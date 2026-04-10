const fs = require('fs');

// 1. Read JSON source
const arriData = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

// 2. Read index.html
let indexContent = fs.readFileSync('index.html', 'utf8');

// 3. Metadata maps
const brandSensorMap = {
  'ARRI': 'ALEV 3/4',
  'Sony': '8.6K Full-Frame CMOS',
  'RED': '35.4 MP CMOS 40.96 x 21.60 mm',
  'Phantom': '9.4 MP CMOS 27.6 x 15.5 mm',
  'BLACKMAGIC': '12K Super 35 CMOS'
};

const brandCodecsDefaultMap = {
  'ARRI': ['ARRIRAW', 'ProRes 4444', 'ProRes 422 HQ'],
  'Sony': ['X-OCN ST', 'X-OCN LT', 'ProRes 4444'],
  'RED': ['REDCODE RAW', 'ProRes 422 HQ'],
  'Phantom': ['Phantom RAW', 'ProRes 422 HQ'],
  'BLACKMAGIC': ['BRAW 12:1', 'BRAW 5:1', 'BRAW 3:1', 'ProRes']
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
    if (brand === 'RED') {
        if (camName.includes('KOMODO')) return '19.9 MP Super 35 Global Shutter CMOS';
        if (camName.includes('V-RAPTOR') && camName.includes('S35')) return '35.4 MP Super 35 Global Shutter CMOS';
        return '35.4 MP Large Format (VV) Global Shutter CMOS';
    }
    return brandSensorMap[brand] || 'Generic Sensor';
}

// 4. Build the new CAMERA_DB structure
const newDB = {};
for (const [brand, camerasMap] of Object.entries(arriData)) {
    newDB[brand] = { cameras: [] };
    for (const [camName, modes] of Object.entries(camerasMap)) {
        // Collect all codecs present in modes
        const codecsSet = new Set();
        modes.forEach(m => {
            if (m.max_fps_by_codec) {
                Object.keys(m.max_fps_by_codec).forEach(c => codecsSet.add(c));
            }
        });
        const codecs = Array.from(codecsSet);
        
        newDB[brand].cameras.push({
            name: camName,
            sensor: getSensorMetadata(brand, camName),
            codecs: codecs.length > 0 ? codecs : (brandCodecsDefaultMap[brand] || ['ProRes 4444']),
            modes: modes.map(m => ({
                sensor_mode: m.sensor_mode,
                resolution: m.resolution,
                max_fps: m.max_fps_by_codec
            }))
        });
    }
}

// 5. Injections
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

fs.writeFileSync('index.html', indexContent);
console.log('Successfully synced complete database (Sony + RED restored) to index.html');
