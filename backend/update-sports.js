const mongoose = require('mongoose');
const User = require('./src/models/User');
const FitnessTest = require('./src/models/FitnessTest');

async function update() {
  await mongoose.connect('mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo');
  
  // Make sure the athlete has "Athletics" in their sports array
  const athlete = await User.findOneAndUpdate(
      { role: 'athlete' },
      { $addToSet: { sports: 'Athletics' } },
      { new: true }
  );
  
  console.log('Updated Athlete Sports:', athlete ? athlete.sports : 'Not found');
  
  // Also create another athlete with a different sport and a pending test to verify filtering
  let swimmer = await User.findOne({ email: 'swimmer@example.com' });
  if (!swimmer) {
      swimmer = await User.create({
          name: 'Test Swimmer',
          email: 'swimmer@example.com',
          password: 'password123',
          role: 'athlete',
          gender: 'female',
          sports: ['Swimming']
      });
      console.log('Created Swimmer');
  }

  const existingSwimTest = await FitnessTest.findOne({ user: swimmer._id });
  if (!existingSwimTest) {
      await FitnessTest.create({
          user: swimmer._id,
          testName: '100m Freestyle',
          status: 'pending',
          videoProofUrl: 'https://res.cloudinary.com/demo/video/upload/v1642691560/docs/video_sports.mp4',
          dateTaken: new Date(),
          metrics: { time: '58s' }
      });
      console.log('Created Swim Test');
  }

  process.exit(0);
}
update();
