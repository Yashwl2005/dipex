const FitnessTest = require('../models/FitnessTest');

// @desc    Upload fitness test results
// @route   POST /api/fitness
// @access  Private
exports.uploadFitnessData = async (req, res) => {
  const { testName, score, metrics, dateTaken, videoProofUrl } = req.body;

  try {
    const fitnessTest = new FitnessTest({
      user: req.user._id,
      testName,
      score,
      metrics,
      dateTaken,
      videoProofUrl,
    });

    const createdTest = await fitnessTest.save();
    res.status(201).json(createdTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user fitness tests
// @route   GET /api/fitness
// @access  Private
exports.getFitnessTests = async (req, res) => {
  try {
    const fitnessTests = await FitnessTest.find({ user: req.user._id }).sort({ dateTaken: -1 });
    res.json(fitnessTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
