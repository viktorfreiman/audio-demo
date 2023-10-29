const { RtAudio, RtAudioFormat } = require("audify");

// Init RtAudio instance using default sound API
const rtAudio = new RtAudio(/* Insert here specific API if needed */);

// Open the input/output stream
rtAudio.openStream(
  {
    deviceId: rtAudio.getDefaultOutputDevice(), // Output device id (Get all devices using `getDevices`)
    nChannels: 1, // Number of channels
    firstChannel: 0, // First channel index on device (default = 0).
  },
  {
    deviceId: rtAudio.getDefaultInputDevice(), // Input device id (Get all devices using `getDevices`)
    nChannels: 1, // Number of channels
    firstChannel: 0, // First channel index on device (default = 0).
  },
  RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
  48000, // Sampling rate is 48kHz
  1920, // Frame size is 1920 (40ms)
  "MyStream", // The name of the stream (used for JACK Api)
  (pcm) => rtAudio.write(pcm) // Input callback function, write every input pcm data to the output buffer
);

// Start the stream
rtAudio.start();