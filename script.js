
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
imageObj.src = './Assets/imgs/rocket_12.png';


//// Characters List 
const charList = [
                    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
                    "U", "V", "W", "X", "Y", "Z", 
                    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                 ]; 

let charObjectArray = [];
 



// console.log(`Canvas: ${CANVAS_WIDTH}, ${CANVAS_HEIGHT}`);

/* Char must be A-Z a-z and 0-9 */
class AlphaNumericChar
{

 
    constructor(ctx, id, alphaNumericChar='A', charSize='20px', xPos, yPos=30, dy=0.5)
    {
        this.ctx = ctx;                     // Canvas 

        this.id = id;                       // Id : too search. Index 
        this.alphaNumericChar = alphaNumericChar; 
        this.charSize = charSize; 
        this.xPos = xPos; 
        this.yPos = yPos; 
        
        this.dy = dy;                       // Dropping top to bottom of y coordinates 
    }// end constructor()

    drawChar()
    {
        // const xPos = Math.random() * CANVAS_WIDTH; 
        // const yPos = 30; 
        this.ctx.beginPath(); 
        this.ctx.fillStyle = '#00FF00'; 

        this.ctx.font = `${this.charSize } Arial`; 
        this.ctx.fillText(`${this.alphaNumericChar}`, this.xPos, this.yPos); 
        this.ctx.closePath();

    }// end drawChar()

    move()
    {
        this.yPos += this.dy; 
    }


}// end class CharAlphaNumeric

// const charSize='20px'; 
// function drawChar()
// {
//     const xPos = Math.random() * CANVAS_WIDTH; 
//     const yPos = 30; 

//     ctx.font = `${charSize} Arial`; 
//     ctx.fillText("A", xPos, yPos); 
// }// end drawChar()


// let bullet_X = CANVAS_WIDTH; 
// let bullet_Y = CANVAS_HEIGHT; 

class Bullet 
{
    constructor(ctx, xPos=200, yPos=200, bulletWidth, bulletHeight, isFired=false, dy)
    {
        this.ctx = ctx; 

        this.xPos = xPos; 
        this.yPos = yPos; 

        

        this.bulletWidth = bulletWidth; 
        this.bulletHeight = bulletHeight; 

        this.isFired = isFired;             // To shoot the alphabets
        this.dy = dy; 
        


    }// end constructor()

    
    drawBullet()
    {

        this.ctx.beginPath(); 
        this.ctx.fillStyle = '#FF0000'; 

        // this.ctx.fillRect(this.xPos / 2, this.yPos - (this.bulletHeight * 2), this.bulletWidth, this.bulletHeight); 
        this.ctx.fillRect(this.xPos , this.yPos, this.bulletWidth, this.bulletHeight); 

        this.ctx.closePath();

    }// end drawCanon()

    drawRocket()
    {

        this.ctx.drawImage(imageObj, this.xPos, this.yPos);

    }// end drawCanon()


    move()
    {
        this.yPos -= this.dy;  
        // console.log(`Bullet yPos: ${this.yPos}`);
    }

    
}// end class Bullet 



function getRandom_xPos()
{
    return Math.random() * CANVAS_WIDTH; 
}// end getRandom_xPos()

function getRandom_yPos()
{
    return (Math.random() * 100) - 50; 
}// end getRandom_yPos()


let isInit = true; 
let isRocketFire = false; 

let bullet = new Bullet(ctx, xPos=getRandom_xPos(), yPos=CANVAS_HEIGHT, bulletWidth, bulletHeight, isFired=false, 1.5); 

/**
    All the initialize objects must be inside the "IF" or outside of this loop. 
 */
function init()
{
 
    if (isInit) // Will only do one time 
    {
        for (let i = 0; i < NUM_OF_CHARS; i++)
        {
            const randomCharIndex = Math.floor(Math.random() * (charList.length - 1)); 

            let ch = new AlphaNumericChar(ctx=ctx, id=i, alphaNumericChar=charList[randomCharIndex], charSize='20px', xPos=getRandom_xPos(), yPos=getRandom_yPos(), dy=0.25); 
            charObjectArray.push(ch); 
        }// end for 

       


        isInit = false; 
    }// end if 

    for (let i=0; i < NUM_OF_CHARS; i++)
    {
        charObjectArray[i].drawChar(); 
        charObjectArray[i].move(); 
    }// end for 


    // bullet.drawRocket(); 
    // bullet.move(); 

    if (isRocketFire)
    {
        // bullet.drawBullet(); 
        bullet.drawRocket(); 
        bullet.move(); 
    }
    

    

    
    
}// init()

 
function renderGame()
{
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 

    // drawChar(); 
    // ch_1.drawChar(); 
    // ch_1.move(); 

 

    
    init(); 

    // drawBullet(); 
    


    
    window.requestAnimationFrame(renderGame); 

}// end renderGame()

//// ============================== Key Pressed Handlers Start ============================================
let rightPressed = true; 
function keyDownHandler(e)
{
    // if (e.key == 'Right' || e.key == "ArrowRight")
    // {
    //     rightPressed = true; 
    //     console.log(`Right Key Down: ${rightPressed}`);

    // }
    isRocketFire = true; 
    console.log(`Rocked Fired : ${isRocketFire}`);
}// end keyDownHandler(e)

function keyUpHandler(e)
{
    // if (e.key == 'Right' || e.key == "ArrowRight")
    // {
    //     rightPressed = false; 
    //     console.log(`Right Key Up: ${rightPressed}`);
    // }
    isRocketFire = false; 

}// end keyUpHandler(e)


document.addEventListener('keydown', keyDownHandler, false); 
// document.addEventListener('keyup', keyUpHandler, false); 



//// ============================== Key Pressed Handlers  END  ============================================

// init(); 
renderGame(); 