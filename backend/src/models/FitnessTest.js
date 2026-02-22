const mongoose = require('mongoose');

const FitnessTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  metrics: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  dateTaken: {
    type: Date,
    default: Date.now,
  },
  videoProofUrl: {
    type: String, 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FitnessTest', FitnessTestSchema);
