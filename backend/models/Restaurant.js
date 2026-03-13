const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    ownerName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'active'
    },
    rating: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'
    },
    deliveryTime: {
        type: Number,
        default: 30
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    minOrder: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
