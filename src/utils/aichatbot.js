const axios = require('axios');
const db = require('./mysql');

const sendMessageChatBot = async(systemPrompt, userMessage) => {
    try {
        // Retrieve the configuration values from the database.
        const [rows] = await db.promise().query(
          "SELECT `key`, `value` FROM settings WHERE `key` = 'CHATBOT_ENABLE'"
        );
    
        // Create a config object from the query results.
        const config = rows.reduce((acc, row) => {
          acc[row.key] = row.value;
          return acc;
        }, {});
    
        const chatbot = config['CHATBOT_ENABLE'];
    
        // Check if either configuration value is missing or empty.
        if (!chatbot) {
          const missing = [];
          if (!chatbot) missing.push('CHATBOT_ENABLE');
          // Throw an error so it can be caught by the Express route handler.
          throw new Error(`Missing configuration for: ${missing.join(', ')}`);
        }

        if (chatbot == '1') {
            return await localChatbot(systemPrompt, userMessage);
        } else if (chatbot == '2') {
            return await geminiChatbot(systemPrompt, userMessage);
        }
    
        return null;
      } catch (error) {
        console.error("Error in localChatbot:", error);
        throw error;
      }
}

const localChatbot = async (systemPrompt, userMessage) => {
    try {
      // Retrieve the configuration values from the database.
      const [rows] = await db.promise().query(
        "SELECT `key`, `value` FROM settings WHERE `key` IN ('LOCAL_CHATBOT_MODEL', 'LOCAL_CHATBOT_URL', 'LOCAL_CHATBOT_TEMPERATURE')"
      );
  
      // Create a config object from the query results.
      const config = rows.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
  
      const model = config['LOCAL_CHATBOT_MODEL'];
      const chatbotUrl = config['LOCAL_CHATBOT_URL'];
      const temperature = config['LOCAL_CHATBOT_TEMPERATURE'];
  
      // Check if either configuration value is missing or empty.
      if (!model || !chatbotUrl || !temperature) {
        const missing = [];
        if (!model) missing.push('LOCAL_CHATBOT_MODEL');
        if (!chatbotUrl) missing.push('LOCAL_CHATBOT_URL');
        if (!temperature) missing.push('LOCAL_CHATBOT_TEMPERATURE');
        // Throw an error so it can be caught by the Express route handler.
        throw new Error(`Missing configuration for: ${missing.join(', ')}`);
      }
  
      // Prepare the request payload for the external API.
      const payload = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage.trim() }
        ],
        temperature: temperature,
        max_tokens: -1,
        stream: false
      };
  
      // Send the request to the external API using Axios.
      const response = await axios.post(`${chatbotUrl}/v1/chat/completions`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const botResponse = response.data.choices[0]?.message?.content;
      return botResponse;
    } catch (error) {
      console.error("Error in localChatbot:", error);
      throw error;
    }
  };  

  const geminiChatbot = async (systemPrompt, userMessage) => {
    try {
      // Retrieve GEMINI_API_KEY from the settings table
      const [rows] = await db.promise().query(
        "SELECT `value` FROM settings WHERE `key` = 'GEMINI_API_KEY'"
      );
      if (!rows.length || !rows[0].value) {
        throw new Error("GEMINI_API_KEY is not configured in settings.");
      }
      const geminiApiKey = rows[0].value;
  
      // Construct the API endpoint URL with the API key as a query parameter
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
  
      // Combine systemPrompt and userMessage into a single text prompt.
      // If systemPrompt is provided, it is concatenated with userMessage.
      const promptText = systemPrompt ? `${systemPrompt}\nCÂU HỎI CỦA KHÁCH HÀNG: ${userMessage.trim()}` : userMessage.trim();
  
      // Prepare the request payload according to the Gemini API documentation
      const payload = {
        contents: [
          {
            parts: [
              { text: promptText }
            ]
          }
        ]
      };
  
      // Send the POST request using Axios
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Extract the chatbot response from the API result
      const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return botResponse;
    } catch (error) {
      console.error("Error in geminiChatbot:", error);
      throw error;
    }
  };  

module.exports = { sendMessageChatBot }