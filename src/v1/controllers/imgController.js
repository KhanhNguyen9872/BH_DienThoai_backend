const ImgModel = require('../models/imgModel');

class ImgController {
    /**
     * GET / - Fetch both chatbot and user avatar settings
     */
    async getAvatars(req, res) {
        try {
            const rows = await ImgModel.getAvatars();

            let botAvatar = '';
            let userAvatar = '';

            rows.forEach((row) => {
                if (row.key === 'CHATBOT_AVATAR') {
                    botAvatar = row.value;
                } else if (row.key === 'CHATBOT_USER_AVATAR') {
                    userAvatar = row.value;
                }
            });

            return res.json({ botAvatar, userAvatar });
        } catch (error) {
            console.error('Error fetching avatars:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ImgController();
