const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getOrders)
    .post(protect, createOrder);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
