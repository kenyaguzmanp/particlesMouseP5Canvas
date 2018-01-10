var canvas;
var ctx;
var reqanimationreference;
var numberParticlesX = 2;
var numberParticlesY = 2;
var numberParticles = numberParticlesX*numberParticlesY;
var particles = [];
var partx;
var party;

var mousex=0;
var mousey=0;

var posMatrix = [];

var slowPeriod = 0.01;
var regularPeriod = 0.03;

var json = [];

/*
var image =  new Image();
//image.src = 'image.png';
//image.src = 'images/person-4.png';
*/
function init(){
    //load the json file with the images
    loadJSON('voices-info.json', 
    function(data) {
        console.log("complete JSON: " , data);
        json = data;
        console.log("json: " , json);
        //after recive the images, create  the canvas
        createCanvas();
        },
        function(xhr) { 
         console.error(xhr); 
        }
    );
   
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

    generateGrid(0,0);
    console.log("partxx: " + partx);
    console.log("party: " + party);
    console.log("matrix position: " , posMatrix);
    for(var i=0; i<numberParticles; i++){
        var psx = posMatrix[i].x;
        var psy = posMatrix[i].y;
        var minxy = Math.min(partx/2, party/2);
        var size = getRandom(minxy/6, minxy/2);
        var orbit = getRandom(0.5, 0.7);
        var amplitude = getRandom(1, 1.5);
        // info variable grab the info of json data of particular particle
        var info = json[i];
        particles.push(new Mover(psx, psy , "mover" + i, size, ctx, orbit, amplitude, info));
    }
    console.log(particles)

    //draw the canvas
    draw();
    //put the event here (dont really sure why)
    canvas.addEventListener("mousemove", function(event) {
        mouseMove(event);
    });
    
}

function draw() {
    //Schedule next redraw
   reqanimationreference = requestAnimationFrame(draw);

    //Draw black background
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    calculateCollisions();
    drawReferenceCanvasLines();
    drawReferenceParticleLines(partx, party);
    for(var i=0; i<numberParticles; i++){
        particle = particles[i];
        particle.partx = partx;
        particle.party = party;
        particle.display();
    }

}

init();


function mouseMove(event){
    var rect = canvas.getBoundingClientRect();
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
            mover.isToMouse = false;
            mover.isMouseInside = true;          
    
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
        }
    }

    calculateCollisions();
}

function calculateCollisions (){
    for(var i=0; i<numberParticles-1; i++){
        var part1 = particles[i];
        for(var j=i+1; j<numberParticles; j++){
            var part2 = particles[j];
            var dx = part1.position[0] - part2.position[0];
            var dy = part1.position[1] - part2.position[1];
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < part1.radiusParticle + part2.radiusParticle) {
                part1.color = "yellow";
                part2.color = "yellow";
                part1.collide = true;
                part2.collide = true;
            }
        } 
    }
}

function compareToGrid(mover){ 
    var d = distance(mover.centerGrid[0], mover.centerGrid[1], mover.position[0], mover.position[0]);
    var b = partx/2 - mover.sizeParticle;
    //console.log("part con otro " + b);
    if(d > b){
        console.log("out of the grid");
        mover.outOfGrid =  true;
       // console.log("d " + d);
    }else{
        mover.outOfGrid = false;
    }
}

function drawReferenceCanvasLines(){
    var epsilon = 5;
    ctx.strokeRect(epsilon, epsilon, canvas.width - 2*epsilon , canvas.height - 2*epsilon);
}

function drawReferenceParticleLines(partx, party){
    for(var i=0; i<numberParticlesX; i++){
        for(var j=0; j<numberParticlesY; j++){
            ctx.strokeRect(i*partx, j*party, partx, party);
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

function generateGrid(x0, y0){
    partx = canvas.width / numberParticlesX;
    party = canvas.height / numberParticlesY;
    var pos ={
        x: 0,
        y: 0
    };
    var c = [];
    for(var j =0; j < numberParticlesX; j++){
        var a= (2*j + 1)*0.5;
        var cx = x0 + a*partx;
        for(var k=0; k< numberParticlesY; k++){
            var b = (2*k + 1)*0.5;
            var cy = y0 + b*party;
            pos.y = cy;
            pos.x = cx;
            c.push(pos);
            pos = {
                x: 0,
                y: 0
            };
        }
    }
    posMatrix = c;
}

function loadJSON(path, success, error)
{   
    console.log("in load json");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
    
}
