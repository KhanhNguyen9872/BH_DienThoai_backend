const OrderModel = require('../models/orderModel');
const { sendNotification } = require('../utils/lib');
const { sendTelegramMessage } = require('../utils/telebot');

class OrderController {
    /**
     * Get all orders of user
     */
    async getAllOrdersOfUser(req, res) {
        try {
            const userId = req.user.userId;
            const orders = await OrderModel.getAllOrdersOfUser(userId);

            const formattedOrders = orders.map(order => ({
                id: order.id,
                orderAt: order.orderAt,
                payment: order.payment,
                status: order.status,
                address: order.address,
                totalPrice: order.totalPrice,
                products: order.products
            }));

            return res.json({
                id: userId,
                orders: formattedOrders
            });
        } catch (error) {
            console.error('Error getting orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a specific order by ID
     */
    async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const userId = req.user.userId;
            const orders = await OrderModel.getOrderById(orderId, userId);

            if (orders.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const order = orders[0];
            const formattedOrder = {
                id: order.id,
                orderAt: order.orderAt,
                payment: order.payment,
                status: order.status,
                address: order.address,
                totalPrice: order.totalPrice,
                products: order.products
            };

            return res.json(formattedOrder);
        } catch (error) {
            console.error('Error getting order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new order
     */
    async createOrder(req, res) {
        try {
            const userId = req.user.userId;
            const { payment, status, address, totalPrice, products } = req.body;

            // Extract relevant product data
            const extractedProducts = products.map(product => ({
                id: product.id,
                name: product.name,
                color: product.color,
                quantity: product.quantity,
                price: product.price,
                totalPrice: product.totalPrice
            }));

            // Start transaction
            await OrderModel.beginTransaction();

            // Insert into orders table
            const orderId = await OrderModel.insertOrder(userId);

            // Insert into order_info table
            await OrderModel.insertOrderInfo(orderId, extractedProducts, totalPrice, payment, status, address);

            // Update product quantities
            for (const product of products) {
                const colorArray = await OrderModel.getProductColor(product.id);
                if (colorArray) {
                    const updatedColorArray = colorArray.map(color => {
                        if (color.name === product.color) {
                            return {
                                ...color,
                                quantity: color.quantity - product.quantity
                            };
                        }
                        return color;
                    });
                    await OrderModel.updateProductColor(product.id, updatedColorArray);
                }
            }

            // Remove ordered products from the cart
            for (const product of products) {
                await OrderModel.removeFromCart(userId, product.id, product.color);
            }

            // Commit the transaction
            await OrderModel.commitTransaction();

            // Fetch buyer's information
            const orderDetails = await OrderModel.getOrderDetails(orderId);
            if (orderDetails.length === 0) {
                return res.status(404).json({ message: 'Order details not found' });
            }

            const orderInfo = orderDetails[0];
            const fullName = `${orderInfo.first_name} ${orderInfo.last_name}`;
            const orderAt = orderInfo.orderAt;

            // Build product details for Telegram message
            let productDetails = '';
            products.forEach(product => {
                productDetails += `${product.name} (${product.color})\n`;
                productDetails += `Số lượng: ${product.quantity}\n`;
                productDetails += `Giá: ${product.price} VNĐ\n\n`;
            });

            // Send Telegram message / notification based on status
            if (status === 'Đang chờ xác nhận') {
                const message = `Đơn hàng mới được tạo:\n\n` +
                                `ID: ${orderId}\n` +
                                `Khách hàng: ${fullName}\n` +
                                `Trạng thái: ${status}\n` +
                                `Thanh toán: ${payment}\n` +
                                `Ngày đặt hàng: ${orderAt}\n` +
                                `Tổng giá trị: ${totalPrice} VNĐ\n\n` +
                                `Sản phẩm:\n${productDetails}`;
                sendTelegramMessage(message);
                await sendNotification(`Hãy xác nhận đơn hàng [ID: ${orderId}]`, `/orders/${orderId}`);
            }

            if (status === 'Đang chờ thanh toán') {
                const message = `Đơn hàng mới được tạo:\n\n` +
                                `ID: ${orderId}\n` +
                                `Khách hàng: ${fullName}\n` +
                                `Trạng thái: Đang chờ khách hàng thanh toán\n` +
                                `Thanh toán: ${payment}\n` +
                                `Ngày đặt hàng: ${orderAt}\n` +
                                `Tổng giá trị: ${totalPrice} VNĐ\n\n` +
                                `Sản phẩm:\n${productDetails}`;
                sendTelegramMessage(message);
                await sendNotification(`Đơn hàng đang chờ thanh toán [ID: ${orderId}]`, `/orders/${orderId}`);
            }

            return res.status(201).json({ message: 'Order created successfully', orderId });
        } catch (error) {
            // Rollback the transaction if there's an error
            await OrderModel.rollbackTransaction();
            console.error('Error creating order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handle "success" (payment success) of an order
     */
    async successOrder(req, res) {
        try {
            const orderId = req.params.id;
            const userId = req.user.userId;

            // Check if this order belongs to the user
            const orders = await OrderModel.getOrderForUser(orderId, userId);
            if (orders.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Fetch full order details
            const orderDetails = await OrderModel.getFullOrderDetails(orderId);
            if (orderDetails.length === 0) {
                return res.status(404).json({ message: 'Order details not found' });
            }

            const orderInfo = orderDetails[0];
            const fullName = `${orderInfo.first_name} ${orderInfo.last_name}`;
            const payment = orderInfo.payment;
            const products = JSON.parse(orderInfo.products);
            const orderAt = orderInfo.orderAt;

            // Build product details for Telegram message
            let productDetails = '';
            products.forEach(product => {
                productDetails += `${product.name} (${product.color})\n`;
                productDetails += `Số lượng: ${product.quantity}\n`;
                productDetails += `Giá: ${product.price} VNĐ\n\n`;
            });

            const message = `Đơn hàng ID: ${orderId} đã được thanh toán và đang chờ xác nhận:\n\n` +
                            `Khách hàng: ${fullName}\n` +
                            `Trạng thái: Đang chờ xác nhận\n` +
                            `Thanh toán: ${payment}\n` +
                            `Ngày đặt hàng: ${orderAt}\n\n` +
                            `Sản phẩm:\n${productDetails}`;

            // Update status to "Đang chờ xác nhận"
            await OrderModel.updateOrderStatus(orderId, 'Đang chờ xác nhận');

            // Send Telegram & in-app notification
            sendTelegramMessage(message);
            await sendNotification(`Đã thanh toán, hãy xác nhận đơn hàng [ID: ${orderId}]`, `/orders/${orderId}`);

            return res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Cancel an order
     */
    async cancelOrder(req, res) {
        try {
            const orderId = req.params.orderId;
            const userId = req.user.userId;

            // Begin transaction
            await OrderModel.beginTransaction();

            // Update order status to 'Đã hủy'
            await OrderModel.cancelOrder(orderId);

            // Get the canceled order details
            const rows = await OrderModel.getOrderInfo(orderId);
            if (rows.length > 0) {
                const products = JSON.parse(rows[0].products);
                const totalPrice = rows[0].totalPrice;

                // Restore product quantities
                for (const product of products) {
                    const colorArray = await OrderModel.getProductColor(product.id);
                    if (colorArray) {
                        const updatedColorArray = colorArray.map(color => {
                            if (color.name === product.color) {
                                return {
                                    ...color,
                                    quantity: color.quantity + product.quantity
                                };
                            }
                            return color;
                        });

                        await OrderModel.updateProductColor(product.id, updatedColorArray);
                    }
                }

                // Prepare a message for Telegram
                let productDetails = '';
                products.forEach(product => {
                    productDetails += `${product.name} (${product.color})\n`;
                    productDetails += `Số lượng: ${product.quantity}\n`;
                    productDetails += `Giá: ${product.moneyDiscount ? product.moneyDiscount : product.money} VNĐ\n\n`;
                });

                const message = `Đơn hàng ID: ${orderId} đã bị hủy:\n\n` +
                                `Tổng giá trị: ${totalPrice} VNĐ\n\n` +
                                `Sản phẩm:\n${productDetails}`;

                // Send the cancellation notification
                sendTelegramMessage(message);
                await sendNotification(`Đơn hàng đã bị hủy [ID: ${orderId}]`, `/orders/${orderId}`);
            }

            await OrderModel.commitTransaction();

            return res.json({ message: 'Order canceled successfully' });
        } catch (error) {
            // Rollback if there's an error
            await OrderModel.rollbackTransaction();
            console.error('Error canceling order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new OrderController();
