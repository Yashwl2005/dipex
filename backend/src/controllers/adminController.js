const User = require('../models/User');
const FitnessTest = require('../models/FitnessTest');
const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');

// @desc    Get dashboard totals and aggregates
// @route   GET /api/admin/dashboard
// @access  Public (mock admin)
exports.getDashboardStats = async (req, res) => {
  try {
    let sportsFilter = req.query.sports ? req.query.sports.split(',') : [];
    if (sportsFilter.includes('All')) sportsFilter = [];
    
    const query = sportsFilter.length > 0 ? { role: 'athlete', sports: { $in: sportsFilter } } : { role: 'athlete' };

    const totalAthletes = await User.countDocuments(query);
    const approvedAthletes = await User.countDocuments({ ...query, evaluationStatus: 'approved' });
    const rejectedAthletes = await User.countDocuments({ ...query, evaluationStatus: 'rejected' });
    const pendingAthletes = await User.countDocuments({ ...query, evaluationStatus: { $in: ['pending', null, undefined] } });

    // Top Performers Leaderboard
    const topPerformers = await User.find(query)
      .sort({ overallScore: -1 })
      .limit(5)
      .select('name state sports overallScore');

    // Heatmap (State distribution)
    const stateDistribution = await User.aggregate([
      { $match: query },
      { $group: { 
          _id: { $toLower: { $trim: { input: { $ifNull: ["$state", "Unknown"] } } } }, 
          count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);

    // Flagged Activity
    const validUsers = await User.find(query).select('_id');
    const validUserIds = validUsers.map(u => u._id);
    const flaggedVideosCount = await FitnessTest.countDocuments({
      user: { $in: validUserIds },
      status: 'rejected'
    });
    const latestFlag = await FitnessTest.findOne({
      user: { $in: validUserIds },
      status: 'rejected'
    })
    .sort({ updatedAt: -1 })
    .populate('user', 'name address state');

    // Chart 1: Vertical Jump Avg (by Age)
    // We group by Age ranges: 12-14, 15-17, 18-20, 21+
    const currentYear = new Date().getFullYear();
    const jumpStats = await FitnessTest.aggregate([
      { $match: { user: { $in: validUserIds }, testName: { $regex: /jump/i }, status: 'approved' } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          score: 1,
          age: {
             $subtract: [currentYear, { $year: "$userDetails.dateOfBirth" }]
          }
        }
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 15, 18, 21],
          default: "21+",
          output: {
            avgScore: { $avg: "$score" }
          }
        }
      }
    ]);

    // Chart 2: Sit-up Avg (by Gender)
     const situpStats = await FitnessTest.aggregate([
      { $match: { user: { $in: validUserIds }, testName: { $regex: /sit.up/i }, status: 'approved' } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: "$userDetails" },
      {
        $group: {
           _id: "$userDetails.gender",
           avgScore: { $avg: "$score" }
        }
      }
    ]);

    // Chart 3: Endurance Trends (Quarterly)
    const enduranceStats = await FitnessTest.aggregate([
      { $match: { user: { $in: validUserIds }, testName: { $regex: /endurance|run/i }, status: 'approved' } },
      {
        $group: {
           _id: { $ceil: { $divide: [{ $month: "$dateTaken" }, 3] } },
           avgScore: { $avg: "$score" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalAthletes,
      approvedAthletes,
      rejectedAthletes,
      pendingAthletes,
      topPerformers,
      stateDistribution,
      flaggedActivity: {
        count: flaggedVideosCount,
        latest: latestFlag
      },
      charts: {
        jumpStats,
        situpStats,
        enduranceStats
      }
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
    let sportsFilter = req.query.sports ? req.query.sports.split(',') : [];
    if (sportsFilter.includes('All')) sportsFilter = [];

    const query = sportsFilter.length > 0 ? { role: 'athlete', sports: { $in: sportsFilter } } : { role: 'athlete' };

    if (req.query.status) {
      if (req.query.status === 'pending') {
         query.evaluationStatus = { $in: ['pending', null, undefined] };
      } else {
         query.evaluationStatus = req.query.status;
      }
    }

    const athletes = await User.find(query)
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
    let sportsFilter = req.query.sports ? req.query.sports.split(',') : [];
    if (sportsFilter.includes('All')) sportsFilter = [];

    const userQuery = sportsFilter.length > 0 ? { role: 'athlete', sports: { $in: sportsFilter } } : { role: 'athlete' };
    const validUsers = await User.find(userQuery, '_id');
    const validUserIds = validUsers.map(u => u._id);

    const tests = await FitnessTest.find({ 
        status: 'pending',
        user: { $in: validUserIds }
    })
      .populate('user', 'name email sports overallScore gender dateOfBirth')
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

        if (status) test.status = status; // e.g. 'evaluated'
        if (score !== undefined) {
             test.score = Number(score);
             test.status = 'evaluated';
        }
        await test.save();

        // Update overall user score average if a score exists
        if (test.score !== undefined) {
             const userTests = await FitnessTest.find({ user: test.user, score: { $exists: true, $ne: null } });
             const totalScore = userTests.reduce((acc, t) => acc + (Number(t.score) || 0), 0);
             const newAvg = (totalScore / userTests.length) || 0;
             
             const updateData = { overallScore: newAvg };
             const athlete = await User.findById(test.user);
             let autoApproved = false;

             if (newAvg > 17 && athlete.evaluationStatus !== 'approved') {
                 updateData.evaluationStatus = 'approved';
                 autoApproved = true;
             }
             
             await User.findByIdAndUpdate(test.user, updateData);

             if (autoApproved) {
                 await Notification.create({
                     user: test.user,
                     title: 'Application Approved',
                     message: 'Congratulations! Your outstanding fitness performance has earned you an automatic profile approval. You have been selected for trials. We will notify you shortly about trials.',
                     type: 'status_update'
                 });
             }
        }

        res.json({ message: 'Evaluation updated', test });
    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single athlete's details and all their submissions
// @route   GET /api/admin/athletes/:id
// @access  Public (mock admin)
exports.getAthleteDetails = async (req, res) => {
    try {
        const athleteId = req.params.id;
        const athlete = await User.findById(athleteId).select('-password');
        
        if (!athlete) {
            return res.status(404).json({ message: 'Athlete not found' });
        }

        const submissions = await FitnessTest.find({ user: athleteId }).sort({ dateTaken: -1 });
        const achievements = await Achievement.find({ user: athleteId }).sort({ dateEarned: -1 });
        
        res.json({ athlete, submissions, achievements });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Evaluate an entire athlete
// @route   PUT /api/admin/athletes/:id/evaluate
// @access  Public (mock admin)
exports.evaluateAthlete = async (req, res) => {
    const { status, remarks } = req.body; // 'approved' or 'rejected'
    
    try {
        const athlete = await User.findById(req.params.id);
        if (!athlete) {
            return res.status(404).json({ message: 'Athlete not found' });
        }

        athlete.evaluationStatus = status;
        if (remarks) {
            athlete.evaluationRemarks = remarks;
        }
        
        // If rejected, allow the user to retake the test
        if (status === 'rejected') {
            athlete.isTestSubmitted = false;
        }
        
        await athlete.save();

        if (status === 'approved' || status === 'rejected') {
            const message = status === 'approved' 
                ? 'Your athlete profile has been approved. You have been selected for trials. We will notify you shortly about trials.'
                : 'Your athlete profile evaluation has been rejected by the administration.';

            await Notification.create({
                user: athlete._id,
                title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message: message,
                type: 'status_update'
            });
        }

        res.json({ message: 'Athlete evaluation updated', athlete });
    } catch (error) {
        console.error("Athlete Evaluation Error:", error);
        res.status(500).json({ message: error.message });
    }
};
