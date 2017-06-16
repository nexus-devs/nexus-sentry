// test.js
const NexusSentry = require('./build/Release/addon').NexusSentry;

const nexus = new NexusSentry;
console.log(nexus.plusOne());
// Prints: 11
console.log(nexus.plusOne());
// Prints: 12
console.log(nexus.plusOne());
// Prints: 13
