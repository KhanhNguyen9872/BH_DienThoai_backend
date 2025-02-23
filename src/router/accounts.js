const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../utils/mysql'); // Assuming you have a db connection setup in db.js
const { check, validationResult } = require('express-validator'); // For input validation
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { md5 } = require('../utils/lib');
const { verifyToken } = require('../utils/authenticate');

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

      const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
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

// POST route to handle user, account, and address data
router.post('/', async (req, res) => {
  const { username, password, email, firstName, lastName, lock, information } = req.body;

  // Validate input
  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Start a MySQL transaction using promise() for db operations
    const promiseDb = db.promise();  // Using promise() here for the transaction

    await promiseDb.beginTransaction();

    // Insert data into user table (without gender)
    const userQuery = 'INSERT INTO user (first_name, last_name, email) VALUES (?, ?, ?)';
    const userValues = [firstName, lastName, email];
    
    const [userResult] = await promiseDb.query(userQuery, userValues);
    const userId = userResult.insertId;

    // Insert data into account table
    const accountQuery = 'INSERT INTO account (username, password, lock_acc, user_id) VALUES (?, ?, ?, ?)';
    const accountValues = [username, password, lock, userId];
    
    await promiseDb.query(accountQuery, accountValues);

    // Insert data into address table
    if (information && information.length > 0) {
      for (let i = 0; i < information.length; i++) {
        const { full_name, address, phone } = information[i];

        const addressQuery = 'INSERT INTO address (user_id, full_name, address, phone) VALUES (?, ?, ?, ?)';
        const addressValues = [userId, full_name, address, phone];

        await promiseDb.query(addressQuery, addressValues);
      }
    }

    // Commit transaction
    await promiseDb.commit();

    // Send a success response
    res.status(201).json({ message: 'User, account, and address data inserted successfully' });
  } catch (error) {
    // Rollback transaction in case of error
    await promiseDb.rollback();
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /forgot route for handling password reset request
router.post('/forgot', (req, res) => {
  const { username, email } = req.body;

  // Validate input
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  // Check if the user exists by joining account and user tables on user_id
  db.query(
    'SELECT a.id FROM account a JOIN user u ON a.user_id = u.id WHERE a.username = ? AND u.email = ?',
    [username, email],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = rows[0].id;

      // Generate a new random password (for simplicity, using a combination of random bytes)
      const newPassword = crypto.randomBytes(8).toString('hex'); // 16 characters password (8 bytes in hex)

      // Hash the new password using MD5
      const hashedPassword = md5(newPassword);

      // Save the hashed password in the account table by user_id
      db.query('UPDATE account SET password = ? WHERE user_id = ?', [hashedPassword, userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update password' });
        }

        // Return the new password to the user (for them to use it)
        res.status(200).json({ message: 'Password reset successful', newPassword: newPassword });
      });
    }
  );
});

// PUT /password route for handling password change
router.put('/password', verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const accountId = req.user.id; // Assuming `req.user.id` contains the account ID of the authenticated user

  // Validate input
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Both oldPassword and newPassword are required' });
  }

  // Check if the old password is correct by querying the account table
  db.query('SELECT password FROM account WHERE id = ?', [accountId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const storedPassword = rows[0].password;

    if (md5(oldPassword) != storedPassword) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    // Hash the new password and update the account table
    const hashedNewPassword = md5(newPassword);

    db.query('UPDATE account SET password = ? WHERE user_id = ?', [hashedNewPassword, accountId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update password' });
      }

      // Return a success message
      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
});

module.exports = router;