const express = require('express');
const router = express.Router();
const { getUsers, createUser, toggleUserStatus, updateUserProfile, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// TODO: Add protect & admin middleware for real production
router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id/suspend')
    .put(toggleUserStatus);

module.exports = router;
