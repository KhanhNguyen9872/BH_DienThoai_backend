// controllers/accountController.js
const AccountModel = require('../models/accountModel');
const crypto = require('crypto');
const { md5 } = require('../utils/lib');
const { generateToken, revokeToken } = require('../utils/auth');

class AccountController {
  async logout(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'User not authenticated' });
      }
  
      const user_id = req.user.id;
      const result = await revokeToken(user_id);
      
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Handle user login (POST /auth).
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const hashedPassword = md5(password);
  
      // Find user with matching credentials
      const results = await AccountModel.findAccountByCredentials(username, hashedPassword);
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = results[0];
      // Check if the account is locked
      if (user.lock_acc === 1) {
        return res.status(403).json({ message: 'Account is locked' });
      }
  
      const accessToken = generateToken(user.id);
  
      return res.status(200).json({
        message: 'Login successful',
        accessToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Create user + account + address (POST /).
   */
  async createAccount(req, res) {
    try {
      const { username, password, email, firstName, lastName } = req.body;

      // Basic server-side checks
      if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const lock = false;
      const information = [];
      
      // Perform transaction in the model
      let hashedPassword = md5(password);
      const result = await AccountModel.createUserAccountTransaction({
        username,
        hashedPassword,
        email,
        firstName,
        lastName,
        lock,
        information,
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'username or email is already registered!' });
    }
  }

  /**
   * Handle "forgot password" reset (POST /forgot).
   */
  async forgotPassword(req, res) {
    try {
      const { username, email } = req.body;
      if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
      }

      // Check if user exists
      const rows = await AccountModel.findAccountByUsernameEmail(username, email);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate a random new password
      const newPassword = crypto.randomBytes(8).toString('hex'); // 16 characters
      const hashedPassword = md5(newPassword);

      // Update the password in DB
      const accountId = rows[0].id;
      await AccountModel.updatePasswordByAccountId(accountId, hashedPassword);

      return res.status(200).json({
        message: 'Password reset successful',
        newPassword: newPassword, // Return the new password
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  /**
   * Change user password (PUT /password).
   */
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const accountId = req.user.id; // Provided by verifyToken middleware

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both oldPassword and newPassword are required' });
      }

      // Verify the old password
      const rows = await AccountModel.findAccountById(accountId);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const storedPassword = rows[0].password;
      if (md5(oldPassword) != storedPassword) {
        return res.status(401).json({ error: 'Wrong password' });
      }

      // Hash and update to new password
      const hashedNewPassword = md5(newPassword);
      await AccountModel.updatePasswordByAccountId(accountId, hashedNewPassword);

      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

// Export as a singleton
module.exports = new AccountController();
