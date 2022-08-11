/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('myCanvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numEnemies = 100;
const enemiesArray = [];



let gameFrame = 0;
//create enemy class
class Enemy{
    constructor(){
        this.image = new Image();
        this.image.src = 'images/enemy4.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 213;
        this.spriteHeight = 213; 
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (canvas.width - this.width); 
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * (canvas.width - this.width); 
        this.newY = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.interval = Math.floor(Math.random() * 200 + 50);
       
    }
    //update enemy position
    update(){
      if(gameFrame % this.interval == 0){
        this.newX = Math.random() * (canvas.width - this.width); 
        this.newY = Math.random() * (canvas.height - this.height);
      }
      let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/20;
        this.y -= dy/20;
    if(this.x + this.width < 0){
        this.x = canvas.width;
    }
     //animate sprite
     if(gameFrame % this.flapSpeed === 0){
        this.frame > 4 ? this.frame = 0 : this.frame++;
     }
    }
    //draw enemy on canvas
    draw(){
        ctx.drawImage(this.image,this.frame * this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x, this.y,this.width,this.height);
    }
}
for(let i = 0; i < numEnemies; i++){
    enemiesArray.push(new Enemy());
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    }
    );
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();