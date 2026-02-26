const fs = require('fs');
const file = 'd:/Dipex/app/src/screens/UploadAssessmentScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

const replacement = "let filename = videoUri.split('/').pop() || 'video.mp4';\n                            const match = /\\.(\\w+)$/.exec(filename);\n                            const type = match ? `video/${match[1]}` : 'video/mp4';\n                            if (!match) filename = `${filename}.mp4`;";

data = data.replace(/const filename = videoUri\.split\('\/'\)\.pop\(\) \|\| 'video\.mp4';\s*const match = \/\\\.[\s\S]*?` : 'video\/mp4';/m, replacement);

fs.writeFileSync(file, data);
console.log("Successfully replaced!");
