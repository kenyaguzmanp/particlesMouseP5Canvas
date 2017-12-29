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
    this.mousex = 0;
    this.mousey = 0;
    this.shiftCx = 0;
    this.shiftCy = 0;
    this.centerAux = [x,y];
    


    this.display = function () {
        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);
        //this.theta +=0.1;

        //this.rotateOwn();
        //this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, true);
        this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, this.isToMouse, this.theta, this.mousex, this.mousey);
        //this.movementParticle(1, 1, 2, this.isToMouse, this.theta, this.mousex, this.mousey);
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

    this.movementParticle = function (orbit, amplitude, radius, isToMouse, angle, mx, my) {
        if (isToMouse) {
            this.shiftAng = 0.1;
            this.shiftCx = 1;
            this.shiftCy = 1;
            //this.orbit = 5;
          //  radius = this.radiusParticle;
           // this.amplitude = 1;
            //var angle2 = Math.atan2(my - canvas.height / 2, mx - canvas.width / 2);
            //this.shiftAng = angle2;

           console.log("mx: " + mx + " my: " + my);
           //console.log("angleAux: angulo que cambia la rapidez" + this.angleAux);           

        } else {
            //only change theta angle when is the movement related to that angle
            this.shiftAng = 0.05;
            this.shiftCx = 0;
            this.shiftCy = 0;
            //this.orbit = 0.7;
            //this.amplitude = 0.5;
          //  radius = this.radiusParticle/2;
            //console.log("theta: angulo donde quedo antes de cambair " + this.theta);
            //console.log("angleAux2: angulo que cambia la rapidez" + this.angleAux2);
            
        }
        this.angleAux += this.shiftAng;
        this.theta = this.angleAux;

        this.centerAux[0] += this.shiftCx;
        this.centerAux[1] += this.shiftCy;
        this.centerParticle = this.centerAux;
        
        var px = orbit*(this.radiusParticle/2) * Math.cos(this.angleAux*amplitude) + this.centerAux[0];
        var py = orbit*(this.radiusParticle/2) * Math.sin(this.angleAux*amplitude) + this.centerAux[1];

       // var px = orbit*(this.radiusParticle/2) * Math.cos(this.angleAux*amplitude) + this.centerParticle[0];
       // var py = orbit*(this.radiusParticle/2) * Math.sin(this.angleAux*amplitude) + this.centerParticle[1];
        this.position[0] = px;
        this.position[1] = py;
    }

    this.distance = function (x1, y1, x2, y2) {
        var a = x1 - x2
        var b = y1 - y2

        var c = Math.sqrt(a * a + b * b);
        return c;
    }

};

