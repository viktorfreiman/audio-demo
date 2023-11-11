const easymidi = require('easymidi');

const OUTPUT_NAME = 'L1';

const output = new easymidi.Output(OUTPUT_NAME);


const framerate = 25;
const msframe = 1000 / framerate;

setInterval(() => {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ms = d.getMilliseconds();
    m = paddZ(m);
    s = paddZ(s);
    var frame = paddZ(parseInt(ms / msframe));

    function paddZ(i) {
        if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
        return i;
    }

    var timecode = h + ":" + m + ":" + s + "." + frame;
    console.log(timecode);
    
    // output.send('mtc', {type: 0, value: 0});
}, msframe);


