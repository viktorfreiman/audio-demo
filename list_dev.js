const { RtAudio, RtAudioFormat, RtAudioApi } = require("audify");

const rtAudio = new RtAudio(RtAudioApi.WINDOWS_WASAPI);

// // print backend
// // console.log("backend: ", rtAudio.getApi());
rtAudio.getDevices().forEach((device) => {
    console.log(device);
});


// // get default output device
// const outputDevice = rtAudio.getDefaultOutputDevice();
// // get default input device
// const inputDevice = rtAudio.getDefaultInputDevice();

// console.log("outputDevice: ", outputDevice);
// console.log("inputDevice: ", inputDevice);