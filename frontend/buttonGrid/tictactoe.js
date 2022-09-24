//to-do
/*
    refactor to OO style
    refactor to get data from server and update:
        player id
        timer updated in server based on timestamp
*/
//globals
let socket = null; 
if(io) socket = io(); //'http://localhost:5000' //automatically connects to the server serving the file
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

let player = 3; //have to change this eventually
let default_time = 0;
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
        default_time = data.remaining_time;

        //change this V (spectators are initiation new games);
        //asking for new board
        socket.emit('newgame');
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
        startNewBoard(data.turnOf);
        // if(data.status === 'success') {
        // } else { //this is a spectator
            
        // }
    });

    //debug
    // socket.on('showMsg',(msg)=>console.log('showMsg',msg));
}
