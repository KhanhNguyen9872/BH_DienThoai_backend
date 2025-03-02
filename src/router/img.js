const express = require('express');
const router = express.Router();
const db = require('../utils/mysql'); // Your MySQL2 pool/connection

router.get('/', async (req, res) => {
  try {
    // Query the keys we need
    const [rows] = await db.promise().query(
      "SELECT `key`, `value` FROM `settings` WHERE `key` IN ('CHATBOT_AVATAR', 'CHATBOT_USER_AVATAR')"
    );

    let botAvatar = '';
    let userAvatar = '';

    rows.forEach((row) => {
      if (row.key === 'CHATBOT_AVATAR') {
        botAvatar = row.value;
      } else if (row.key === 'CHATBOT_USER_AVATAR') {
        userAvatar = row.value;
      }
    });

    // Return both avatar paths in JSON
    return res.json({ botAvatar, userAvatar });
  } catch (error) {
    console.error('Error fetching avatars:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
