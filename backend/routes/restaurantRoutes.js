const express = require('express');
const router = express.Router();
const { getRestaurants, createRestaurant, updateRestaurantStatus } = require('../controllers/restaurantController');

// TODO: Add protect & admin middleware for real production
router.route('/')
    .get(getRestaurants)
    .post(createRestaurant);

router.route('/:id/status')
    .put(updateRestaurantStatus);

module.exports = router;
