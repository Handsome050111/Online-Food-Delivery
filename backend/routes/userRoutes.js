const express = require('express');
const router = express.Router();
const { getUsers, createUser, toggleUserStatus, updateUserProfile, getUserProfile, updateRiderAvailability } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/availability')
    .put(protect, updateRiderAvailability);

// TODO: Add protect & admin middleware for real production
router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id/suspend')
    .put(toggleUserStatus);

module.exports = router;
