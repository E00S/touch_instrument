let osc
let env
var amp;
var fft;

let noise
let noise_env
var one_touch = true;
var bool;
var touch_start = false;

let frequency = 50

let circle_radius_1 = 0;
let circle_radius_2 = 0;
let circle_radius_3 = 0;
let circle_x = 0
let circle_y = 0

var volhistory = [];

var note;
var num_bars = 64;
var w;

let reverb;


function setup() {

    print("version: 3");

    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.parent("p5")

    osc = new p5.TriOsc();
    osc.amp(0);

    fft = new p5.FFT(.70, num_bars);
    w = width/num_bars;
    bool = false;

    reverb = new p5.Reverb();
    reverb.connect();
}


function draw() {

    

    background(0);

    if(touches.length == 1 || one_touch) {
        one_touch = true;
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
        if(touch_start || circle_radius_1 >= -1) {
            ellipse(circle_x, circle_y, circle_radius_1, circle_radius_1);
            ellipse(circle_x, circle_y, circle_radius_2, circle_radius_2);
            ellipse(circle_x, circle_y, circle_radius_3, circle_radius_3);
        }

        if(circle_radius_1 < 100 && touch_start) {
            circle_radius_1 += 6;
        }
        if(circle_radius_2 < 80 && touch_start) {
            circle_radius_2 += 4;
        }
        if(circle_radius_3 < 60 && touch_start) {
            circle_radius_3 += 2.5;
        }
        if(!touch_start && circle_radius_1 >= -1) {
            circle_radius_1 -= 6;
            circle_radius_2 -= 4;
            circle_radius_3 -= 2.5;
        }

    }

    if(touches.length == 2) {
        one_touch = false;
        fill(255);
        noStroke();
        rect(0, height, width, mouseY - height);
    }

    if(touches.length == 3) {
        one_touch = false;
        noStroke();
        for (var i = 4; i > 0; i--) {
            fill(255/(i + 1));
            rect(0, 0, width, (height/4) * i);
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
        let reverb_time = map(mouseY, 0, height, 5, 0);
        reverb.process(osc, reverb_time, 2);
    }
    if(touches.length == 3){
        if (mouseY <= height/4 && mouseY >= 0) {
            print('square')
            print(height/4)
            osc.setType('square')
        }
        if (mouseY <= (height/4) * 2 && mouseY > height/4) {
            print('sine')
            print((height/4) * 2)
            osc.setType('sine')
        }
        if (mouseY <= (height/4) * 3 && mouseY > (height/4) * 2) {
            print('triangle')
            print((height/4) * 3)
            osc.setType('triangle')
        }
        if (mouseY <= (height/4) * 4 && mouseY > (height/4) * 3) {
            print('sawtooth')
            print((height/4) * 4)
            osc.setType('sawtooth')
        }
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
    touch_start = true;
    mousePressed()   
    mouseClicked()
}


function touchEnded() {
    touch_start = false;
    mouseReleased()   
}