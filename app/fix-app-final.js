const fs = require('fs');
const file = 'd:/Dipex/app/src/screens/UploadAssessmentScreen.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

lines[189] = "                            let filename = videoUri.split('/').pop() || 'video.mp4';\r";
lines[190] = "                            const match = /\\.(\\w+)$/.exec(filename);\r";
lines[191] = "                            const type = match ? `video/${match[1]}` : 'video/mp4';\r";
lines[192] = "                            if (!match) filename = `${filename}.mp4`;\r";

fs.writeFileSync(file, lines.join('\n'));
console.log('Done script');
