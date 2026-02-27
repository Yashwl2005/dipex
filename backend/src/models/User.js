const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['athlete', 'coach', 'admin'],
    default: 'athlete',
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  address: { type: String },
  state: { type: String },
  aadhaarNumber: { 
    type: String, 
    unique: true,
    sparse: true
  },
  aadhaarCardUrl: { type: String },
  dobCertificateUrl: { type: String },
  profilePhotoUrl: { type: String },
  competitionVideoUrl: { type: String },
  sports: { type: [String], default: [] },
  overallScore: { type: Number, default: 0 },
  evaluationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  evaluationRemarks: { type: String },
  isTestSubmitted: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Password Hash middleware
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
