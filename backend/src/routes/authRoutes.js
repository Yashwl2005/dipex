const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, submitUserTest, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.fields([{ name: 'aadhaarCard', maxCount: 1 }, { name: 'dobCertificate', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }, { name: 'competitionVideo', maxCount: 1 }]), registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/submit-test', protect, submitUserTest);
router.put('/profile', protect, upload.single('profilePhoto'), updateUserProfile);

module.exports = router;
