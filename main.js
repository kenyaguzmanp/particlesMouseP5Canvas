var canvas;
var ctx;
var reqanimationreference;
var numberParticles = 5;
var particles = [];

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

    for(var i=0; i<numberParticles; i++){
        //var mover =  new Mover(canvas.width/2, canvas.height/2, "mover1", 100, ctx);
        particles.push(new Mover(getRandom(0, canvas.width-200), getRandom(0, canvas.height-200), "mover" + i, 100, ctx));
    }

    //draw the canvas
    draw();
}

function draw() {
    //Schedule next redraw
   reqanimationreference = requestAnimationFrame(draw);

    //Draw black background
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //mover.display();
    for(var i=0; i<numberParticles; i++){
        particle = particles[i];
        particle.display();
    }
}

init();

canvas.addEventListener("mousemove", function(event) {
    mouseMove(event)
});

function mouseMove(event){

    for(var i=0; i<numberParticles; i++){
        mover = particles[i];
        
        mousex = event.clientX;
        mousey = event.clientY;
        var cx = mover.centerParticle[0];
        var cy = mover.centerParticle[1];
        var distMousePart = this.distance(mousex, mousey, cx, cy);
        mover.mousex = mousex;
        mover.mousey = mousey;
    
        if (distMousePart <= mover.sizeParticle) {
            //inside particle
            mover.color = "red";
            mover.isToMouse = false;
    
        } else if (distMousePart > mover.sizeParticle && distMousePart > 300) {
            //out of the action radius
            mover.color = "blue";
            mover.isToMouse = false;
        } else {
            //in the action radius
            mover.color = "green";
            mover.isToMouse = true;
        }
        
    }

}

function distance(x1, y1, x2, y2){
    var a = x1 - x2
    var b = y1 - y2
    
    var c = Math.sqrt( a*a + b*b );
    return c;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}