const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ role: 'athlete' });
    if (!user) {
        console.log("No athlete found");
        process.exit(1);
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    console.log("Token:", token);

    // Call fetch exactly as the app does
    const FormData = require('form-data');
    const fs = require('fs');

    const formData = new FormData();
    fs.writeFileSync('test.jpg', 'dummy image content');
    formData.append('proof', fs.createReadStream('test.jpg'));
    formData.append('title', 'Test');
    formData.append('description', 'Test desc');
    formData.append('dateEarned', new Date().toISOString());

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`http://127.0.0.1:5000/api/achievements`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            },
            body: formData,
        });

        const text = await response.text();
        console.log("STATUS:", response.status);
        console.log("BODY:", text);
    } catch(err) {
        console.error(err);
    } finally {
        fs.unlinkSync('test.jpg');
        process.exit(0);
    }
}
run();
