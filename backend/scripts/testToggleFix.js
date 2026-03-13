const mongoose = require('mongoose');
const User = require('../models/User');

async function testToggle() {
    try {
        await mongoose.connect('mongodb+srv://khaistarehman050111_db_user:Fizamylife2@food-delivery-cluster.ayc85ww.mongodb.net/food_delivery');
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'rider@gmail.com' });
        if (!user) {
            console.log('Rider not found');
            process.exit(1);
        }

        console.log('Current availability:', user.riderDetails?.isAvailable);

        if (!user.riderDetails) {
            user.riderDetails = { isAvailable: false, vehicleType: 'None', licensePlate: 'N/A' };
        }
        
        // Simulating the controller logic
        user.riderDetails.isAvailable = !user.riderDetails.isAvailable;
        user.markModified('riderDetails');
            
        console.log('Attempting save...');
        const updatedUser = await user.save();
        console.log('Updated availability:', updatedUser.riderDetails.isAvailable);

    } catch (err) {
        console.error('ERROR OCCURRED:');
        console.error(err.message);
        if (err.stack) console.error(err.stack);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

testToggle();
