const { LTCEncoder, LTCDecoder, LTC_USE_DATE } = require('libltc-wrapper');
const { RtAudio, RtAudioFormat, RtAudioApi } = require("audify");

const encoder = new LTCEncoder(48000, 25, LTC_USE_DATE); // 48khz, 25 fps, LTC_USE_DATE flag

let time = new Date();

encoder.setTimecode({
  hours: time.getHours(),
  minutes: time.getMinutes(),
  seconds: time.getSeconds(),
  frame: time.getMilliseconds() / (1000 / 25),
  days: time.getDate(),
  months: time.getMonth() + 1,
  years: time.getFullYear() % 100,
  timezone: "+0000"
})

// Every frame (25 times per second) increase the current frame
encoder.incrementTimecode();

// Get 1 frame worth of LTC audio (48khz 25fps would be 40ms audio)
encoder.encodeFrame();

// encoder.incrementTimecode();
// encoder.encodeFrame();

let buffer = encoder.getBuffer();

// const rtAudio = new RtAudio(RtAudioApi.WINDOWS_WASAPI);

// // setup output stream
// rtAudio.openStream({deviceId: 132, nChannels: 2, firstChannel: 0}, null, RtAudioFormat.RTAUDIO_SINT16, 48000, 1920, "MyStream");
// rtAudio.openStream()
// rtAudio.start();

// // convert unsigned 8 bit to signed 16 bit
// s16_buffer = new Int16Array(buffer.length);

// // write to output stream
// rtAudio.write(s16_buffer);
// rtAudio.write(s16_buffer);
// rtAudio.write(s16_buffer);
// rtAudio.write(s16_buffer);


// console.log(buffer);

const decoder = new LTCDecoder(48000, 25, "s16");

// Write audio buffer to the decoder
decoder.write(buffer);
decoder.write(buffer);

// Check if there is any ltc frames ready
let frame = decoder.read();

if (frame !== undefined) {
    // found a valid frame
    console.log("Frame: ", frame);
    console.log(frame.hours + ":" + frame.minutes + ":" + frame.seconds + ":" + frame.frames)
}
