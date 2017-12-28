var canvas;
var canvasCtx;
var reqanimationreference;


//Create 2D canvas
function createCanvas() {
    console.log("in create canvas");
    cnvContainerDiv = document.getElementById('canvasContainer');
    canvas = document.createElement('canvas');
    canvas.id = "particles";
    canvas.width = waveContainerDiv.offsetWidth;
    canvas.height = 600;
    console.log("canvas height: " + canvas.height + "canvas width: " + canvas.width);
    cnvContainerDiv.appendChild(canvas);
    canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    //draw the canvas
    draw();
}

function draw() {
    //Schedule next redraw
    reqanimationreference = requestAnimationFrame(draw);

    //Draw black background
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    //set initial values
    setWaveValues();

}

function handleResize() {
    console.log("changed");
    cancelAnimationFrame(reqanimationreference);
}

//When rezise pause the animation
window.addEventListener("resize", handleResize);