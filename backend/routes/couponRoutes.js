const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getCoupons, createCoupon, toggleCouponStatus, validateCoupon, deleteCoupon } = require('../controllers/couponController');

router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id/toggle')
    .put(protect, admin, toggleCouponStatus);

router.route('/:id')
    .delete(protect, admin, deleteCoupon);

router.post('/validate', protect, validateCoupon);

module.exports = router;
