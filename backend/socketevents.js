/*
check spectator joining after game finish
*/
module.exports = function(io) {
    const Board = require('./board');
    let board = new Board();
    
    const connections = new Map();
    
    let xFilled = false;
    let oFilled = false;
    let player = 1;
    let ttpp = 10; //total time per player in seconds
    let rtp1 = ttpp; //timestamp of move update
    let rtp2 = ttpp; 
    
    
    //removed old temp util functions
    let INTERVAL_ID = null;
    
    function startTimer(){
        INTERVAL_ID = setInterval(() => {
            player === 1 ? --rtp1 : --rtp2;
            io.emit('tick', {
                turnOf: player,
                rtp1,
                rtp2
            });
            if(rtp1 === 0 || rtp2 === 0) {
                //board.moves = 10;
                //get win status and send
                io.emit('status',{
                    update: 'success',
                    game_status: 'finished',
                    board: board.board,
                    winner: player === 1 ? 'O' : 'X',
                    rtp1,rtp2
                });
                stopTimer();
                console.log('Game Finished');
            }
            // console.log('tick',rtp1,rtp2);
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
            connections.set(socket.id,{role: 1});
            xFilled = true;
        }
        else if(!oFilled) {
            connections.set(socket.id,{role: 2});
            oFilled = true;
        }   
        else connections.set(socket.id,{role: 3}); //spectator

        console.log(`New Connection: ${socket.id}, role: ${connections.get(socket.id).role}`);
        console.log('connections:',connections);
        socket.emit('initialData', {
            role: connections.get(socket.id).role,
            rtp1,rtp2
        });
        
        socket.on('disconnect',()=> {
            const conRole = connections.get(socket.id).role;
            if(conRole===1) xFilled = false;
            else if(conRole===2) oFilled = false;

            console.log(`Disconnected: ${socket.id}, role: ${connections.get(socket.id).role}`);
            connections.delete(socket.id);
            console.log('connections:',connections);
        });

        socket.on('move', (r,c,p)=>{
            // console.log(r,c,p,socket.id);

            if(player === p) {
                
                const updateStatus = board.update(r,c,p);
                const data = board.serialize(updateStatus,p);
                data.turnOf = player;
                if(data.game_status === 'finished') {
                    stopTimer();
                    data.rtp1 = rtp1;
                    data.rtp2 = rtp2;
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
            rtp1 = ttpp;
            rtp2 = ttpp;
            const payload = {
                turnOf: player,
                rtp1, rtp2
            }
            io.emit('newboard',payload);
        });

        socket.on('getgame',()=>{
            const data = board.serialize(true,player);
            data.turnOf = player;
            data.rtp1 = rtp1;
            data.rtp2 = rtp2;
            if(rtp1 == 0 || rtp2 == 0) data.game_status = 'finished';

            socket.emit('spectator-setup', data);
        });

        socket.on('message', (msg)=>{
            console.log('Emitting',msg);
            io.emit('showMsg', msg);
        });
    });
}