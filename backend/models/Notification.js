const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipientRole: {
        type: String,
        enum: ['admin', 'customer', 'rider', 'owner', 'all'],
        required: true,
        default: 'all'
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // If null, the notification goes to everyone in `recipientRole`
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
