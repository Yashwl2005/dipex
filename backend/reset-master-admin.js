const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User'); // In case it was created here
require('dotenv').config();

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    const email = 'masteradmin@dipex.com';
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Try Admin Collection
    let admin = await Admin.findOne({ email });
    if (admin) {
      admin.password = hashedPassword;
      await admin.save();
      console.log(`Password for ${email} in Admin collection has been reset to: ${newPassword}`);
    } else {
      // Try User Collection
      admin = await User.findOne({ email });
      if (admin) {
        admin.password = hashedPassword;
        await admin.save();
        console.log(`Password for ${email} in User collection has been reset to: ${newPassword}`);
      } else {
        console.log(`${email} was not found in either the Admin or User collection.`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

resetAdminPassword();
