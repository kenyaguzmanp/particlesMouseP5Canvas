var Mover =  function(x, y, name, size, context){
    this.position = [x, y];
    this.velocity = [];
    this.acceleration = [];
    this.topspeed = 5;
    this.radiusParticle = 50;
    this.centerParticle = [x, y];
    this.theta = 0;
    this.name = name;
    this.color = "blue";
    this.sizeParticle = size;
    this.orbit = 0.7; 
    this.amplitude = 0.5; 
    this.showBar = false;
    this.ctx = context;
    this.isHovering= false;
    this.angleMov=0;
    this.isToMouse = false;

    
    this.display = function(){
        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);
        this.theta +=0.1;

        //this.rotateOwn();
        //this.movementParticle(this.orbit, this.amplitude, this.radiusParticle, true);
        this.movementParticle(1, 1, 2, this.isToMouse, this.theta);
    };

    this.drawSimpleParticle = function(posx, posy, ishover, color){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(posx, posy, 50, 0, 2 * Math.PI);
        //ctx.fillStyle = ishover ? "red" : "blue";
        ctx.fill();
       
        if(ishover){
            ctx.fillStyle = "red";
            ctx.fill();
            
        }else{
            ctx.fillStyle = color;
            ctx.fill();
        }
        
        ctx.stroke();
    };

    this.rotateOwn = function (){
        var orbit=this.orbit;
        var amplitude = this.amplitude;
        var px = orbit*(this.radiusParticle/2) * Math.cos(this.theta*amplitude) + this.centerParticle[0];
        var py = orbit*(this.radiusParticle/2) * Math.sin(this.theta*amplitude) + this.centerParticle[1];
        this.position[0] = px;
        this.position[1] = py;
    };

    this.movementParticle = function (orbit, amplitude, radius, isToMouse, angle){
        //var angle2 = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2);
        //var angle = isToMouse ? angle2 : this.angle;
        var angleAux =  this.theta;
        if(isToMouse){
            //this.angleMov += 0.5;
            angleAux *= 2;
        }else{
            //this.angleMov = angle;
            angleAux = angle;
        }

        var px = orbit*(this.radiusParticle/2) * Math.cos(angleAux*amplitude) + this.centerParticle[0];
        var py = orbit*(this.radiusParticle/2) * Math.sin(angleAux*amplitude) + this.centerParticle[1];
        this.position[0] = px;
        this.position[1] = py;
    }

    this.handleHover =  function (event) {
        var x = event.clientX;
        var y = event.clientY;
        var distMousePart = distance(x, y, this.position[0], this.position[1]);

        this.insideParticle(x,y, distMousePart);

        if(distMousePart<300 && distMousePart>10){
            console.log("dentro de radio de accion iman");
            this.color = "green";
            this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering, this.color);
            this.isToMouse = true;
            this.movementParticle(1, 1, 2, this.isToMouse, this.theta);
        }else if(distMousePart<10){
            this.insideParticle(x,y, distMousePart);
        }
    }

    this.insideParticle = function (x, y, dist){
        if(dist< this.sizeParticle){
            console.log("dentro de particula");
            this.isHovering =  true;
            this.color= "red";
            this.drawSimpleParticle(200, 500, this.isHovering);
        }else{
            this.isHovering = false;
            this.color= "blue";
            this.drawSimpleParticle(200, 500, this.isHovering);
            this.isToMouse = false;
            this.movementParticle(1, 1, 2, this.isToMouse, this.theta);
        }
    }

};

