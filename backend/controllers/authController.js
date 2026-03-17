const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id, rememberMe = false) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: rememberMe ? '30d' : '24h',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if user is active
            if (user.status === 'pending') {
                return res.status(401).json({ message: 'Your account is pending approval by an administrator.' });
            }
            if (user.status === 'suspended') {
                return res.status(401).json({ message: 'Your account has been suspended. Please contact support.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id, rememberMe),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token (simple implementation for now)
        const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // In a real app, send email here. For now, return it in response for testing/user ease if needed, 
        // but ideally just a success message.
        console.log(`Reset token for ${email}: ${resetToken}`);
        
        res.json({ 
            message: 'A reset token has been generated. (In production, this would be sent via email)',
            token: resetToken // Returning token for easy testing as requested/implied
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ 
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword
};
