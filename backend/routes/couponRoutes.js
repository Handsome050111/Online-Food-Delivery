const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, toggleCouponStatus } = require('../controllers/couponController');

router.route('/')
    .get(getCoupons)
    .post(createCoupon);

router.route('/:id/toggle')
    .put(toggleCouponStatus);

module.exports = router;
