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
    this.amplitude = 1;
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
    this.distanceMouse = 0;
    this.stepsToMouse = 0;
    this.collide = false;
    this.px = x;
    this.py = y;
    this.stepsInCollision = 0;



    this.display = function () {

        this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, this.isToMouse, this.theta, this.mousex, this.mousey, this.inMouseInside);          

        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);

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


    this.movementParticle = function (orbit, amplitude, radius, isToMouse, angle, mx, my, isMouseInside) {
        var dist = this.distance(mx, my, this.position[0], this.position[1]) - this.sizeParticle / 2;
        if(this.collide){
            //this.localMovement(0.5, 0, 0);
            this.preventCollision(mx, my);
        }else{
            if (dist < 0 && !isToMouse) {
                console.log("insideeee");
                this.localMovement(0.01, 0, 0);
            }else if(dist>0 && isToMouse){
                this.toMouse(mx, my);
            }else{
                this.localMovement(0.07, 0, 0);
            }
    
        }
        this.position[0] = this.px;
        this.position[1] = this.py;
    }

    this.toMouse = function (mx, my) {
        var magMouse = this.magnitude(mx, my)
        var normMx = mx / magMouse;
        var normMy = my / magMouse;
        var dirX = this.addDirection(mx, this.position[0]);
        var dirY = this.addDirection(my, this.position[1]);
        this.shiftCx = normMx * dirX;
        this.shiftCy = normMy * dirY;

        //var angle = Math.atan2(my - canvas.height / 2, mx - canvas.width / 2);
        //console.log("angle: " + angle);

        //angle that makes to traslate particle with some period
        this.angleAux += this.shiftAng;
        //angle that traslate angle withoun any jumps
        //this.angleAux = angle;
        this.centerAux[0] += this.shiftCx;
        this.centerAux[1] += this.shiftCy;
        this.centerParticle = this.centerAux;

        this.px = this.orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
        this.py = this.orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

    }

    this.preventCollision = function (mx, my) {
        if(this.stepsInCollision<100){
            console.log("in collision");
            var magMouse = this.magnitude(mx, my)
            var normMx = mx / magMouse;
            var normMy = my / magMouse;
            var dirX = this.addDirection(mx, this.position[0]);
            var dirY = this.addDirection(my, this.position[1]);
            this.shiftCx = normMx * dirX*-1;
            this.shiftCy = normMy * dirY*-1;
    
            //var angle = Math.atan2(my - canvas.height / 2, mx - canvas.width / 2);
            //console.log("angle: " + angle);
    
            //angle that makes to traslate particle with some period
            this.angleAux += this.shiftAng;
            //angle that traslate angle withoun any jumps
            //this.angleAux = angle;
    
            this.centerAux[0] += this.shiftCx;
            this.centerAux[1] += this.shiftCy;
            this.centerParticle = this.centerAux;
    
            this.px = this.orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
            this.py = this.orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];
        }else{
           this.collide = false;
           this.stepsInCollision = 0;
        }
        this.stepsInCollision +=1;

    }

    this.localMovement = function (shiftA, shiftx, shifty) {
        this.shiftAng = shiftA;
        this.shiftCx = shiftx;
        this.shiftCy = shifty;

        this.angleAux += shiftA;
        this.theta = this.angleAux;

        this.centerAux[0] += this.shiftCx;
        this.centerAux[1] += this.shiftCy;
        this.centerParticle = this.centerAux;

        this.px = this.orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
        this.py = this.orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

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

