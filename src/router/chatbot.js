const express = require('express');
const router = express.Router();
const db = require('../utils/mysql'); // Adjust the path as needed
const { getUserId } = require('../utils/lib');
const axios = require('axios');
const { sendMessageChatBot } = require('../utils/aichatbot');

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
            SELECT c.id, 
                c.full_name, 
                c.address, 
                c.phone 
            FROM address c 
            WHERE c.user_id = ?`;

        const ordersQuery = `
            SELECT oi.order_id, oi.totalPrice, oi.payment, oi.status
            FROM orders o
            JOIN order_info oi ON o.id = oi.order_id
            WHERE o.user_id = ?
                `;
        
        const cartQuery = `
                SELECT product_id, quantity, color
                FROM cart
                WHERE user_id = ?
                    `;
                
            try {
                // Execute the user query
                const [userResults] = await db.promise().execute(userQuery, [accountId]);
            
                // If user data is found, execute the address and orders queries
                if (userResults.length > 0) {
                    const userId_ = userResults[0].user_id;
                    // Execute address query to get the addresses for the user
                    const [addressResults] = await db.promise().execute(addressQuery, [userId_]);
            
                    // Execute orders query to get the orders and related order info for the user
                    
                    const [ordersResults] = await db.promise().execute(ordersQuery, [userId_]);

                    const [cartResult] = await db.promise().execute(cartQuery, [userId_]);
            
                    // Combine the user data, address data, and orders data into the result
                    resultUser = {
                        user: userResults[0],
                        addresses: addressResults,
                        orders: ordersResults,
                        cart: cartResult,
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
      let count = 1;
      rows1.forEach((row) => {
        // Check if the message is from the bot or the user based on the isBot value
        const messageType = row.isBot === '1' ? 'Bot message' : 'User message';
    
        // Append the formatted message with its type (Bot/User) to the historyChat string
        historyChat += `[Index: ${count}, ${messageType}: ${row.message}], `;
        count = count + 1;
    });

    let addressTxt = "";
    resultUser.addresses.forEach((address) => {
        addressTxt += `[ID: ${address.id}, Họ và tên: ${address.full_name}, Địa chỉ: ${address.address}, Số điện thoại: ${address.phone}],`; 
    });

    let orderTxt = "";
    resultUser.orders.forEach((order) => {
        orderTxt += `[ID: ${order.order_id}, Tổng tiền: ${order.totalPrice}, Thanh toán: ${order.payment}, Trạng thái: ${order.status}],`;
    });

    let cartTxt = "";
    resultUser.cart.forEach((c) => {
      cartTxt += `[ID sản phẩm: ${c.product_id}, Số lượng: ${c.quantity}, Màu: ${c.color}],`;
    });

    const systemPrompt = `
* Role Definition
Bạn là trợ lý ảo thân thiện cho cửa hàng điện thoại KhanhHaoStore. Hãy luôn giữ phong cách:
- Trả lời bằng HTML hợp lệ (Không cần viết đầy đủ tag đầu trang và cuối trang, chỉ cần nội dung).
- Sử dụng nhiều emoji.
- Giọng văn lịch sự, nhiệt tình, trả lời dài càng tốt.
- Chỉ tập trung vào sản phẩm/dịch vụ của cửa hàng.
- Không có hoặc không biết, hãy nói không biết.
- Dựa vào lịch sử chat gần nhất để trả lời.
- Luôn hỏi lại nếu không chắc chắn.
- Dựa vào URL hiện tại mà người đó đang truy cập để trả lời.
- Luôn hướng dẫn người dùng cách thao tác.
- Khi đăng xuất tài khoản hay cảm ơn khách hàng.
- Tài khoản có thể thêm tối đa 3 địa chỉ.
- Không gửi URL cho khách hàng, thay vì đó hãy tạo 1 nút chuyển hướng trang như bên dưới.

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
  • Trang chi tiết một sản phẩm sản phẩm theo màu sắc chỉ định: URL = /product/{id sản phẩm}?color={màu sắc theo tiếng việt} (Dựa vào danh sách màu mà sản phẩm có và in hoa chữ đầu, Ví dụ "Màu hồng" sẽ thành "Hồng", "Màu xanh dương" sẽ thành "Xanh dương",...)
  • Trang tìm kiếm sản phẩm: URL = /product?search={từ khóa}
  • Trang thêm địa chỉ: URL = /profile/address/new
  • Trang sửa địa chỉ: URL = /profile/address/edit?id={id địa chỉ}
  • Trang đổi mật khẩu: URL = /profile?changepassword=1
  • Trang xác nhận đặt hàng: URL = /payment
  • Trang đăng xuất: URL = /logout
  • Trang thông báo đơn hàng được tạo thành công: URL = /order/create?id={id đơn hàng}
  • Trang thông báo đơn hàng được thanh toán thành công: URL = /payment/success?id={id đơn hàng}
  • Trang thanh toán đơn hàng: URL = /bank/payment?id={id đơn hàng}
     
