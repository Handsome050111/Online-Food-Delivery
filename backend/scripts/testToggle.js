const mongoose = require('mongoose');
const User = require('./models/User');

async function testToggle() {
    try {
        await mongoose.connect('mongodb+srv://khaistarehman050111_db_user:Fizamylife2@food-delivery-cluster.ayc85ww.mongodb.net/food_delivery');
        console.log('Connected');

        const user = await User.findOne({ email: 'rider@gmail.com' });
        if (!user) {
            console.log('Rider not found');
            process.exit(1);
        }

        console.log('Current availability:', user.riderDetails?.isAvailable);

        if (!user.riderDetails) {
            user.riderDetails = { isAvailable: false, vehicleType: 'Motorcycle', licensePlate: 'N/A' };
        }
        
        // Simulating the controller logic
        user.riderDetails.isAvailable = !user.riderDetails.isAvailable;
            
        console.log('Attempting save...');
        const updatedUser = await user.save();
        console.log('Updated availability:', updatedUser.riderDetails.isAvailable);

    } catch (err) {
        console.error('ERROR OCCURRED:');
        console.error(err.message);
        console.error(err.stack);
    } finally {
        await mongoose.disconnect();
    }
}

testToggle();
