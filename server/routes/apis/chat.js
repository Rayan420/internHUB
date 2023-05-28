const express = require('express');
const router = express.Router();
const prisma = require('../../prisma'); // Assuming you have a Prisma instance set up
const {getChats, sendNewMessage,markChatAsRead, replyToChat} = require('../../controllers/chatController');
// GET /api/chats
router.route('/:userId').get(getChats);
router.route('/:userId').post(sendNewMessage);
router.route('/:chatId').put(markChatAsRead);
router.route('/:chatId/reply').put(replyToChat);



module.exports = router;
