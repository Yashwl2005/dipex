const express = require('express');
const router = express.Router();
const { uploadFitnessData, getFitnessTests } = require('../controllers/fitnessController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, uploadFitnessData).get(protect, getFitnessTests);

module.exports = router;
