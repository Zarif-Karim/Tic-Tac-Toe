document.getElementById("start-new").onclick = ()=>{
    socket.emit('newgame');
};

//start new board
async function startNewBoard() {
    clearBoard();
    setColorOfBoard('black','white');
    TIME_PO = default_time;
    TIME_PX = default_time;
    updatePlayerPanelDisplay(player);
    setScreenBoardClickEvents(displayBoard,player);
    stopTimer();
    startTimer();
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

function updateBoard(board){
    updatePlayerPanelDisplay(player); //have to change this eventually

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
function setScreenBoardClickEvents(displayBoard, player, remove = false){
    console.log('Onclick',player)
    for(let i in displayBoard){
        for(let j in displayBoard[i]){
            displayBoard[i][j].onclick = 
            remove ? null : ()=> socket.emit('move', i,j,player);
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
    stopTimer();
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

}

function updatePlayerPanelDisplay(player) {
    whopx.innerText = player === 1 ? "Your Turn" : "Waiting";
    whopo.innerText = player === 1 ? "Waiting" : "Your Turn";
    
    turnpx.style.display = player === 1 ? 'block' : 'none';
    turnpo.style.display = player === 1 ? 'none' : 'block';

    updateTimerDisplay();
}

function updateTimerDisplay(){
    timepx.innerHTML = TIME_PX;
    timepo.innerHTML = TIME_PO;
}

function startTimer(){
    INTERVAL_ID = setInterval(() => {
        player === 1 ? --TIME_PX : --TIME_PO;
        updateTimerDisplay();
        if(TIME_PO === 0 || TIME_PX === 0) {
            finishGame({winner: TIME_PO === 0 ? 'X' : 'O'});
        }
    }, 1000);
}

function stopTimer(){
    if(INTERVAL_ID){
        clearInterval(INTERVAL_ID);
        INTERVAL_ID = null;
    }
}

function log(msg)
{
    const cc = document.getElementById('consolelog');
    const p = document.createElement('p');
    p.innerText = msg;
    cc.appendChild(p);
}