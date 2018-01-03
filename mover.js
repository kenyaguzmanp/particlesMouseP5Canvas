var Mover = function (x, y, name, size, context, orbit, amplitude) {
    this.position = [x, y];
    this.velocity = [];
    this.acceleration = [];
    this.topspeed = 5;
    this.radiusParticle = size;
    this.centerParticle = [x, y];
    this.theta = 0;
    this.angleAux = 0;
    this.angleAux2 = 0;
    this.shiftAng = 0;
    this.name = name;
    this.color = "blue";
    this.sizeParticle = size;
    this.orbit = orbit;
    this.amplitude = amplitude;
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
        
        if(this.isMouseInside){
            this.drawChildParticle(this.position[0] + 2*this.sizeParticle, this.position[1] + 2*this.sizeParticle);
        }

    };

    this.drawSimpleParticle = function (posx, posy, ishover, color) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(posx, posy, this.sizeParticle, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    };

    this.drawChildParticle = function (posx, posy) {

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        //diagonal line
        ctx.beginPath();
        ctx.moveTo(this.position[0] + this.sizeParticle*0.7, this.position[1] + this.sizeParticle*0.7);
        ctx.lineTo(posx, posy);
        ctx.stroke();

        //child particle
        ctx.beginPath();
        ctx.arc(posx, posy, this.sizeParticle*1.3, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(image, posx - this.sizeParticle, posy- this.sizeParticle, this.sizeParticle*2, this.sizeParticle*2);
      
    };


    this.movementParticle = function (orbit, amplitude, radius, isToMouse, angle, mx, my, isMouseInside) {
        var dist = this.distance(mx, my, this.position[0], this.position[1]) - this.sizeParticle / 2;
        if(this.collide && dist>0){
            //this.localMovement(0.5, 0, 0);
            this.preventCollision(mx, my, 100);
        }else{
            if (dist < 0 && !isToMouse) {
                //console.log("insideeee");
                this.localMovement(0.01, 0, 0);
            }else if(dist>0 && isToMouse){
                this.toMouse(mx, my);
            }else{
                this.localMovement(0.07, 0, 0);
            }
    
        }
        this.verifyEdges(mx, my, this.px, this.py);
        this.position[0] = this.px;
        this.position[1] = this.py;
        //console.log("px: " + this.px + " py " + this.py);
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

    this.preventCollision = function (mx, my, steps) {
        if(this.stepsInCollision<steps){
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

    this.verifyEdges = function(mx, my, valx, valy){
        //console.log("in verify edges");
        var marginx = valx + this.sizeParticle;
        var marginy = valy + this.sizeParticle;
       // console.log("marginx " + marginx);
        if(valx<10 || marginx>canvas.width){
            console.log("x fuera de los ejes");
        }else if(valy<10 || marginy>canvas.height){
            console.log("y fuera de los ejes");
            this.localMovement(0.07, -5, -5);
        }else if(isNaN(valx) || isNaN (valy)){
            console.log("is nan");
            //this.px = canvas.width/2;
            //this.py = canvas.height/2;
        }else{
           // console.log("dentor d elos ejes");
        }
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

