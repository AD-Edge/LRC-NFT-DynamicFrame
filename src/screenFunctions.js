
//Fullscreen functions
function fullScreenEnable() {
    //resize elements
    resizeToDiv();
    if(doco) {
        resizeDoco();
        repositionDoco();
    }
}
function fullScreenDisable() {
    //reset constraints 
    nftBOX.style.maxWidth = maxCanvas + 'px';
    nftBOX.style.maxHeight = maxCanvas + 'px';
    nftBOX.style.minWidth = minCanvas + 'px';
    nftBOX.style.minHeight = minCanvas + 'px';
    //resize elements
    resizeToDiv();
    if(doco) {
        resizeDoco();
        repositionDoco();
    }
}

//Primary resize function for canvas
//Keeps all dimensions being used relative to nftBOX constraints and limits
function resizeToDiv() {
    // console.log('html width: ' + html.clientWidth + ' height: ' + html.clientHeight); 
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
