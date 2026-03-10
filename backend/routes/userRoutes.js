const express = require('express');
const router = express.Router();
const { getUsers, createUser, toggleUserStatus } = require('../controllers/userController');

// TODO: Add protect & admin middleware for real production
router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id/suspend')
    .put(toggleUserStatus);

module.exports = router;
