var Mover =  function(x, y, name, size, context){
    this.position = [x, y];
    this.velocity = [];
    this.acceleration = [];
    this.topspeed = 5;
    this.radiusParticle = 50;
    this.centerParticle = [x, y];
    this.theta = 0;
    this.name = name;
    this.color = [127, 127, 127];
    this.sizeParticle = size;
    this.orbit = 0.7; 
    this.amplitude = 0.5; 
    this.showBar = false;
    this.ctx = context;
    this.isHovering= false;

    
    this.display = function(){
        this.drawSimpleParticle(this.position[0], this.position[1], this.isHovering);
        this.theta +=0.1;
        this.rotateOwn();
    };

    this.drawSimpleParticle = function(posx, posy, ishover){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(posx, posy, 50, 0, 2 * Math.PI);
        ctx.fillStyle = ishover ? "red" : "blue";
        ctx.fill();
        /*
        if(ishover){
            ctx.fillStyle = "red";
            ctx.fill();
        }else{
            ctx.fillStyle = "blue";
            ctx.fill();
        }
        */
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

    this.handleHover =  function (event) {
        var x = event.clientX;
        var y = event.clientY;
        var distMousePart = distance(x, y, this.position[0], this.position[1]);
        if(distMousePart< this.sizeParticle){
            this.isHovering =  true;
            this.drawSimpleParticle(200, 500, this.isHovering);
        }else{
            this.isHovering = false;
            this.drawSimpleParticle(200, 500, this.isHovering);
        }
    }

};

