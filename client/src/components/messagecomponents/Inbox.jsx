import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../../services/axios';
import { useAuthHeader } from 'react-auth-kit';
import { BiEnvelope } from 'react-icons/bi';

const Inbox = ({ userId }) => {
  const authHeader = useAuthHeader();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [isChatRead, setIsChatRead] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [selectedReplyAttachments, setSelectedReplyAttachments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      // Fetch chats from the backend
      if (userId) {
        try {
          const response = await axios.get(`/api/chats/${userId}`, {
            headers: {
              authorization: authHeader(),
            },
          });
          setChats(response.data);
          console.log('chats', response.data);
          if (response.data.length > 0) {
            setSelectedChat(response.data[0]);
            setSelectedChatMessages([response.data[0].messages[0]]);
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      }
    };

    fetchChats();
  }, [userId]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setSelectedChatMessages([chat.messages[0]]);

    // Mark the messages as read
    const updatedMessages = chat.messages.map((message) => {
      if (message.read === false) {
        return {
          ...message,
          read: true,
        };
      }
      return message;
    });

    // Update the messages in the selected chat
    setChats((prevChats) => {
      return prevChats.map((prevChat) => {
        if (prevChat.id === chat.id) {
          return {
            ...prevChat,
            messages: updatedMessages,
          };
        }
        return prevChat;
      });
    });

    // Mark the entire chat as read
    setIsChatRead(true);

    // Make a request to the backend to mark the chat messages as read
    const markChatAsRead = async () => {
      try {
        await axios.put(`/api/chats/${chat.id}`, null, {
          headers: {
            authorization: authHeader(),
          },
        });
      } catch (error) {
        console.error('Error marking chat as read:', error);
      }
    };
    markChatAsRead();
  };

  const handleReplyTextChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplyAttachmentChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setReplyAttachments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleReplyAttachmentDelete = (filename) => {
    setReplyAttachments((prevFiles) =>
      prevFiles.filter((file) => file.name !== filename)
    );
  };

  const handleReplyAttachmentSelect = (filename) => {
    const selectedFile = replyAttachments.find((file) => file.name === filename);
    setSelectedReplyAttachments((prevFiles) => [...prevFiles, selectedFile]);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    console.log('selected chat', selectedChat);
    const formData = new FormData();
    formData.append('senderId', userId);
    formData.append(
      'recipientId',
      selectedChat.users.find((user) => user.id !== userId).id
    );
    formData.append(
      'subject',
      selectedChat.messages[0].subject
    );
    formData.append('text', replyText);
    replyAttachments.forEach((file) => formData.append('attachments', file));

    console.log('reply', formData);
    try {
      const response = await axios.put(
        `/api/chats/reply/${selectedChat.id}/reply`, // Include the selected chat ID in the URL
        formData,
        {
          headers: {
            authorization: authHeader(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Clear form inputs and close modal
      setReplyText('');
      setReplyAttachments([]);
      setSelectedReplyAttachments([]);
      // Handle success response if needed
      console.log('Message sent:', response.data);
    } catch (error) {
      // Handle error response if needed
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="message-main-container">
      <div className="inbox-container">
        <div className="inbox-header">
          <div className="inbox-header-title">
            <BiEnvelope />
            <span>Inbox</span>
          </div>
          <div className="inbox-header-messages">
            <div className="inbox-header-message-count">{chats.length}</div>
          </div>
         
        </div>
        <div className="inbox-header-search">
    <input
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
        <div className="inbox-body">
          <div className="inbox-list">
            {chats.length > 0 ?(
    chats
      .filter((chat) =>
        chat.messages[0].subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((chat) => (
                <div
                  className={`inbox-chat ${
                    chat === selectedChat ? 'selected' : ''
                  }`}
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="inbox-chat-messages">
                    {chat.messages.length > 0 ? (
                      <div
                        className={`inbox-message ${
                          chat.messages[0] === selectedChat ? 'selected' : ''
                        } ${!chat.messages[0].read ? 'unread' : ''}`}
                        key={chat.messages[0].id}
                        onClick={() => handleChatClick(chat)}
                      >
                        <div className="inbox-message-sender-time">
                          <div className="inbox-message-sender">
                            {chat.messages[0].senderId === userId ? (
                              <>
                                <p>
                                  <strong>Sender:</strong> You
                                </p>
                              </>
                            ) : (
                              <>
                                <p>
                                  <strong>Sender:</strong>{' '}
                                  {
                                    chat.users.find(
                                      (user) => user.id === chat.messages[0].senderId
                                    ).firstName
                                  }{' '}
                                  {
                                    chat.users.find(
                                      (user) => user.id === chat.messages[0].senderId
                                    ).lastName
                                  }
                                </p>
                              </>
                            )}
                          </div>
                          <div className="inbox-message-time">
                            {new Date(chat.messages[0].createdAt).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                            {!chat.messages[0].read && (
                              <span className="unread-marker"></span>
                            )}
                          </div>
                        </div>
                        <div className="inbox-message-subject">
                          <p>
                            <strong>Subject:</strong> {chat.messages[0].subject}
                          </p>
                        </div>
                        <div className="inbox-message-content">
                          <p>
                            <strong>Message:</strong> {chat.messages[0].text}
                          </p>
                        </div>
                        {chat.messages[0].attachments && (
                          <div className="inbox-message-attachments">
                            {chat.messages[0].attachments.map((attachment) => (
                              <a
                                className="attachment-link"
                                href={attachment.url}
                                key={attachment.id}
                              >
                                {attachment.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="inbox-empty">
                        No messages in this chat.
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="inbox-empty">No chats in your inbox.</div>
            )}
          </div>
        </div>
      </div>
      <div className="message-container inbox-container">
        {selectedChat ? (
          <div className="message">
            <div className="message-header">
              <div className="message-date-time">
                {new Date(selectedChat.createdAt).toLocaleDateString([], {
                  dateStyle: 'medium',
                })}
                {' '}
                {new Date(selectedChat.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div className="message-body">
              {selectedChat.messages.map((message) => (
                <div className="message-card" key={message.id}>
                  <div className="message-sender-recipient">
                    <div>
                      {message.senderId === userId ? (
                        <>
                          <p>
                            <strong>Sender:</strong> You
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Sender:</strong>{' '}
                            {
                              selectedChat.users.find(
                                (user) => user.id === message.senderId
                              ).firstName
                            }{' '}
                            {
                              selectedChat.users.find(
                                (user) => user.id === message.senderId
                              ).lastName
                            }
                          </p>
                        </>
                      )}
                    </div>
                    <div className="message-recipient">
                      {message.senderId != userId ? (
                        <>
                          <p> 
                            <strong>Recipient:</strong> You
                            </p>
                            </>
                            
                          ) : (
                            <p>
                        <strong>Recipient:</strong>{' '}
                        {
                          selectedChat.users.find(
                            (user) => user.id !== message.senderId
                          ).firstName
                        }{' '}
                        {
                          selectedChat.users.find(
                            (user) => user.id !== message.senderId
                          ).lastName
                        }
                      </p>
                      )
                      }
                    </div>
                  </div>
                  <div className="message-title"><strong>Subject:</strong> {message.subject}</div>
                  <div className="message-content">
                    <strong>Message:</strong> <br /> {message.text}
                  </div>
                  {message.attachments && (
                    <div className="message-attachments">
                      {message.attachments.map((attachment) => (
                        <div
                          className="message-attachment"
                          key={attachment.id}
                        >
                          <a
                            className="attachment-link"
                            href={attachment.url}
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="message-footer">
              <div className="message-reply-form">
                <textarea
                  className="message-reply-text"
                  value={replyText}
                  onChange={handleReplyTextChange}
                  placeholder="Reply..."
                />
                <input
                  type="file"
                  multiple
                  onChange={handleReplyAttachmentChange}
                />
                <div className="selected-attachments">
                  {replyAttachments.map((file) => (
                    <div className="selected-attachment" key={file.name}>
                      {file.name}
                      <button
                        className="attachment-delete"
                        onClick={() => handleReplyAttachmentDelete(file.name)}
                      >
                        &times;
                      </button>
                      <button
                        className="attachment-select"
                        onClick={() => handleReplyAttachmentSelect(file.name)}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="message-reply-button"
                  onClick={handleReplySubmit}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="message-empty">No chat selected.</div>
        )}
      </div>
    </div>
  );
};


export default Inbox;
