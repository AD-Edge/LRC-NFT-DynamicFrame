//Eye Tracking
let eyeScale;
let eyeL_X;
let eyeR_X;
let eye_Y;
let cXL;
let cXR;
let cYL;
let cYR;
var loopyScale = 1.00; //still glitches
var loopyX = 0.0;
var loopyY = 0.0;

function calcDrawEyes() {
    var eyeWidthL = ((imgEyeL.width/2)*loopyScale)/2; //can split into x/y if needed
    var eyeWidthR = ((imgEyeR.width/2)*loopyScale)/2; //can split into x/y if needed
    //LEFT EYE
    //calc angle between mouse and eye center
    const xDiffL = ((eyeL_X + eyeWidthL) - mouse.x);
    const yDiffL = ((eye_Y + eyeWidthL) - mouse.y);
    const angleL = Math.atan2(yDiffL, xDiffL) - Math.PI;
    if (!isNaN(angleL)) {
        // calculate the point on the circumference of the eye
        cXL = ((eyeWidthL/5) * Math.cos(angleL)) * (width/650); 
        cYL = ((eyeWidthL/5) * Math.sin(angleL)) * (width/650);
        //ctx.drawImage(imgEyeL, cXL + eyeL_X, cYL + eye_Y, eyeScale, eyeScale);
    }
    //RIGHT EYE
    //calc angle between mouse and eye center
    const xDiffR = ((eyeR_X + eyeWidthR) - mouse.x);
    const yDiffR = ((eye_Y + eyeWidthR) - mouse.y);
    const angleR = Math.atan2(yDiffR, xDiffR) - Math.PI;
    if (!isNaN(angleR)) {
        // calculate the point on the circumference of the eye
        cXR = ((eyeWidthR/5) * Math.cos(angleR)) * (width/650);
        cYR = ((eyeWidthR/5) * Math.sin(angleR)) * (width/650);
        //ctx.drawImage(imgEyeR, cXR + eyeR_X, cYR + eye_Y, eyeScale, eyeScale);
    }
}