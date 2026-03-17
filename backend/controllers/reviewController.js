const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { rating, comment, restaurantId, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ success: false, message: 'You can only review delivered orders' });
        }

        const existingReview = await Review.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this order' });
        }

        const review = await Review.create({
            user: req.user._id,
            userName: req.user.name,
            restaurant: restaurantId,
            order: orderId,
            rating: Number(rating),
            comment
        });

        // Update restaurant rating
        const reviews = await Review.find({ restaurant: restaurantId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await Restaurant.findByIdAndUpdate(restaurantId, {
            rating: avgRating.toFixed(1)
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get restaurant reviews
// @route   GET /api/reviews/restaurant/:id
// @access  Public
const getRestaurantReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addReview,
    getRestaurantReviews
};
