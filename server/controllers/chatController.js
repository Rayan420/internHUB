const prisma = require('../prisma');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage')
const config = require('../config/firebase.config');

  
const getChats = async (req, res) => {
    const { userId } = req.params;
  
    console.log('userId', userId);
  
    try {
      // Fetch chats belonging to the user with the messages and the attachments
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
        include: {
          chats: {
            include: {
              users: true,
              messages: {
                include: {
                  attachments: true,
                },
              },
            },
          },
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user.chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ error: 'Failed to fetch chats' });
    }
  };
  
  const sendNewMessage = async (req, res) => {

    const senderId = parseInt(req.params.userId);
    const { recipientEmail, subject, text } = req.body;

    if(!recipientEmail, !subject, !text){
      return res.status(202).json({ error: 'Please fill all fields' });
    }
  
    try {
        initializeApp(config);
        const storage = getStorage();
      // Check if recipient exists
      const recipient = await prisma.user.findUnique({
        where: {
          email: recipientEmail,
        },
      });
  
      if (!recipient) {
        return res.status(202).json({ error: 'Recipient not found' });
      }
  
      // Create a new chat
      const chat = await prisma.chat.create({
        data: {
          users: {
            connect: [{ id: senderId }, { id: recipient.id }],
          },
        },
      });
  
      // Create a new message and connect it to the chat
      const message = await prisma.message.create({
        data: {
          sender: { connect: { id: senderId } },
          receiver: { connect: { id: recipient.id } },
          subject,
          text,
          chat: { connect: { id: chat.id } },
        },
      });
  
      // Upload attachments and connect them to the message
      const multerFiles = req.files.attachments; // Access the attachments array from multerFiles
      const attachments = [];
      if(multerFiles){
        for (let i = 0; i < multerFiles.length; i++) {
          const file = multerFiles[i];
          const storageRef = ref(storage, `attachments/${file.originalname}`);
          await uploadBytesResumable(storageRef, file.buffer);
        
          const downloadURL = await getDownloadURL(storageRef);
          const attachment = await prisma.attachment.create({
            data: {
              name: file.originalname,
              url: downloadURL,
              message: { connect: { id: message.id } },
            },
          });
        
          attachments.push(attachment);
        }
      }
         //user senderid to get sender name from user table and send notification
         const sender = await prisma.user.findUnique({
          where: {
            id: parseInt(senderId),
          },
        });
        // Create a notification for the coordinator
        await prisma.notification.create({
          data: {
            message: `${sender.firstName} ${sender.lastName} has sent you a new message, Subject: ${subject}`,
            user: { connect: { id: recipient.id } }
          }
        });
      res.status(200).json({ message, attachments });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
  
  const markChatAsRead = async (req, res) => {
    const { chatId } = req.params;
  
    try {
      // Retrieve the chat and its messages
      const chat = await prisma.chat.findUnique({
        where: { id: parseInt(chatId) },
        include: { messages: true },
      });
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      // Update all messages in the chat as read
      const updatedMessages = chat.messages.map((message) => {
        return prisma.message.update({
          where: { id: message.id },
          data: { read: true },
        });
      });
  
      // Execute the updates in a single database transaction
      await prisma.$transaction(updatedMessages);
  
      return res.status(200).json({ message: 'Chat marked as read' });
    } catch (error) {
      console.error('Error marking chat as read:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  const replyToChat = async (req, res) => {
    const { senderId, recipientId, subject, text } = req.body;
    const chatId = parseInt(req.params.chatId);
    console.log('chatId', chatId);
    console.log('req.body', req.body);
    
    try {
      initializeApp(config);
      const storage = getStorage();
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      const message = await prisma.message.create({
        data: {
          sender: {
            connect: { id: parseInt(senderId) },
          },
          receiver: {
            connect: { id: parseInt(recipientId) },
          },
          subject: subject,
          text: text,
          //connect chat and mark as unread
          chat: { 
            connect: 
            { 
              id: parseInt(chatId), 
            } 
          },
        },
      });
      //user senderid to get sender name from user table and send notification
      const sender = await prisma.user.findUnique({
        where: {
          id: parseInt(senderId),
        },
      });
      // Create a notification for the coordinator
      await prisma.notification.create({
        data: {
          message: `${sender.firstName} ${sender.lastName} has replied to your message, Subject: ${subject}`,
          user: { connect: { id: parseInt(recipientId) } }
        }
      });
  
      const multerFiles = req.files.attachments;
      if (multerFiles) {
        const attachmentsData = multerFiles.map((file) => {
          const storageRef = ref(storage, `attachments/${file.originalname}`);
          uploadBytesResumable(storageRef, file.buffer);
          const downloadURL = getDownloadURL(storageRef);
          return {
            name: file.originalname,
            url: downloadURL,
            messageId: message.id,
          };
        });
    
        const attachments = await prisma.attachment.createMany({
          data: attachmentsData,
        });

        //user senderid to get sender name from user table and send notification
        const sender = await prisma.user.findUnique({
          where: {
            id: parseInt(senderId),
          },
        });
        // Create a notification for the coordinator
        await prisma.notification.create({
          data: {
            message: `${sender.firstName} ${sender.lastName} has replied to your message, Subject: ${subject}`,
            user: { connect: { id: parseInt(recipientId) } }
          }
        });
        res.json({ message, attachments });
      }
      else{
        res.json({ message });
      }
    } catch (error) {
      console.error('Error replying to chat:', error);
      res.status(500).json({ error: 'Failed to reply to chat' });
    }
  };
  
  
module.exports = {
    getChats,
    sendNewMessage,
    markChatAsRead,
    replyToChat
}