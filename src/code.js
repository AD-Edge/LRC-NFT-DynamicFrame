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
    console.log("Minimum Canvas: " + minCanvas);
    console.log("Maximum Canvas: " + maxCanvas);

    //touch and mouse events
    canvas.addEventListener("touchstart", dragStart, false);
    canvas.addEventListener("mousedown", dragStart, false);
    canvas.addEventListener("touchend", dragEnd, false);
    canvas.addEventListener("mouseup", dragEnd, false);
    canvas.addEventListener('pointermove', pointerTouchMove, false);

    //Find Doco example element via ID
    //Doco is a friendly gif in the html layout, to demonstrate some other kind of interactivity
    doco = document.getElementById("doco");

    //Get Delta/link example element
    deltaContainer = document.getElementById("container");

    //Call resize functions on setup so canvas is happy from the start
    resizeToDiv();
    //Setup doco character example
    resizeDoco();
    repositionDoco();

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

//Setup main variables
var width = 0;
var height = 0;
var aspectRatio = 0;
var renderInterval;

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

//Doco Character (interactivity example)
var doco = null;
var overDoco = false;
var docoDrag = false;
var docoScale = 0.25; //Scale Doco here
var docoX = 0.38; //Starting x position of Doco
var docoY = 0.38; //Starting y position of Doco

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
    //Doco resize
    resizeDoco();
    repositionDoco();
}

//Fullscreen functions
function fullScreenEnable() {
    //resize elements
    resizeToDiv();
    resizeDoco();
    repositionDoco();
    //console.log("fullscreen enabled");
}
function fullScreenDisable() {
    //reset constraints 
    nftBOX.style.maxWidth = maxCanvas + 'px';
    nftBOX.style.maxHeight = maxCanvas + 'px';
    nftBOX.style.minWidth = minCanvas + 'px';
    nftBOX.style.minHeight = minCanvas + 'px';

    resizeToDiv();
    resizeDoco();
    repositionDoco();
    //console.log("fullscreen disabled");
}

