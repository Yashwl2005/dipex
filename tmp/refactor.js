const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports SafeAreaView from react-native
    if (content.includes('SafeAreaView') && content.includes('react-native')) {
        // Find the react-native import block
        const rnImportRegex = /import\s+type\s+{[^}]*}|import\s+{([^}]*)}\s+from\s+['"]react-native['"];?/g;
        let match;
        let changed = false;

        while ((match = rnImportRegex.exec(content)) !== null) {
            if (match[1]) {
                const imports = match[1].split(',').map(i => i.trim()).filter(i => i);
                if (imports.includes('SafeAreaView')) {
                    const newImports = imports.filter(i => i !== 'SafeAreaView');
                    let newImportStatement = '';
                    if (newImports.length > 0) {
                        // Keep formatting simple or single line for now
                        newImportStatement = `import { ${newImports.join(', ')} } from 'react-native';`;
                    }
                    content = content.replace(match[0], newImportStatement);
                    changed = true;
                }
            }
        }

        if (changed) {
            // Check if react-native-safe-area-context is already imported
            const ctxImportRegex = /import\s+{([^}]*)}\s+from\s+['"]react-native-safe-area-context['"];?/;
            const ctxMatch = content.match(ctxImportRegex);
            
            if (ctxMatch) {
                const ctxImports = ctxMatch[1].split(',').map(i => i.trim()).filter(i => i);
                if (!ctxImports.includes('SafeAreaView')) {
                    ctxImports.push('SafeAreaView');
                    const newCtxImport = `import { ${ctxImports.join(', ')} } from 'react-native-safe-area-context';`;
                    content = content.replace(ctxMatch[0], newCtxImport);
                }
            } else {
                // Add the import after the last import sentence or at the top
                const addImport = `import { SafeAreaView } from 'react-native-safe-area-context';\n`;
                const firstImport = content.match(/import\s+.*from\s+['"].*['"];?/);
                if (firstImport) {
                    content = content.replace(firstImport[0], firstImport[0] + '\n' + addImport);
                } else {
                    content = addImport + content;
                }
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
            processFile(filePath);
        }
    });
}

walk(path.join(__dirname, '../app/src'));
console.log('Done!');
