let playerState = 'idle';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
} );
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
//create and import image
const playerImage = new Image();
playerImage.src = 'images/shadow.png';
//sprite measurements
const spriteWidth = 575;
const spriteHeight = 523;

//slow down animation
let gameFrame = 0;
//slow down animation by how much you want
const staggerFrames = 5
//array to hold all the animations
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,  
    },
    {
       name: 'sit',
       frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    }
]
animationStates.forEach((state,index) => {
let frames = {
    loc:[],
}
for(let i = 0; i < state.frames; i++){
    let positionX = i * spriteWidth;
    let positionY = index * spriteHeight;
    frames.loc.push({x:positionX,y:positionY});
}
spriteAnimations[state.name] = frames;
})
console.log(spriteAnimations);
function animate(){
    //clear old paint between each animation frame
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //cycle through horizontal sprite sheets
    let position =Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = position * spriteWidth;
    let frameY =  spriteAnimations[playerState].loc[position].y;
    //draw sprite and animate it
    ctx.drawImage(playerImage,frameX, frameY,spriteWidth,spriteHeight,0, 0, spriteWidth, spriteHeight);
    
    gameFrame++;

    requestAnimationFrame(animate);
}
animate()