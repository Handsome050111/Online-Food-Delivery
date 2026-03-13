const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        const user = await User.findOne({ email: 'admin@fooddelivery.com' });
        if (!user) {
            console.log('ERROR: User not found');
            process.exit(1);
        }
        console.log('Found user:', user.email, 'role:', user.role);

        const match = await user.matchPassword('admin123');
        console.log('Password match:', match);

        if (match) {
            console.log('SUCCESS: Login would work!');
        } else {
            console.log('FAIL: Password does not match');
        }
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error(err.stack);
    } finally {
        await mongoose.disconnect();
    }
}

testLogin();
