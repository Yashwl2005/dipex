const FitnessTest = require('../models/FitnessTest');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload fitness test results
// @route   POST /api/fitness
// @access  Private
exports.uploadFitnessData = async (req, res) => {
  console.log("--- UPLOAD REQUEST RECEIVED ---");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("File:", req.file ? req.file.path : 'No file');

  let { testName, score, metrics, dateTaken } = req.body;
  let finalStatus = 'pending';

  try {
    let videoProofUrl = req.body.videoProofUrl || null;

    if (req.file) {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "fitness_assessments"
      });
      videoProofUrl = result.secure_url;

      // Remove the file from local storage after successful upload
      fs.unlinkSync(req.file.path);
    }

    // Parse metrics if it comes as a stringified JSON from form-data (optional)
    let parsedMetrics = metrics;
    if (typeof metrics === 'string') {
        try {
            parsedMetrics = JSON.parse(metrics);
        } catch(e) { /* ignore */ }
    }

    const fitnessTest = new FitnessTest({
      user: req.user._id,
      testName,
      score,
      metrics: parsedMetrics,
      dateTaken,
      videoProofUrl,
      status: finalStatus
    });

    const createdTest = await fitnessTest.save();
    res.status(201).json(createdTest);
  } catch (error) {
    // Attempt to clean up local file if an error occurred during upload
    if (req.file && fs.existsSync(req.file.path)) {
       fs.unlinkSync(req.file.path);
    }
    console.error("Cloudinary Upload Error:", error);
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
