const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
  try {
    const fileContent = Buffer.from('dummy video content');
    fs.writeFileSync('test.mp4', fileContent);

    const formData = new FormData();
    formData.append('video', fs.createReadStream('test.mp4'));
    formData.append('testName', '100m Sprint');
    formData.append('score', '0');
    formData.append('metrics', JSON.stringify({ duration: 12 }));
    formData.append('dateTaken', new Date().toISOString());

    const res = await axios.post('http://127.0.0.1:5000/api/fitness', formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Server error:', err.response.status, err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
  } finally {
    if(fs.existsSync('test.mp4')) fs.unlinkSync('test.mp4');
  }
}
testUpload();
