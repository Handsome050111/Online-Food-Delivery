const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus } = require('../controllers/orderController');

router.route('/').get(getOrders);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
