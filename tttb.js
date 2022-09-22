function getBoard(){
    const rows = document.getElementById("board-container").children;
    const b = [];
    for(row of rows){
        const btnRow = [];
        for(col of row.children) {
            btnRow.push(col.children[0]);
        }
        b.push(btnRow);
    }
    return b;  
};

function updateBoard(i,j,displayBoard,dataBoard){
    const update = dataBoard.update(i,j,player);
    const data = JSON.parse(dataBoard.serialize(update,player));
    console.log(data);
    if(data.update === "success"){
        displayBoard[i][j].children[0]
        .innerText = data.board[i][j] === 1 ? 'X' : 'O';
        player += 1;
    }
    if(player > 2) player = 1;
}

function setScreenBoardClickEvents(displayBoard, dataBoard){
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].onclick = 
                ()=> updateBoard(i,j,displayBoard, dataBoard);
        }
    }
}

const displayBoard = getBoard();
let player = 1;
const dataBoard = new Board();
setScreenBoardClickEvents(displayBoard,dataBoard);

