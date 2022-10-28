document.getElementById("start-new").onclick = ()=>{
    socket.emit('newgame');
};

//start new board
async function startNewBoard(_turnOf,rtp1,rtp2) {
    document.getElementById("start-new").hidden = true;
    clearBoard();
    setColorOfBoard('black','white');
    TIME_PX = rtp1;
    TIME_PO = rtp2;
    turnOf = _turnOf;
    updatePlayerPanelDisplay();
    setScreenBoardClickEvents(displayBoard/*,player*/);
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

function updateBoard(board,_turnOf){
    turnOf = _turnOf;
    updatePlayerPanelDisplay(); //have to change this eventually

    for(let i in board){
        for(let j in board[i]){
            if(board[i][j] !== 0) {
                displayBoard[i][j].children[0].
                innerText = board[i][j] == 1 ? 'X' : 'O';
            }
        }
    }
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
function setScreenBoardClickEvents(displayBoard/*, player*/, remove = false){
    console.log('Onclick',player)
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].onclick = 
            remove ? null : 
            ()=> {
                if(turnOf === player) 
                    socket.emit('move', i,j,player);
            }
        }
    }
}

function setColorOfBoard(fontColor,backgroundColor)
{
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            if(backgroundColor)
                displayBoard[i][j].style.backgroundColor = backgroundColor;
            if(fontColor)
                displayBoard[i][j].children[0].style.color = fontColor;
        }
    }

}

function finishGame(winData){
    console.log("Finished", winData);
    //dont show button for spectators
    if(player !== 3) document.getElementById("start-new").hidden = false;
    setScreenBoardClickEvents(displayBoard,remove=true);

    //hide green indicator
    turnpx.style.display = 'none';
    turnpo.style.display = 'none';


    if(winData.winner === 'X'){
        whopx.innerText = 'Winner';
        whopo.innerText = 'Looser'
    }
    else if(winData.winner === 'O') {
        whopo.innerText = 'Winner';
        whopx.innerText = 'Looser'
    } else {
        whopx.innerText = 'Draw';
        whopo.innerText = 'Draw'
    }

    //grey out all letters
    setColorOfBoard('grey','#d9d9d9');

    //highlight winning path
    if('winPath' in winData){
        for(let [x,y] of winData.winPath){
            displayBoard[x][y].children[0].style.color = 'red';
        }
    }

    TIME_PX = winData.rtp1;
    TIME_PO = winData.rtp2;

}

function updatePlayerPanelDisplay() {
    if(player === 1)
    {
        whopx.innerText = turnOf === 1 ? "Your Turn" : "Waiting";
        whopo.innerText = turnOf === 1 ? "Waiting" : "Opponent Turn";
    }
    else if(player === 2) 
    {
        whopx.innerText = turnOf === 2 ?  "Waiting" : "Opponent Turn";
        whopo.innerText = turnOf === 2 ?  "Your Turn" : "Waiting";
    } 
    else
    {
        whopx.innerText = turnOf === 1 ?  "Playing" : "Waiting";
        whopo.innerText = turnOf === 1 ?  "Waiting" : "Playing";
    }


    turnpx.style.display = turnOf === 1 ? 'block' : 'none';
    turnpo.style.display = turnOf === 1 ? 'none' : 'block';

}

function log(msg)
{
    const cc = document.getElementById('consolelog');
    const p = document.createElement('p');
    p.innerText = msg;
    cc.appendChild(p);
}