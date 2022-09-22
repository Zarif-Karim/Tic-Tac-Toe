//globals
const displayBoard = getBoard();
const whopx = document.getElementById("who-px");
const whopo = document.getElementById("who-po");
const turnpx = document.getElementById("turn-px");
const turnpo = document.getElementById("turn-po");
const timepx = document.getElementById("time-px");
const timepo = document.getElementById("time-po");

//remaining time in seconds, gets updated from server eventually
//currently doing it client side through functions
let TIME_PX = 15;
let TIME_PO = 15;

startNewBoard();

//event listeners
setScreenBoardClickEvents(displayBoard);

//to-do
/*
    show win message
    disable button listeners on game finish
    update reset button to implement required actions to reset game.
    update player who message
    show/hide the green turn signal based on player
    timer function
    loses if timer finishes
*/
async function updateBoard(i,j,displayBoard){
    //make the move
    let data = await getData(i,j,player);
    console.log(data); //debug

    //update board if move successful
    if(data.update === "success"){
        player += 1; //have to change this eventually
        if(player > 2) player = 1; //have to change this eventually
        updatePlayerPanelDisplay(player); //have to change this eventually

        for(let i in data.board){
            for(let j in data.board[i]){
                if(data.board[i][j] !== 0) {
                    displayBoard[i][j].children[0].
                    innerText = data.board[i][j] == 1 ? 'X' : 'O';
                }
            }
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


//seconds timer
let INTERVAL_ID = null;

function startTimer(){
    INTERVAL_ID = setInterval(() => {
        player === 1 ? --TIME_PX : --TIME_PO;
        updateTimerDisplay();
        if(TIME_PO === 0 || TIME_PX === 0) 
            stopTimer();
        
        console.log('tick');
    }, 1000);
}

function stopTimer(){
    clearInterval(INTERVAL_ID);
    INTERVAL_ID = null;
}

