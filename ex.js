var canvas;
var ctx;
var reqanimationreference;
var numberParticles = 3;
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
    calculateCollisions();
    for(var i=0; i<numberParticles; i++){
        particle = particles[i];
        //particle.display();
        
        if(particle.collide){
            console.log("esta particula colisiona, no mostrare");
            particle.removeCollision();
        }else{
            if(particle.isToMouse){
                particle.toMouse(mousex, mousey);
            }else{
                particle.localMovement(0.07, 0, 0);
            }     
        }
        particle.display();
    }
   
}

init();

canvas.addEventListener("mousemove", function(event) {
    mouseMove(event);
});

function mouseMove(event){
    var rect = canvas.getBoundingClientRect();
    //calculate the collision of previous movement
    //calculateCollisions();   
    for(var i=0; i<numberParticles; i++){
        mover = particles[i];
        var mx= event.clientX - rect.left;
        var my= event.clientY - rect.top;

        var cx = mover.centerParticle[0];
        var cy = mover.centerParticle[1];

        var distMousePart = this.distance(mx, my, cx, cy) - mover.sizeParticle/2;
        mover.distanceMouse = distMousePart;

        mover.mousex = mx;
        mover.mousey = my;
             
        if (distMousePart < 0) {
            //inside particle
            mover.color = "red";
            console.log("particle: " + mover.name);
            mover.isToMouse = false;
            mover.isMouseInside = true;
            mover.localMovement(0.03, 0, 0);           
    
        } else if (distMousePart > 0 && distMousePart > 300) {
            //out of the action radius
            mover.color = "blue";
            mover.isToMouse = false;
            mover.isMouseInside = false;
            mover.stepsToMouse = 0;
        } else {
            //in the action radius
            mover.color = "green";
            mover.isToMouse = true;
            mover.isMouseInside = false;
            mousex = mx;
            mousey = my;
            //mover.toMouse(mx, my);
        }
    }
    
}

function calculateCollisions (){
    for(var i=0; i<numberParticles-1; i++){
        var part1 = particles[i];
        for(var j=i+1; j<numberParticles; j++){
            var part2 = particles[j];
            var dx = part1.position[0] - part2.position[0];
            var dy = part1.position[1] - part2.position[1];
            var distance = Math.sqrt(dx * dx + dy * dy);
            var bigRadius = part1.radiusParticle + part2.radiusParticle;
            if (distance < bigRadius) {
                // collision detected!
                //console.log("collision");
                part1.color = "yellow";
                part2.color = "yellow";
                part1.collide = true;
                part2.collide = true;
            }else{
                part1.collide = false;
                part2.collide = false;
            }
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