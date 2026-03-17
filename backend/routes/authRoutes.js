const express = require('express');
const router = express.Router();
const { loginUser, registerUser, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Social Auth Routes (Skeletons - backend logic needed for OAuth)
router.get('/google', (req, res) => res.status(501).json({ message: 'Google Auth setup required with Client ID/Secret' }));
router.get('/facebook', (req, res) => res.status(501).json({ message: 'Facebook Auth setup required with App ID/Secret' }));
router.get('/apple', (req, res) => res.status(501).json({ message: 'Apple Auth setup required with Service ID/Secret' }));

module.exports = router;
