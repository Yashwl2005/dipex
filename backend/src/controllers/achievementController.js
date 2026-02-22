const Achievement = require('../models/Achievement');

// @desc    Upload an achievement
// @route   POST /api/achievements
// @access  Private
exports.uploadAchievement = async (req, res) => {
  const { title, description, dateEarned, proofUrl } = req.body;

  try {
    const achievement = new Achievement({
      user: req.user._id,
      title,
      description,
      dateEarned,
      proofUrl,
    });

    const createdAchievement = await achievement.save();
    res.status(201).json(createdAchievement);
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
