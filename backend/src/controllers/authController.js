const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role, dateOfBirth, gender, height, weight, sports, address, state } = req.body;

  try {
    if (role === 'admin') {
      const adminExists = await Admin.findOne({ email });
      if (adminExists) return res.status(400).json({ message: 'Admin already exists' });
      
      const admin = await Admin.create({ name, email, password, role, sports });
      return res.status(201).json({
        _id: admin.id, name: admin.name, email: admin.email, role: admin.role, sports: admin.sports,
        token: generateToken(admin.id),
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name, email, password, role, dateOfBirth, gender, height, weight, sports, address, state
    });

    if (user) {
      res.status(201).json({
        _id: user.id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in Admin collection first
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin.id, name: admin.name, email: admin.email, role: admin.role, sports: admin.sports,
        token: generateToken(admin.id),
      });
    }

    // Check in User collection next
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
