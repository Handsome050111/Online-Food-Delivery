const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, deliveryAddress, paymentMethod, totalAmount, restaurantId, restaurantName } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            orderId: 'OD' + Date.now().toString().slice(-8),
            items: orderItems,
            user: req.user._id,
            customerName: req.user.name,
            restaurant: restaurantId || null,
            restaurantName: restaurantName || 'Unknown Restaurant',
            deliveryAddress,
            paymentMethod,
            totalAmount,
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { restaurantName: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get available orders for riders
// @route   GET /api/orders/available
// @access  Private/Rider
const getAvailableOrders = async (req, res) => {
    try {
         // Find orders that are ready or preparing, and have no rider assigned
        const orders = await Order.find({ 
            $or: [{ status: 'preparing' }, { status: 'pending' }],
            rider: { $exists: false } 
        }).sort({ createdAt: -1 });
        
        // Also include orders specifically assigned to null if they exist
        const nullRiderOrders = await Order.find({
             $or: [{ status: 'preparing' }, { status: 'pending' }],
             rider: null
        }).sort({ createdAt: -1 });

        // Merge and deduplicate
        const uniqueOrderIds = new Set();
        const allAvailable = [];
        
        [...orders, ...nullRiderOrders].forEach(order => {
             if (!uniqueOrderIds.has(order._id.toString())) {
                  uniqueOrderIds.add(order._id.toString());
                  allAvailable.push(order);
             }
        });

        res.json(allAvailable);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Accept an order for delivery
// @route   PUT /api/orders/:id/accept
// @access  Private/Rider
const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.rider) {
            return res.status(400).json({ message: 'Order has already been accepted by another rider' });
        }

        order.rider = req.user._id;
        order.status = 'out_for_delivery';
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get orders assigned to the logged-in rider
// @route   GET /api/orders/rider
// @access  Private/Rider
const getRiderOrders = async (req, res) => {
    try {
        const orders = await Order.find({ rider: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getOrders,
    updateOrderStatus,
    createOrder,
    getMyOrders,
    getAvailableOrders,
    acceptOrder,
    getRiderOrders
};
