// routes/userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Example: GET /users
router.get('/', userController.getUserProfile);

module.exports = router;
