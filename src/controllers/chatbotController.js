const ChatbotModel = require('../models/chatbotModel');
const { sendMessageChatBot } = require('../utils/aichatbot'); // External utility for AI chatbot

class ChatbotController {
    /**
     * GET / - Retrieve a user's chat history
     */
    async getChatHistory(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required.' });
            }

            const history = await ChatbotModel.getChatHistory(userId);
            return res.json(history);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return res.status(500).json({ error: 'Failed to fetch chat history.' });
        }
    }

    /**
     * POST / - Send a message to the chatbot and store the conversation.
     */
    async postUserMessage(req, res) {
        try {
            const { message, prompt } = req.body;
            // The code uses "req.user?.id" – you can adapt it if you store user in `req.user.userId`:
            const accountId = req.user?.id; 
            if (!accountId) {
                return res.status(400).json({ error: 'User ID is required.' });
            }

            if (!message || !message.trim()) {
                return res.status(400).json({ error: 'Message is required.' });
            }

            // 1) Fetch basic user/account data
            const userResults = await ChatbotModel.getUserAccountData(accountId);
            if (userResults.length === 0) {
                return res.status(404).send('User not found');
            }

            const userId_ = userResults[0].user_id;

            // 2) Fetch addresses, orders, cart
            const [addressResults, ordersResults, cartResults] = await Promise.all([
                ChatbotModel.getUserAddresses(userId_),
                ChatbotModel.getUserOrders(userId_),
                ChatbotModel.getUserCart(userId_)
            ]);

            // Combine data
            const resultUser = {
                user: userResults[0], // username, full_name, email, user_id
                addresses: addressResults,
                orders: ordersResults,
                cart: cartResults
            };

            // 3) Insert the user's message into the history (isBot=0)
            await ChatbotModel.insertChatMessage(userId_, message, 0);

            // 4) Build an all-product string
            const products = await ChatbotModel.getAllProducts();
            let allProductTxt = '';
            products.forEach((row) => {
                let colors = '{';
                row.color.forEach((color) => {
                    const formattedPrice = new Intl.NumberFormat('vi-VN').format(color.money);
                    colors += `Màu ${color.name} có giá ${formattedPrice} VND còn ${color.quantity} cái `;

                    if (color.moneyDiscount) {
                        const discountPrice = new Intl.NumberFormat('vi-VN').format(color.moneyDiscount);
                        colors += `và giảm giá còn ${discountPrice} VND`;
                    }
                    colors += ', ';
                });
                colors += '}';

                allProductTxt += `[ID: ${row.id}, tên: ${row.name}, màu: ${colors}, lượt thích: ${row.favorite.length}],`;
            });

            // 5) Retrieve last ~30 messages for conversation context
            let historyRows = await ChatbotModel.getChatHistory(userId_);
            if (historyRows.length > 30) {
                historyRows = historyRows.slice(historyRows.length - 30);
            }
            let historyChat = '';
            let count = 1;
            historyRows.forEach((row) => {
                const messageType = row.isBot === '1' ? 'Bot message' : 'User message';
                historyChat += `[Index: ${count}, ${messageType}: ${row.message}], `;
                count += 1;
            });

            // 6) Build addresses, orders, cart strings
            let addressTxt = '';
            resultUser.addresses.forEach((address) => {
                addressTxt += `[ID: ${address.id}, Họ và tên: ${address.full_name}, Địa chỉ: ${address.address}, Số điện thoại: ${address.phone}],`;
            });

            let orderTxt = '';
            resultUser.orders.forEach((order) => {
                orderTxt += `[ID: ${order.order_id}, Tổng tiền: ${order.totalPrice}, Thanh toán: ${order.payment}, Trạng thái: ${order.status}],`;
            });

            let cartTxt = '';
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

            // 7) Send the user's question & system prompt to the AI chatbot
            const botResponse = await sendMessageChatBot(systemPrompt, message);

            // 8) Return the result to the client & store the bot's response in DB
            if (botResponse) {
                // Add bot response to the chat history
                await ChatbotModel.insertChatMessage(userId_, botResponse, 1);

                return res.json({ content: botResponse });
            } else {
                return res.status(500).json({ error: 'Failed to extract bot response.' });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Something went wrong while processing the request.' });
        }
    }

    /**
     * DELETE / - Clear a user's entire chat history
     */
    async deleteChatHistory(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required.' });
            }

            const affectedRows = await ChatbotModel.clearChatHistory(userId);
            if (affectedRows > 0) {
                return res.json({ message: 'Chat history cleared successfully.' });
            } else {
                return res.status(404).json({ message: 'No chat history found for this user.' });
            }
        } catch (error) {
            console.error('Error clearing chat history:', error);
            return res.status(500).json({ error: 'Failed to clear chat history.' });
        }
    }
}

module.exports = new ChatbotController();
