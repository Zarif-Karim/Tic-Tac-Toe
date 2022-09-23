//to-do
/*
    refactor to OO style
    refactor to get data from server and update:
        player id
        timer updated in server based on timestamp
*/
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

    if(data.game_status === "finished")
    {
        finishGame(data);
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


//seconds timer
let INTERVAL_ID = null;

function startTimer(){
    INTERVAL_ID = setInterval(() => {
        player === 1 ? --TIME_PX : --TIME_PO;
        updateTimerDisplay();
        if(TIME_PO === 0 || TIME_PX === 0) {
            finishGame({winner: TIME_PO === 0 ? 'X' : 'O'});
        }
        
        console.log('tick');
    }, 1000);
}

function stopTimer(){
    if(INTERVAL_ID){
        clearInterval(INTERVAL_ID);
        INTERVAL_ID = null;
    }
}

