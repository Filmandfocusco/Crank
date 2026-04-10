const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

function extractObject(content, startString) {
    const startIndex = content.indexOf(startString);
    if (startIndex === -1) return null;
    const objStart = content.indexOf('{', startIndex);
    let braceCount = 0;
    let index = objStart;
    while (index < content.length) {
        if (content[index] === '{') braceCount++;
        else if (content[index] === '}') braceCount--;
        if (braceCount === 0) return content.substring(objStart, index + 1);
        index++;
    }
    return null;
}

const dbStr = extractObject(content, 'const CAMERA_DB =');
if (dbStr) {
    const db = eval('(' + dbStr + ')');
    console.log('Sony:', db.Sony ? db.Sony.cameras.length : 'MISSING');
    console.log('RED:', db.RED ? db.RED.cameras.length : 'MISSING');
    console.log('Phantom:', db.Phantom ? db.Phantom.cameras.length : 'MISSING');
}
