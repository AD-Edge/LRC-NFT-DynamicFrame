const app = () => {
    console.log("Template Created by Alex Delderfield, delta-edge.com/");
    console.log("LRC-NFT-DynamicFrame [https://github.com/AD-Edge/LRC-NFT-DynamicFrame]");
    
    //Setup Canvas and Elements
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    //Get nftBOX values
    nftBOX = document.getElementById('nftBOX');
    style = window.getComputedStyle(nftBOX),
    minCanvas = parseInt(style.getPropertyValue('min-height'));
    maxCanvas = parseInt(style.getPropertyValue('max-height'));
    console.log("Minimum Canvas: " + minCanvas);
    console.log("Maximum Canvas: " + maxCanvas);

    //Find Doco element via ID
    //Doco is a friendly gif in the html layout, to demonstrate some other kind of interactivity
    doco = document.getElementById("doco");

    //Call resize functions on setup so canvas is happy from the start
    resizeToDiv(canvas); 
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

//Min and Max values, set by looking at the CSS values for 'nftBOX' div
var minCanvas;
var maxCanvas;

//Images/icons
var imgScaleIcon = new Image();
imgScaleIcon.src = 'src/canvas_scale.png'

//Setup main variables
var width = 0;
var height = 0;
var renderInterval;

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
    //Handle div stuff
    resizeToDiv(canvas);
    //Doco resize
    resizeDoco();
    repositionDoco();
}

//Primary resize function for canvas
//Keeps all dimensions being used relative to nftBOX
//See nftBOX css for the brains of that part
function resizeToDiv(canvas) {
    //This is needed to preserve image during scaling
    //Resizing the canvas (ie canvas.width = xxx) clears the canvas
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    //Save the canvas on the temp/memory-only canvas
    tempCtx.drawImage(canvas, 0, 0);

    //Width and height will be the same for this template 
    //but will specify individually for the sake of it
    canvas.width = nftBOX.clientWidth;
    canvas.style.width = nftBOX.clientWidth;
    canvas.height = nftBOX.clientHeight;
    canvas.style.height = nftBOX.clientHeight;

    //Reset variables
    width = nftBOX.clientWidth;
    height = nftBOX.clientHeight;

    //Draw saved canvas back right away
    ctx.drawImage(tempCanvas, 0, 0);
}

//Resize Doco Character Icon
function resizeDoco() {
    doco.style.width = docoScale*width + 'px';
    doco.style.height = docoScale*height + 'px';
}
//Update Doco Position
function repositionDoco() {
    doco.style.left = docoX*canvas.width + 'px';
    doco.style.top = docoY*canvas.height + 'px';
}

//Handle Mouse/Touch Events
function handleMouseEvents() {
    canvas.onpointerdown = function(e) {
        //Mouse click if hovering over Doco element
        if(overDoco) {
            docoDrag = true;
            //Set kawaii gif
            doco.src = 'src/doco_hover_ops.gif';
        }
    };
    canvas.onpointermove = function(e) {
        //Refresh mouse pos
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        //Change Doco position on drag event
        if(docoDrag) {
            docoX = ((mouse.x - (docoScale*width)/2) /canvas.width) ;
            docoY = ((mouse.y - (docoScale*height)/2) /canvas.height);
            repositionDoco();
        }
    };
    canvas.onpointerup = function(e) {
        //Reset Doco
        if(docoDrag) {
            docoDrag = false;
            doco.src = 'src/doco_spin_ops.gif'
        }
    };
    canvas.onpointerout = function(e) {
        overDoco = false;
    };
}

//Main Render Loop
function renderLoop() {
    //Refresh canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Title text
    ctx.fillStyle = '#303030';
    ctx.textAlign = "center";
    ctx.font = width/26 + 'px retroPixel';
    ctx.fillText("*DYNAMIC FRAME*", 0.5*width, 0.12*width);
    ctx.fillText("TEMPLATE 0.1", 0.5*width, 0.16*width);
    //Draw custom red text for min/max sizes
    if((width <= minCanvas) || (width >=maxCanvas)) {
        ctx.fillStyle = '#FF4444';
        ctx.fillText(width, 0.60*width, 0.88*width);
    } else {
        ctx.fillStyle = '#303030';
        ctx.fillText(width, 0.60*width, 0.88*width);
    }
    //Display current canvas size
    ctx.fillStyle = '#303030';
    ctx.fillText("SIZE: ", 0.46*width, 0.88*width);
    ctx.fillText("*RESIZE WINDOW*", 0.5*width, 0.92*width);

    //Draw arrows scale icon
    ctx.drawImage(imgScaleIcon, 0, 0, width, height);
    
    //Draw and Calculate select area for Doco
    ctx.beginPath();
    if(docoDrag) {
        ctx.fillStyle = 'rgba(240, 140, 140, 0.4)';
        //determine if mouse is over doco select area
        ctx.rect((docoX*width)+(0.02*width), docoY*width+0, doco.width-(0.04*width), doco.height+(0.01*width));
        ctx.fill();
    } else {
        ctx.rect((docoX*width)+(0.04*width), docoY*width+(0.02*width), doco.width-(0.08*width), doco.height-(0.04*width));
        //determine if mouse is over doco select area
        ctx.fillStyle = ctx.isPointInPath(mouse.x, mouse.y) ? 'rgba(240, 140, 140, 0.75)' : 'rgba(240, 140, 140, 0)';
        ctx.isPointInPath(mouse.x, mouse.y) ? overDoco=true : overDoco=false;
        ctx.fill();
    }

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