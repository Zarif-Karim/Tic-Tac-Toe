let player = 1; //have to change this eventually

//start new board
document.getElementById("start-new").onclick = async function startNewBoard() {
    fetch(`http://localhost:5000?game=new`)
    .then(resp=>resp.text())
    .then(data=>{
        console.log(data);
        clearBoard();
    });
};

//getting all the button elemets of the board
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

//sends the move to the server and gets success message and data
async function getData(i,j,p){
    const resp = await fetch(`http://localhost:5000?r=${i}&c=${j}&p=${player}`);
    return await resp.json();
}

function clearBoard()
{
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].children[0].
            innerText = ' '; 
        }
    }
}

async function updateBoard(i,j,displayBoard){
    //make the move
    let data = await getData(i,j,player);
    console.log(data); //debug

    //update board if move successful
    if(data.update === "success"){
        player += 1; //have to change this eventually
        for(let i in data.board){
            for(let j in data.board[i]){
                if(data.board[i][j] !== 0) {
                    displayBoard[i][j].children[0].
                    innerText = data.board[i][j] == 1 ? 'X' : 'O';
                }
            }
        }
    }
    if(player > 2) player = 1; //have to change this eventually
}

//adding click events to all the board buttons to send update request to server
function setScreenBoardClickEvents(displayBoard){
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].onclick = 
                ()=> updateBoard(i,j,displayBoard);
        }
    }
}