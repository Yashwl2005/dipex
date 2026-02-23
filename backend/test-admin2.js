const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');

async function testAdmin() {
  await mongoose.connect('mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo');
  
  // Make sure the admin has 'Athletics'
  const admin = await Admin.findOneAndUpdate(
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
  
  // Also hash the password directly for testing login
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash('password123', salt);
  await admin.save();
  
  console.log('Admin ready in Admin collection:', admin.email, admin.sports);
  process.exit(0);
}
testAdmin();
