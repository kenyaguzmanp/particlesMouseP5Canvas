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
    this.orbit = 0.01; 
    this.amplitude = 1.5; 
    this.showBar = false;
    this.ctx = context;

    
    this.display = function(){
        console.log(this.ctx);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(x,x, 50, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.stroke();
        x+=0.5;
    }




    this.getRandom = function(min, max) {
        return Math.random() * (max - min) + min;
    }

}

