const fs = require('fs');

// 1. Read sources
const currentData = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));
const recoveredDB = JSON.parse(fs.readFileSync('recovered_db.json', 'utf8'));

// 2. Helper to convert CAMERA_DB format back to JSON format
function modesToJSON(modes) {
    return modes.map(m => ({
        sensor_mode: m.sensor_mode,
        resolution: m.resolution,
        max_fps_by_codec: m.max_fps
    }));
}

// 3. Merge RED
if (recoveredDB.RED) {
    recoveredDB.RED.cameras.forEach(cam => {
        if (!currentData.RED[cam.name]) {
            currentData.RED[cam.name] = modesToJSON(cam.modes);
            console.log('Restored RED camera:', cam.name);
        }
    });
}

// 4. Merge Sony
if (recoveredDB.Sony) {
    currentData.Sony = currentData.Sony || {};
    recoveredDB.Sony.cameras.forEach(cam => {
        if (!currentData.Sony[cam.name]) {
            currentData.Sony[cam.name] = modesToJSON(cam.modes);
            console.log('Restored Sony camera:', cam.name);
        }
    });
}

// 5. Save
fs.writeFileSync('arri_camera_data.json', JSON.stringify(currentData, null, 2));
console.log('Merge complete.');
