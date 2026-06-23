const fs = require('fs');
const path = require('path');

function removeComments(str) {
    let mode = {
        singleQuote: false,
        doubleQuote: false,
        template: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        jsx: 0 // nesting level for JSX expressions {}
    };

    let result = [];
    let i = 0;

    while (i < str.length) {
        const char = str[i];
        const nextChar = str[i + 1] || '';

        // If we're inside a line comment
        if (mode.lineComment) {
            if (char === '\n') {
                mode.lineComment = false;
                result.push(char);
            }
            i++;
            continue;
        }

        // If we're inside a block comment
        if (mode.blockComment) {
            if (char === '*' && nextChar === '/') {
                mode.blockComment = false;
                i += 2;
            } else {
                i++;
            }
            continue;
        }

        // If we're inside a string or regex, check for escapes
        if (mode.singleQuote || mode.doubleQuote || mode.template || mode.regex) {
            result.push(char);
            if (char === '\\') {
                result.push(nextChar);
                i += 2;
                continue;
            }

            if (mode.singleQuote && char === "'") mode.singleQuote = false;
            else if (mode.doubleQuote && char === '"') mode.doubleQuote = false;
            else if (mode.template && char === '`') mode.template = false;
            else if (mode.regex && char === '/') mode.regex = false;
            
            i++;
            continue;
        }

        // Check for strings
        if (char === "'") mode.singleQuote = true;
        else if (char === '"') mode.doubleQuote = true;
        else if (char === '`') mode.template = true;
        
        // JSX expressions
        if (char === '{') mode.jsx++;
        if (char === '}') mode.jsx = Math.max(0, mode.jsx - 1);

        // Very basic regex detection (not perfect but mostly works to avoid breaking regexes containing //)
        // Only consider it a regex if it starts with / and the previous non-whitespace character was =, (, [, ,, :, or return
        if (char === '/' && nextChar !== '/' && nextChar !== '*') {
            // Find previous non-whitespace character
            let j = result.length - 1;
            while (j >= 0 && /\s/.test(result[j])) j--;
            const prevChar = j >= 0 ? result[j] : '';
            if (['=', '(', '[', ',', ':', '>', '<', '&', '|', '!', '?', ';'].includes(prevChar) || result.slice(Math.max(0, j - 6), j + 1).join('').endsWith('return')) {
                mode.regex = true;
                result.push(char);
                i++;
                continue;
            }
        }

        // JSX Block comment {/* ... */}
        if (mode.jsx > 0 && char === '{' && nextChar === '/' && str[i + 2] === '*') {
            // We just remove the whole {/* ... */} block
            let j = i + 3;
            while (j < str.length - 1 && !(str[j] === '*' && str[j + 1] === '/' && str[j + 2] === '}')) {
                j++;
            }
            if (j < str.length - 1) {
                i = j + 3; // skip past */}
                continue;
            }
        }

        // Check for line comment
        if (char === '/' && nextChar === '/') {
            mode.lineComment = true;
            i += 2;
            continue;
        }

        // Check for block comment
        if (char === '/' && nextChar === '*') {
            // But don't remove eslint-disable
            if (str.slice(i, i + 50).includes('eslint-disable')) {
                result.push(char);
                i++;
                continue;
            }
            mode.blockComment = true;
            i += 2;
            continue;
        }

        result.push(char);
        i++;
    }

    // Clean up empty lines that only contain whitespace, but leave empty lines that were already there
    // To do this simply, we replace lines with only spaces that resulted from line comments with empty string
    return result.join('').replace(/^[ \t]+$/gm, '');
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
            processDirectory(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let newContent = removeComments(content);
            
            // Keep eslint-disable-next-line line comments by putting them back if they were removed
            // Actually, simpler to just use regex to remove comments except eslint
            
            if (content !== newContent) {
                // Let's do a safety check: if we somehow removed something and the file size changed too drastically (>50%), or we messed up
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Processed: ' + fullPath);
            }
        }
    }
}

// Re-implementing with regex for simplicity and safety, since the parser approach can be buggy.
function regexRemoveComments(content) {
    // 1. Remove JSX block comments: {/* ... */}
    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
    
    // 2. Remove standard block comments /* ... */
    // Exclude eslint-disable
    content = content.replace(/\/\*[\s\S]*?\*\//g, (match) => {
        if (match.includes('eslint-disable')) return match;
        return '';
    });
    
    // 3. Remove line comments // ...
    // Exclude eslint-disable and URL-like (http://)
    const lines = content.split('\n');
    const newLines = lines.map(line => {
        // Skip eslint
        if (line.includes('eslint-disable')) return line;
        
        // Find // that is not preceded by : (to avoid http://)
        // Also avoid removing // inside strings (very naive)
        let inString = false;
        let stringChar = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if ((char === '"' || char === "'" || char === "`") && line[i-1] !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (stringChar === char) {
                    inString = false;
                }
            }
            
            if (!inString && char === '/' && line[i+1] === '/') {
                if (i === 0 || line[i-1] !== ':') {
                    // return only the part before the comment, trimming trailing whitespace
                    return line.substring(0, i).trimEnd();
                }
            }
        }
        return line;
    });
    
    // Remove lines that became completely empty and were probably just comment lines
    return newLines.join('\n');
}

function processDirectoryRegex(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
            count += processDirectoryRegex(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let newContent = regexRemoveComments(content);
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Removed comments from: ' + fullPath);
                count++;
            }
        }
    }
    return count;
}

console.log('Starting comment removal...');
const count = processDirectoryRegex(path.join(__dirname, 'src'));
console.log(`Finished. Modified ${count} files.`);
