const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, createOrder, getMyOrders, getAvailableOrders, acceptOrder, getRiderOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getOrders)
    .post(protect, createOrder);

router.route('/available').get(protect, getAvailableOrders);
router.route('/rider').get(protect, getRiderOrders);
router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/accept').put(protect, acceptOrder);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
