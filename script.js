
let canvas = document.querySelector('#myCanvas'); 
canvas.width  = window.innerWidth; 
canvas.height = window.innerHeight; 

let ctx = canvas.getContext('2d'); 

const CANVAS_WIDTH = canvas.width - 50; 
const CANVAS_HEIGHT = canvas.height; 

const cannonWidth = 10; 
const cannonHeight = 20; 

const bulletWidth = 10; 
const bulletHeight = 20; 

const NUM_OF_CHARS = 10; 
let dY = 0.25; 

const imageObj = new Image;
imageObj.src = './assets/imgs/rocket_12.png';


//// Characters List 
const charList = [
                    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
                    "U", "V", "W", "X", "Y", "Z", 
                    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", 
                    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", 
                    "u", "v", "w", "x", "y", "z", 
                    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                 ]; 

//// Arrays 
let charObjectArray = [];
let rocketArray = []; 

let isInit = true; 
let keyDownChar = ''; 

//// Adding audio effects 
let explosionAudio = new Audio('./assets/sounds/explosion-6055.mp3');
let shootingAudio = new Audio('./assets/sounds/sniper-rifle-5989.mp3');


// console.log(`Canvas: ${CANVAS_WIDTH}, ${CANVAS_HEIGHT}`);

class BaseSprite
{
    constructor(ctx, id, alphaNumericChar='A', charSize='20px', xPos, yPos=30, width, height, dy=0.5, isDisplay=true)
    {
        this.ctx = ctx;                     // Canvas 

        this.id = id;                       // Id : too search. Index 
        this.alphaNumericChar = alphaNumericChar;
        this.charSize = charSize; 

        //// x & y coordinates 
        this.xPos = xPos; 
        this.yPos = yPos; 

        //// The width and height of the objects
        this.width = width; 
        this.height = height; 
        
        this.dy = dy;                       // Dropping top to bottom of y coordinates 
        this.isDisplay = isDisplay; 

    }//end constructor()

}// end class Parent

/* Char must be A-Z a-z and 0-9 */
class AlphaNumericChar extends BaseSprite
{

 
    constructor(ctx, id, alphaNumericChar='A', charSize='20', xPos, yPos=30, dy=0.5)
    {
        super(ctx, id, alphaNumericChar, charSize, xPos, yPos, dy); 
       
    }// end constructor()

    drawChar()
    {
        
        this.ctx.beginPath(); 
        this.ctx.fillStyle = '#00FF00'; 

        this.ctx.font = `${ this.charSize }px Arial`; 
        this.ctx.fillText(`${this.alphaNumericChar}`, this.xPos, this.yPos); 

        let fontHeight = parseInt(this.ctx.font.match(/\d+/), 10); 


        this.width = this.ctx.measureText(this.alphaNumericChar).width; 
        this.height = fontHeight; 


        //// Getting the width and height of the font 
        // console.log(`Font: W: ${this.width}, H: ${this.height}`);

        //// Rectangle box 
        this.ctx.strokeStyle = '#FF0000'; 

        this.ctx.rect(this.xPos , this.yPos - (this.height - 3), this.width, this.height); 
        this.ctx.stroke();

        this.ctx.closePath();

    }// end drawChar()

    move()
    {
        this.yPos += this.dy; 
        // console.log(`Alphabet ${this.alphaNumericChar} [x,y]: [${this.xPos}, ${this.yPos}]`);

    }// end move()


}// end class CharAlphaNumeric

// 
class Bullet extends BaseSprite
{
    constructor(ctx, id, alphaNumericChar, xPos=200, yPos=200, width, height, isFired=false, dy)
    {
        super(ctx, id, alphaNumericChar, charSize, xPos, yPos, width, height, dy); 

        // this.width = width; 
        // this.height = height; 

        this.isFired = isFired;             // To shoot the alphabets
        this.dy = dy; 
        
    }// end constructor()

    
    drawBullet()
    {

        this.ctx.beginPath(); 
        this.ctx.fillStyle = '#FF0000'; 

        // this.ctx.fillRect(this.xPos / 2, this.yPos - (this.bulletHeight * 2), this.bulletWidth, this.bulletHeight); 
        this.ctx.fillRect(this.xPos , this.yPos, this.width, this.height); 

        this.ctx.closePath();

    }// end drawCanon()

    drawRocket()
    {
        this.ctx.beginPath(); 


        this.ctx.drawImage(imageObj, this.xPos, this.yPos);

        this.ctx.strokeStyle = '#FF0000'; 

        // this.ctx.fillRect(this.xPos / 2, this.yPos - (this.bulletHeight * 2), this.bulletWidth, this.bulletHeight); 
        this.ctx.rect(this.xPos , this.yPos, this.width, this.height); 
        this.ctx.stroke();
        this.ctx.closePath();

    }// end drawCanon()


