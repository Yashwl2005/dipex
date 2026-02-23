const fs = require('fs');

async function testIt() {
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

    try {
        const response = await fetch('http://127.0.0.1:5000/api/fitness', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + boundary.replace('----', '')
            },
            body: data
        });
        const text = await response.text();
        console.log('STATUS:', response.status);
        console.log('BODY:', text);
    } catch (err) {
        console.error('ERROR:', err);
    }
}
testIt();
