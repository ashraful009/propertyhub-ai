const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch_emojis.json', 'utf8'));
const filesToProcess = [...new Set(data.map(item => item.file))];

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]\uFE0F?/gu;

filesToProcess.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace emojis in single or double quotes with an empty string
    content = content.replace(/'[\p{Emoji_Presentation}\p{Extended_Pictographic}]\uFE0F?'/gu, "''");
    content = content.replace(/"[\p{Emoji_Presentation}\p{Extended_Pictographic}]\uFE0F?"/gu, '""');
    content = content.replace(/`[\p{Emoji_Presentation}\p{Extended_Pictographic}]\uFE0F?`/gu, '``');
    
    // Replace emojis next to spaces, handling extra space issues
    content = content.replace(/([\s])[\p{Emoji_Presentation}\p{Extended_Pictographic}]\uFE0F?\s/gu, '$1');
    content = content.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]\uFE0F?\s/gu, '');
    
    // General emoji removal for anything leftover
    content = content.replace(emojiRegex, '');
    
    // Clean up empty tags (spans, ps, divs) if they only had whitespace left
    let oldContent;
    do {
        oldContent = content;
        content = content.replace(/<(span|p|div|h[1-6])([^>]*)>\s*<\/\1>/g, (match, tag, attrs) => {
            // Only remove span, p, and headings if empty.
            // Leave divs in case they are used for layout/flex boxes.
            if (tag === 'span' || tag === 'p' || tag.startsWith('h')) {
                return '';
            }
            return match;
        });
    } while (oldContent !== content);
    
    // Cleanup any empty ternary strings e.g. `{isTotal ? '' : ''}` or empty boolean renders
    content = content.replace(/\{\s*''\s*\}/g, 'null'); // { '' } -> null if inside JSX
    
    fs.writeFileSync(file, content);
});

console.log('Emojis removed from ' + filesToProcess.length + ' files.');
