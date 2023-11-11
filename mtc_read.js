const easymidi = require('easymidi');

// Connect to first available midi port
const inputs = easymidi.getInputs();
if (inputs.length <= 0) {
    console.log('No midi device found');
    process.exit(1);
}
console.log('Connecting to: ' + inputs[0]);
const input = new easymidi.Input(inputs[0]);

// input.on('clock', (clock) => {
//     console.log('clock', clock);
// });

midiState = {
    rate: 0,
    hourMsbit: 0,
    hourLsbits: 0,
    minuteMsbits: 0,
    minuteLsbits: 0,
    secondMsbits: 0,
    secondLsbits: 0,
    frameMsbit: 0,
    frameLsbits: 0,
    total: 0,
}
function paddZ(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

// var framerate = 25;
// var msframe = 1000 / framerate;

input.on('mtc', (mtc) => {
    // console.log('mtc', mtc);
    switch (mtc.type) {
        case 0: {
            console.log("FL:" + mtc.value)
            midiState.frameLsbits = mtc.value & 0b00001111;
            midiState.total =
                ((midiState.frameMsbit + midiState.frameLsbits) / midiState.rate) * 1000 +
                (midiState.secondMsbits + midiState.secondLsbits) * 1000 +
                (midiState.minuteMsbits + midiState.minuteLsbits) * 60000 +
                (midiState.hourMsbit + midiState.hourLsbits) * 3600000;

            elapsed = midiState.total % 86400000;
            if (elapsed == 0 || isNaN(elapsed)) {
                console.log("SKIP")
                break;
            }
            // // console.log(elapsed)
            // var d = new Date(elapsed);
            // var h = d.getHours();
            // var m = d.getMinutes();
            // var s = d.getSeconds();
            // var ms = d.getMilliseconds();
            // h = paddZ(h);
            // m = paddZ(m);
            // s = paddZ(s);
            // var frame = paddZ(parseInt(ms / msframe));

            // var timecode = h + ":" + m + ":" + s + "." + frame;
            // console.log(timecode);
            // ms to hh:mm:ss:ms
            // console.log(elapsed);
            clock = new Date(elapsed).toISOString().substr(11, 8);
            // clock = new Date(elapsed).toISOString()
            console.log(clock + ":" + midiState.frameMsbit + midiState.frameLsbits);

            // console.log(midiState.hourMsbit + midiState.hourLsbits + ":" + midiState.minuteMsbits + midiState.minuteLsbits + ":" + midiState.secondMsbits + midiState.secondLsbits + ":" + midiState.frameMsbit + midiState.frameLsbits);
            break;
        }
        case 1: {
            console.log("FH:" + mtc.value)
            midiState.frameMsbit = (mtc.value & 0b00000001) << 4;
            if (midiState.frameMsbit == 16) {
                midiState.frameMsbit = 1;
            }
            break;
        }
        case 2: {
            midiState.secondLsbits = mtc.value & 0b00001111;
            break;
        }
        case 3: {
            midiState.secondMsbits = (mtc.value & 0b00000011) << 4;
            break;
        }
        case 4: {
            midiState.minuteLsbits = mtc.value & 0b00001111;
            break;
        }
        case 5: {
            midiState.minuteMsbits = (mtc.value & 0b00000011) << 4;
            break;
        }
        case 6: {
            midiState.hourLsbits = mtc.value & 0b00001111;
            break;
        }
        case 7: {
            midiState.hourMsbit = (mtc.value & 0b00000001) << 4;
            midiState.rate = [24, 25, 29.97, 30][(mtc.value >> 1) & 0b00000011];
            // console.log(midiState.rate);
            msframe = 1000 / midiState.rate;
            break;
        }
    }

    // console.log(midiState.hourMsbit + midiState.hourLsbits + ":" + midiState.minuteMsbits + midiState.minuteLsbits + ":" + midiState.secondMsbits + midiState.secondLsbits + ":" + midiState.frameMsbit + midiState.frameLsbits);
    // print timecode as HH:MM:SS:FF
    // console.log(midiState.secondLsbits);

    // midiState.total = Math.floor(midiState.total);
    // process.stdout.write(midiState.total + "\n");

});
