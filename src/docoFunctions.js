//Doco Character (interactivity example)
var doco = null;
var overDoco = false;
var docoDrag = false;
var docoScale = 0.25; //Scale Doco here
var docoX = 0.38; //Starting x position of Doco
var docoY = 0.38; //Starting y position of Doco


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

function checkIfOverDoco() {
    ctx.beginPath();
    ctx.rect(docoX*width + (doco.width*0.16), docoY*height + (doco.height*0.075), 
                                        doco.width-(doco.width*0.33), doco.height-(doco.height*0.15));
    //determine if mouse is over doco select area
    ctx.fillStyle = ctx.isPointInPath(mouse.x, mouse.y) ? 'rgba(240, 140, 140, 0.75)' : 'rgba(240, 140, 140, 0)';
    ctx.isPointInPath(mouse.x, mouse.y) ? overDoco=true : overDoco=false;
    ctx.fill();
}