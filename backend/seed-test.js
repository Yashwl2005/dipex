const mongoose = require('mongoose');
const User = require('./src/models/User');
const FitnessTest = require('./src/models/FitnessTest');

async function seed() {
  await mongoose.connect('mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo');
  
  let athlete = await User.findOne({ role: 'athlete' });
  if (!athlete) {
      athlete = await User.create({
          name: 'Test Athlete',
          email: 'test@example.com',
          password: 'password123',
          role: 'athlete',
          gender: 'male',
          dateOfBirth: new Date('2000-01-01')
      });
  }

  const test = await FitnessTest.create({
      user: athlete._id,
      testName: '100m Sprint',
      status: 'pending',
      videoProofUrl: 'https://res.cloudinary.com/demo/video/upload/v1642691560/docs/video_sports.mp4',
      dateTaken: new Date(),
      metrics: {
          releaseVelocity: '28.4',
          launchAngle: '42.1'
      }
  });

  console.log('Created test submission:', test._id);
  process.exit(0);
}
seed();
