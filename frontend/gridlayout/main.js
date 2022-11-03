//initialise the socket
const socket = io(); //connecting to the serving server by default

const timeX = get('time-x');
const timeO = get('time-o');
const psx = get('psx');
const pso = get('pso');
const board = document.getElementsByClassName('cell');

let turnOf;
let player;

if(socket) {
    // socket.emit('newgame');
    socket.on('setup', (data)=>{
        console.log('setup:',data);
        setTime(data.rtpx,data.rtpo);
        setRole(data.role);
        setTurn(data.turnOf);
        setScreenBoardClickEvents(board);
        updateBoard(data.board)
    });

    socket.on('tick',({turnOf,rtpx,rtpo})=>{
        setTurn(turnOf);
        setTime(rtpx,rtpo);
    });

    socket.on('status', (data)=>{
        console.log(data);

        //update board if move successful
        if(data.update === "success"){
            updateBoard(data.board);
        }

        if(data.game_status === "finished")
        {
            //finishGame(data);
            setTurn('');
        }
    });
}

function updateBoard(_board){
    for(let i = 0; i < 3; ++i){
        for(let j = 0; j < 3; ++j){
            setSymbol(i,j,_board[i][j])
        }
    }
}

function setSymbol(r,c,symbol){
    symbol = symbol === 1 ? 'X' : symbol === 2 ? 'O' : '';
    const cell = board[r*3+c];
    cell.classList.remove('X');
    cell.classList.remove('O');
    if(symbol !== '') cell.classList.add(symbol);
}

//adding click events to all the board buttons to send update request to server
function setScreenBoardClickEvents(displayBoard, remove = false){
    for(let i = 0; i < 3; ++i){
        for(let j = 0; j < 3; ++j){
            displayBoard[i*3+j].onclick = 
            remove ? null : 
            ()=> {
                if(turnOf === player) 
                    socket.emit('move', i,j,player);
            }
        }
    }
}

//get element by id
function get(id) {
    return document.getElementById(id);
}

function setTurn (player) {
    turnOf = player;
    pso.classList.remove('turn');
    psx.classList.remove('turn');
    if(player === 'x'){
        psx.classList.add('turn');        
    } else if (player === 'o') {
        pso.classList.add('turn');
    }
}

function setTime(px,po){
    timeX.innerText = px;
    timeO.innerText = po;
}

function setRole(role){
    player = role;
    if(role === 'x'){
        pso.classList.remove('me');
        psx.classList.add('me');        
    } else if( role === 'o') {
        psx.classList.remove('me');
        pso.classList.add('me');
    }
}