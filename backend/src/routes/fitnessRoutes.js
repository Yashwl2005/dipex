const express = require('express');
const router = express.Router();
const { uploadFitnessData, getFitnessTests } = require('../controllers/fitnessController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/').post(protect, upload.single('video'), uploadFitnessData).get(protect, getFitnessTests);

module.exports = router;
