// routes/accountRoute.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../utils/auth');
const { check, validationResult } = require('express-validator');

router.post(
  '/auth',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return accountController.login(req, res);
  }
);

router.post('/', (req, res) => {
  return accountController.createAccount(req, res);
});

router.post('/forgot', (req, res) => {
  return accountController.forgotPassword(req, res);
});

router.patch('/password', verifyToken, (req, res) => {
  return accountController.changePassword(req, res);
});

router.delete('/', verifyToken, (req, res) => {
  return accountController.logout(req, res);
});


module.exports = router;
