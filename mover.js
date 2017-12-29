var Mover = function (x, y, name, size, context) {
    this.position = [x, y];
    this.velocity = [];
    this.acceleration = [];
    this.topspeed = 5;
    this.radiusParticle = 50;
    this.centerParticle = [x, y];
    this.theta = 0;
    this.angleAux = 0;
    this.angleAux2 = 0;
    this.shiftAng = 0;
    this.name = name;
    this.color = "blue";
    this.sizeParticle = size;
    this.orbit = 0.7;
    this.amplitude = 0.5;
    this.showBar = false;
    this.ctx = context;
    this.isHovering = false;
    this.angleMov = 0;
    this.isToMouse = false;
    this.isMouseInside = false;
    this.mousex = 0;
    this.mousey = 0;
    this.shiftCx = 0;
    this.shiftCy = 0;
    this.centerAux = [x, y];
    this.distanceMouse =0;



    this.display = function () {
        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);
        
        //this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, this.isToMouse, this.theta, this.mousex, this.mousey, this.inMouseInside);
        var dist = this.distance(this.mousex, this.mousey, this.position[0], this.position[1]) - this.sizeParticle/2;
        console.log("dist2: " + dist);
        if(dist<50){
            console.log("insideeee");
        }else{
            this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, this.isToMouse, this.theta, this.mousex, this.mousey, this.inMouseInside);
        }

    };

    this.drawSimpleParticle = function (posx, posy, ishover, color) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(posx, posy, 50, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    };

    this.rotateOwn = function () {
        var orbit = this.orbit;
        var amplitude = this.amplitude;
        var px = orbit * (this.radiusParticle / 2) * Math.cos(this.theta * amplitude) + this.centerParticle[0];
        var py = orbit * (this.radiusParticle / 2) * Math.sin(this.theta * amplitude) + this.centerParticle[1];
        this.position[0] = px;
        this.position[1] = py;
    };

    this.movementParticle = function (orbit, amplitude, radius, isToMouse, angle, mx, my, isMouseInside) {
        //console.log("this.distanceMouse " + this.distanceMouse);
        //console.log(this.isMouseInside);

            if (isToMouse && !isMouseInside) {
                this.toMouse(mx, my);
    
            } else {
                this.localMovement();
            }

            
            this.angleAux += this.shiftAng;
            this.theta = this.angleAux;
    
            this.centerAux[0] += this.shiftCx;
            this.centerAux[1] += this.shiftCy;
            this.centerParticle = this.centerAux;
    
            var px = orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * amplitude) + this.centerAux[0];
            var py = orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * amplitude) + this.centerAux[1];

            this.position[0] = px;
            this.position[1] = py; 
       
    }

    this.toMouse = function(mx, my){
        var magMouse = this.magnitude(mx, my)
        var normMx = mx / magMouse;
        var normMy = my / magMouse;
        var dirX = this.addDirection(mx, this.position[0]);
        var dirY = this.addDirection(my, this.position[1]);            

        this.shiftAng = 0.1;
        this.shiftCx = normMx * dirX;
        this.shiftCy = normMy * dirY;
    }

    this.localMovement = function(){
        this.shiftAng = 0.05;
        this.shiftCx = 0;
        this.shiftCy = 0;
    }

    this.distance = function (x1, y1, x2, y2) {
        var a = x1 - x2
        var b = y1 - y2

        var c = Math.sqrt(a * a + b * b);
        return c;
    }

    this.magnitude = function (x, y) {
        return Math.sqrt(x * x + y * y);
    }

    this.addDirection = function (mx, x) {
        if (mx - x > 0) {
            return 1;
        } else {
            return -1;
        }
    }

};

