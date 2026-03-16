const express = require('express');
const router = express.Router();
const { getAdminDashboardData, getRiderStats } = require('../controllers/dashboardController');
const { protect, admin, rider } = require('../middleware/authMiddleware');

router.get('/admin', protect, admin, getAdminDashboardData);
router.get('/rider', protect, rider, getRiderStats);

module.exports = router;
