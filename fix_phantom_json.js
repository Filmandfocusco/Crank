const fs = require('fs');
const data = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

if (data.Phantom && data.Phantom.Phantom) {
    const nested = data.Phantom.Phantom;
    for (const [cam, modes] of Object.entries(nested)) {
        data.Phantom[cam] = modes;
    }
    delete data.Phantom.Phantom;
}

fs.writeFileSync('arri_camera_data.json', JSON.stringify(data, null, 2));
console.log('Fixed Phantom brand section in JSON.');
