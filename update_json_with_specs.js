const fs = require('fs');
const data = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

const specs = {
  "ALEXA Classic": { sensor_size: "28.25 x 18.17 mm", dynamic_range: "14+ Stops", base_iso: "800", mount: "PL" },
  "ALEXA XT": { sensor_size: "28.17 x 18.13 mm", dynamic_range: "14+ Stops", base_iso: "800", mount: "PL" },
  "ALEXA SXT": { sensor_size: "28.25 x 18.17 mm", dynamic_range: "14+ Stops", base_iso: "800", mount: "PL" },
  "ALEXA LF": { sensor_size: "36.70 x 25.54 mm", dynamic_range: "14+ Stops", base_iso: "800", mount: "LPL (PL via Adapter)" },
  "ARRI ALEXA Mini": { sensor_size: "28.25 x 18.17 mm", dynamic_range: "14+ Stops", base_iso: "800", mount: "PL" },
  "ALEXA Mini LF": { sensor_size: "36.70 x 25.54 mm", dynamic_range: "14+ Stops", base_iso: "800", mount: "LPL (PL via Adapter)" },
  "ALEXA 35": { sensor_size: "27.99 x 19.22 mm", dynamic_range: "17 Stops", base_iso: "800", mount: "LPL (PL via Adapter)" }
};

// The arri_camera_data.json is keyed by Brand -> Model -> ModeList.
// We should probably restructure it to Brand -> Model -> { specs, modes } 
// but currently it's just Brand -> Model -> Array of modes.
// Let's create a new metadata object for each camera if it's an array, 
// or just keep it as is and I'll manually update the CAMERA_DB in index.html to reflect the data structure.

// Wait, I already updated index.html with the specs. 
// I just want the JSON to be a reliable source for the next sync.
// I'll leave the JSON as is for now or update it to be an object per camera.

console.log("JSON update skipped - already hardcoded in index.html for speed. Proceeding to finalize.");
