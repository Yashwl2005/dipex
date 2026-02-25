const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const findStrayTextPlugin = function({ types: t }) {
    return {
        visitor: {
            JSXText(path) {
                const text = path.node.value;
                if (text.trim() === '') return;
                const parent = path.parent;
                if (parent.type === 'JSXElement') {
                    const parentName = parent.openingElement.name.name;
                    if (parentName !== 'Text' && parentName !== 'TextInput') {
                        console.log('\nFound stray text: "' + text.trim() + '" inside <' + parentName + '>');
                        console.log('At line: ' + path.node.loc.start.line);
                        console.log('In File: ' + path.state.filename);
                    }
                }
            },
            JSXExpressionContainer(path) {
                 if (t.isStringLiteral(path.node.expression)) {
                     const parent = path.parent;
                     if (parent.type === 'JSXElement') {
                        const parentName = parent.openingElement.name.name;
                        if (parentName !== 'Text') {
                            console.log('\nFound string literal {"' + path.node.expression.value + '"} inside <' + parentName + '>');
                            console.log('At line: ' + path.node.loc.start.line);
                            console.log('In File: ' + path.state.filename);
                        }
                     }
                 }
            }
        }
    };
};

walkDir('d:/Dipex/app/src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        const code = fs.readFileSync(filePath, 'utf8');
        try {
            babel.transformSync(code, {
                filename: filePath,
                presets: ['@babel/preset-typescript', '@babel/preset-react'],
                plugins: [findStrayTextPlugin],
                ast: false,
                code: false
            });
        } catch (e) {
            console.log("Parse error in " + filePath);
        }
    }
});
console.log("Done checking src directory.");
