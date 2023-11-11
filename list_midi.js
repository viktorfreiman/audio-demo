const easymidi = require('easymidi');

const inputs = easymidi.getInputs();
const outputs = easymidi.getOutputs();

console.log('inputs:', inputs);
console.log('outputs:', outputs);