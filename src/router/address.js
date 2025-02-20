const express = require('express');
const router = express.Router();
const db = require('../utils/mysql'); // Adjust the path as needed
const { verifyToken } = require('../utils/authenticate');
const getUserId = require('../utils/lib');

router.get('/', verifyToken, getUserId, async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the token

    try {
        const query = 'SELECT * FROM address WHERE user_id = ?';
        const [addresses] = await db.promise().query(query, [userId]);

        return res.status(200).json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', verifyToken, getUserId, async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the token
    const addressId = req.params.id; // Get the address ID from the URL parameter

    try {
        const query = 'SELECT * FROM address WHERE id = ? AND user_id = ?';
        const [address] = await db.promise().query(query, [addressId, userId]);

        if (address.length === 0) {
            return res.status(404).json({ message: 'Address not found or you do not have permission to view this address' });
        }

        return res.status(200).json(address[0]); // Return the first matching address
    } catch (error) {
        console.error('Error fetching address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// POST route to add a new address
router.post('/', verifyToken, getUserId, async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the token
    const { fullName, address, phone } = req.body; // Get address data from the request body

    // Validate the required fields
    if (!fullName || !address || !phone) {
        return res.status(400).json({ message: 'Full name, address, and phone are required' });
    }

    try {
        const query = 'INSERT INTO address (user_id, full_name, address, phone) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [userId, fullName, address, phone]);

        return res.status(201).json({
            message: 'Address added successfully',
            address: {
                id: result.insertId, // The ID of the newly inserted address
                user_id: userId,
                fullName,
                address,
                phone,
            },
        });
    } catch (error) {
        console.error('Error adding address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE route to remove an address by ID
router.delete('/:id', verifyToken, getUserId, async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the token
    const addressId = req.params.id; // Get the address ID from the URL

    try {
        // Query to delete the address for the specified user and address ID
        const query = 'DELETE FROM address WHERE id = ? AND user_id = ?';
        const [result] = await db.promise().query(query, [addressId, userId]);

        // If no address was found or deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Address not found or you do not have permission to delete this address' });
        }

        // Return success message
        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT route to update an existing address by ID
router.put('/:id', verifyToken, getUserId, async (req, res) => {
    const userId = req.user.userId; // Get the user ID from the token
    const addressId = req.params.id; // Get the address ID from the URL parameter
    const { fullName, address, phone } = req.body; // Get updated address data from the request body

    // Validate the required fields
    if (!fullName || !address || !phone) {
        return res.status(400).json({ message: 'Full name, address, and phone are required' });
    }

    try {
        // Query to update the address for the specified user and address ID
        const query = `
            UPDATE address
            SET full_name = ?, address = ?, phone = ?
            WHERE id = ? AND user_id = ?`;

        const [result] = await db.promise().query(query, [fullName, address, phone, addressId, userId]);

        // If no address was found or updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Address not found or you do not have permission to update this address' });
        }

        // Return success message with the updated address
        return res.status(200).json({
            message: 'Address updated successfully',
            address: {
                id: addressId,
                user_id: userId,
                fullName,
                address,
                phone,
            },
        });
    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;