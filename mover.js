var Mover = function (x, y, name, size, context, orbit, amplitude) {
    this.position = [x, y];
    this.topspeed = 5;
    this.radiusParticle = size;
    this.centerParticle = [x, y];
    this.theta = 0;
    this.angleAux = 0;
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


    this.display = function () {

        this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, this.isToMouse, this.theta, this.mousex, this.mousey, this.inMouseInside);

        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);

        if (this.isMouseInside) {
            this.drawChildParticle(this.position[0] + 2 * this.sizeParticle, this.position[1] + 2 * this.sizeParticle);
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
        ctx.moveTo(this.position[0] + this.sizeParticle * 0.7, this.position[1] + this.sizeParticle * 0.7);
        ctx.lineTo(posx, posy);
        ctx.stroke();

        //child particle
        ctx.beginPath();
        ctx.arc(posx, posy, this.sizeParticle * 1.3, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();

        ctx.drawImage(image, posx - this.sizeParticle, posy - this.sizeParticle, this.sizeParticle * 2, this.sizeParticle * 2);

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

        this.centerAux[0] += this.shiftCx;
        this.centerAux[1] += this.shiftCy;
        this.centerParticle = this.centerAux;

        var pxAux = orb * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
        var pyAux = orb * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

        this.px = pxAux;
        this.py = pyAux;

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

