const express = require('express');
const router = express.Router();
const db = require('../utils/mysql');
const { getUserId } = require('../utils/lib');
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

// Create a new order
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
        
        sendTelegramMessage(`New order created: ${orderId}`);
        return res.status(201).json({ message: 'Order created successfully', orderId });

    } catch (error) {
        // Rollback the transaction if an error occurred
        await db.promise().rollback();
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update order status to "Đang chờ xác nhận"
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

        // Update the order status to "Đang chờ xác nhận"
        await db.promise().query(
            'UPDATE order_info SET status = ? WHERE order_id = ?',
            ['Đang chờ xác nhận', orderId]
        );

        sendTelegramMessage(`Order ${orderId} is waiting for confirmation`);
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
            'SELECT products FROM order_info WHERE order_id = ?',
            [orderId]
        );

        if (rows.length > 0) {
            const products = rows[0].products;

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
        }

        // Commit the transaction
        await db.promise().commit();

        sendTelegramMessage(`Order ${orderId} has been canceled`);
        return res.json({ message: 'Order canceled successfully' });

    } catch (error) {
        // Rollback the transaction if an error occurred
        await db.promise().rollback();
        console.error('Error canceling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;