const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dateEarned: {
    type: Date,
  },
  proofUrl: {
    type: String, // URL to uploaded certificate/image
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Achievement', AchievementSchema);
