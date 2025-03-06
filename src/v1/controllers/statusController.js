const StatusModel = require('../models/statusModel');

class ImgController {
    async getStatus(req, res) {
        try {
            const rows = await StatusModel.getStatus();

            return res.json(rows);
        } catch (error) {
            console.error('Error fetching status:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ImgController();
