//draws a line in the given context
function drawLine(ctx,x1,y1,x2,y2,width=1,color="black",pattern=[]){
    ctx.setLineDash(pattern);
    ctx.lineWidth=width;
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

//draws a line in the given context
function drawCircle(ctx,x,y,r,width=1,color="black"){
    ctx.lineWidth=width;
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
}
