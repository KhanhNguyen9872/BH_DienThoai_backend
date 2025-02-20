const db = require('./mysql');

const getUserId = (req, res, next) => {
  const accountId = req.user.id; // Assuming req.user.id contains the account ID
  
  // Query to fetch user_id based on account_id
  db.query('SELECT user_id FROM account WHERE id = ?', [accountId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    // If no user_id is found
    if (results.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Attach the found user_id to req for later use in the next middleware or route
    req.user.userId = results[0].user_id;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = getUserId;
