// routes/accountRoute.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../utils/authenticate');
const { check, validationResult } = require('express-validator');

// POST /auth (login)
router.post(
  '/auth',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res) => {
    // Handle validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return accountController.login(req, res);
  }
);

// POST / (create user + account + address)
router.post('/', (req, res) => {
  return accountController.createAccount(req, res);
});

// POST /forgot (forgot password)
router.post('/forgot', (req, res) => {
  return accountController.forgotPassword(req, res);
});

// PUT /password (change password)
router.put('/password', verifyToken, (req, res) => {
  return accountController.changePassword(req, res);
});

module.exports = router;
