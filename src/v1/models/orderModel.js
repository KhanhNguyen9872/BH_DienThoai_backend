const db = require('../utils/mysql');

/**
 * Fetch all orders for a given user.
 */
const getAllOrdersOfUser = async (userId) => {
    const [orders] = await db.promise().query(
        `SELECT o.id, oi.products, oi.totalPrice, oi.payment, oi.status, oi.address, oi.orderAt
         FROM orders o
         JOIN order_info oi ON o.id = oi.order_id
         WHERE o.user_id = ?`,
        [userId]
    );
    return orders;
};

/**
 * Fetch a specific order by ID for a given user.
 */
const getOrderById = async (orderId, userId) => {
    const [orders] = await db.promise().query(
        `SELECT o.id, oi.products, oi.totalPrice, oi.payment, oi.status, oi.address, oi.orderAt
         FROM orders o
         JOIN order_info oi ON o.id = oi.order_id
         WHERE o.id = ? AND o.user_id = ?`,
        [orderId, userId]
    );
    return orders;
};

/**
 * Insert a new row into 'orders' table and return the inserted order's ID.
 */
const insertOrder = async (userId) => {
    const [result] = await db.promise().query(
        'INSERT INTO orders (user_id) VALUES (?)',
        [userId]
    );
    return result.insertId;
};

/**
 * Insert data into the 'order_info' table.
 */
const insertOrderInfo = async (orderId, extractedProducts, totalPrice, payment, status, address) => {
    await db.promise().query(
        `INSERT INTO order_info (order_id, products, totalPrice, payment, status, address, orderAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [orderId, JSON.stringify(extractedProducts), totalPrice, payment, status, JSON.stringify(address)]
    );
};

/**
 * Begin a database transaction.
 */
const beginTransaction = async () => {
    await db.promise().beginTransaction();
};

/**
 * Commit a database transaction.
 */
const commitTransaction = async () => {
    await db.promise().commit();
};

/**
 * Rollback a database transaction.
 */
const rollbackTransaction = async () => {
    await db.promise().rollback();
};

/**
 * Retrieve 'color' array for a specific product.
 */
const getProductColor = async (productId) => {
    const [rows] = await db.promise().query(
        'SELECT color FROM product WHERE id = ?',
        [productId]
    );
    return rows.length > 0 ? rows[0].color : null;
};

/**
 * Update 'color' array for a specific product.
 */
const updateProductColor = async (productId, colorArray) => {
    await db.promise().query(
        'UPDATE product SET color = ? WHERE id = ?',
        [JSON.stringify(colorArray), productId]
    );
};

/**
 * Remove items from cart table.
 */
const removeFromCart = async (userId, productId, color) => {
    await db.promise().query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND color = ?',
        [userId, productId, color]
    );
};

/**
 * Get additional details (first_name, last_name, payment, orderAt) after an order is created.
 */
const getOrderDetails = async (orderId) => {
    const [orderDetails] = await db.promise().query(
        `SELECT u.first_name, u.last_name, oi.payment, oi.orderAt 
         FROM orders o 
         JOIN user u ON u.id = o.user_id 
         JOIN order_info oi ON oi.order_id = o.id
         WHERE o.id = ?`,
        [orderId]
    );
    return orderDetails;
};

/**
 * Verify if an order belongs to a user.
 */
const getOrderForUser = async (orderId, userId) => {
    const [orders] = await db.promise().query(
        'SELECT id FROM orders WHERE id = ? AND user_id = ?',
        [orderId, userId]
    );
    return orders;
};

/**
 * Get full order details (including products) for 'success' route usage.
 */
const getFullOrderDetails = async (orderId) => {
    const [orderDetails] = await db.promise().query(
        `SELECT u.first_name, u.last_name, oi.payment, oi.products, oi.orderAt 
         FROM orders o
         JOIN user u ON u.id = o.user_id
         JOIN order_info oi ON oi.order_id = o.id
         WHERE o.id = ?`,
        [orderId]
    );
    return orderDetails;
};

/**
 * Update the status of an order in 'order_info'.
 */
const updateOrderStatus = async (orderId, status) => {
    await db.promise().query(
        'UPDATE order_info SET status = ? WHERE order_id = ?',
        [status, orderId]
    );
};

/**
 * Cancel (update status to 'Đã hủy') a specific order.
 */
const cancelOrder = async (orderId) => {
    await db.promise().query(
        'UPDATE order_info SET status = ? WHERE order_id = ?',
        ['Đã hủy', orderId]
    );
};

/**
 * Fetch products and total price of an order from 'order_info'.
 */
const getOrderInfo = async (orderId) => {
    const [rows] = await db.promise().query(
        'SELECT products, totalPrice FROM order_info WHERE order_id = ?',
        [orderId]
    );
    return rows;
};

module.exports = {
    getAllOrdersOfUser,
    getOrderById,
    insertOrder,
    insertOrderInfo,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
    getProductColor,
    updateProductColor,
    removeFromCart,
    getOrderDetails,
    getOrderForUser,
    getFullOrderDetails,
    updateOrderStatus,
    cancelOrder,
    getOrderInfo
};
