const axios = require('axios');

// Configure your Telegram Bot credentials.
// It’s a good idea to store these in environment variables.
const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.BOT_CHAT_ID;

/**
 * Send a message via Telegram using the Bot API.
 *
 * @param {string} message - The message to send.
 */
function sendTelegramMessage(message) {
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  axios
    .post(telegramApiUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    })
    .then((response) => {
      // Optionally, log the Telegram API response for debugging.
      // console.log('Telegram message sent:', response.data);
    })
    .catch((err) => {
      console.error('Failed to send Telegram message:', err);
    });
}

module.exports = { sendTelegramMessage };
