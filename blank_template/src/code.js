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
    
    //Retrieve and save values needed
    minCanvas = parseInt(style.getPropertyValue('min-height'));
    maxCanvas = parseInt(style.getPropertyValue('max-height'));
    padding = parseInt(window.getComputedStyle(body, null).getPropertyValue('padding'));
    paddingVal = padding;
    console.log("Minimum Canvas: " + minCanvas);
    console.log("Maximum Canvas: " + maxCanvas);
    console.log("Padding set to: " + padding);

    //Call resize functions on setup so canvas is happy from the start
    resizeToDiv();

    //Preload custom font and kick off main processes
    var f = new FontFace('retroPixel', 'url(./src/EarlyGameBoy.ttf)');
    f.load().then(function(font) {
        // Ready to use the font in a canvas context
        console.log('*Custom Font Loaded Successfully*');
        // Add font on the html page
        document.fonts.add(font);

        //Kick off main panel setup
        startPANEL();
    });
};

//Min and Max values, set by looking at the CSS values for 'nftBOX' div
var minCanvas;
var maxCanvas;
var padding;

//Load images for fullscreen toggle button
var imgFullScreenOpen = new Image();
var imgFullScreenClose = new Image();
imgFullScreenOpen.src = 'src/fullscreenOpen.png';
imgFullScreenClose.src = 'src/fullscreenClose.png';

//Setup main variables
var width = 0;
var height = 0;
var paddingVal = 0;
var aspectRatio = 0;
var renderInterval;

var fullScreenToggle = false;
var fullScreenOver = false;

// Make a memory only canvas for redraw 
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
}

//Fullscreen functions
function fullScreenEnable() {
    //remove padding for fullscreen
    paddingVal = 0;
    //resize elements
    resizeToDiv();
}
function fullScreenDisable() {
    //add padding back
    paddingVal = padding;
    //reset constraints 
    body.style.padding = paddingVal + 'px';
    nftBOX.style.maxWidth = maxCanvas + 'px';
    nftBOX.style.maxHeight = maxCanvas + 'px';
    nftBOX.style.minWidth = minCanvas + 'px';
    nftBOX.style.minHeight = minCanvas + 'px';

    resizeToDiv();
}

//Primary resize function for canvas
//Keeps all dimensions being used relative to nftBOX
//See nftBOX css for the brains of that part
function resizeToDiv() {
    //console.log('html width: ' + html.clientWidth + ' height: ' + html.clientHeight); 
    console.log('html width: ' + html.clientWidth + ' height: ' + html.clientHeight); 
    console.log('canvas width: ' + canvas.clientWidth + ' height: ' + canvas.clientHeight); 
    console.log('body width: ' + body.clientWidth + ' height: ' + body.clientHeight);
    
    //This is needed to preserve image during scaling
    //Resizing the canvas (ie canvas.width = xxx) clears the canvas
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    //Save the canvas on the temp/memory-only canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    //Resize nftBOX based on smallest dimension (height vs width)
    //This is our overall 'containment box'
    if(fullScreenToggle) { //Fullscreen MODE
        //unset padding on html body
        body.style.padding = paddingVal + 'px';
        //Unset constraints on nftBOX
        nftBOX.style.maxWidth = '100%';
        nftBOX.style.maxHeight = '100%';
        nftBOX.style.minWidth = '100%';
        nftBOX.style.minHeight = '100%';

        //Set to max available dimension
        nftBOX.style.width = (html.clientWidth) + 'px';
        nftBOX.style.height = (html.clientHeight) + 'px';
    } else { //If NOT-Fullscreen MODE
        if (html.clientHeight < html.clientWidth) {
            nftBOX.style.width = (html.clientHeight-(paddingVal*2)) + 'px';
            nftBOX.style.height = (html.clientHeight-(paddingVal*2)) + 'px';
        } else  {
            nftBOX.style.width = (html.clientWidth-(paddingVal*2)) + 'px';
            nftBOX.style.height = (html.clientWidth-(paddingVal*2)) + 'px';
        }
    }

    //Reset canvas dimensions
    canvas.width = nftBOX.clientWidth;
    canvas.style.width = nftBOX.clientWidth;
    canvas.height = nftBOX.clientHeight;
    canvas.style.height = nftBOX.clientHeight;

    //Reset variables
    width = nftBOX.clientWidth;
    height = nftBOX.clientHeight;
    aspectRatio = width/height;
    console.log('*width: ' + width + ' height: ' + height);
    
    //Draw saved canvas back right away
    ctx.drawImage(tempCanvas, 0, 0);
}

//Handle Mouse/Touch Events
function handleMouseEvents() {
    canvas.onpointerdown = function(e) {
        if(fullScreenOver) {
            //toggle to fullscreen
            if(!fullScreenToggle) {
                fullScreenToggle = true;
                fullScreenEnable();
            } else {
                fullScreenToggle = false;
                fullScreenDisable();
            }
        }
    };
    canvas.onpointermove = function(e) {
        //Refresh mouse pos
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
    };
    canvas.onpointerup = function(e) {
    
    };
    canvas.onpointerout = function(e) {

    };
}

//Draw and Calculate select area Fullscreen button
function drawFullScreenButton() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(100, 100, 240, 0.33)';
    ctx.rect(1*width-(0.11*width/aspectRatio), 0.89*height, 0.10*width/aspectRatio, 0.10*height);
    //determine if mouse is over select area
    ctx.isPointInPath(mouse.x, mouse.y) ? fullScreenOver=true : fullScreenOver=false;
    ctx.fill();
    if(fullScreenOver) {
        ctx.rect(1*width-(0.11*width/aspectRatio), 0.89*height, 0.10*width/aspectRatio, 0.10*height);
        //determine if mouse is over doco select area
        ctx.fillStyle = ctx.isPointInPath(mouse.x, mouse.y) ? 'rgba(100, 140, 240, 0.5)' : 'rgba(100, 140, 240, 0)';
        ctx.fill();
    }
    //draw fullscreen button in various states
    if(fullScreenToggle) {
        ctx.drawImage(imgFullScreenClose, 1*width-(0.11*width/aspectRatio), 0.89*height, 0.10*width/aspectRatio, 0.10*height);
        //console.log("aspect ratio: " + aspectRatio);
    } else {
        ctx.drawImage(imgFullScreenOpen, 1*width-(0.11*width/aspectRatio), 0.89*height, 0.10*width/aspectRatio, 0.10*height);
        //console.log("aspect ratio: " + aspectRatio);
    }
}

//Main Render Loop
//Draw to canvas here
function renderLoop() {
    //Refresh canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Title text
    ctx.fillStyle = '#303030';
    ctx.textAlign = "center";
    ctx.font = height/26 + 'px retroPixel';
    ctx.fillText("*BLANK TEMPLATE*", 0.5*width, 0.12*height);

    drawFullScreenButton();
}

//Start overall processeses
function startPANEL() {
    //clear render interval if running
    clearInterval(renderInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //kick off mouse checks
    handleMouseEvents();
    //set off render process
    renderInterval = setInterval(renderLoop, 20);
}

//Kick off app function when initial HTML document loaded
document.addEventListener("DOMContentLoaded", app);