const { LTCDecoder } = require('libltc-wrapper');
const { RtAudio, RtAudioFormat, RtAudioApi } = require("audify");

const decoder = new LTCDecoder(48000, 25, "s16", 2);

const rtAudio = new RtAudio(RtAudioApi.WINDOWS_WASAPI);

const frameSize = 2;
// value = 0;

rtAudio.openStream(null, {deviceId: 137, nChannels: 1, firstChannel: 0}, RtAudioFormat.RTAUDIO_SINT16, 48000, frameSize, "MyStream", (pcm) => {
    // console.log("pcm: ", pcm);
    // process.stdout.write("pcm: " + pcm);
    decoder.write(pcm);
    let frame = decoder.read();
    // console.log("Frame: ", frame);
    if (frame !== undefined) {
        // console.log("Frame: ", frame);
        // console.log(frame.hours + ":" + frame.minutes + ":" + frame.seconds + ":" + frame.frames)
        process.stdout.write(frame.hours + ":" + frame.minutes + ":" + frame.seconds + ":" + frame.frames + "\n")
        // process.stdout.write("ms: " + tc_ms(frame) + "\n")
        value = tc_ms(frame);
    }
});

// setInterval(() => {
//     console.log("value: ", value);
// }, 1000);   

// rtAudio.openStream(null, {deviceId: 137, nChannels: 1, firstChannel: 0}, RtAudioFormat.RTAUDIO_SINT16, 48000, frameSize, "MyStream", (pcm) => ltc_handle(pcm), (fd) => f_done(fd));
rtAudio.start();

// https://github.com/almoghamdani/audify/issues/28
setTimeout(() => {
    try {
        rtAudio.write(null);
    } catch {
        console.log("RTAudio fixed, enjoy your stream.");
    }
})

// let ltc_handle = function(pcm) {
//     console.log("pcm: ", pcm);
//     console.log("time: ", new Date().getTime());
// }

// let f_done = function(fd) {
//     console.log("done: ", fd);
// }

let tc_ms = function(frame) {
    return (frame.hours * 3600000) + (frame.minutes * 60000) + (frame.seconds * 1000) + (frame.frames * 40);
}