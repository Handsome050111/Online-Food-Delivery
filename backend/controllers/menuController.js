const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const filters = {};

        // Filter by restaurant if provided
        if (req.query.restaurant) filters.restaurantId = req.query.restaurant;
        // Filter by popular if provided
        if (req.query.popular === 'true') filters.popular = true;

        const limit = req.query.limit ? parseInt(req.query.limit) : 0;

        const items = await MenuItem.find(filters).populate('restaurantId', 'name deliveryFee').limit(limit);
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
    try {
        const { restaurantId, name, description, price, category, image, popular } = req.body;

        if (!restaurantId || !name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Verify the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        const menuItem = await MenuItem.create({
            restaurantId,
            name,
            description,
            price,
            category,
            image,
            popular
        });

        res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        res.status(200).json({ success: true, message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getMenuItems,
    createMenuItem,
    deleteMenuItem
};
