const express = require('express');
const router = express.Router();
const db = require('../utils/mysql');
const { getUserId } = require('../utils/lib');

// Get all items in cart
router.get('/', getUserId, async (req, res) => {
    try {
        const userId = req.user.userId;
        const [carts] = await db.promise().query(
            'SELECT product_id as productId, quantity, color FROM cart WHERE user_id = ?',
            [userId]
        );

        return res.json({
            carts,
            id: userId
        });
    } catch (error) {
        console.error('Error getting cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Add product to cart
router.post('/', getUserId, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity, color } = req.body;

        await db.promise().query(
            'INSERT INTO cart (user_id, product_id, quantity, color) VALUES (?, ?, ?, ?)',
            [userId, productId, quantity, color]
        );

        return res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete product from cart
router.delete('/:productId', getUserId, async (req, res) => {
    try {
        const userId = req.user.userId;
        const color = req.body.color;
        const { productId } = req.params;

        await db.promise().query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND color = ?',
            [userId, productId, color]
        );

        return res.json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update product in cart
router.put('/:productId', getUserId, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        const { quantity, color } = req.body;

        await db.promise().query(
            'UPDATE cart SET quantity = ?, color = ? WHERE user_id = ? AND product_id = ?',
            [quantity, color, userId, productId]
        );

        return res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;