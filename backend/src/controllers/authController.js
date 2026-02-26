const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

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
  const { name, email, password, role, dateOfBirth, gender, height, weight, sports, specificEvent, address, state } = req.body;
  let { aadhaarCardUrl, dobCertificateUrl, profilePhotoUrl, competitionVideoUrl } = req.body;

  try {
    if (req.files) {
      if (req.files.profilePhoto && req.files.profilePhoto.length > 0) {
        const result = await uploadBufferToCloudinary(req.files.profilePhoto[0].buffer, 'dipex/profiles');
        profilePhotoUrl = result.secure_url;
      }
      if (req.files.aadhaarCard && req.files.aadhaarCard.length > 0) {
        const result = await uploadBufferToCloudinary(req.files.aadhaarCard[0].buffer, 'dipex/documents');
        aadhaarCardUrl = result.secure_url;
      }
      if (req.files.dobCertificate && req.files.dobCertificate.length > 0) {
        const result = await uploadBufferToCloudinary(req.files.dobCertificate[0].buffer, 'dipex/documents');
        dobCertificateUrl = result.secure_url;
      }
      if (req.files.competitionVideo && req.files.competitionVideo.length > 0) {
        const videoResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'video', folder: 'dipex/videos' },
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
            stream.end(req.files.competitionVideo[0].buffer);
        });
        competitionVideoUrl = videoResult.secure_url;
      }
    }
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
      name, email, password, role, dateOfBirth, gender, height, weight, sports, address, state, aadhaarCardUrl, dobCertificateUrl, profilePhotoUrl, competitionVideoUrl
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

// @desc    Mark user test as submitted
// @route   PUT /api/auth/submit-test
// @access  Private
exports.submitUserTest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isTestSubmitted = true;
      if (user.evaluationStatus === 'rejected') {
          user.evaluationStatus = 'pending';
      }
      await user.save();
      res.json({ message: 'Test submitted successfully', isTestSubmitted: user.isTestSubmitted, evaluationStatus: user.evaluationStatus });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.height = req.body.height || user.height;
      user.weight = req.body.weight || user.weight;
      user.address = req.body.address || user.address;
      user.state = req.body.state || user.state;
      
      if (req.body.sports) {
          // ensure it's an array or split string
          user.sports = Array.isArray(req.body.sports) ? req.body.sports : [req.body.sports];
      }

      if (req.file) {
        const result = await uploadBufferToCloudinary(req.file.buffer, 'dipex/profiles');
        user.profilePhotoUrl = result.secure_url;
      }

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        height: updatedUser.height,
        weight: updatedUser.weight,
        address: updatedUser.address,
        state: updatedUser.state,
        sports: updatedUser.sports,
        profilePhotoUrl: updatedUser.profilePhotoUrl
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
