const { LTCDecoder } = require('libltc-wrapper');
const { RtAudio, RtAudioFormat, RtAudioApi } = require("audify");

const decoder = new LTCDecoder(48000, 25, "s16", 2);

const rtAudio = new RtAudio(RtAudioApi.WINDOWS_WASAPI);

const easymidi = require('easymidi');

console.log('Connecting to: L1');
const output = new easymidi.Output("L1");

const frameSize = 2;
// value = 0;

// mtc messages are sent 4 times per frame
// to send a complete timecode, we need to send 8 messages, total duration 2 frames
f1 = true;

rtAudio.openStream(null, { deviceId: 137, nChannels: 1, firstChannel: 0 }, RtAudioFormat.RTAUDIO_SINT16, 48000, frameSize, "MyStream", (pcm) => {
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
        setTimeout(() => {
            if (f1) {
                // console.log("f1");
                // Frame low nibble
                f_low = frame.frames & 0xF;
                output.send('mtc', { type: 0, value: f_low })
            } else {
                // console.log("f2");
                // Minute low nibble
                m_low = frame.minutes & 0xF;
                output.send('mtc', { type: 4, value: m_low })
            }
        }, 10);

        setTimeout(() => {
            if (f1) {
                // Frame high nibble
                f_high = frame.frames >> 4;
                output.send('mtc', { type: 1, value: f_high })
            } else {
                // Minute high nibble
                m_high = frame.minutes >> 4;
                output.send('mtc', { type: 5, value: m_high })
            }
        }, 10);

        setTimeout(() => {
            if (f1) {
                // Second low nibble
                s_low = frame.seconds & 0xF;
                output.send('mtc', { type: 2, value: s_low })
            } else {
                // Hour low nibble
                h_low = frame.hours & 0xF;
                output.send('mtc', { type: 6, value: h_low })
            }
        }, 10);

        setTimeout(() => {
            if (f1) {
                // Second high nibble
                s_high = frame.seconds >> 4;
                output.send('mtc', { type: 3, value: s_high })
            } else {
                // Hour high nibble and rate
                // 0 = 24
                // 1 = 25
                // 2 = 29.97
                // 3 = 30

                h_high = frame.hours >> 4;
                h_high_rate = h_high + 2;
                output.send('mtc', { type: 7, value: h_high_rate })
            }
        }, 10);


        if (f1) {
            f1 = false
        } else {
            f1 = true
        }
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

let tc_ms = function (frame) {
    return (frame.hours * 3600000) + (frame.minutes * 60000) + (frame.seconds * 1000) + (frame.frames * 40);
}