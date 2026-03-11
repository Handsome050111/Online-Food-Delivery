const Notification = require('../models/Notification');

// @desc    Get notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;

        // Fetch notifications explicitly targeted at this exact user ID, 
        // OR general broadcast notifications meant for their entire Role class,
        // OR global 'all' broadcasts.
        const notifications = await Notification.find({
            $or: [
                { recipientId: userId },
                { recipientRole: userRole, recipientId: { $exists: false } }, // Global Role broadcasts
                { recipientRole: userRole, recipientId: null },
                { recipientRole: 'all' }
            ]
        }).sort({ createdAt: -1 }).limit(50); // Get latest 50

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (notification) {
            notification.isRead = true;
            const updatedNotification = await notification.save();
            res.json(updatedNotification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a system notification (Internal Helper, Admin, or System hooks)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
    try {
        const { recipientRole, recipientId, title, message, type } = req.body;

        const notification = new Notification({
            recipientRole: recipientRole || 'all',
            recipientId: recipientId || null,
            title,
            message,
            type: type || 'info'
        });

        const createdNotification = await notification.save();
        res.status(201).json(createdNotification);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    createNotification
};
