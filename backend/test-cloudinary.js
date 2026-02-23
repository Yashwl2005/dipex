require('dotenv').config({ path: '.env' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    const fileContent = Buffer.from('dummy video content');
    fs.writeFileSync('test_cloud.mp4', fileContent);
    
    console.log("Uploading to cloudinary...");
    const result = await cloudinary.uploader.upload('test_cloud.mp4', {
      resource_type: "video",
      folder: "fitness_assessments"
    });
    console.log("Success:", result.secure_url);
  } catch (err) {
    console.error("Cloudinary error:", err.message || err);
  } finally {
    if(fs.existsSync('test_cloud.mp4')) fs.unlinkSync('test_cloud.mp4');
  }
}

testUpload();
