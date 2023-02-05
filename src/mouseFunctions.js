//Touch and Mouse Functions
//Click down/Drag starts
function dragStart(e) { 
    //the user cant do anything else but drag
    e.preventDefault(); 
    //update the mouse location relative to canvas area
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    //debug mouse/touch CLICK pos
    ctx.globalAlpha = 1.0; //reset global alpha
    ctx.beginPath();
    ctx.fillStyle = 'rgba(140, 140, 240, 1)';
    //console.log("mouse: " + mouse.x + ", " + mouse.y);
    ctx.arc(mouse.x, mouse.y, height*0.06, 0, 2*Math.PI);
    ctx.fill();
    
    //refresh whether we are over clickable objects
    //this wont work if its only checking via the *later* render function highlight
    if(doco) { checkIfOverDoco(); }
    checkIfOverFullScreen();
    
    //Mouse click if hovering over Doco element
    if(overDoco) {
        docoDrag = true;
        //Set kawaii gif
        doco.src = 'src/doco_hover_ops.gif';
        //disable delta link (gets in the way when dragging otgherwise)
        deltaContainer.style.pointerEvents = "none";
    }
    
    //Mouse click if hovering over Fullscreen element
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
//When the drag ends - ie touch or mouse ends
//All activation events while releasing on a hover, ie a 'PRESS' event 
function dragEnd() { 
    //Reset Doco at the end of the drag event
    if(docoDrag) {
        docoDrag = false;
        doco.src = 'src/doco_spin_ops.gif'
        //re-enable delta link
        deltaContainer.style.pointerEvents = "all";
    }
}
//Handle the pointer moving
//Drag Doco around if selected
function pointerTouchMove(e) {
    //the user cant do anything else but drag
    e.preventDefault(); 
    //update the mouse location relative to canvas area
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    //Change Doco position on drag event
    if(docoDrag) {
        docoX = ((mouse.x - (docoScale*width/aspectRatio)/2) /canvas.width) ;
        docoY = ((mouse.y - (docoScale*height)/2) /canvas.height);
        repositionDoco();
    }
}