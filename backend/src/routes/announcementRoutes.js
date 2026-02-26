const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public route (Athletes fetching news)
router.get('/', announcementController.getAllAnnouncements);

// Admin Routes for managing news
router.post('/', protectAdmin, announcementController.createAnnouncement);
router.delete('/:id', protectAdmin, announcementController.deleteAnnouncement);

module.exports = router;
