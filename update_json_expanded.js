const fs = require('fs');
const data = JSON.parse(fs.readFileSync('arri_camera_data.json', 'utf8'));

// 1. Update ALEXA Mini LF
if (data.ARRI && data.ARRI['ALEXA Mini LF']) {
  const miniLF = data.ARRI['ALEXA Mini LF'];
  // Add 3.8K 16:9 HDE (90fps)
  miniLF.push({
    "sensor_mode": "3.8K 16:9",
    "resolution": "UHD (3840 x 2160)",
    "max_fps_by_codec": {
      "ARRIRAW HDE": 90,
      "ARRIRAW": 60,
      "ProRes 4444": 60,
      "ProRes 422 HQ": 60
    }
  });
  // Add HD ProRes 4444 (from 3.8K sensor) - 90fps
  miniLF.push({
    "sensor_mode": "3.8K 16:9 (HD)",
    "resolution": "HD (1920 x 1080)",
    "max_fps_by_codec": {
      "ProRes 4444": 90,
      "ProRes 422 HQ": 100
    }
  });
}

// 2. Add RED Monstro 8K VV
if (data.RED) {
  data.RED['RED Monstro 8K VV'] = [
    { "sensor_mode": "8K FF", "resolution": "8.2K (8192 x 4320)", "max_fps_by_codec": { "REDCODE RAW": 60 } },
    { "sensor_mode": "8K 2.4:1", "resolution": "8.2K (8192 x 3456)", "max_fps_by_codec": { "REDCODE RAW": 75 } },
    { "sensor_mode": "7K FF", "resolution": "7.2K (7168 x 3780)", "max_fps_by_codec": { "REDCODE RAW": 80 } },
    { "sensor_mode": "6K FF", "resolution": "6.1K (6144 x 3240)", "max_fps_by_codec": { "REDCODE RAW": 100 } },
    { "sensor_mode": "5K FF", "resolution": "5.1K (5120 x 2700)", "max_fps_by_codec": { "REDCODE RAW": 120 } },
    { "sensor_mode": "4K FF", "resolution": "4.1K (4096 x 2160)", "max_fps_by_codec": { "REDCODE RAW": 150 } },
    { "sensor_mode": "2K FF", "resolution": "2.1K (2048 x 1080)", "max_fps_by_codec": { "REDCODE RAW": 300 } }
  ];
}

// 3. Add Phantom
if (!data.Phantom) {
  data.Phantom = {
    "Phantom Flex 4K": [
      { "sensor_mode": "4K 16:9", "resolution": "4K (4096 x 2304)", "max_fps_by_codec": { "Phantom RAW": 938, "ProRes 422 HQ": 938 } },
      { "sensor_mode": "2K 16:9", "resolution": "2K (2048 x 1152)", "max_fps_by_codec": { "Phantom RAW": 1840, "ProRes 422 HQ": 1840 } }
    ]
  };
}

fs.writeFileSync('arri_camera_data.json', JSON.stringify(data, null, 2));
console.log('JSON updated successfully with RED Monstro and Phantom Flex 4K.');
