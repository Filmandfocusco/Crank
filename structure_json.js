const fs = require('fs');
const flatData = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

const structuredData = {
  "ARRI": {},
  "Sony": {},
  "RED": {},
  "Phantom": {}
};

const arriCameras = [
  'ALEXA Classic', 'ALEXA XT', 'ALEXA SXT', 'ALEXA LF', 
  'ARRI ALEXA Mini', 'ALEXA Mini LF', 'ALEXA 35', 
  'ALEXA 35 Xtreme', 'ALEXA 65', 'ALEXA 265', 'AMIRA'
];

const sonyCameras = ['VENICE', 'Sony VENICE', 'Sony Venice 2 6K', 'Sony Venice 2 8K'];
const redCameras = ['V-RAPTOR [X] 8K VV', 'RED Monstro 8K VV', 'KOMODO-X'];

for (const [camName, modes] of Object.entries(flatData)) {
  if (arriCameras.includes(camName)) structuredData.ARRI[camName] = modes;
  else if (sonyCameras.some(s => camName.includes(s))) structuredData.Sony[camName] = modes;
  else if (redCameras.some(r => camName.includes(r))) structuredData.RED[camName] = modes;
  else if (camName.includes('Phantom')) structuredData.Phantom[camName] = modes;
  else {
    // Default to ARRI if unknown for now, or just add to ARRI
    structuredData.ARRI[camName] = modes;
  }
}

fs.writeFileSync('arri_camera_data.json', JSON.stringify(structuredData, null, 2));
console.log('JSON structured by brand successfully.');
