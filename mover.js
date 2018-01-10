var Mover = function (x, y, name, size, context, orbit, amplitude) {
    this.position = [x, y];
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
    this.ctx = context;
    this.angleMov = 0;
    this.isToMouse = false;
    this.isMouseInside = false;
    this.mousex = 0;
    this.mousey = 0;
    this.shiftCx = 0;
    this.shiftCy = 0;
    this.centerAux = [x, y];
    this.collide = false;
    this.px = x;
    this.py = y;
    this.stepsInCollision = 0;
    this.outOfGrid = false;
    this.centerGrid = [x, y];
    this.partx;
    this.party;
    this.px2 = 0;
    this.py2 = 0;
    this.childPosX = x;
    this.childPosY = y;
    this.sizeChildParticle = 0;

    this.display = function () {

        this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, this.isToMouse, this.theta, this.mousex, this.mousey, this.inMouseInside);

        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);

        if (this.isMouseInside) {
            this.drawChildParticle(this.position[0] + 2 * this.sizeParticle, this.position[1] + 2 * this.sizeParticle);
            //iterate in scale of child particle
            //if sizeChildParticle has reqched his amximun point, do not iterate again
            if(this.sizeChildParticle  < this.sizeParticle*1.3){
                this.sizeChildParticle += 5;
            }
            
        }else{
            this.sizeChildParticle = 0;
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
        // Save the state, so we can undo the clipping
        ctx.save();

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        //diagonal line
        ctx.beginPath();
        ctx.moveTo(this.position[0] + this.sizeParticle * 0.7, this.position[1] + this.sizeParticle * 0.7);
        ctx.lineTo(this.childPosX, this.childPosY);
        ctx.stroke();

        //final size of child particle: this.sizeParticle * 1.3
        //child particle
        ctx.beginPath();
        ctx.arc(this.childPosX, this.childPosY, this.sizeChildParticle , 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
        // Clip to the current path
        ctx.clip();
        
        ctx.drawImage(image, this.childPosX - this.sizeChildParticle, this.childPosY - this.sizeChildParticle, this.sizeChildParticle * 2, this.sizeChildParticle * 2);

         // Undo the clipping
        ctx.restore();
        
    };


    this.movementParticle = function (orbit, amplitude, radius, isToMouse, angle, mx, my, isMouseInside) {
        var dist = this.distance(mx, my, this.position[0], this.position[1]) - this.sizeParticle / 2;
        //if particles collide and mouse is not inside 
        //  if(this.collide && dist>0){
        //      this.preventCollision(mx, my, 80);
        //  }else{
        //if particles do not collide
        //if mouse is inside particle, very slow movement
        if (dist > this.sizeParticle * 1.5 && isToMouse) { //if mouse is in the acttraction radius. Multiply 1.5 in order to the particle do not approach inside
            this.toMouse(mx, my);
        } else {
            this.localMovement(dist < 0 && !isToMouse ? slowPeriod : regularPeriod, 0, 0);
        }


        // }
        //this.verifyEdges(this.px, this.py);
        this.compareToGrid(this.px, this.py);
        this.position[0] = this.px;
        this.position[1] = this.py;

        //position of child particle
        this.childPosX = this.px2;
        this.childPosY = this.py2;
    }

    this.toMouse = function (mx, my) {
        var magMouse = this.magnitude(mx, my)
        var normMx = mx / magMouse;
        var normMy = my / magMouse;
        var dirX = this.addDirection(mx, this.position[0]);
        var dirY = this.addDirection(my, this.position[1]);
        this.shiftCx = normMx * dirX;
        this.shiftCy = normMy * dirY;

        //angle that makes to traslate particle with some period
        this.angleAux += this.shiftAng;

        this.centerAux[0] += this.shiftCx;
        this.centerAux[1] += this.shiftCy;
        this.centerParticle = this.centerAux;

        this.px = this.orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
        this.py = this.orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

        //position of child particle
        this.px2 = this.px;
        this.py2 = this.py;

    }

    this.compareToGrid = function (x, y) {
        var radx = x;
        var rady = y;
        var c = this.centerGrid[0] + partx / 2;
        var d = this.centerGrid[1] + party / 2;

        var e = this.centerGrid[0] - partx / 2;
        var f = this.centerGrid[1] - party / 2;
        if (radx > c - this.sizeParticle || rady > d - this.sizeParticle || radx < e + this.sizeParticle || rady < f + this.sizeParticle) {
            this.outOfGrid = true;
            this.px = this.position[0];
            this.py = this.position[1];
        } else {
            this.outOfGrid = false;
        }
    }

    this.preventCollision = function (mx, my, steps) {
        if (this.stepsInCollision < steps) {
            if (this.isToMouse) {
                var magMouse = this.magnitude(mx, my);
                var normMx = mx / magMouse;
                var normMy = my / magMouse;
                var dirX = this.addDirection(mx, this.position[0]);
                var dirY = this.addDirection(my, this.position[1]);

                this.shiftCx = normMx * dirX * -1;
                this.shiftCy = normMy * dirY * -1;

            } else { //collision when the particles are in their local movement
                console.log("local movement and collision");
                console.log("shiftAng " + this.amplitude);
                this.shiftCx = 0;
                this.shiftCy = 0;
                this.shiftAng = regularPeriod * -1;

            }
            this.angleAux += this.shiftAng;
            this.centerAux[0] += this.shiftCx;
            this.centerAux[1] += this.shiftCy;
            this.centerParticle = this.centerAux;

            this.px = this.orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
            this.py = this.orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

        } else {
            this.collide = false;
            this.stepsInCollision = 0;
        }
        this.stepsInCollision += 1;

    }

    this.localMovement = function (shiftA, shiftx, shifty) {
        var orb = this.orbit;
        this.shiftAng = shiftA;
        this.shiftCx = shiftx;
        this.shiftCy = shifty;

        this.angleAux += shiftA;
        this.theta = this.angleAux;

        //angle change of child particle
        this.angleAux2 += shiftA*3;

        this.centerAux[0] += this.shiftCx;
        this.centerAux[1] += this.shiftCy;
        this.centerParticle = this.centerAux;

        var pxAux = orb * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
        var pyAux = orb * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

        this.px = pxAux;
        this.py = pyAux;

        //position of child particle. direction to center of canvas
        var d1 = this.addDirection(canvas.width/2, this.centerAux[0]);
        var d2 = this.addDirection(canvas.height/2, this.centerAux[1]);
        this.px2 = orb * (this.radiusParticle ) * Math.cos(this.angleAux2 * this.amplitude /2) + this.centerParticle[0] + (this.sizeParticle*3)*d1;
        this.py2 = orb * (this.radiusParticle ) * Math.sin(this.angleAux2 * this.amplitude/2) + this.centerParticle[1] + (this.sizeParticle*3)*d2;
      
        //this.compareToGrid(this.px,this.py);

    }

    this.verifyEdges = function (valx, valy) {
        var marginx = valx + this.sizeParticle;
        var marginy = valy + this.sizeParticle;
        if (valx < 10 || marginx > canvas.width || valy < 10 || marginy > canvas.height) {
            this.collide = true;
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

