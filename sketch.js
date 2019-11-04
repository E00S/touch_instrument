let osc
let env
var amp;
var fft;

let noise
let noise_env

let frequency = 50

let circle_radius = 0
let circle_x = 0
let circle_y = 0

var volhistory = [];

var num_bars = 128;
var w;


function setup() {

    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent("p5")

    // create new oscillator 
    osc = new p5.Oscillator()
    osc.setType("sine") // "sine" "square" "sawtooth"
    osc.amp(0)  // set initial amplitude to 0

    // create new envelope
    env = new p5.Envelope()
    env.setADSR(0.2, 0.1, 0.1, 0.5)


    // create new noise maker
    noise = new p5.Noise()
    noise.setType("white") // "brown" "pink"
    noise.amp(0)  // set initial amplitude to 0

    noise_env = new p5.Envelope()
    noise_env.setADSR(0.01, 0.1, 0, 0)

    fft = new p5.FFT(.9, num_bars);
    w = width/num_bars;

}


function draw() {

    noStroke()

    // map the red value of our background fill to the frequency variable
    background(0);
    stroke(255);
    var spec = fft.analyze();
    for (var i = 0; i < spec.length; i++) {
        var amp = spec[i];
        var y = map(amp, 0, 256, height, 0);
        line(i * w, height, i * w, y);
    }
    if(touches.length >= 1) {
        print(touches);
    }
}


function windowResized() {    
    resizeCanvas(windowWidth, windowHeight)
}


function mousePressed() {

    // trigger the osc envelope
    osc.start()
    osc.amp(env)
    env.triggerAttack()

    // trigger the noise envelope
    noise.start()
    noise.amp(noise_env)
    noise_env.triggerAttack()

    // set the circle to the mouse position and increase its radius
    circle_radius = 100
    circle_x = mouseX
    circle_y = mouseY

    mouseDragged()
}


function mouseReleased() {

    // "release" the envelopes
    env.triggerRelease()
    noise_env.triggerRelease()

}


function mouseDragged() {

    // map the mouse position to a frequency variable
    frequency = map(mouseY, 0, height, 2000, 50)
    osc.freq(frequency) // set the osc to this frequency

    // track the mouse position with circle variables
    circle_x = mouseX
    circle_y = mouseY

    // map pan to mouseX
    let pan = map(mouseX, 0, width, -1, 1)
    osc.pan(pan)
}


// add these to make it work for touch screens
function touchStarted() {
    mousePressed()   
    mouseClicked()
}


function touchEnded() {
    mouseReleased()   
}