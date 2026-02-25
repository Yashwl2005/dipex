const express = require('express');
const router = express.Router();
const { uploadAchievement, getAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer (store in memory so we can pipe to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/').post(protect, upload.single('proof'), uploadAchievement).get(protect, getAchievements);

module.exports = router;
