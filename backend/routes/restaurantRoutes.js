const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant, updateRestaurantStatus, getMyRestaurant, updateMyRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public can view restaurants
router.route('/')
    .get(getRestaurants)
    .post(protect, admin, createRestaurant);

router.route('/my-restaurant')
    .get(protect, getMyRestaurant)
    .put(protect, updateMyRestaurant);

router.route('/:id')
    .get(getRestaurantById)
    .delete(protect, admin, deleteRestaurant);

router.route('/:id/status')
    .put(protect, admin, updateRestaurantStatus);

module.exports = router;
