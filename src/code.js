const app = () => {
    console.log("Template Created by Alex Delderfield, delta-edge.com/");
    console.log("LRC-NFT-DynamicFrame [https://github.com/AD-Edge/LRC-NFT-DynamicFrame]");
    
    //Setup Canvas and Elements
    html = document.documentElement;
    body = document.body;
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    nftBOX = document.getElementById('nftBOX');
    style = window.getComputedStyle(nftBOX);
    //Find Doco example element via ID
    //Doco is a friendly gif in the html layout, to demonstrate some other kind of interactivity
    doco = document.getElementById("doco");
    //Get Delta/link example element
    deltaContainer = document.getElementById("container");
    
    //Retrieve and save values needed
    minCanvas = parseInt(style.getPropertyValue('min-height'));
    maxCanvas = parseInt(style.getPropertyValue('max-height'));
    console.log("Minimum Canvas: " + minCanvas);
    console.log("Maximum Canvas: " + maxCanvas);

    //touch and mouse events
    canvas.addEventListener("pointerdown", dragStart, false);
    canvas.addEventListener("pointerup", dragEnd, false);
    canvas.addEventListener('pointermove', pointerTouchMove, false);

    //Call resize functions on setup so canvas is happy from the start
    resizeToDiv();
    //Setup doco character example
    if(doco) {
        resizeDoco();
        repositionDoco();
    }

    //Preload custom font and kick off main processes
    var f = new FontFace('retroPixel', 'url(./src/EarlyGameBoy.ttf)');
    f.load().then(function(font) {
        //Ready to use the font in a canvas context
        console.log('*Custom Font Loaded Successfully*');
        //Add font on the html page
        document.fonts.add(font);
        //Kick off main panel setup
        startPANEL();
    });
};

//Setup main variables
var width = 0;
var height = 0;
var aspectRatio = 0;
var renderInterval;
var eyeInterval;

//Min and Max values, set by looking at the CSS values for 'nftBOX' div
var minCanvas;
var maxCanvas;

//Images/icons
var imgScaleIcon = new Image();
imgScaleIcon.src = 'src/canvas_scale.png'
//Load images for fullscreen toggle button
var imgFullScreenOpen = new Image();
var imgFullScreenClose = new Image();
imgFullScreenOpen.src = 'src/fullscreenOpen.png';
imgFullScreenClose.src = 'src/fullscreenClose.png';
var fullScreenToggle = false;
var fullScreenOver = false;

//eye tracking example 
let imgEyeL = new Image();
let imgEyeR = new Image();
let imgDocoBlank = new Image();
imgEyeL.src = 'src/eye.png'
imgEyeR.src = 'src/eye.png'
imgDocoBlank.src = 'src/doco_blank.png'

var pad, xLoc, yLoc, xScale;

//Make a memory only canvas for redraw 
var tempCanvas = document.createElement('canvas');
var tempCtx = tempCanvas.getContext('2d');

//Store mouse position
const mouse = { x: 0, y: 0 };

//Called whenever window resizes
window.onresize = function()
{
    if(fullScreenToggle) {
        fullScreenEnable();
    } else {
        resizeToDiv();
    }
    //Doco resize
    if(doco) {
        resizeDoco();
        repositionDoco();
    }
}

//Todo? - handle pointer leaving canvas
// canvas.onpointerout = function(e) {
//     overDoco = false;
// };

//Draw and Calculate select area Fullscreen button
function drawFullScreenButton() {
    pad = (width*0.125);
    //clamp padding amount to reasonable levels
    pad = Math.min(Math.max(pad, 25), 70);
    xLoc = width-pad;
    yLoc = height-pad;
    xScale = 0.10*(width*0.75);
    //clamp button from going outside of the range 16 -> 54
    xScale = Math.min(Math.max(xScale, 16), 54);

    //draw and check fullscreen button
    checkIfOverFullScreen();
    if(fullScreenOver) {
        ctx.fillStyle = 'rgba(100, 100, 240, 0.25)';
        ctx.rect(xLoc, yLoc, xScale, xScale);
        //determine if mouse is over doco select area
        ctx.fillStyle = ctx.isPointInPath(mouse.x, mouse.y) ? 'rgba(100, 140, 240, 0.5)' : 'rgba(100, 140, 240, 0)';
        ctx.fill();
    }

    //draw fullscreen button in various states
    if(fullScreenToggle) {
        if(fullScreenOver) {
            ctx.drawImage(imgFullScreenClose, xLoc, yLoc, xScale, xScale);
        } else {
            ctx.globalAlpha = 0.15;
            ctx.drawImage(imgFullScreenClose, xLoc, yLoc, xScale, xScale);
            ctx.globalAlpha = 1;
        }
    } else {
        if(fullScreenOver) {
            ctx.drawImage(imgFullScreenOpen, xLoc, yLoc, xScale, xScale);
        } else {
            ctx.globalAlpha = 0.15;
            ctx.drawImage(imgFullScreenOpen, xLoc, yLoc, xScale, xScale);
            ctx.globalAlpha = 1;
        }
    }
}

