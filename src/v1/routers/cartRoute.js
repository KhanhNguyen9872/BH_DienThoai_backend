const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { getUserId } = require('../utils/lib');

// Get all items in cart
router.get('/', getUserId, cartController.getCartItems);

// Add product to cart
router.post('/', getUserId, cartController.addToCart);

// Delete product from cart
router.delete('/:productId', getUserId, cartController.removeFromCart);

// Update product in cart
router.put('/:productId', getUserId, cartController.updateCartItem);

module.exports = router;
