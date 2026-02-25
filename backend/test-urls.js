const mongoose = require('mongoose');
const FitnessTest = require('./src/models/FitnessTest');
const fs = require('fs');
require('dotenv').config();

async function checkURLs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const tests = await FitnessTest.find({ videoProofUrl: { $ne: null } }).select('videoProofUrl');
        const urls = tests.map(t => t.videoProofUrl);
        fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2), 'utf8');
        console.log("Written to urls.json");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
checkURLs();
