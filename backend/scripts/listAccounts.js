const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

async function listAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\n--- RESTAURANT ACCOUNTS ---\n');
        
        const restaurants = await Restaurant.find().populate('owner');
        
        for (const res of restaurants) {
            console.log(`Restaurant Name: ${res.name}`);
            console.log(`Owner Name:     ${res.ownerName}`);
            console.log(`Owner Email:    ${res.owner ? res.owner.email : 'NOT LINKED'}`);
            console.log(`Status:         ${res.status}`);
            console.log('---------------------------');
        }

        console.log('\n--- ALL USER ACCOUNTS ---\n');
        const users = await User.find();
        users.forEach(u => {
            console.log(`Email: ${u.email.padEnd(30)} | Role: ${u.role.padEnd(10)} | Name: ${u.name}`);
        });
        
        console.log('\nNOTE: Passwords are encrypted (hashed) and cannot be displayed in plain text.');
        console.log('If you forgotten your password, type "admin123" if it was a default, or I can help you reset it.');

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

listAll();
