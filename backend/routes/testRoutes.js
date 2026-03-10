const express = require('express');
const router = express.Router();
const { getTestMessage } = require('../controllers/testController');

router.route('/').get(getTestMessage);

module.exports = router;
