const readingTime = require('reading-time');
const file = process.argv[2];

const stats = readingTime(require('fs').readFileSync(file));
console.log(stats);