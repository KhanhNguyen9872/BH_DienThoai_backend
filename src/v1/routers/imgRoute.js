const express = require('express');
const router = express.Router();
const imgController = require('../controllers/imgController');

// GET avatars
router.get('/', imgController.getAvatars);

module.exports = router;
