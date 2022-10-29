//to-do
/*
    refactor to OO style
*/
//globals
let socket = null; 
if(io) socket = io(); //'http://localhost:5000' //automatically connects to the server serving the file
const displayBoard = getBoard();
const whopx = document.getElementById("who-px");
const whopo = document.getElementById("who-po");
// const turnpx = document.getElementById("turn-px");
// const turnpo = document.getElementById("turn-po");
const timepx = document.getElementById("time-px");
const timepo = document.getElementById("time-po");
//seconds timer
//remaining time in seconds, gets updated from server 
let player = 3; //have to change this eventually
let TIME_PX = 0;
let TIME_PO = 0;
let turnOf = 1;

if(!socket) {
    finishGame({});
    throw new Error('Cannot create socket');
}
else 
{
    socket.on('initialData',data=>{
        player = data.role;
        TIME_PX = data.rtp1;
        TIME_PO = data.rtp2;
        //change this V (spectators are initiation new games);
        //asking for new board
        socket.emit(player !== 3 ? 'newgame' : 'getgame');
        document.getElementById("start-new").hidden = true;
    });

    socket.on('status', (data)=>{
        console.log(data);

        //update board if move successful
        if(data.update === "success"){
            updateBoard(data.board,data.turnOf);
        }

        if(data.game_status === "finished")
        {
            finishGame(data);
        }
    });

    socket.on('newboard', (data)=>{
        console.log('New board:', data);
        startNewBoard(data.turnOf,data.rtp1,data.rtp2);
    });

    socket.on('spectator-setup', (data) => {
        console.log(data);
        const {board,turnOf,rtp1,rtp2,game_status,winPath} = data;
        if(game_status === "ongoing"){
            startNewBoard(turnOf,rtp1,rtp2);
            updateBoard(board,turnOf);
        } else {
            finishGame(data);
        }
    });

    socket.on('tick', (data)=> {
        // console.log(data);
        turnOf = data.turnOf;
        TIME_PX = data.rtp1;
        TIME_PO = data.rtp2;
        updatePlayerTimes();
    });

    //debug
    // socket.on('showMsg',(msg)=>console.log('showMsg',msg));
}
