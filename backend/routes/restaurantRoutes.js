const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant, updateRestaurantStatus, getMyRestaurant } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

// TODO: Add protect & admin middleware for real production
router.route('/')
    .get(getRestaurants)
    .post(createRestaurant);

router.route('/my-restaurant')
    .get(protect, getMyRestaurant);

router.route('/:id')
    .get(getRestaurantById);

router.route('/:id/status')
    .put(updateRestaurantStatus);

module.exports = router;
