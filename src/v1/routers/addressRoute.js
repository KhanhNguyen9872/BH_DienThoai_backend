const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { getUserId } = require('../utils/lib');

// Get all addresses for a user
router.get('/', getUserId, addressController.getAllAddresses);

// Get a single address by ID for the current user
router.get('/:id', getUserId, addressController.getSingleAddress);

// Create a new address
router.post('/', getUserId, addressController.createAddress);

// Delete an existing address by ID
router.delete('/:id', getUserId, addressController.deleteAddress);

// Update an existing address by ID
router.put('/:id', getUserId, addressController.updateAddress);

module.exports = router;
