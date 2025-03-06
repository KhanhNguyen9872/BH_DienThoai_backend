const AddressModel = require('../models/addressModel');

class AddressController {
    /**
     * GET / - Get all addresses for a user
     */
    async getAllAddresses(req, res) {
        try {
            const userId = req.user.userId;
            const addresses = await AddressModel.getAddressesByUser(userId);

            return res.status(200).json(addresses);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /:id - Get a single address by ID (for the current user)
     */
    async getSingleAddress(req, res) {
        try {
            const userId = req.user.userId;
            const addressId = req.params.id;

            const address = await AddressModel.getAddressByIdAndUser(addressId, userId);
            if (address.length === 0) {
                return res.status(404).json({
                    message: 'Address not found'
                });
            }

            return res.status(200).json(address[0]);
        } catch (error) {
            console.error('Error fetching address:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * POST / - Create a new address
     */
    async createAddress(req, res) {
        try {
            const userId = req.user.userId;
            const { fullName, address, phone } = req.body;

            // Validate required fields
            if (!fullName || !address || !phone) {
                return res.status(400).json({
                    message: 'Full name, address, and phone are required'
                });
            }

            const addresses = await AddressModel.getAddressesByUser(userId);
            if (addresses && addresses.length >= 3) {
                return res.status(400).json({ message: "Cannot add more address, please remove some address" });
            }

            const insertedId = await AddressModel.createAddress(userId, fullName, address, phone);

            if (!insertedId) {
                return res.status(500).json({ message: 'Error while create address' })
            }

            return res.status(201).json({
                message: 'Address added successfully'
            });
        } catch (error) {
            console.error('Error adding address:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * DELETE /:id - Delete an existing address by ID
     */
    async deleteAddress(req, res) {
        try {
            const userId = req.user.userId;
            const addressId = req.params.id;

            const affectedRows = await AddressModel.deleteAddressByIdAndUser(addressId, userId);
            if (affectedRows === 0) {
                return res.status(404).json({
                    message: 'Address not found'
                });
            }

            return res.status(200).json({ message: 'Address deleted successfully' });
        } catch (error) {
            console.error('Error deleting address:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /:id - Update an existing address by ID
     */
    async updateAddress(req, res) {
        try {
            const userId = req.user.userId;
            const addressId = req.params.id;
            const { fullName, address, phone } = req.body;

            // Validate required fields
            if (!fullName || !address || !phone) {
                return res.status(400).json({
                    message: 'Full name, address, and phone are required'
                });
            }

            const affectedRows = await AddressModel.updateAddressByIdAndUser(
                addressId, userId, fullName, address, phone
            );

            if (affectedRows === 0) {
                return res.status(404).json({
                    message: 'Address not found'
                });
            }

            return res.status(200).json({
                message: 'Address updated successfully'
            });
        } catch (error) {
            console.error('Error updating address:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AddressController();
