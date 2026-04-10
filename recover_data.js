const fs = require('fs');

function extractObject(content, startString) {
    const startIndex = content.indexOf(startString);
    if (startIndex === -1) return null;
    
    const objStart = content.indexOf('{', startIndex);
    let braceCount = 0;
    let index = objStart;
    
    while (index < content.length) {
        if (content[index] === '{') braceCount++;
        else if (content[index] === '}') braceCount--;
        
        if (braceCount === 0) {
            return content.substring(objStart, index + 1);
        }
        index++;
    }
    return null;
}

const prevContent = fs.readFileSync('index_prev.html', 'utf8');
const dbStr = extractObject(prevContent, 'const CAMERA_DB =');

if (dbStr) {
    try {
        const db = eval('(' + dbStr + ')');
        console.log(JSON.stringify(db, null, 2));
    } catch (e) {
        console.error('Extraction failed to parse:', e.message);
    }
} else {
    console.error('Could not find CAMERA_DB in previous version');
}
