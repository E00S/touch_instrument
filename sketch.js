let osc
let env
var amp;
var fft;

let noise
let noise_env

var bool;

let frequency = 50

let circle_radius = 0
let circle_x = 0
let circle_y = 0

var volhistory = [];

var note;
var num_bars = 128;
var w;

let reverb;


function setup() {

    print("version: 1");

    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent("p5")

    osc = new p5.TriOsc();
    osc.amp(0);

    fft = new p5.FFT(.89, num_bars);
    w = width/num_bars;
    bool = false;

    reverb = new p5.Reverb();
    reverb.connect();
}


function draw() {

    background(0);

    if(touches.length == 1) {
        noStroke()

        // map the red value of our background fill to the frequency variable
        stroke(255);
        var spec = fft.analyze();

        for (var i = 0; i < spec.length; i++) {
            var amp = spec[i];
            var y = map(amp, 0, 280, height, 0);
            line(i * w, height, i * w, y);
        }

        strokeWeight(2);
        noFill();
        if(circle_radius > 0) {
            ellipse(circle_x, circle_y, circle_radius - 0, circle_radius - 0);
            ellipse(circle_x, circle_y, circle_radius - 20, circle_radius - 20);
            ellipse(circle_x, circle_y, circle_radius - 40, circle_radius - 40);
        }

        if(bool && circle_radius < 100) {
            circle_radius += 5;
        }
        if(circle_radius >= 100) {
            bool = false;
        }
        if (circle_radius > -1 && bool == false) {
            circle_radius -= 5;
        }
    }

    if(touches.length == 2) {

        for (var i = 0; i < num_bars; i++) {
            line(i * w, height, i * w, mouseY);
        }
    }
 
}


function windowResized() {    
    resizeCanvas(windowWidth, windowHeight)
}


function mousePressed() {

    if(touches.length == 1) {
        // trigger the osc envelope
        osc.start()
        bool = true;
        
        // Fade it in
        osc.fade(1,.3);

        circle_radius = 0;
        circle_x = mouseX
        circle_y = mouseY  
    }

    mouseDragged()
}


function mouseReleased() {
    osc.fade(0,0.3);
    // bool = false;
}


function mouseDragged() {

    // map the mouse position to a frequency variable
    if(touches.length == 1){
        note = map(mouseY, 0, height, 40, 80);
        osc.freq(midiToFreq(Math.floor(note)));
    }
    if(touches.length == 2){
        let reverb_time = map(mouseY, 0, height, .1, 3);
        reverb.process(osc, reverb_time, 2);
    }
    if(touches.length == 3){
        note = map(mouseY, 0, height, 40, 80);
        osc.freq(midiToFreq(Math.floor(note)));
    }
    if(touches.length == 4){
        note = map(mouseY, 0, height, 40, 80);
        osc.freq(midiToFreq(Math.floor(note)));
    }

    // track the mouse position with circle variables
    circle_x = mouseX
    circle_y = mouseY

    // map pan to mouseX
    let pan = map(mouseX, 0, width, -1, 1)
    osc.pan(pan)
}

function mouseClicked() {
}

// add these to make it work for touch screens
function touchStarted() {
    mousePressed()   
    mouseClicked()
}


function touchEnded() {
    mouseReleased()   
}