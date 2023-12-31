const easymidi = require('easymidi');


// Monitor all MIDI inputs with a single "message" listener
easymidi.getInputs().forEach((inputName) => {
    const input = new easymidi.Input(inputName);
    input.on('message', (msg) => {
      const vals = Object.keys(msg).map((key) => `${key}: ${msg[key]}`);
      date = new Date();
      console.log(`${date.getSeconds()}.${date.getMilliseconds()} ${inputName}: ${vals.join(', ')}`);
    });
  });