const express = require('express');
const router = express.Router();
const db = require('../utils/mysql');
const { getUserId, sendNotification } = require('../utils/lib');
const { sendTelegramMessage } = require('../utils/telebot');

// Get all orders of user
router.get('/', getUserId, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [orders] = await db.promise().query(
            `SELECT o.id, oi.products, oi.totalPrice, oi.payment, oi.status, oi.address, oi.orderAt
            FROM orders o
            JOIN order_info oi ON o.id = oi.order_id
            WHERE o.user_id = ?`,
            [userId]
        );

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
});

// Get a specific order by ID
router.get('/:id', getUserId, async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.userId;

        const [orders] = await db.promise().query(
            `SELECT o.id, oi.products, oi.totalPrice, oi.payment, oi.status, oi.address, oi.orderAt
            FROM orders o
            JOIN order_info oi ON o.id = oi.order_id
            WHERE o.id = ? AND o.user_id = ?`,
            [orderId, userId]
        );

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
});

router.post('/', getUserId, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { payment, status, address, totalPrice, products } = req.body;

        // Extract necessary data from products
        const extractedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            color: product.color,
            quantity: product.quantity,
            price: product.price,
            totalPrice: product.totalPrice
        }));

        // Start a transaction
        await db.promise().beginTransaction();

        // Insert into orders table
        const [result] = await db.promise().query(
            'INSERT INTO orders (user_id) VALUES (?)',
            [userId]
        );

        const orderId = result.insertId;

        // Insert into order_info table
        await db.promise().query(
            `INSERT INTO order_info (order_id, products, totalPrice, payment, status, address, orderAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [orderId, JSON.stringify(extractedProducts), totalPrice, payment, status, JSON.stringify(address)]
        );

        // Update product quantities
        for (const product of products) {
            const [rows] = await db.promise().query(
                'SELECT color FROM product WHERE id = ?',
                [product.id]
            );

            if (rows.length > 0) {
                const colorArray = rows[0].color;
                const updatedColorArray = colorArray.map(color => {
                    if (color.name === product.color) {
                        return {
                            ...color,
                            quantity: color.quantity - product.quantity
                        };
                    }
                    return color;
                });

                await db.promise().query(
                    'UPDATE product SET color = ? WHERE id = ?',
                    [JSON.stringify(updatedColorArray), product.id]
                );
            }
        }

        // Remove ordered products from the cart
        for (const product of products) {
            await db.promise().query(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND color = ?',
                [userId, product.id, product.color]
            );
        }

        // Commit the transaction
        await db.promise().commit();

        // Fetch buyer's full name, payment method, and order date (orderAt)
        const [orderDetails] = await db.promise().query(
            `SELECT u.first_name, u.last_name, oi.payment, oi.orderAt 
             FROM orders o 
             JOIN user u ON u.id = o.user_id 
             JOIN order_info oi ON oi.order_id = o.id
             WHERE o.id = ?`,
            [orderId]
        );

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Order details not found' });
        }

        const orderInfo = orderDetails[0];
        const fullName = `${orderInfo.first_name} ${orderInfo.last_name}`;
        const orderAt = orderInfo.orderAt;


        // Create a detailed product list for the Telegram message
        let productDetails = '';
        products.forEach(product => {
            productDetails += `${product.name} (${product.color})\n`;
            productDetails += `Số lượng: ${product.quantity}\n`;
            productDetails += `Giá: ${product.price} VNĐ\n\n`;
        });

        // If status is 'Đang chờ xác nhận', send a Telegram message
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

        // If status is 'Đang chờ thanh toán', send a Telegram message about payment waiting
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
        // Rollback the transaction if an error occurred
        await db.promise().rollback();
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/:id/success', getUserId, async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.userId;

        // Check if the order belongs to the authenticated user
        const [orders] = await db.promise().query(
            'SELECT id FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order details and customer information
        const [orderDetails] = await db.promise().query(
            `SELECT u.first_name, u.last_name, oi.payment, oi.products, oi.orderAt 
            FROM orders o 
            JOIN user u ON u.id = o.user_id 
            JOIN order_info oi ON oi.order_id = o.id
            WHERE o.id = ?`,
            [orderId]
        );

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Order details not found' });
        }

        const orderInfo = orderDetails[0];
        const fullName = `${orderInfo.first_name} ${orderInfo.last_name}`;
        const payment = orderInfo.payment;
        const products = orderInfo.products; // Assuming products are stored as JSON
        const orderAt = orderInfo.orderAt;

        // Construct the message
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

        // Update the order status to "Đang chờ xác nhận"
        await db.promise().query(
            'UPDATE order_info SET status = ? WHERE order_id = ?',
            ['Đang chờ xác nhận', orderId]
        );

        // Send the message to Telegram
        sendTelegramMessage(message);
        await sendNotification(`Đã thanh toán, hãy xác nhận đơn hàng [ID: ${orderId}]`, `/orders/${orderId}`);

        return res.json({ message: 'Order status updated successfully' });

    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Cancel an order
router.delete('/:orderId', getUserId, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user.userId;

        // Start a transaction
        await db.promise().beginTransaction();

        // Update order status to 'Đã hủy'
        await db.promise().query(
            'UPDATE order_info SET status = ? WHERE order_id = ?',
            ['Đã hủy', orderId]
        );

        // Get the canceled order details
        const [rows] = await db.promise().query(
            'SELECT products, totalPrice FROM order_info WHERE order_id = ?',
            [orderId]
        );

        if (rows.length > 0) {
            const products = JSON.parse(rows[0].products); // Assuming products are stored as JSON
            const totalPrice = rows[0].totalPrice;

            // Restore product quantities
            for (const product of products) {
                const [productRows] = await db.promise().query(
                    'SELECT color FROM product WHERE id = ?',
                    [product.id]
                );

                if (productRows.length > 0) {
                    const colorArray = productRows[0].color;
                    const updatedColorArray = colorArray.map(color => {
                        if (color.name === product.color) {
                            return {
                                ...color,
                                quantity: color.quantity + product.quantity
                            };
                        }
                        return color;
                    });

                    await db.promise().query(
                        'UPDATE product SET color = ? WHERE id = ?',
                        [JSON.stringify(updatedColorArray), product.id]
                    );
                }
            }

            // Construct the message
            let productDetails = '';
            products.forEach(product => {
                productDetails += `${product.name} (${product.color})\n`;
                productDetails += `Số lượng: ${product.quantity}\n`;
                productDetails += `Giá: ${product.moneyDiscount ? product.moneyDiscount : product.money} VNĐ\n\n`;
            });

            const message = `Đơn hàng ID: ${orderId} đã bị hủy:\n\n` +
                            `Tổng giá trị: ${totalPrice} VNĐ\n\n` +
                            `Sản phẩm:\n${productDetails}`;

            // Send the cancellation message to Telegram
            sendTelegramMessage(message);
            await sendNotification(`Đơn hàng đã bị hủy [ID: ${orderId}]`, `/orders/${orderId}`)
        }

        // Commit the transaction
        await db.promise().commit();

        return res.json({ message: 'Order canceled successfully' });

    } catch (error) {
        // Rollback the transaction if an error occurred
        await db.promise().rollback();
        console.error('Error canceling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;