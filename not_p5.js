var redColor = document.getElementById('r');
var greenColor = document.getElementById('g');
var blueColor = document.getElementById('b');

redColor.addEventListener('input', function() {
	document.getElementById('r').style.background = "rgb(" + redColor.value + ", 0, 0)";
	setBoxColor();
});

greenColor.addEventListener('input', function() {
	document.getElementById('g').style.background = "rgb(0," + greenColor.value +", 0)";
	setBoxColor();
});

blueColor.addEventListener('input', function() {
	document.getElementById('b').style.background = "rgb(0,0," + blueColor.value + ")";
	setBoxColor();
});

function setBoxColor() {
	document.getElementById('colorBox').style.background = "rgb(" + redColor.value + "," + greenColor.value + "," + blueColor.value + ")";
	document.getElementById('colorBox').style.backgroundClip = "content-box";
}