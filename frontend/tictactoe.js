

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");
canvas.width  = 400;
canvas.height = 400;

const board = new Board();
const animator = new Animator(canvas);
animator.printBoard();

let player = 1;

const mouseListeners = () =>
{
    canvas.onclick=(event)=>{
        const {x,y} = animator.getCellAt(event.x, event.y);
        if(board.update(x,y,player)){
            player += 1;
            animator.animateCells({x:event.x, y:event.y},board.board);    
        }
        if(player > 2) player = 1;
        //animator.printBoard();
    }

    canvas.onmousemove=(event)=>{
        animator.animateCells({x:event.x, y:event.y},board.board);
    }
    
    canvas.onmouseleave=(event)=>{
        animator.animateCells({x:event.x, y:event.y},board.board,true);
    }
};

mouseListeners();

onresize = (event)=> {
    //animator.offset = (window.innerWidth-this.width)/2;
    //console.log(canvas.width,canvas.height);
    //location.replace(document.URL);
    let zoom = (( window.outerWidth - 10 ) / window.innerWidth) * 100;
    console.log(zoom);
};