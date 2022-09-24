//to-do
/*
    refactor to OO style
    refactor to get data from server and update:
        player id
        timer updated in server based on timestamp
*/
//globals
let socket = null; 
if(io) socket = io('http://localhost:5000');
const displayBoard = getBoard();
const whopx = document.getElementById("who-px");
const whopo = document.getElementById("who-po");
const turnpx = document.getElementById("turn-px");
const turnpo = document.getElementById("turn-po");
const timepx = document.getElementById("time-px");
const timepo = document.getElementById("time-po");
//seconds timer
let INTERVAL_ID = null;
//remaining time in seconds, gets updated from server eventually
//currently doing it client side through functions
let TIME_PX = 15;
let TIME_PO = 15;

let player = 1; //have to change this eventually

if(!socket) {
    finishGame({});
    throw new Error('Cannot create socket');
}
else 
{
    //asking for new board
    socket.emit('newgame');

    socket.on('status', (data)=>{
        console.log(data);

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
    });

    socket.on('newboard', (data)=>{
        console.log(`New board: ${data}`);
        if(data === 'success')
            startNewBoard();
    })
    
    //event listeners
    setScreenBoardClickEvents(displayBoard);
}
