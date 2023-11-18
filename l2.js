
const framerate = 25;
const msframe = 1000 / framerate;

// async function sleep(ms) {
//     return new Promise(resolve => {
//       setTimeout(resolve, ms);
//     });
//   }

/*
Value          description
  0	   Current Frames Low Nibble
  1	   Current Frames High Nibble
  2	   Current Seconds Low Nibble
  3	   Current Seconds High Nibble
  4	   Current Minutes Low Nibble
  5	   Current Minutes High Nibble
  6	   Current Hours Low Nibble
  7	   Current Hours High Nibble and SMPTE Type
*/

const easymidi = require('easymidi');

console.log('Connecting to: L1');
const output = new easymidi.Output("L1");

odd = true;
setInterval(() => {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ms = d.getMilliseconds();
    p_m = paddZ(m);
    p_s = paddZ(s);
    var frame = paddZ(parseInt(ms / msframe));

    function paddZ(i) {
        if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
        return i;
    }

    var timecode = h + ":" + p_m + ":" + p_s + "." + frame;
    console.log(timecode);
    // console.log("sleep " + msframe);
    setTimeout(() => {
        // 0 // 4
        if (odd) {
            // console.log("0")
            // Frame low nibble
            // we can only send max value of 15
            // The bit mask is to every thing over 15 will be 0
            // for frames over 15 we need to send the high nibble as 1
            // and the low nibble as the remainder
            // 0 = high nibble 0, low nibble 0
            // 24 = high nibble 1, low nibble 8
            // f_low = frame & 0b00001111;
            f_low = frame & 0xF;
            output.send('mtc', { type: 0, value: f_low });
        } else {
            // console.log("4")
            // Minute low nibble
            m_low = m & 0xF;
            output.send('mtc', { type: 4, value: m_low });
        }
        // console.log("qf")
    }, 10);
    setTimeout(() => {
        // 1 // 5
        if (odd) {
            // console.log("1")
            // Frame high nibble
            f_high = frame >> 4;
            output.send('mtc', { type: 1, value: f_high });
        } else {
            // console.log("5")
            // Minute high nibble
            m_high = m >> 4;
            output.send('mtc', { type: 5, value: m_high });
        }
        // console.log("qf")
    }, 20);
    setTimeout(() => {
        // 2 // 6
        if (odd) {
            // console.log("2")
            // Seconds low nibble
            s_low = s & 0xF;
            output.send('mtc', { type: 2, value: s_low });
        } else {
            // console.log("6")
            // Hour low nibble
            h_low = h & 0xF;
            output.send('mtc', { type: 6, value: h_low });
        }
        // console.log("qf")
    }, 30);
    setTimeout(() => {
        // 3 // 7
        if (odd) {
            // console.log("3")
            // Seconds high nibble
            s_high = s >> 4;
            output.send('mtc', { type: 3, value: s_high });
        } else {
            // console.log("7")
            // Hour high nibble and rate
            // 0 = 24
            // 1 = 25
            // 2 = 29.97
            // 3 = 30
            // 0 = hour 0 + rate 24
            // 1 = hour 0 + rate 25
            // 2 = hour 0 + rate 29.97
            // 3 = hour 0 + rate 30
            // 4 = hour 1 + rate 24
            // 5 = hour 1 + rate 25
            // 6 = hour 1 + rate 29.97
            // 7 = hour 1 + rate 30
            // 0brrh, 25fps, hour 1 = 0b0011 -> 3
            // 0brrh, 25fps, hour 0 = 0b0010 -> 2
            // 0brrh, 30fps, hour 1 = 0b0111 -> 7
            // 0brrh, 30fps, hour 0 = 0b0110 -> 6
            h_high = h >> 4;
            rate = 2 // 25fps? // need to fix this
            // console.log("h_high: " + h_high)
            // console.log("h_low: " + h_low)
            // console.log("rate: " + rate)
            h_high_rate = h_high + rate
            // h_high_rate = 1
            // console.log("h_high_rate: " + h_high_rate)
            output.send('mtc', { type: 7, value: h_high_rate })
        }
        // console.log("qf")
    }, 40);

    if (odd) {
        odd = false;
    } else {
        odd = true;
    }

}, msframe);



// setInterval(() => {
//     console.log("qf")
// }, 10);