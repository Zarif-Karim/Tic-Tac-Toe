/*
check spectator joining after game finish
*/
module.exports = function(io) {
    const Board = require('./board');
    let board = new Board();
    
    const connections = new Map();
    
    let xFilled = false;
    let oFilled = false;
    let player = 2;
    let ttpp = 500; //total time per player in seconds:
    let rtpx = ttpp; //timestamp of move update
    let rtpo = ttpp; 
    
    
    //removed old temp util functions
    let INTERVAL_ID = null;
    
    function startTimer(){
        INTERVAL_ID = setInterval(() => {
            player === 1 ? --rtpx : --rtpo;
            io.emit('tick', {
                turnOf: player===1? 'x':'o',
                rtpx,
                rtpo
            });
            if(rtpx === 0 || rtpo === 0) {
                //board.moves = 10;
                //get win status and send
                io.emit('status',{
                    update: 'success',
                    game_status: 'finished',
                    board: board.board,
                    winner: player === 1 ? 'O' : 'X',
                    rtpx,rtpo
                });
                stopTimer();
                console.log('Game Finished');
            }
            // console.log('tick',rtpx,rtpo);
        }, 1000);
    }
    
    function stopTimer(){
        if(INTERVAL_ID){
            clearInterval(INTERVAL_ID);
            INTERVAL_ID = null;
        }
    }

    io.on('connection',(socket)=>{
        
        if(!xFilled) {
            connections.set(socket.id,{role: 'x'});
            xFilled = true;
        }
        else if(!oFilled) {
            connections.set(socket.id,{role: 'o'});
            oFilled = true;
        }   
        else connections.set(socket.id,{role: 's'}); //spectator

        console.log(`New Connection: ${socket.id}, role: ${connections.get(socket.id).role}`);
        console.log('connections:',connections);

        //change initial data to setup
        socket.emit('setup', {
            role: connections.get(socket.id).role,
            rtpx,rtpo, turnOf: player === 1 ? 'x' : 'o',
            board: board.board
        });
        
        socket.on('disconnect',()=> {
            const conRole = connections.get(socket.id).role;
            if(conRole==='x') xFilled = false;
            else if(conRole==='o') oFilled = false;

            console.log(`Disconnected: ${socket.id}, role: ${connections.get(socket.id).role}`);
            connections.delete(socket.id);
            console.log('connections:',connections);
        });

        socket.on('move', (r,c,p)=>{
            p = p==='x'? 1 : p==='o'? 2 : 3;
            if(player === p) {
                console.log(r,c,p,socket.id);
                const updateStatus = board.update(r,c,p);
                const data = board.serialize(updateStatus,p);
                data.turnOf = player;
                if(data.game_status === 'finished') {
                    stopTimer();
                    data.rtpx = rtpx;
                    data.rtpo = rtpo;
                    console.log('Game Finished');
                }
                if(updateStatus){
                    player += 1;
                    if(player > 2) player = 1;
                    data.turnOf = player;
                    io.emit('status', data);
                } else socket.emit('status', data);
            }
        });

        socket.on('newgame',()=>{
            console.log('New board requested');
            
            board = new Board();
            player = 1;
            stopTimer();
            startTimer();
            rtpx = ttpp;
            rtpo = ttpp;
            const payload = {
                turnOf: player,
                rtpx, rtpo
            }
            io.emit('newboard',payload);
        });

        socket.on('getgame',()=>{
            const data = board.serialize(true,player);
            data.turnOf = player;
            data.rtpx = rtpx;
            data.rtpo = rtpo;
            if(rtpx == 0 || rtpo == 0) data.game_status = 'finished';

            socket.emit('spectator-setup', data);
        });

        socket.on('message', (msg)=>{
            console.log('Emitting',msg);
            io.emit('showMsg', msg);
        });
    });
}