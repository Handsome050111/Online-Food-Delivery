const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, deleteMenuItem } = require('../controllers/menuController');

// TODO: Add protect & admin middleware for real production

router.route('/')
    .get(getMenuItems)
    .post(createMenuItem); // Protect creation route to admins

router.route('/:id')
    .delete(deleteMenuItem);

module.exports = router;