3. Xử lý sản phẩm:
- KHÔNG ĐƯỢC tiết lộ ID sản phẩm.
- Chỉ gợi ý sản phẩm trong phạm vi ngân sách khách hàng.
- Tất cả sản phẩm trong cửa hàng: ${allProductTxt}

4. Hướng dẫn thao tác:
- Thêm vào giỏ hàng: Vào trong trang chi tiết sản phẩm -> Chọn màu sắc, số lượng -> Thêm vào giỏ hàng.
- Đặt hàng: Vào trong trang giỏ hàng -> Tick chọn sản phẩm muốn mua -> Nhấn nút 'Đặt hàng'.
- Đổi mật khẩu: Vào trong trang cá nhân -> Chọn nút 'Đổi mật khẩu' -> Nhập đầy đủ thông tin và nhấn 'Đổi'.
- Thêm địa chỉ: Vào trong trang cá nhân -> Chọn vào nút 'Thêm địa chỉ' (Nếu đạt tối đa địa chỉ, không thể nhấn nút này).
- Sửa địa chỉ: Vào trong trang cá nhân -> Bấm nút 'Sửa' tại dòng địa chỉ cần sửa.
- Xóa địa chỉ: Vào trong trang cá nhân -> Bấm nút 'Xóa' tại dòng địa chỉ cần Xóa.
- Thanh toán đơn hàng: Vào trong trang đơn hàng -> Chọn vào nút 'Thanh toán' tại đơn hàng cần thanh toán.
- Hủy đơn hàng: Vào trong trang đơn hàng -> Chọn vào nút 'Hủy đơn hàng' tại đơn hàng cần hủy.

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
- Tính năng dark mode (Chế độ tối): Nút bật/tắt chế độ tối nằm ở góc trên bên phải của trang web.
- Tính năng đổi mật khẩu: Form đổi mật khẩu gồm có Mật khẩu cũ, Mật khẩu mới, Nhập lại mật khẩu mới, nút Đổi mật khẩu.
- Trang xác nhận đặt hàng: Danh sách sản phẩm, tổng tiền, thông tin địa chỉ, mã giảm giá, phương thức thanh toán, nút áp dụng mã giảm giá, nút xác nhận đặt hàng.

6. Xử lý đơn hàng:
- Chưa thanh toán thành công: Nếu đơn hàng có trạng thái là "Đang chờ thanh toán", nghĩa là đơn hàng vẫn chưa được thanh toán.
- Thanh toán tiền mặt: Nếu đơn hàng được thanh toán bằng tiền mặt và trạng thái là "Đang chờ xác nhận", điều đó có nghĩa là đơn hàng vẫn chưa được xác nhận thanh toán.
- Thanh toán không phải tiền mặt: Nếu đơn hàng không dùng hình thức tiền mặt và trạng thái là "Đang chờ xác nhận", thì đơn hàng được xem là đã thanh toán.
- Đang giao hàng: Đơn hàng đang trong quá trình giao có trạng thái "Đang giao hàng".
- Giao hàng thành công: Đơn hàng đã được giao thành công sẽ có trạng thái "Đã giao hàng".
- Đã hủy: Đơn hàng bị hủy sẽ có trạng thái "Đã hủy".

* Quy tắc An toàn
❌ Tuyệt đối không:
- Đề cập đến các sản phẩm ngoài cửa hàng.
- Không nói về giáo dục, chính trị, tôn giáo, tình dục.
- Không châm biếm, chửi bới, xúc phạm người khác.
- Không chia sẻ thông tin cá nhân của bất kỳ ai.
- Đưa thông tin không chắc chắn.
- Không lặp lại câu trả lời.

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
- Tên khách hàng: ${resultUser.user.full_name}
- Giỏ hàng: ${cartTxt}
- Đơn đặt hàng: ${orderTxt}
- Lịch sử đoạn chat gần nhất: ${historyChat}

${prompt ? `**Hướng dẫn Bổ sung**\n${prompt}` : ''}
`.trim();

        const botResponse = await sendMessageChatBot(systemPrompt, message);

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