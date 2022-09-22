class Animator {
    constructor(canvasElement){
        this.width = canvasElement.width;
        this.height = canvasElement.height;
        this.offset = (window.innerWidth-this.width)/2;
        this.ctx = canvasElement.getContext("2d");

        this.cellWidth = this.width/3 - 20;
        this.cellHeight = this.height/3 - 20;
        this.lastShadedCell = {x:-1,y:-1};

        this.UNFILL = "#f0ffff";
        this.FILL = "#90ffff";
    }

    printBoard() 
    {
        this.drawBoardLines();
    }

    animateCells(curCell,board,mouseLeft=false)
    {
        curCell = this.getCellAt(curCell.x, curCell.y);
        if(mouseLeft) 
        {
            this.shadeCell(this.lastShadedCell,this.UNFILL);
        }
        else 
        {
            if(this.lastShadedCell.x !== curCell.x || this.lastShadedCell.y !== curCell.y) 
                this.shadeCell(this.lastShadedCell,this.UNFILL,board);
            
            this.shadeCell(curCell,this.FILL);
            this.drawBoardSymbol(curCell,board[curCell.x][curCell.y],true);
        }

        if(this.lastShadedCell.x !== -1)
            this.drawBoardSymbol(this.lastShadedCell,board[this.lastShadedCell.x][this.lastShadedCell.y],false);
    
        this.lastShadedCell=curCell;
    }

    getCellCenter(cell){
        return {
            x: (this.width/6) + (this.cellWidth+20)*cell.x,
            y: (this.height/6) + (this.cellHeight+20)*cell.y
        };
    }

    shadeCell(cell,color)
    {
        const {x,y} = this.getCellCenter(cell);

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.rect( 
            x-this.cellWidth/2, y-this.cellHeight/2, 
            this.cellWidth, this.cellHeight
        );
        this.ctx.fill();
    }

    drawBoardLines() 
    {
        const width3rd = this.width/3;
        const height3rd = this.height/3;
        const wm10 = this.width - 10;
        const hm10 = this.height - 10;
        drawLine(this.ctx,width3rd,10,width3rd,hm10);
        drawLine(this.ctx,width3rd*2,10,width3rd*2,hm10);
        drawLine(this.ctx,10,height3rd,wm10,height3rd);
        drawLine(this.ctx,10,height3rd*2,wm10,height3rd*2);
    }

    drawBoardSymbol(cell,value,highlight)
    {
        if(value < 1) return;

        const color = highlight ? "purple" : "blue";
        const {x,y} = this.getCellCenter(cell);
        value === 1 ? this.drawX(x,y,color) : this.drawO(x,y,color);
    }

    drawX(x,y,color)
    {
        const leftX = x-this.cellWidth/2;
        const rightX = x+this.cellWidth/2;
        const topY = y-this.cellHeight/2;
        const bottomY = y+this.cellHeight/2;

        drawLine(this.ctx,leftX,topY,rightX,bottomY,2,color);
        drawLine(this.ctx,rightX,topY,leftX,bottomY,2,color);
    }

    drawO(x,y,color)
    {
        const r = Math.min(this.cellHeight,this.cellWidth)/2;
        drawCircle(this.ctx,x,y,r-3,3,color);
    }

    getCellAt(X,Y)
    {
        const cell = {
            x: -1,
            y: -1
        };

        const width3rd = this.width/3;
        const height3rd = this.height/3;

        if(X < this.offset+width3rd) cell.x = 0;
        else if( X <= this.offset+width3rd*2) cell.x = 1;
        else cell.x = 2;

        if(Y < height3rd) cell.y = 0;
        else if( Y <= height3rd*2) cell.y = 1;
        else cell.y = 2;

        return cell;
    }
};