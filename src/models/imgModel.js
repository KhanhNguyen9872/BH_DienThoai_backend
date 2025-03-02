const db = require('../utils/mysql');

/**
 * Get chatbot and user avatar values from `settings` table.
 */
const getAvatars = async () => {
    const [rows] = await db.promise().query(
        "SELECT `key`, `value` FROM `settings` WHERE `key` IN ('CHATBOT_AVATAR', 'CHATBOT_USER_AVATAR')"
    );
    return rows; // returns an array of objects with { key, value }
};

module.exports = {
    getAvatars
};
