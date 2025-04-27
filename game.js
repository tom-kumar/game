// Setting up canvas
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let color = ['red'];
let platforms = [];
let offSet=0;

const backgroundImg=new Image();
backgroundImg.src='../image/background.png'
const backgroundImg2=new Image();
backgroundImg2.src='../image/hills.png'

//Start animation after backGround image load
backgroundImg.onload=function(){
    playerAnimation();
}



// Gravity
let gravity = 0.5;

// Making platform
class Platform {
    constructor(x, y, width, height,imgSrc) {
        this.platform = { x: x, y: y, width: width, height: height };
        this.img=new Image();
        this.img.src=imgSrc;
    }

    draw() {
        
        context.drawImage(this.img,this.platform.x,this.platform.y,this.platform.width,this.platform.height);
       
    }
}

// Making player
class Player {
    constructor() {
        this.position = { x: 200, y: 200 };
        this.velocity = { x: 0, y: 2 };
        this.onGround = 0; // onGround = 1 player is on the ground, onGround = 0 player is mid-air
        this.height = 50;
        this.width = 50;
    }

    draw() {
        context.fillStyle = color[Math.floor(Math.random() * color.length)];
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    playerMovement() {
        if ((this.position.y + this.height) > canvas.height) {
            this.position.y = canvas.height - this.height;
            this.velocity.y = 0; // Reset velocity when hitting the ground
            this.onGround = 1; // Set player as grounded
        } else { 
            this.velocity.y += gravity; // Gravity continues if not grounded
            this.onGround = 0; // Player is mid-air
        }

        for (let i = 0; i < platforms.length; i++) {
            if (
                (this.position.x + this.width > platforms[i].platform.x) &&
                (this.position.x < platforms[i].platform.x + platforms[i].platform.width) &&
                (this.position.y + this.height <= platforms[i].platform.y) && // Check if player is above the platform
                (this.position.y + this.height + this.velocity.y >= platforms[i].platform.y) // Check if falling onto the platform
            ) {
                this.velocity.y = 0; // Stop vertical movement when landing on the platform
                this.onGround = 1; // Set player as grounded
                this.position.y = platforms[i].platform.y - this.height; // Place player on top of the platform
            }

        // stop player after collision with platform
        if(this.velocity.x>0 &&
            (this.position.x+this.width+2>platforms[i].platform.x)&&
        (this.position.x +this.width<platforms[i].platform.x+platforms[i].platform.width)&&
        (this.position.y+this.height>platforms[i].platform.y)&&
        (this.position.y<platforms[i].platform.y+platforms[i].platform.height))
        {this.velocity.x=0
       
        }

        if(this.velocity.x<0 &&
            (this.position.x>platforms[i].platform.x)&&
        (this.position.x >platforms[i].platform.x+platforms[i].platform.width)&&
        (this.position.y+this.height>platforms[i].platform.y)&&
        (this.position.y<platforms[i].platform.y+platforms[i].platform.height))
        {this.velocity.x=0
       
        }
        
        
        }

        

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
       

        this.draw();
    }
}

// Creating player
let player = new Player();

// Creating platforms
let platform1 = new Platform(0, 600, 500, 100,'../image/platform.png');
let platform2 = new Platform(550, 600, 500, 150,'../image/platform.png');
let platform3 = new Platform(1200, 600, 200, 150,'../image/platform.png');
platforms.push(platform1, platform2, platform3);

// Event listeners
addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
        player.velocity.x = 2;
        offSet= offSet -5

    }
    if (e.key === 'ArrowLeft') {
        player.velocity.x = -2;
        offSet= offSet +5;
    }
    if (e.key === 'ArrowUp'  ) { // Jump only if grounded
       
            player.velocity.y = -12; // Smooth jump effect
            player.onGround = 0; // Temporarily disable jump button
        
    }

    if (e.key === ' '  ) { // Jump only if grounded
        if (player.onGround) {
            player.velocity.y = -12; // Smooth jump effect
            player.onGround = 0; // Temporarily disable jump button
        }
    }
});

addEventListener('keyup', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        player.velocity.x = 0; // Stop horizontal movement
        
    }
});

// Main animation loop
function playerAnimation() {
    requestAnimationFrame(playerAnimation);
    context.clearRect(0, 0, canvas.width, canvas.height);
  
   
    context.drawImage(backgroundImg,0,0,canvas.width,canvas.height)  
    context.drawImage(backgroundImg2,0+offSet,0,canvas.width,canvas.height)  
 

    for (let i = 0; i <platforms.length; i++) {
        platforms[i].draw();
    }
    player.playerMovement();
    
}

