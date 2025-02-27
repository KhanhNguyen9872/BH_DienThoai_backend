const express = require('express');
const router = express.Router();
const db = require('../utils/mysql'); // Adjust the path as needed
const { getUserId } = require('../utils/lib');
const axios = require('axios');

router.get('/', getUserId, async (req, res) => {
    try {
      // Assuming userId comes from authentication middleware (e.g., JWT or session)
      const userId = req.user.userId; // Ensure `userId` is added to `req.user`

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
  
      // Query to fetch chat history from history_chatbot table
      const [rows] = await db.promise().query(
        'SELECT message, isBot,  time FROM history_chatbot WHERE user_id = ? ORDER BY time ASC',
        [userId]
      );
  
      // Send the chat history as an array
      res.json(rows);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Failed to fetch chat history.' });
    }
  });

router.post('/', getUserId, async (req, res) => {
    try {
        // Get the message from the request body
        const { message, prompt } = req.body;
        const userId = req.user.userId; // Get the user ID from the token

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        if (!message || !message?.trim()) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        // Insert into the history_chatbot table in MySQL using db.promise()
        await db.promise().execute(
            'INSERT INTO history_chatbot (user_id, message, isBot) VALUES (?, ?, ?)',
            [userId, message, 0]
        );

        const [rows] = await db.promise().query(
            `SELECT 
    p.id, 
    p.name, 
    p.color
   FROM product p;`
        );

        let allProductTxt = "";
        rows.forEach((row) => {
            let colors = "{";
            row.color.forEach((color) => {
                // Thêm định dạng số tiền VNĐ
                const formattedPrice = new Intl.NumberFormat('vi-VN').format(color.money);
                colors += `Màu ${color.name} có giá ${formattedPrice} VND, `;
            });
            colors += "}";
        
            allProductTxt += `[ID sản phẩm: ${row.id}, tên: ${row.name}, màu sắc: ${colors}],`; // Đã bỏ ID
        });

        console.log(allProductTxt);

        // Query to fetch chat history from history_chatbot table
      const [rows1] = await db.promise().query(
        'SELECT message, isBot FROM history_chatbot WHERE user_id = ? ORDER BY time ASC',
        [userId]
      );

      const lengthHistoryMessage = rows1.length;
      if (lengthHistoryMessage > 30) {
        rows1 = rows1.slice(lengthHistoryMessage - 30, lengthHistoryMessage);
      }

      let historyChat = "";
      rows1.forEach((row) => {
        // Check if the message is from the bot or the user based on the isBot value
        const messageType = row.isBot === '1' ? 'Bot message' : 'User message';
    
        // Append the formatted message with its type (Bot/User) to the historyChat string
        historyChat += `[${messageType}: ${row.message}], `;
    });
    

        const systemPrompt = `
**Role Definition**
Bạn là trợ lý ảo thân thiện cho cửa hàng điện thoại KhanhStore. Hãy luôn giữ phong cách:
- Trả lời bằng HTML hợp lệ (Không cần viết đầy đủ tag đầu trang và cuối trang, chỉ cần nội dung)
- Sử dụng emoji phù hợp
- Giọng văn lịch sự, nhiệt tình
- Chỉ tập trung vào sản phẩm/dịch vụ của cửa hàng
- Không có hoặc không biết, hãy nói không biết

**Hướng dẫn Trả lời**
1. Định dạng tiền VND: Luôn hiển thị dạng 1.000.000 VND
2. Chuyển hướng trang:
   - Dùng nút: <button value="{URL}" name="redirect">{Tên nút}</button>
   - Nếu muốn xem sản phẩm nào thì phải dựa vào id sản phẩm để truy cập (/product/{id sản phẩm})
   - URL quan trọng:
     • Tất cả Sản phẩm: URL = /product
     • Trang Giỏ hàng: URL = /cart
     • Trang Đơn hàng: URL = /order
     • Trang chi tiết một sản phẩm sản phẩm: URL = /product/{id sản phẩm}
     • Trang Tìm kiếm sản phẩm: URL = /product?search={từ khóa}

3. Xử lý sản phẩm:
   - KHÔNG tiết lộ ID sản phẩm
   - Chỉ gợi ý sản phẩm trong phạm vi ngân sách khách hàng
   - Tất cả sản phẩm trong cửa hàng: ${allProductTxt}

**Quy tắc An toàn**
❌ Tuyệt đối không:
- Đề cập đến các sản phẩm ngoài cửa hàng.
- Sử dụng từ ngữ không phù hợp
- Đưa thông tin không chắc chắn
- Hiển thị lỗi định dạng tiền
- Không lặp lại câu trả lời
- Làm tròn số hoặc thay đổi số 0 cuối (25.000.000 → 2.500.000)

**🛑 Kiểm tra Toán học**
TRƯỚC KHI TRẢ LỜI PHẢI:
1. Đếm số chữ số trong giá sản phẩm từ database
2. So sánh với số tiền khách hàng có
3. Không gợi ý sản phẩm ngoài phạm vi ngân sách
4. Lặp lại quy trình cho từng màu sắc

**Ngữ cảnh**
- Tên khách hàng: ${req.user.fullName}

${prompt ? `**Hướng dẫn Bổ sung**\n${prompt}` : ''}
`.trim();

        // Prepare the request payload for the external API
        const payload = {
          model:  "gemma-2-2b-it",
          messages: [
            { role: "system", 
                content: systemPrompt
             },
            { role: "user", content: message.trim() } // Use the message sent by the user
          ],
          temperature: 1.0,
          max_tokens: -1,
          stream: false
        };
    
        // Send the request to the external API using Axios
        const response = await axios.post('http://127.0.0.1:1234/v1/chat/completions', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        const botResponse = response.data.choices[0]?.message?.content;

        if (botResponse) {
            res.json({ content: botResponse });
            
            // Insert into the history_chatbot table in MySQL using db.promise()
            await db.promise().execute(
                'INSERT INTO history_chatbot (user_id, message, isBot) VALUES (?, ?, ?)',
                [userId, botResponse, 1]
            );
        } else {
            res.status(500).json({ error: 'Failed to extract bot response.' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong while processing the request.' });
      }
});

router.delete('/', getUserId, async (req, res) => {
    try {
      // Assuming userId comes from authentication middleware (e.g., JWT or session)
      const userId = req.user.userId; // Ensure `userId` is added to `req.user`
  
      // SQL query to delete all records for the logged-in user from history_chatbot
      const [result] = await db.promise().execute(
        'DELETE FROM history_chatbot WHERE user_id = ?',
        [userId]
      );
  
      // If rows affected > 0, history has been cleared
      if (result.affectedRows > 0) {
        res.json({ message: 'Chat history cleared successfully.' });
      } else {
        res.status(404).json({ message: 'No chat history found for this user.' });
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
      res.status(500).json({ error: 'Failed to clear chat history.' });
    }
  });

module.exports = router;