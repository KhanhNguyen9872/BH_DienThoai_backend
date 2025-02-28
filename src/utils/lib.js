const db = require('./mysql');
const crypto = require('crypto');

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

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

const sendNotification = async (text, url) => {
  // Câu lệnh SQL để insert vào bảng notifications
  const query = 'INSERT INTO notifications (text, url) VALUES (?, ?)';
  
  try {
    // Thực thi câu lệnh SQL với db.promise()
    await db.promise().query(query, [text, url]);
    console.log('Notification sent successfully');
  } catch (err) {
    console.error('Error inserting notification:', err);
  }
};

module.exports = { getUserId, md5, sendNotification };
