const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const admin = await User.findOne({ email: 'admin@fooddelivery.com' });
        if (admin) {
            admin.password = 'admin123';
            await admin.save();
            console.log('Password reset successfully for admin@fooddelivery.com');
        } else {
            console.log('Admin user NOT found');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
