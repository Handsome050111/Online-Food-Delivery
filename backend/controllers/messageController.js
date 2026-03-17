const Message = require('../models/Message');
const Order = require('../models/Order');

// @desc    Get chat history for an order
// @route   GET /api/messages/:orderId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Verify order exists and user is part of it
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is the customer or the assigned rider
        const userId = req.user._id.toString();
        const isCustomer = order.user.toString() === userId;
        const isRider = order.rider && order.rider.toString() === userId;

        if (!isCustomer && !isRider && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to view this chat' });
        }

        const messages = await Message.find({ orderId })
            .sort({ createdAt: 1 })
            .populate('sender', 'name');

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Store a message (usually called via socket, but API also available)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { orderId, text } = req.body;

        if (!orderId || !text) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const message = await Message.create({
            orderId,
            sender: req.user._id,
            senderRole: req.user.role,
            text
        });

        const populatedMessage = await message.populate('sender', 'name');

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getChatHistory,
    sendMessage
};
