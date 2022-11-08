/*
check spectator joining after game finish
*/
module.exports = function(io) {
    const Board = require('./board');
    let board = new Board();
    
    const connections = new Map();
    
    let xID = null;
    let oID = null;
    let startPlayer = 'x';
    let player = -1;
    let ttpp = 10; //total time per player in seconds:
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
                player = -1;
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


    function setUp(socket,sendRole=true, sendUsers=true) {
        const data = board.gameStatus();
        if(rtpx === 0 || rtpo === 0){
            data.game_status = 'finished';
            data.winner = player === 1 ? 'O' : 'X';
        }
        //change initial data to setup
        const payload = {
            rtpx,rtpo, turnOf: player===1 ? 'x' : player === 2 ? 'o' : '',
            board: board.board,
            game_status: data.game_status
        };
        if(data.game_status==='finished') {
            payload.winner = data.winner;
            payload.turnOf = '';
        }
        if(sendRole) payload.role = connections.get(socket.id).role;
        // console.log('setup', payload);
        payload.onlineUsers = [];
        //get all users except self
        if(sendUsers) {
            for(let [id,data] of connections.entries()){
                if(data.userName)
                    payload.onlineUsers.push({id, name: data.userName});
            }
        }
        if(xID) payload.xName = connections.get(xID).userName || '';
        if(oID) payload.oName = connections.get(oID).userName || '';
        socket.emit('setup', payload);
    }

    io.on('connection',(socket)=>{
        
        if(!xID) {
            connections.set(socket.id,{role: 'x'});
            xID = socket.id;
        }
        else if(!oID) {
            connections.set(socket.id,{role: 'o'});
            oID = socket.id;
        }   
        else connections.set(socket.id,{role: 's'}); //spectator

        console.log(`New Connection: ${socket.id}, role: ${connections.get(socket.id).role}`);
        console.log('connections:',connections);
        setUp(socket);
        
        socket.on('disconnect',()=> {
            const conRole = connections.get(socket.id).role;
            if(conRole==='x') xID = null;
            else if(conRole==='o') oID = null;
            if(conRole !== 's') io.emit('set-player', conRole, '');

            socket.broadcast.emit('user-disconnected',connections.get(socket.id).userName,socket.id);
            console.log(`Disconnected: ${socket.id}, ${connections.get(socket.id)}`);
            connections.delete(socket.id);
            console.log('connections:',connections);


        });

        socket.on('move', (r,c,p)=>{
            p = p==='x'? 1 : p==='o'? 2 : 3;
            if(player === p) {
                // console.log(r,c,p,socket.id);
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
            startPlayer = startPlayer === 'x' ? 'o' : 'x';
            player = startPlayer === 'x' ? 1 : 2;
            board = new Board();
            stopTimer();
            startTimer();
            rtpx = ttpp;
            rtpo = ttpp;
            setUp(io,false,false);
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

        socket.on('chat-message', ({message}) => {
            socket.broadcast.emit('chat-message', {
                username: connections.get(socket.id).userName,
                message
            });
        });

        socket.on('set-username', name => {
            connections.get(socket.id).userName = name;
            console.log(connections.get(socket.id));
            const {role} = connections.get(socket.id);
            if(role !== 's') io.emit('set-player',role,name);

            socket.broadcast.emit('user-connected', socket.id, connections.get(socket.id));
        })
    });
}

