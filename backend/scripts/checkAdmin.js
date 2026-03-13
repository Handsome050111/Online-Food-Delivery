const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const admin = await User.findOne({ email: 'admin@fooddelivery.com' });
        if (admin) {
            console.log('Admin user found:', admin.email);
            console.log('Role:', admin.role);
            console.log('Status:', admin.status);
        } else {
            console.log('Admin user NOT found');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
