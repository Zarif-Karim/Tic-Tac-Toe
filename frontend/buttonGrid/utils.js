let player = 1; //have to change this eventually

document.getElementById("start-new").onclick = startNewBoard;

//start new board
async function startNewBoard() {
    await fetch(`http://localhost:5000?game=new`)
    .then(resp=>resp.text())
    .then(data=>{
        console.log(data);
        clearBoard();
        player = 1;
        updatePlayerPanelDisplay(player);
        startTimer();
    });
}
    
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


//adding click events to all the board buttons to send update request to server
function setScreenBoardClickEvents(displayBoard, remove = false){
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].onclick = 
            remove ? null : ()=> updateBoard(i,j,displayBoard);
        }
    }
}