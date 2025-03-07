const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const { verifyToken } = require('../utils/auth');
const { getUserId } = require('../utils/lib');

// GET all products
router.get('/', productController.getAllProducts);

// GET a single product by ID
router.get('/:id', productController.getProductById);

// POST: add a product to the user's favorite list
router.post('/:id/favorite', verifyToken, getUserId, productController.addToFavorite);

// DELETE: remove a product from the user's favorite list
router.delete('/:id/favorite', verifyToken, getUserId, productController.removeFromFavorite);

module.exports = router;