    move()
    {
        this.yPos -= this.dy;  
        // console.log(`Rocket ${this.alphaNumericChar} [x,y]: [${this.xPos}, ${this.yPos}]`);
        
    }// end move()

    
}// end class Bullet 



function getRandom_xPos()
{
    return Math.floor(Math.random() * CANVAS_WIDTH); 
}// end getRandom_xPos()

function getRandom_yPos()
{
    return Math.floor((Math.random() * 100) - 50); 
}// end getRandom_yPos()

function detectCollision(word, rocket)
{
    if (word.isDisplay && rocket.isDisplay &&
        word.xPos < rocket.xPos + rocket.width &&
        word.xPos + word.width > rocket.xPos &&
        word.yPos < rocket.yPos + rocket.height && 
        word.yPos + word.height > rocket.yPos
       )
    {
        console.log('========================');
        console.log(`Collision Detect: [${Math.round(word.yPos)}, ${rocket.yPos - 2}]`);

        //// Object collides 
        word.isDisplay = false;
        rocket.isDisplay = false;  


        explosionAudio.play(); 

    }

}// end detectCollision()




/**
    All the initialize objects must be inside the "IF" or outside of this loop. 
 */
function init()
{
 
    //// Initializing the game 
    if (isInit) // Will only do one time 
    {
        //// Generating the chars and rockets. 
        for (let i = 0; i < NUM_OF_CHARS; i++)
        {
            const randomCharIndex = Math.floor(Math.random() * (charList.length - 1)); 

            let chosenChar = charList[randomCharIndex];
            let dy = 0.25; 
            let xPos = getRandom_xPos(); 

            let ch = new AlphaNumericChar(ctx=ctx, id=i, alphaNumericChar=chosenChar, charSize='20', xPos=xPos, yPos=getRandom_yPos(), dy=dy); 
            charObjectArray.push(ch); 

            let rocket = new Bullet(ctx, id=i, alphaNumericChar=chosenChar, xPos=xPos, yPos=CANVAS_HEIGHT, bulletWidth, bulletHeight, isFired=false, dy=(dy * 8)); 
            rocketArray.push(rocket); 

        }// end for 

       
        isInit = false; 

    }// end if 


    //// Main loop for moving the Chars and Rockets
    for (let i = 0; i < NUM_OF_CHARS; i++)
    {
        //// Drawing chars on the Screen.
        if ( charObjectArray[i].isDisplay)
        {
            charObjectArray[i].drawChar(); 
            charObjectArray[i].move(); 

        }// end if 

        //// Looking for char in the rocket array and setting "isFire" to True. So the rocket 
        //// will appear on the screen. 
        if (rocketArray[i].alphaNumericChar == keyDownChar && rocketArray[i].isFired == false)
        {
            rocketArray[i].isFired = true; 
            
            
            shootingAudio.play();       // Adding shooting sound
            // console.log(`Found: ${keyDownChar}`);
            //// Reset the char 
            keyDownChar = ''; 

        }// end if
        
        //// Drawing the rockets on the screen
        if (rocketArray[i].isFired &&  rocketArray[i].isDisplay)
        {
            rocketArray[i].drawRocket(); 
            rocketArray[i].move(); 

             //// Detect Collision 
             detectCollision(charObjectArray[i], rocketArray[i]); 
            
        }

        if ((charObjectArray[i].isDisplay == false && rocketArray[i].isDisplay == false) 
            || (charObjectArray[i].yPos > CANVAS_HEIGHT)
        )
        {
            const randomCharIndex = Math.floor(Math.random() * (charList.length - 1)); 

            let chosenChar = charList[randomCharIndex];
            let dy = 0.25; 
            let xPos = getRandom_xPos(); 

            charObjectArray[i].alphaNumericChar = chosenChar; 
            charObjectArray[i].xPos = xPos; 
            charObjectArray[i].yPos = getRandom_yPos(); 
            charObjectArray[i].isDisplay = true; 


            rocketArray[i].alphaNumericChar = chosenChar; 
            rocketArray[i].xPos = xPos; 
            rocketArray[i].yPos = CANVAS_HEIGHT; 
            rocketArray[i].isDisplay = true; 
            rocketArray[i].isFired = false; 
            
        }// end if 

    }// end for 

    
    
}// init()

 
function renderGame()
{
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 

    init(); 

    window.requestAnimationFrame(renderGame); 

}// end renderGame()

//// ============================== Key Pressed Handlers Start ============================================
function keyDownHandler(e)
{
   
    keyDownChar = e.key; 
    // console.log(`Key: `, keyDownChar);

    
}// end keyDownHandler(e)


document.addEventListener('keydown', keyDownHandler, false); 


//// ============================== Key Pressed Handlers  END  ============================================

renderGame(); 