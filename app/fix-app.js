const fs = require('fs');
const file = 'd:/Dipex/app/src/screens/UploadAssessmentScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

const oldStr = `const filename = videoUri.split('/').pop() || 'video.mp4';
                            const match = /\\.(\\w+)$/.exec(filename);
                            const type = match ? \`video/\${match[1]}\` : 'video/mp4';`;

const newStr = `let filename = videoUri.split('/').pop() || 'video.mp4';
                            const match = /\\.(\\w+)$/.exec(filename);
                            const type = match ? \`video/\${match[1]}\` : 'video/mp4';
                            if (!match) filename = \`\${filename}.mp4\`;`;

if (data.includes(oldStr)) {
    data = data.replace(oldStr, newStr);
    fs.writeFileSync(file, data);
    console.log("Replaced successfully.");
} else {
    // try with \r\n
    const oldStr2 = "const filename = videoUri.split('/').pop() || 'video.mp4';\r\n                            const match = /\\.(\\w+)$/.exec(filename);\r\n                            const type = match ? `video/${match[1]}` : 'video/mp4';";
    const newStr2 = "let filename = videoUri.split('/').pop() || 'video.mp4';\r\n                            const match = /\\.(\\w+)$/.exec(filename);\r\n                            const type = match ? `video/${match[1]}` : 'video/mp4';\r\n                            if (!match) filename = `${filename}.mp4`;";
    if (data.includes(oldStr2)) {
        data = data.replace(oldStr2, newStr2);
        fs.writeFileSync(file, data);
        console.log("Replaced successfully (CRLF).");
    } else {
        console.log("String not found!");
    }
}
