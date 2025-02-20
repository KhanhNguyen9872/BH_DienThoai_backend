const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../utils/mysql'); // Assuming you have a db connection setup in db.js
const { check, validationResult } = require('express-validator'); // For input validation
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { SECRET_TOKEN } = require('../config/config');

// MD5 hashing function
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// Login route - POST /auth
router.post(
  '/auth',
  [
    // Input validation using express-validator
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = md5(password);

    try {
      // Query the database
      const query = 'SELECT * FROM account WHERE username = ? AND password = ?';
      const [results] = await db.promise().query(query, [username, hashedPassword]);


      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' }); // Authentication failed
      }

      const user = results[0]; // Assuming only one user matches username and password

      if (user.lock_acc === 1) { // Assuming 1 means locked
        return res.status(403).json({ message: 'Account is locked' });
      }

      // Authentication successful - Generate JWT access token
      const payload = {
        id: user.id
      };

      const accessToken = jwt.sign(payload, SECRET_TOKEN, {
        expiresIn: '12h' // Token expires in 12 hours
      });

      // you may want to store refreshToken for refresh accessToken

      return res.status(200).json({ message: 'Login successful', accessToken });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;