const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:orderId').get(protect, getChatHistory);
router.route('/').post(protect, sendMessage);

module.exports = router;
