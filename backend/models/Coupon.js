const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxDiscountAmount: {
        type: Number, // For percentage discounts (e.g. 50% off up to $10)
        default: null
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: null // Null means unlimited
    },
    timesUsed: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'disabled', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
