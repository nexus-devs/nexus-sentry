// test.js
const NexusSentry = require('./build/Release/addon').NexusSentry;
const nexus = new NexusSentry;

nexus.scan()

console.log(nexus)
