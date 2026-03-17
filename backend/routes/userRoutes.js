const express = require('express');
const router = express.Router();
const { getUsers, createUser, toggleUserStatus, updateUserProfile, getUserProfile, updateRiderAvailability, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/availability')
    .put(protect, updateRiderAvailability);

router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.route('/:id')
    .delete(protect, admin, deleteUser);

router.route('/:id/suspend')
    .put(protect, admin, toggleUserStatus);

module.exports = router;
