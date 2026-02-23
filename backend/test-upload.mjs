const fs = require('fs');

async function testUpload() {
  try {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let data = '';
    data += '--' + boundary + '\r\n';
    data += 'Content-Disposition: form-data; name="video"; filename="test.mp4"\r\n';
    data += 'Content-Type: video/mp4\r\n\r\n';
    data += 'dummy video content\r\n';
    data += '--' + boundary + '\r\n';
    data += 'Content-Disposition: form-data; name="testName"\r\n\r\n';
    data += '100m Sprint\r\n';
    data += '--' + boundary + '--\r\n';

    const res = await fetch('http://127.0.0.1:5000/api/fitness', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: data
    });
    const result = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', result);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
testUpload();
