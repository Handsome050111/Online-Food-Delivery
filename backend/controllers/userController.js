const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users (with search/filter)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role && role !== 'all') {
            query.role = role;
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new user manually
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, riderDetails } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userData = {
            name,
            email,
            password,
            role: role || 'customer',
            status: 'active'
        };

        if (role === 'rider' && riderDetails) {
            userData.riderDetails = riderDetails;
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                riderDetails: user.riderDetails
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Suspend or activate a user
// @route   PUT /api/users/:id/suspend
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin' && user.email === 'admin@fooddelivery.com') {
                return res.status(400).json({ message: 'Cannot suspend the master admin account' });
            }

            user.status = user.status === 'suspended' ? 'active' : 'suspended';
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile & update
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            
            if (req.body.password) {
                if (req.body.currentPassword) {
                    const isMatch = await user.matchPassword(req.body.currentPassword);
                    if (!isMatch) {
                        return res.status(400).json({ message: 'Invalid current password' });
                    }
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                token: req.headers.authorization.split(' ')[1] // return existing token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const responseData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
            };

            if (user.role === 'rider') {
                responseData.isAvailable = user.riderDetails?.isAvailable || false;
            }

            res.json(responseData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update rider availability
// @route   PUT /api/users/availability
// @access  Private/Rider
const updateRiderAvailability = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user && user.role === 'rider') {
            if (!user.riderDetails) {
                 user.riderDetails = { 
                     isAvailable: false, 
                     vehicleType: 'None', 
                     licensePlate: 'N/A' 
                 };
            }
            
            const newValue = typeof req.body.isAvailable !== 'undefined' 
                ? req.body.isAvailable 
                : !user.riderDetails.isAvailable;
            
            // Set values directly on riderDetails
            user.riderDetails.isAvailable = newValue;
            
            // Explicitly mark riderDetails as modified for Mongoose visibility
            user.markModified('riderDetails');
                
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                isAvailable: updatedUser.riderDetails.isAvailable
            });
        } else {
            res.status(404).json({ message: 'Rider not found or invalid role' });
        }
    } catch (error) {
        console.error('Rider Availability Update Error:', error.message);
        if (error.stack) console.error(error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin' && user.email === 'admin@fooddelivery.com') {
                return res.status(400).json({ message: 'Cannot delete the master admin account' });
            }

            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    toggleUserStatus,
    updateUserProfile,
    getUserProfile,
    updateRiderAvailability,
    deleteUser
};
