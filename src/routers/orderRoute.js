const express = require('express');
const router = express.Router();
const { getUserId } = require('../utils/lib');
const orderController = require('../controllers/orderController');

// GET all orders of a user
router.get('/', getUserId, orderController.getAllOrdersOfUser);

// GET a specific order by ID
router.get('/:id', getUserId, orderController.getOrderById);

// CREATE a new order
router.post('/', getUserId, orderController.createOrder);

// Mark an order as success (paid)
router.post('/:id/success', getUserId, orderController.successOrder);

// CANCEL an order
router.delete('/:orderId', getUserId, orderController.cancelOrder);

module.exports = router;
