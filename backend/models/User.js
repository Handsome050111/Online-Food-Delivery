const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'rider', 'owner'],
        default: 'customer'
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    address: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    // Rider specific details
    riderDetails: {
        vehicleType: {
            type: String,
            enum: ['Motorcycle', 'Bicycle', 'Car', 'None'],
            default: 'None'
        },
        licensePlate: {
            type: String,
            default: ''
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
