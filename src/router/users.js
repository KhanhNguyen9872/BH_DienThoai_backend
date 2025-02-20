const express = require('express');
const router = express.Router();
const db = require('../utils/mysql'); // Adjust the path as needed
const { verifyToken } = require('../utils/authenticate');

// Route to get user information - GET /users
router.get('/', verifyToken, async (req, res) => {
    // Access user information from req.user (set by verifyToken middleware)
    const userId = req.user.id;  // Changed to userId

    try {
        // Query the database using a JOIN
        const query = `
            SELECT
                user.id AS id,
                account.username AS username,
                user.email AS email,
                user.first_name AS firstName,
                user.last_name AS lastName,
                account.lock_acc AS locked
            FROM
                account
            JOIN
                user ON account.user_id = user.id
            WHERE
                account.id = ?`;

        const [accountResults] = await db.promise().query(query, [userId]);

        if (accountResults.length === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const user = accountResults[0];  // Get the first result

        // Query the database for address information
        const addressQuery = `
            SELECT
                id,
                full_name AS fullName,
                address,
                phone
            FROM
                address
            WHERE
                user_id = ?`;

        const [addressResults] = await db.promise().query(addressQuery, [user.id]);

        // Construct the final result
        const result = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            lock: user.locked === 1 ? true : false, // Convert to boolean, lock_acc = 1 -> lock = true
            information: addressResults
        };

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;