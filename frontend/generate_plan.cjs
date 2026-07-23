const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch_emojis.json', 'utf8'));
const fileMap = {};
let standaloneCount = 0;
data.forEach(item => {
    if (!fileMap[item.file]) fileMap[item.file] = [];
    let stripped = item.line.replace(/<[^>]+>/g, '').trim();
    let textOnly = stripped;
    const emojis = item.emojis.split(' ');
    emojis.forEach(e => textOnly = textOnly.replace(e, ''));
    textOnly = textOnly.trim();
    
    let hasText = /[a-zA-Z0-9]/.test(textOnly);
    item.isStandalone = !hasText;
    if (!hasText) standaloneCount++;
    fileMap[item.file].push(item);
});
console.log('Total files:', Object.keys(fileMap).length);
console.log('Total emojis found:', data.length);
console.log('Standalone emojis (no text):', standaloneCount);

let md = '# Remove All Emoji Characters Used as Icons\n\n';
md += '## Goal\nRemove all emoji characters used as icons across the frontend project. Emojis that sit next to text will be removed alongside any extra whitespace. Emojis used alone are flagged for user decision.\n\n';

md += '## User Review Required\n\n';
md += '> [!WARNING]\n> The following standalone emojis (no accompanying text) were found. Removing them might leave empty elements visually. **Please confirm if you want to add text labels, use a placeholder icon, or just remove them entirely.**\n\n';

let standaloneList = [];
data.forEach(item => {
    if(item.isStandalone) {
        standaloneList.push('- `' + item.file.replace(/\\/g, '/') + '` (Line ' + item.lineNum + '): `' + item.line + '`');
    }
});
if(standaloneList.length > 0) {
    md += standaloneList.join('\n') + '\n\n';
} else {
    md += 'None found.\n\n';
}

md += '## Open Questions\n\n';
md += '> [!IMPORTANT]\n> - For standalone emojis listed above, should they be removed completely (leaving an empty visual space), or do you want text labels added in their place?\n';
md += '> - Should data keys containing emojis (e.g. `icon` fields in config arrays) be completely removed or set to empty strings? (Default proposed: set to `null` or empty string to avoid breaking component props).\n\n';

md += '## Proposed Changes\n\n';
md += 'Grouped by file, here are all the emoji occurrences that will be removed.\n\n';

for (const [file, items] of Object.entries(fileMap)) {
    md += '### [MODIFY] [' + file.split('\\').pop() + '](file:///' + file.replace(/\\/g, '/') + ')\n';
    items.forEach(item => {
        md += '- Line ' + item.lineNum + ': `' + item.line.replace(/`/g, "'") + '`\n';
    });
    md += '\n';
}

md += '## Verification Plan\n';
md += '- Run a final `grep_search` for emoji character sets (`\\p{Emoji_Presentation}`) to ensure 0 results remain in the frontend.\n';
md += '- Run the frontend build and linter to check that no layout/jsx was broken.\n';
md += '- Manually inspect any flagged standalone emoji components.\n';

fs.writeFileSync('plan_out.md', md);
