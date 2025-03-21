const db = require('../utils/mysql');

/**
 * Get all items in the cart for a specific user.
 */
const getCartItems = async (userId) => {
    const [carts] = await db.promise().query(
        'SELECT product_id as productId, quantity, color FROM cart WHERE user_id = ?',
        [userId]
    );
    return carts;
};

/**
 * Add a product to the user's cart.
 */
const addToCart = async (userId, productId, quantity, color) => {
    // Check if the item is already in the cart for this user with the same product and color
    const [rows] = await db.promise().query(
        'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ? AND color = ?',
        [userId, productId, color]
    );

    if (rows.length > 0) {
        // Update the quantity if found
        await db.promise().query(
            'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND color = ?',
            [quantity, userId, productId, color]
        );
    } else {
        // Insert a new row if not found
        await db.promise().query(
            'INSERT INTO cart (user_id, product_id, quantity, color) VALUES (?, ?, ?, ?)',
            [userId, productId, quantity, color]
        );
    }
};

/**
 * Remove a product from the user's cart by product ID and color.
 */
const removeFromCart = async (userId, productId, color) => {
    await db.promise().query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND color = ?',
        [userId, productId, color]
    );
};

const removeCart = async (userId) => {
    try {
        return await db.promise().query(
            'DELETE FROM cart WHERE user_id = ?',
            [userId]
        );
    } catch (error) {
        return null;
    }
};

/**
 * Update cart item (quantity or color) for a specific product in a user's cart.
 */
const updateCartItem = async (userId, productId, quantity, color) => {
    await db.promise().query(
        'UPDATE cart SET quantity = ?, color = ? WHERE user_id = ? AND product_id = ?',
        [quantity, color, userId, productId]
    );
};

module.exports = {
    getCartItems,
    addToCart,
    removeFromCart,
    removeCart,
    updateCartItem
};
