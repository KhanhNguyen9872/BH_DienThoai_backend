const db = require('../utils/mysql');

/**
 * Fetch chat history for a user (ascending time).
 */
const getChatHistory = async (userId) => {
    const [rows] = await db.promise().query(
        'SELECT message, isBot, time FROM history_chatbot WHERE user_id = ? ORDER BY time ASC',
        [userId]
    );
    return rows;
};

/**
 * Insert a message into the chatbot history.
 */
const insertChatMessage = async (userId, message, isBot) => {
    await db.promise().execute(
        'INSERT INTO history_chatbot (user_id, message, isBot) VALUES (?, ?, ?)',
        [userId, message, isBot]
    );
};

/**
 * Clear all chat history for a specific user.
 */
const clearChatHistory = async (userId) => {
    const [result] = await db.promise().execute(
        'DELETE FROM history_chatbot WHERE user_id = ?',
        [userId]
    );
    return result.affectedRows;
};

/**
 * Get account + user info by accountId.
 */
const getUserAccountData = async (accountId) => {
    const userQuery = `
        SELECT
            a.username,
            CONCAT(b.first_name, ' ', b.last_name) AS full_name,
            b.email,
            b.id AS user_id
        FROM account a
        JOIN user b ON a.user_id = b.id
        WHERE a.id = ?
    `;
    const [rows] = await db.promise().execute(userQuery, [accountId]);
    return rows;
};

/**
 * Get all addresses for a given userId.
 */
const getUserAddresses = async (userId) => {
    const addressQuery = `
        SELECT c.id, c.full_name, c.address, c.phone
        FROM address c
        WHERE c.user_id = ?
    `;
    const [rows] = await db.promise().execute(addressQuery, [userId]);
    return rows;
};

/**
 * Get all orders for a given userId.
 */
const getUserOrders = async (userId) => {
    const ordersQuery = `
        SELECT oi.order_id, oi.totalPrice, oi.payment, oi.status
        FROM orders o
        JOIN order_info oi ON o.id = oi.order_id
        WHERE o.user_id = ?
    `;
    const [rows] = await db.promise().execute(ordersQuery, [userId]);
    return rows;
};

/**
 * Get all cart items for a given userId.
 */
const getUserCart = async (userId) => {
    const cartQuery = `
        SELECT product_id, quantity, color
        FROM cart
        WHERE user_id = ?
    `;
    const [rows] = await db.promise().execute(cartQuery, [userId]);
    return rows;
};

/**
 * Get all products (including color, favorite) from 'product' table.
 */
const getAllProducts = async () => {
    const [rows] = await db.promise().query(
        `SELECT p.id, p.name, p.color, p.favorite FROM product p;`
    );
    return rows;
};


module.exports = {
    getChatHistory,
    insertChatMessage,
    clearChatHistory,
    getUserAccountData,
    getUserAddresses,
    getUserOrders,
    getUserCart,
    getAllProducts
};
