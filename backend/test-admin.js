const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testAdmin() {
  await mongoose.connect('mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo');
  
  // Make sure the admin has 'Athletics'
  const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      { 
          $set: { 
              name: 'Test Admin',
              password: 'password123',
              role: 'admin',
              sports: ['Athletics'] 
          } 
      },
      { upsert: true, new: true }
  );
  
  console.log('Admin ready', admin.email, admin.sports);
  process.exit(0);
}
testAdmin();