//Primary resize function for canvas
//Keeps all dimensions being used relative to nftBOX
//See nftBOX css for the brains of that part
function resizeToDiv() {
    //console.log('html width: ' + html.clientWidth + ' height: ' + html.clientHeight); 
    // console.log('html width: ' + html.clientWidth + ' height: ' + html.clientHeight); 
    // console.log('canvas width: ' + canvas.clientWidth + ' height: ' + canvas.clientHeight); 
    // console.log('body width: ' + body.clientWidth + ' height: ' + body.clientHeight);
    
    //This is needed to preserve image during scaling
    //Resizing the canvas (ie canvas.width = xxx) clears the canvas
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    //Save the canvas on the temp/memory-only canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    //Resize nftBOX based on smallest dimension (height vs width)
    //This is our overall 'containment box'
    if(fullScreenToggle) { //Fullscreen MODE
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
            nftBOX.style.width = (html.clientHeight) + 'px';
            nftBOX.style.height = (html.clientHeight) + 'px';
        } else  {
            nftBOX.style.width = (html.clientWidth) + 'px';
            nftBOX.style.height = (html.clientWidth) + 'px';
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
    //console.log('*width: ' + width + ' height: ' + height);
    
    //Draw saved canvas back right away
    ctx.drawImage(tempCanvas, 0, 0);
}

//Resize Doco Character Icon
function resizeDoco() {
    doco.style.width = docoScale*width/aspectRatio + 'px';
    doco.style.height = docoScale*height + 'px';
}
//Update Doco Position
function repositionDoco() {
    doco.style.left = docoX*canvas.width + 'px';
    doco.style.top = docoY*canvas.height + 'px';
}

//Touch and Mouse Functions
function dragStart(e) { //when the drag starts
    if (e.type === "touchstart") { //if its a touchscreen
        //set initial x-cordinate to where it was before drag started
        // initialX = e.touches[0].clientX - xOffset; 
        //set initial y-cordinate to where it was before drag started
        // initialY = e.touches[0].clientY - yOffset; 
    } else { //if its not a touchscreen (mouse) 
    }

    //Mouse click if hovering over Doco element
    if(overDoco) {
        docoDrag = true;
        //Set kawaii gif
        doco.src = 'src/doco_hover_ops.gif';
        //disable delta link (gets in the way when dragging otgherwise)
        deltaContainer.style.pointerEvents = "none";
    }
}
function pointerTouchMove(e) {
    e.preventDefault(); //the user cant do anything else but drag
    //mouse.x = e.clientX;
    //mouse.y = e.clientY;

    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    //Change Doco position on drag event
    if(docoDrag) {
        docoX = ((mouse.x - (docoScale*width)/2) /canvas.width) ;
        docoY = ((mouse.y - (docoScale*height)/2) /canvas.height);
        repositionDoco();
    }
}
//when the drag ends - ie touch or mouse ends
//All activation events while releasing on a hover, ie a 'PRESS' event 
function dragEnd(e) { 
    //Reset Doco
    if(docoDrag) {
        docoDrag = false;
        doco.src = 'src/doco_spin_ops.gif'
        //re-enable delta link
        deltaContainer.style.pointerEvents = "all";
    }

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
}

//Todo - handle pointer leaving canvas
// canvas.onpointerout = function(e) {
//     overDoco = false;
// };

//Draw and Calculate select area Fullscreen button
function drawFullScreenButton() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(100, 100, 240, 0.25)';
    ctx.rect(width-80, height-80, 70, 70);
    //determine if mouse is over select area
    ctx.isPointInPath(mouse.x, mouse.y) ? fullScreenOver=true : fullScreenOver=false;
    ctx.fill();

    if(fullScreenOver) {
        ctx.rect(width-80, height-80, 70, 70);
        //determine if mouse is over doco select area
        ctx.fillStyle = ctx.isPointInPath(mouse.x, mouse.y) ? 'rgba(100, 140, 240, 0.5)' : 'rgba(100, 140, 240, 0)';
        ctx.fill();
    }

    //draw fullscreen button in various states
    if(fullScreenToggle) {
        ctx.drawImage(imgFullScreenClose, width-80, height-80, 70, 70);
        //console.log("aspect ratio: " + aspectRatio);
    } else {
        ctx.drawImage(imgFullScreenOpen, width-80, height-80, 70, 70);
        //console.log("aspect ratio: " + aspectRatio);
    }
}

//Main Render Loop
//Draw to canvas here
function renderLoop() {
    //Refresh canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw arrows scale icon (with opacity)
    ctx.globalAlpha = 0.5;
    ctx.drawImage(imgScaleIcon, 0, 0, width, height);
    ctx.globalAlpha = 1;
    
    //Draw Title text
    ctx.fillStyle = '#303030';
    ctx.textAlign = "center";
    ctx.font = height/26 + 'px retroPixel';
    ctx.fillText("*DYNAMIC FRAME*", 0.5*width, 0.12*height);
    ctx.fillText("TEMPLATE 0.1.5", 0.5*width, 0.16*height);
    //Draw custom red text for min/max sizes
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
    ctx.fillStyle = '#303030';
    ctx.fillText("*RESIZE WINDOW*", 0.5*width, 0.92*height);

    //Draw and Calculate select area for Doco
    ctx.beginPath();
    if(docoDrag) {
        ctx.fillStyle = 'rgba(240, 140, 140, 0.4)';
        //determine if mouse is over doco select area
        ctx.rect((docoX*width)+(0.02*width), docoY*height+0, doco.width-(0.04*width), doco.height+(0.01*height));
        ctx.fill();
    } else {
        ctx.rect((docoX*width)+(0.04*width), docoY*height+(0.02*height), doco.width-(0.08*width), doco.height-(0.04*height));
        //determine if mouse is over doco select area
        ctx.fillStyle = ctx.isPointInPath(mouse.x, mouse.y) ? 'rgba(240, 140, 140, 0.75)' : 'rgba(240, 140, 140, 0)';
        ctx.isPointInPath(mouse.x, mouse.y) ? overDoco=true : overDoco=false;
        ctx.fill();
    }

    drawFullScreenButton();

    //debug mouse/touch pos
    ctx.globalAlpha = 1.0; //reset global alpha
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
}

//Kick off app function when initial HTML document loaded
document.addEventListener("DOMContentLoaded", app);