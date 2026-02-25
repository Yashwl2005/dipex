const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getShortlistedAthletes, 
  getSubmissions, 
  evaluateSubmission,
  getAthleteDetails,
  evaluateAthlete
} = require('../controllers/adminController');

router.get('/dashboard', getDashboardStats);
router.get('/athletes', getShortlistedAthletes);
router.get('/athletes/:id', getAthleteDetails);
router.put('/athletes/:id/evaluate', evaluateAthlete);
router.get('/submissions', getSubmissions);
router.put('/submissions/:id/evaluate', evaluateSubmission);

module.exports = router;
