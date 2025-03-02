const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { getUserId } = require('../utils/lib');

// GET: fetch chat history
router.get('/', getUserId, chatbotController.getChatHistory);

// POST: send a message to the chatbot
router.post('/', getUserId, chatbotController.postUserMessage);

// DELETE: clear chat history
router.delete('/', getUserId, chatbotController.deleteChatHistory);

module.exports = router;
