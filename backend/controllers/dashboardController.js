const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Get admin dashboard overview data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboardData = async (req, res) => {
    try {
        // 1. Get total counts
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } }); // Exclude admin
        const totalRestaurants = await Restaurant.countDocuments();
        const totalOrders = await Order.countDocuments();

        // 2. Calculate Total Revenue (completed orders only)
        const completedOrders = await Order.find({ status: { $in: ['delivered'] } });
        const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);

        // 3. Get Recent Orders (last 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderId customerName totalAmount status createdAt');

        // 4. Get "Top" Restaurants (For now, just the newest 4 active with ratings)
        const topRestaurants = await Restaurant.find({ status: 'active' })
            .sort({ rating: -1, createdAt: -1 })
            .limit(4)
            .select('name category rating imageUrl totalOrders'); // Assume totalOrders will be tracked later, keeping UI structure

        res.json({
            stats: {
                totalUsers,
                totalRestaurants,
                totalOrders,
                totalRevenue
            },
            recentOrders,
            topRestaurants
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data', error: error.message });
    }
};

// @desc    Get rider stats (earnings, deliveries, etc.)
// @route   GET /api/dashboard/rider
// @access  Private/Rider
const getRiderStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deliveredOrders = await Order.find({
            rider: req.user._id,
            status: 'delivered'
        });

        const todayDelivered = deliveredOrders.filter(o => new Date(o.updatedAt) >= today);

        // Standard commission for riders: e.g., 20% of the totalAmount or a flat fee
        // Here we'll sum totalAmount * 0.1 as a sample earning logic
        const earnings = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount * 0.1), 0);
        const todayEarnings = todayDelivered.reduce((sum, o) => sum + (o.totalAmount * 0.1), 0);
        
        const totalDeliveries = deliveredOrders.length;
        
        // Mock active time and distance for now
        const activeTime = (totalDeliveries * 0.5).toFixed(1) + "h " + ((totalDeliveries * 30) % 60) + "m"; 
        const totalDistance = (totalDeliveries * 4.2).toFixed(1) + " km";

        res.json({
            todayEarnings: todayEarnings.toFixed(2),
            totalEarnings: earnings.toFixed(2),
            totalDeliveries,
            activeTime,
            totalDistance
        });
    } catch (error) {
        console.error('Error fetching rider stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAdminDashboardData,
    getRiderStats
};
