document.getElementById("start-new").onclick = ()=>{
    socket.emit('newgame');
};

//start new board
async function startNewBoard() {
    clearBoard();
    setColorOfBoard('black','white');
    player = 1;
    TIME_PO = default_time;
    TIME_PX = default_time;
    updatePlayerPanelDisplay(player);
    setScreenBoardClickEvents(displayBoard);
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