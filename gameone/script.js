const canvas = document.getElementById('myCanvas3');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
 collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
let score = 0; 
let timeToNextRaven = 0;
let ravenInterval = 200;
let lasttime = 0;
let gameOver = false;
let dpi = window.devicePixelRatio;
let ravens = [];

    function fix_dpi() {
    //create a style object that returns width and height
      let style = {
        height() {
          return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
        },
        width() {
          return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
        }
      }
    //set the correct attributes for a crystal clear image!
      canvas.setAttribute('width', style.width() * dpi);
      canvas.setAttribute('height', style.height() * dpi);
    }
   
    
class Raven {
    constructor() { 
          this.spriteWidth = 271;
        this.spriteHeight = 194; 
        this.sizeModifier = Math.random() * 0.4 + 0.2;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'images/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColours = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];
        this.colour = 'rgb(' + this.randomColours[0] + ',' + this.randomColours[1] + ',' + this.randomColours[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltatime){
        if(this.y < 0 || this.y > canvas.height - this.height){
            this.directionY *= -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width){
            this.markedForDeletion = true;   
        }
        this.timeSinceFlap += deltatime;
        if(this.timeSinceFlap > this.flapInterval){
        if(this.frame > this.maxFrame){
            this.frame = 0;
        }else{
            this.frame++;
            this.timeSinceFlap = 0;

        }
        if(this.hasTrail){
        particles.push(new Particle(this.x, this.y, this.width, this.colour));
    }
}
   /* if(this.x < 0 - this.width ){
        gameOver = true; 
    }*/
}
    draw(){
        collisionCtx.fillStyle = this.colour;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,this.frame * this.spriteWidth,0,this.spriteWidth,this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion {
    constructor(x,y,size) {
        this.image = new Image();
        this.image.src = 'images/boom.png';
        this.spriteWidth= 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'images/exp.flac';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
    }
    update(deltatime){
        if(this.frame === 0){
            this.sound.play();
        }
       this.timeSinceLastFrame += deltatime;
         if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5){
                this.markedForDeletion = true;
            }
    }
}
    draw(){
        ctx.drawImage(this.image,this.frame * this.spriteWidth,0,this.spriteWidth,this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
    }
}
let particles = [];
class Particle {
    constructor(x,y,size,colour) {
         this.size = size;
        this.x = x + this.size / 2;
        this.y = y + this.size / 3;
        this.colour = colour;
       
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
       
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if(this.radius > this.maxRadius - 5){
            this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
         ctx.fillStyle = this.colour;
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
function drawScore(){
    ctx.font = '50px Impact';
    ctx.fillStyle = 'black';
    ctx.fillText('Score:'+ score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score:'+ score, 55, 80);
}
function drawGameOver(){
    ctx.font = '50px Impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over, Your score:' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over, Your score:'+score, canvas.width/2 , canvas.height/2 +5);
}
window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    ravens.forEach(raven => {
        if(pc[0] == raven.randomColours[0] && pc[1] == raven.randomColours[1] && pc[2] == raven.randomColours[2]){
            raven.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(raven.x, raven.y, raven.width));
        }
    }
    );
})

function animate(timestamp){
    fix_dpi();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
    let deltatime = timestamp - lasttime;
    lasttime = timestamp;
    timeToNextRaven += deltatime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b){
            return a.width - b.width;
        } )
    };
    drawScore();
    [...ravens, ...explosions].forEach(raven =>  raven.update(deltatime));
    [ ...ravens, ...explosions].forEach(raven => raven.draw());
    ravens = ravens.filter(raven => !raven.markedForDeletion);
    explosions = explosions.filter(explosion => !explosion.markedForDeletion);
    //particles = particles.filter(particle => !particle.markedForDeletion);
   if(!gameOver) requestAnimationFrame(animate);
   else drawGameOver();
}
animate(0);