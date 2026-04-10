const fs = require('fs');

// 1. Read JSON source
const arriData = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

// 2. Read index.html
let indexContent = fs.readFileSync('index.html', 'utf8');

// 3. Extract existing metadata (sensor) from index.html if possible
// We won't use eval as it's risky and failed before. 
// We'll trust our arri_camera_data.json structure and provide defaults for metadata.
const brandSensorMap = {
  'ARRI': 'ALEV 3/4',
  'Sony': '8.6K Full-Frame CMOS',
  'RED': '35.4 MP CMOS 40.96 x 21.60 mm',
  'Phantom': '9.4 MP CMOS 27.6 x 15.5 mm'
};

const brandCodecsMap = {
  'ARRI': ['ARRIRAW', 'ProRes 4444', 'ProRes 422 HQ'],
  'Sony': ['X-OCN ST', 'X-OCN LT', 'ProRes 4444'],
  'RED': ['REDCODE RAW', 'ProRes 422 HQ'],
  'Phantom': ['Phantom RAW', 'ProRes 422 HQ']
};

function getSensorMetadata(brand, camName) {
    if (brand === 'ARRI') {
        if (camName.includes('Classic')) return 'ALEV 3';
        if (camName.includes('XT') || camName.includes('SXT')) return 'ALEV 3';
        if (camName.includes('Mini LF') || camName.includes('LF')) return 'ALEV 3 A2X';
        if (camName.includes('35')) return 'ALEV 4';
        if (camName.includes('65') || camName.includes('265')) return 'ALEV 3 A3X';
        return 'ALEV 3';
    }
    return brandSensorMap[brand] || 'Generic Sensor';
}

// 4. Build the new CAMERA_DB structure
const newDB = {};
for (const [brand, camerasMap] of Object.entries(arriData)) {
    newDB[brand] = { cameras: [] };
    for (const [camName, modes] of Object.entries(camerasMap)) {
        newDB[brand].cameras.push({
            name: camName,
            sensor: getSensorMetadata(brand, camName),
            codecs: brandCodecsMap[brand] || ['ProRes 4444'],
            modes: modes.map(m => ({
                sensor_mode: m.sensor_mode,
                resolution: m.resolution,
                max_fps: m.max_fps_by_codec
            }))
        });
    }
}

// 5. Build the new CAMERA_CODECS
const newCodecs = brandCodecsMap;
// Add BLACKMAGIC as it was in the file
newCodecs['BLACKMAGIC'] = ['BRAW 12:1', 'BRAW 5:1', 'BRAW 3:1', 'ProRes'];

// 6. Injection
// Inject CAMERA_DB
const dbStartTag = '    const CAMERA_DB = ';
const dbEndTag = '    let camdbExpandedCam = null;';
const dbStartIndex = indexContent.indexOf(dbStartTag);
const dbEndIndex = indexContent.indexOf(dbEndTag);

if (dbStartIndex !== -1 && dbEndIndex !== -1) {
    indexContent = indexContent.substring(0, dbStartIndex) + 
                   dbStartTag + JSON.stringify(newDB, null, 2) + ';\n\n' + 
                   indexContent.substring(dbEndIndex);
}

// Inject CAMERA_CODECS
const codecStartTag = '    const CAMERA_CODECS = ';
const codecEndTag = '    };'; // This might be ambiguous if there are many. 
// Let's find the one right after CAMERA_CODECS.
const codecStartIndex = indexContent.indexOf(codecStartTag);
const codecEndIndex = indexContent.indexOf(codecEndTag, codecStartIndex);

if (codecStartIndex !== -1 && codecEndIndex !== -1) {
    indexContent = indexContent.substring(0, codecStartIndex) + 
                   codecStartTag + JSON.stringify(newCodecs, null, 2) + 
                   indexContent.substring(codecEndIndex + codecEndTag.length);
}

fs.writeFileSync('index.html', indexContent);
console.log('Successfully synced expanded database and codecs to index.html');
