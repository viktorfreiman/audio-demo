const { LTCDecoder } = require('libltc-wrapper');
const { RtAudio, RtAudioFormat, RtAudioApi } = require("audify");

const audioFrameSize = 2;
const sampleRate = 48000;
const frameRate = 25;
const msPerFrame = 1000 / frameRate;
const decoder = new LTCDecoder(sampleRate, frameRate, "s16", audioFrameSize);

const rtAudio = new RtAudio(RtAudioApi.WINDOWS_WASAPI);

// we start with 00:00:00:00
export let ltcTime = 0;

rtAudio.openStream(null, {deviceId: 139, nChannels: 1, firstChannel: 0}, RtAudioFormat.RTAUDIO_SINT16, sampleRate, audioFrameSize, "LTC", (pcm) => {

    // we decode the LTC frame
    decoder.write(pcm);

    // try to parse LTC frames
    let frame = decoder.read();

    // if we have a valid frame
    if (frame !== undefined) {
        ltcTime = tc_ms(frame);
    }
});

// don't forget to start the stream
rtAudio.start();

// https://github.com/almoghamdani/audify/issues/28
setTimeout(() => {
    try {
        rtAudio.write(null);
    } catch {
        console.log("RTAudio fixed, enjoy your stream.");
    }
})

// convert a LTC frame to milliseconds
let tc_ms = function(frame) {
    return (frame.hours * 3600000) + (frame.minutes * 60000) + (frame.seconds * 1000) + (frame.frames * msPerFrame);
}