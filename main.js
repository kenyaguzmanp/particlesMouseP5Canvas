var canvas;
var ctx;
var reqanimationreference;
var x=75;
var mover;
var mover2;

var mousex=0;
var mousey=0;

function init(){
    createCanvas();
}

//Create 2D canvas
function createCanvas() {
    console.log("in create canvas");
    cnvContainerDiv = document.getElementById('canvasContainer');
    canvas = document.createElement('canvas');
    console.log("canvas ", canvas)
    canvas.id = "particles";
    canvas.width = cnvContainerDiv.offsetWidth;
    canvas.height = 600;
    console.log("canvas height: " + canvas.height + "canvas width: " + canvas.width);
    cnvContainerDiv.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mover =  new Mover(100, 100, "mover1", 100, ctx);
    //draw the canvas
    draw();
}

function draw() {
    //Schedule next redraw
   reqanimationreference = requestAnimationFrame(draw);

    //Draw black background
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    mover.display();
}

init();

canvas.addEventListener("mousemove", function(event) {
    mouseMove(event)
});

function mouseMove(event){
    mousex = event.clientX;
    mousey = event.clientY;
    mover.handleHover(mousex, mousey);
}

function distance(x1, y1, x2, y2){
    var a = x1 - x2
    var b = y1 - y2
    
    var c = Math.sqrt( a*a + b*b );
    return c;
}