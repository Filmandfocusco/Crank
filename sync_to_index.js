const fs = require('fs');

// 1. Read JSON source
const arriData = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

// 2. Read index.html to find existing metadata (sensor, codecs) to preserve
const indexContent = fs.readFileSync('index.html', 'utf8');
const dbMatch = indexContent.match(/const CAMERA_DB = ({[\s\S]+?})[\s\S]*?;/);
let existingDB = {};
if (dbMatch) {
    try {
        // Use a safer way to parse the object than eval if possible, 
        // but it's a JS object literal, not strictly JSON.
        // For simplicity in this script, we'll use a basic regex approach or a loose eval.
        existingDB = eval('(' + dbMatch[1] + ')');
    } catch (e) {
        console.warn('Could not parse existing CAMERA_DB, using defaults.');
    }
}

// 3. Build the new CAMERA_DB structure
const newDB = {};

for (const [brand, camerasMap] of Object.entries(arriData)) {
    newDB[brand] = { cameras: [] };
    
    for (const [camName, modes] of Object.entries(camerasMap)) {
        // Try to find existing camera metadata
        let existingCam = null;
        if (existingDB[brand] && existingDB[brand].cameras) {
            existingCam = existingDB[brand].cameras.find(c => c.name === camName);
        }
        
        const cameraEntry = {
            name: camName,
            sensor: existingCam ? existingCam.sensor : (brand === 'Phantom' ? '9.4 MP CMOS 27.6 x 15.5 mm' : (brand === 'RED' && camName.includes('Monstro') ? '35.4 MP CMOS 40.96 x 21.60 mm' : 'Generic sensor')),
            codecs: existingCam ? existingCam.codecs : Object.keys(modes[0].max_fps_by_codec),
            modes: modes.map(m => ({
                sensor_mode: m.sensor_mode,
                resolution: m.resolution,
                max_fps: m.max_fps_by_codec
            }))
        };
        newDB[brand].cameras.push(cameraEntry);
    }
}

// 4. Inject into index.html
const startTag = '    const CAMERA_DB = ';
const endTag = '    let camdbExpandedCam = null;';
const dbString = JSON.stringify(newDB, null, 2);

const startIndex = indexContent.indexOf(startTag);
const endIndex = indexContent.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = indexContent.substring(0, startIndex) + 
                       startTag + dbString + ';\n\n' + 
                       indexContent.substring(endIndex);
    fs.writeFileSync('index.html', newContent);
    console.log('Successfully synced expanded database to index.html');
} else {
    console.error('Could not find injection points in index.html');
}
