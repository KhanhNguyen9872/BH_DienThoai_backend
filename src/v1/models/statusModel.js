const db = require('../utils/mysql');


const getStatus = async (req, res) => {
    try {
      // Query the database for both the "MAINTENANCE" and "CHATBOT_ENABLE" keys
      const [maintenanceRows] = await db.promise().query('SELECT value FROM settings WHERE `key` = "MAINTENANCE"');
      const [chatbotRows] = await db.promise().query('SELECT value FROM settings WHERE `key` = "CHATBOT_ENABLE"');
  
      // Check if the keys exist and return the appropriate status
      const maintenanceStatus = maintenanceRows[0]?.value == '0' ? 'ALIVE' : 'MAINTENANCE';
      const chatbotEnabled = chatbotRows[0]?.value;
  
      // Return the status and the chatbot flag
      return {
        status: maintenanceStatus,
        chatbot: chatbotEnabled
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

module.exports = {
    getStatus
};
