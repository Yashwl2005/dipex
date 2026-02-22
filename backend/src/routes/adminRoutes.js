const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getShortlistedAthletes, 
  getSubmissions, 
  evaluateSubmission 
} = require('../controllers/adminController');

router.get('/dashboard', getDashboardStats);
router.get('/athletes', getShortlistedAthletes);
router.get('/submissions', getSubmissions);
router.put('/submissions/:id/evaluate', evaluateSubmission);

module.exports = router;
