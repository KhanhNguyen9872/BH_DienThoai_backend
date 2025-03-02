// controllers/userController.js
const UserModel = require('../models/userModel');

class UserController {
    async getUserProfile(req, res) {
        try {
            // Using the authenticated user’s ID from req.user
            const accountId = req.user.id;

            // Get the user & account info
            const accountResults = await UserModel.getAccountDataByAccountId(accountId);
            if (accountResults.length === 0) {
                return res.status(404).json({ message: 'Account not found' });
            }
            const user = accountResults[0];

            // Get the address info
            const addressResults = await UserModel.getAddressDataByUserId(user.id);

            // Construct final response
            const result = {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                lock: user.locked === 1, // Convert 1 or 0 to Boolean
                information: addressResults
            };

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