function checkIfOverFullScreen() {
    ctx.beginPath();
    ctx.rect(xLoc, yLoc, xScale, xScale);
    ctx.fillStyle = 'rgba(100, 100, 240, 0.25)';
    //determine if mouse is over select area
    ctx.isPointInPath(mouse.x, mouse.y) ? fullScreenOver=true : fullScreenOver=false;
    ctx.fill();
}

//Main Render Loop
//Draw to canvas here
function renderLoop() {
    //Refresh canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw arrows scale icon (with opacity)
    ctx.globalAlpha = 1;
    ctx.drawImage(imgScaleIcon, 0, 0, width, height);
    // ctx.drawImage(imgDocoBlank, width*0.35, height*0.35, width*0.3, width*0.3);
    ctx.globalAlpha = 1;
    
    //Draw Title text
    ctx.fillStyle = '#303030';
    ctx.textAlign = "center";
    ctx.font = height/26 + 'px retroPixel';
    ctx.fillText("*DYNAMIC FRAME*", 0.5*width, 0.12*height);
    ctx.fillText("TEMPLATE 0.1.9", 0.5*width, 0.16*height);

    //Draw custom red text for min/max sizes
    ctx.fillStyle = '#303030';
    ctx.fillText("*RESIZE WINDOW*", 0.5*width, 0.92*height);
    if(fullScreenToggle) {
        ctx.fillStyle = '#FF4444';
        ctx.fillText('FULLSCREEN', 0.5*width, 0.88*height);
    } else {
        if((width <= minCanvas) || (width >=maxCanvas)) {
            ctx.fillStyle = '#FF4444';
            ctx.fillText(width, 0.60*width, 0.88*height);
        } else {
            ctx.fillStyle = '#303030';
            ctx.fillText(width, 0.60*width, 0.88*height);
        }
        //Display current canvas size
        ctx.fillStyle = '#303030';
        ctx.fillText("SIZE: ", 0.46*width, 0.88*height);
        
    }

    //Eye stuff
    //recalc eye variables
    // eyeScale = (loopyScale/14) * width;
    // eyeL_X = (width*0.435);
    // eyeR_X = (width*0.50);
    // eye_Y = (height*0.42);
    // ctx.drawImage(imgEyeL, cXL + eyeL_X, cYL + eye_Y, eyeScale, eyeScale);
    // ctx.drawImage(imgEyeR, cXR + eyeR_X, cYR + eye_Y, eyeScale, eyeScale);

    //Draw select-area for Doco
    if(!docoDrag && doco) {
        checkIfOverDoco();
    }

    //Draw the button which toggles fullscreen mode
    drawFullScreenButton();

    //debug mouse/touch pos - final draw call so it draws on top
    ctx.globalAlpha = 0.5; //reset global alpha
    ctx.beginPath();
    ctx.fillStyle = 'rgba(240, 140, 140, 1)';
    //console.log("mouse: " + mouse.x + ", " + mouse.y);
    ctx.arc(mouse.x, mouse.y, height*0.02, 0, 2*Math.PI);
    ctx.fill();
    
}

//Start overall processeses
function startPANEL() {
    //clear render interval if running
    clearInterval(renderInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //set off render process
    renderInterval = setInterval(renderLoop, 20);

    // eyeInterval = setInterval(calcDrawEyes, 50);
}

//Kick off app function when initial HTML document loaded
document.addEventListener("DOMContentLoaded", app);