const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const lineIndex = 5026; // 5027-1

// Identifying the line content
const line = lines[lineIndex];
console.log('Original line ends with:', line.slice(-20));

// Correcting the braces:
// Currently: ]}]} } };
// Should be: ]}} };
// Wait, let's trace:
// ] (modes)
// } (camera)
// ] (cameras array)
// } (ARRI section)
// } (CAMERA_DB)
// ;
// Correct order: mode end } modes array end ] camera end } cameras array end ] arri section end } CAMERA_DB end } ;
// JSON ends with camera array end ] then arri section end }
// So it is: JSON ends with ... }] }
// Then adding } ; should be enough.
// My JSON generator: JSON.stringify(arriSection) ends with }
// arriSection = { cameras: [...] }
// So JSON ends with ]}
// Then we need one more } for CAMERA_DB and ;
// Total: ] } } ;

const fixedLine = line.trimEnd().replace(/\}* ?\}* ?\}* ?\}* ?;$/, '') + '}};';
// Wait, regex might be too greedy. Let's just find the last bracket.
const lastBracketIndex = line.lastIndexOf(']');
// From there, we need }} ;
const newLine = line.substring(0, lastBracketIndex + 1) + '}};';

lines[lineIndex] = newLine;
fs.writeFileSync('index.html', lines.join('\n'));
console.log('Fixed line ends with:', newLine.slice(-20));
