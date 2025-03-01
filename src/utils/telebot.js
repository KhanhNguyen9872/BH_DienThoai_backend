const axios = require('axios');
const db = require('./mysql');

async function getTelegramSettings() {
  // Query both BOT_TOKEN and BOT_CHAT_ID from settings
  const [rows] = await db.promise().query(
    "SELECT `key`, `value` FROM settings WHERE `key` IN ('BOT_TOKEN', 'BOT_CHAT_ID')"
  );

  let botToken, botChatId;
  rows.forEach(row => {
    if (row.key === 'BOT_TOKEN') {
      botToken = row.value;
    } else if (row.key === 'BOT_CHAT_ID') {
      botChatId = row.value;
    }
  });

  // Fallback to environment variables if any value is empty
  if (!botToken) {
    botToken = process.env.BOT_TOKEN;
  }
  if (!botChatId) {
    botChatId = process.env.BOT_CHAT_ID;
  }

  return { botToken, botChatId };
}

/**
 * Send a message via Telegram using the Bot API.
 *
 * @param {string} message - The message to send.
 */
async function sendTelegramMessage(message) {
  try {
    const { botToken, botChatId } = await getTelegramSettings();
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await axios.post(telegramApiUrl, {
      chat_id: botChatId,
      text: message,
    });

    // Optionally, log the response for debugging.
    // console.log('Telegram message sent successfully.');
  } catch (err) {
    console.error('Failed to send Telegram message:', err);
  }
}

module.exports = { sendTelegramMessage };
