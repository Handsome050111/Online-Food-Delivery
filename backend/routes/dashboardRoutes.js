const express = require('express');
const router = express.Router();
const { getAdminDashboardData } = require('../controllers/dashboardController');

router.get('/admin', getAdminDashboardData);

module.exports = router;
