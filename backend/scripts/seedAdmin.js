const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seed');

        const adminExists = await User.findOne({ email: 'admin@fooddelivery.com' });

        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        const adminUser = new User({
            name: 'Khaista Rehman',
            email: 'admin@fooddelivery.com',
            password: 'Password123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully:');
        console.log(`Username (Email): admin@fooddelivery.com\nPassword: Password123`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
