const Achievement = require('../models/Achievement');

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (ensure ENV vars are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Upload an achievement
// @route   POST /api/achievements
// @access  Private
exports.uploadAchievement = async (req, res) => {
  const { title, description, dateEarned } = req.body;
  
  if (!req.file) {
      return res.status(400).json({ message: 'No proof file uploaded' });
  }

  try {
    // 1. Upload buffer to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'dipex/achievements' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary achievement upload error:', error);
          return res.status(500).json({ message: 'Error uploading proof to Cloudinary' });
        }

        // 2. Save document to DB
        const achievement = new Achievement({
          user: req.user._id,
          title,
          description,
          dateEarned,
          proofUrl: result.secure_url,
        });

        const createdAchievement = await achievement.save();
        res.status(201).json(createdAchievement);
      }
    );

    // Pipe the multer memory buffer to Cloudinary
    uploadStream.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user achievements
// @route   GET /api/achievements
// @access  Private
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
