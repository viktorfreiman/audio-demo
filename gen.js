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

const rtAudio = new RtAudio(RtAudioApi.WINDOWS_WASAPI);

rtAudio.openStream({ deviceId: 131, nChannels: 1, firstChannel: 0 }, null, RtAudioFormat.RTAUDIO_SINT8, 48000, 1920, "MyStream");

rtAudio.start();

setInterval(() => {

    encoder.incrementTimecode();
    encoder.encodeFrame();

    let buffer = encoder.getBuffer();
    rtAudio.write(buffer);
}, 10);