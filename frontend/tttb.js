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

async function getData(i,j,p){
    const resp = await fetch(`http://localhost:5000?r=${i}&c=${j}&p=${player}`);
    return await resp.json();
}

async function updateBoard(i,j,displayBoard){
    let data = await getData(i,j,player);
    console.log(data);
    if(data.update === "success"){
        for(let i in data.board){
            for(let j in data.board[i]){
                displayBoard[i][j].children[0].
                innerText = data.board[i] == 1 ? 'X' : 'O';
                player += 1;
            }
        }
    }
    if(player > 2) player = 1;
}

function setScreenBoardClickEvents(displayBoard){
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].onclick = 
                ()=> updateBoard(i,j,displayBoard);
        }
    }
}

const displayBoard = getBoard();
let player = 1;
setScreenBoardClickEvents(displayBoard);

//start new board
async function startNewBoard() {
    fetch(`http://localhost:5000?game=new`)
    .then(resp=>resp.text())
    .then(data=>console.log(data));
}


