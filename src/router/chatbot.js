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

router.post('/', async (req, res) => {
    try {
        // Get the message from the request body
        const { message, prompt } = req.body;
        const accountId = req.user?.id;
        if (!accountId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        let resultUser = null;

        const userQuery = `
            SELECT a.username, 
                CONCAT(b.first_name, ' ', b.last_name) AS full_name, 
                b.email,
                b.id AS user_id 
            FROM account a
            JOIN user b ON a.user_id = b.id 
            WHERE a.id = ?`;

        // SQL query to get all addresses associated with the user
        const addressQuery = `
            SELECT c.full_name, 
                c.address, 
                c.phone 
            FROM address c 
            WHERE c.user_id = ?`;

        try {
            // Execute the user query
            const [userResults] = await db.promise().execute(userQuery, [accountId]);
    
            // If user data is found, execute the address query
            if (userResults.length > 0) {
                // Execute address query to get the addresses for the user
                const [addressResults] = await db.promise().execute(addressQuery, [accountId]);
    
                // Combine the user data and address data and send the response
                resultUser = {
                    user: userResults[0],
                    addresses: addressResults
                };
            } else {
                return res.status(404).send('User not found');
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        const userId = resultUser.user.user_id;

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
    p.color,
    p.favorite
   FROM product p;`
        );

        let allProductTxt = "";
        rows.forEach((row) => {
            let colors = "{";
            row.color.forEach((color) => {
                // Thêm định dạng số tiền VNĐ
                const formattedPrice = new Intl.NumberFormat('vi-VN').format(color.money);
                colors += `Màu ${color.name} có giá ${formattedPrice} VND còn ${color.quantity} cái `;

                if (color.moneyDiscount) {
                    const formattedPrice = new Intl.NumberFormat('vi-VN').format(color.moneyDiscount);
                    colors += `và giảm giá còn ${formattedPrice} VND`
                }

                colors += ", ";
            });
            colors += "}";
        
            allProductTxt += `[ID: ${row.id}, tên: ${row.name}, màu: ${colors}, lượt thích: ${row.favorite.length}],`; // Đã bỏ ID
        });

        // Query to fetch chat history from history_chatbot table
      let [rows1] = await db.promise().query(
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

    let addressTxt = "";
    resultUser.addresses.forEach((address) => {
        addressTxt += `[Họ và tên: ${address.full_name}, Địa chỉ: ${address.address}, Số điện thoại: ${address.phone}], `; 
    });

        const systemPrompt = `
* Role Definition
Bạn là trợ lý ảo thân thiện cho cửa hàng điện thoại KhanhHaoStore. Hãy luôn giữ phong cách:
- Trả lời bằng HTML hợp lệ (Không cần viết đầy đủ tag đầu trang và cuối trang, chỉ cần nội dung).
- Sử dụng emoji phù hợp.
- Giọng văn lịch sự, nhiệt tình.
- Chỉ tập trung vào sản phẩm/dịch vụ của cửa hàng.
- Không có hoặc không biết, hãy nói không biết.

* Hướng dẫn Trả lời
1. Định dạng tiền VND: Luôn hiển thị dạng 1.000.000 VND
2. Chuyển hướng trang:
   - Dùng nút: <button class="material-button" value="{URL}" name="redirect">{Tên nút}</button>
   - name="redirect" là bắt buộc để chuyển hướng.
   - Nếu muốn xem sản phẩm nào thì phải dựa vào id sản phẩm để truy cập (/product/{id sản phẩm})
   - URL quan trọng:
     • Trang chủ: URL = /
     • Trang giới thiệu: URL = /about
     • Trang liên hệ: URL = /contact
     • Trang sản phẩm: URL = /product
     • Trang Giỏ hàng: URL = /cart
     • Trang Đơn hàng: URL = /order
     • Trang cá nhân: URL = /profile (Trang này có chứa thông tin cá nhân, các địa chỉ, đổi mật khẩu)
     • Trang chi tiết một sản phẩm sản phẩm: URL = /product/{id sản phẩm}
     • Trang Tìm kiếm sản phẩm: URL = /product?search={từ khóa}
     • Trang thêm địa chỉ: URL = /profile/address/new
     • Trang sửa địa chỉ: URL = /profile/address/edit?id={id địa chỉ}

3. Xử lý sản phẩm:
   - KHÔNG ĐƯỢC tiết lộ ID sản phẩm.
   - Chỉ gợi ý sản phẩm trong phạm vi ngân sách khách hàng.
   - Tất cả sản phẩm trong cửa hàng: ${allProductTxt}

4. Hướng dẫn thao tác:
   - Thêm vào giỏ hàng: Vào trong trang chi tiết sản phẩm -> Chọn màu sắc, số lượng -> Thêm vào giỏ hàng.
   - Đặt hàng: Vào trong trang giỏ hàng -> Chọn sản phẩm muốn mua -> Đặt hàng.
   - Đổi mật khẩu: Vào trong trang cá nhân -> Đổi mật khẩu.
   - Thêm địa chỉ: Vào trong trang cá nhân -> Thêm địa chỉ.
   - Sửa/xóa địa chỉ: Vào trong trang cá nhân -> Sửa/xóa địa chỉ.
   - Thanh toán đơn hàng: Vào trong trang đơn hàng -> Thanh toán.
   - Hủy đơn hàng: Vào trong trang đơn hàng -> Hủy đơn hàng.

5. Những trường thông tin có ở từng trang:
    - Trang chi tiết sản phẩm: ID, tên, màu sắc, giá, số lượng, nút lượt thích.
    - Trang giỏ hàng: Danh sách sản phẩm, màu sắc, tổng tiền, nút đặt hàng.
    - Trang đơn hàng: Danh sách đơn hàng, trạng thái, thông tin đặt hàng, nút thanh toán, nút hủy đơn hàng.
    - Trang cá nhân: Thông tin tên đăng nhập, họ, tên, email, danh sách địa chỉ, nút thêm địa chỉ, nút đổi mật khẩu.
    - Trang tìm kiếm: Danh sách sản phẩm tìm kiếm được.
    - Trang sản phẩm: Danh sách các sản phẩm, có phân trang.
    - Trang chủ: Hình ảnh banner, danh sách sản phẩm được yêu nhất nhiều nhất, sản phẩm ngẫu nhiên.
    - Trang liên hệ: Thông tin liên hệ.
    - Trang giới thiệu: Giới thiệu cửa hàng.
    - Trang thêm địa chỉ: Form thêm địa chỉ gồm có Họ và tên, Địa chỉ, Số điện thoại, nút Thêm.
    - Trang sửa địa chỉ: Form sửa địa chỉ gồm có Họ và tên, Địa chỉ, Số điện thoại, nút Sửa.
    - Tính năng dark mode (Chế độ tối): Nút bật/tắt chế độ tối nằm ở cuối header.

* Quy tắc An toàn
❌ Tuyệt đối không:
- Đề cập đến các sản phẩm ngoài cửa hàng.
- Không nói về giáo dục, chính trị, tôn giáo, tình dục.
- Không châm biếm, chửi bới, xúc phạm người khác.
- Không chia sẻ thông tin cá nhân của bất kỳ ai.
- Sử dụng từ ngữ không phù hợp.
- Đưa thông tin không chắc chắn.
- Hiển thị lỗi định dạng tiền.
- Không lặp lại câu trả lời.
- Một tài khoản tối đa có 3 địa chỉ.

* Kiểm tra Toán học
TRƯỚC KHI TRẢ LỜI PHẢI:
1. Đếm số chữ số trong giá sản phẩm từ thông tin sản phẩm.
2. So sánh với số tiền khách hàng có.
3. Không gợi ý sản phẩm ngoài phạm vi ngân sách.
4. Lặp lại quy trình cho từng màu sắc.

* Ngữ cảnh
- URL của trang web: http://khanhhaostore.com
- Username: ${resultUser.user.username}
- Email: ${resultUser.user.email}
- Tất cả Địa chỉ: ${addressTxt}
- ID khách hàng: ${resultUser.user.user_id}
- Tên khách hàng: ${resultUser.user.full_name}
- Lịch sử đoạn chat gần nhất: ${historyChat}

${prompt ? `**Hướng dẫn Bổ sung**\n${prompt}` : ''}
`.trim();

        // Prepare the request payload for the external API
        const payload = {
          model:  "gemma-2-9b-it",
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