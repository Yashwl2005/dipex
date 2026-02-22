const express = require('express');
const router = express.Router();
const { uploadAchievement, getAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, uploadAchievement).get(protect, getAchievements);

module.exports = router;
