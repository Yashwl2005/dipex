const User = require('../models/User');
const FitnessTest = require('../models/FitnessTest');
const Achievement = require('../models/Achievement');

// @desc    Get dashboard totals and aggregates
// @route   GET /api/admin/dashboard
// @access  Public (mock admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalAthletes = await User.countDocuments({ role: 'athlete' });
    const pendingEvaluations = await FitnessTest.countDocuments({ status: 'pending' });
    
    // Calculate aggregate score
    const athletes = await User.find({ role: 'athlete' }, 'overallScore');
    const validScores = athletes.filter(a => a.overallScore > 0);
    const avgScore = validScores.length 
      ? validScores.reduce((acc, a) => acc + a.overallScore, 0) / validScores.length 
      : 0;

    res.json({
      totalAthletes,
      pendingEvaluations,
      activeEvaluations: pendingEvaluations, // using pending as active
      avgPerformanceScore: avgScore.toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shortlisted athletes sorted by score
// @route   GET /api/admin/athletes
// @access  Public (mock admin)
exports.getShortlistedAthletes = async (req, res) => {
  try {
    const athletes = await User.find({ role: 'athlete' })
      .sort({ overallScore: -1 })
      .limit(100);
    res.json(athletes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending submissions
// @route   GET /api/admin/submissions
// @access  Public (mock admin)
exports.getSubmissions = async (req, res) => {
  try {
    const tests = await FitnessTest.find({ status: 'pending' })
      .populate('user', 'name email sport overallScore gender dateOfBirth')
      .sort({ dateTaken: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate a submission
// @route   PUT /api/admin/submissions/:id/evaluate
// @access  Public (mock admin)
exports.evaluateSubmission = async (req, res) => {
    const { status, score, remarks } = req.body;
    
    try {
        const test = await FitnessTest.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        test.status = status; // 'approved' or 'rejected'
        if (score !== undefined) {
             test.score = score;
        }
        await test.save();

        // Update overall user score average if approved
        if (status === 'approved' && test.score) {
             const userTests = await FitnessTest.find({ user: test.user, status: 'approved' });
             const totalScore = userTests.reduce((acc, t) => acc + (t.score || 0), 0);
             const newAvg = (totalScore / userTests.length) || 0;
             
             await User.findByIdAndUpdate(test.user, { overallScore: newAvg });
        }

        res.json({ message: 'Evaluation updated', test });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
