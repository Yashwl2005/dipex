const mongoose = require('mongoose');
const FitnessTest = require('./src/models/FitnessTest');

async function check() {
  await mongoose.connect('mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo');
  const tests = await FitnessTest.find({ status: 'pending' }).populate('user', 'name');
  console.log('Pending tests:', tests.length);
  if (tests.length > 0) {
      console.log('First pending test ID:', tests[0]._id);
      console.log('User:', tests[0].user?.name);
  }
  process.exit(0);
}
check();
