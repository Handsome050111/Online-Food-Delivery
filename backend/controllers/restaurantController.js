const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants (with search/filter)
// @route   GET /api/restaurants
// @access  Public (Admin sees all, users see active only - we'll handle admin logic via query currently)
const getRestaurants = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const restaurants = await Restaurant.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
    try {
        const { name, ownerName, category, status, address, imageUrl, image } = req.body;

        const restaurant = await Restaurant.create({
            name,
            ownerName,
            category,
            status: status || 'pending',
            address: address || '',
            imageUrl: imageUrl || image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
            image: image || imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
            rating: 0
        });

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update restaurant status
// @route   PUT /api/restaurants/:id/status
// @access  Private/Admin
const updateRestaurantStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (restaurant) {
            restaurant.status = status;
            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json({ success: true, data: restaurant });
        } else {
            res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get owner's restaurant
// @route   GET /api/restaurants/my-restaurant
// @access  Private/Owner
const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user._id });
        if (restaurant) {
            res.json({ success: true, data: restaurant });
        } else {
            res.status(404).json({ success: false, message: 'Restaurant not found for this owner.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurantStatus,
    getMyRestaurant
};
