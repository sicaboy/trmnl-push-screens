const fs = require('fs');
const path = require('path');

// Import the HTML generator
const { generateEInkHTML } = require('./src/utils/htmlGenerator.ts');

console.log('Current server time:', new Date().toString());
console.log('Current UTC time:', new Date().toISOString());
console.log('Current local time:', new Date().toLocaleString());

try {
  const html = generateEInkHTML('calendar', { title: 'calendar', data: {} });
  
  // Extract the date display from HTML
  const dateMatch = html.match(/今天是(\d{4})年(\d+)月(\d+)日/);
  if (dateMatch) {
    console.log('Generated date display:', dateMatch[0]);
    console.log('Year:', dateMatch[1], 'Month:', dateMatch[2], 'Day:', dateMatch[3]);
  }
  
  // Save HTML for inspection
  fs.writeFileSync('debug-output.html', html);
  console.log('HTML saved to debug-output.html');
  
} catch (error) {
  console.error('Error generating HTML:', error);
}