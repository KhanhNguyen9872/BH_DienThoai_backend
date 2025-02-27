const db = require('./mysql');
const crypto = require('crypto');

const getUserId = (req, res, next) => {
  const accountId = req.user.id; // Assuming req.user.id contains the account ID
  
  // Query to fetch user_id based on account_id
  db.query(`
    SELECT u.last_name, u.first_name, CONCAT(u.last_name, ' ', u.first_name) AS full_name, a.user_id
    FROM account a
    JOIN user u ON a.user_id = u.id
    WHERE a.id = ?`, [accountId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
  
      // If no user_id or user details are found
      if (results.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Attach the found user_id and full_name to req for later use in the next middleware or route
      req.user.userId = results[0].user_id;
      req.user.fullName = results[0].full_name;
  
      // Proceed to the next middleware or route handler
      next();
    });  
};

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

module.exports = { getUserId, md5 };
