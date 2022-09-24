const http = require('http');
const cors = require('cors');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: "http://localhost:5000"}});
const port = 5000;

const Board = require('./board');
let board = new Board();

app.use(cors());
app.use(express.static('../frontend/buttonGrid'))

// app.get('/',(req,res)=>{
//     console.log(req.url, req.query);
//     res.send('Home Page');
// });

// app.get('/tictactoe',(req,res)=>{
//     console.log(req.method, req.url);
//     res.redirect('http://192.168.0.120:5000/tictactoe.html');
// });

app.all('*',(req,res)=>{
    console.log('all', req.url, req.query);
    //redirecting all urls to tictactoe
    res.redirect('http://192.168.0.120:5000/tictactoe.html');
});

server.listen(port, ()=> console.log(`Server Started: http://localhost::${port}`));

const connections = new Map();
let xFilled = false;
let oFilled = false;
let player = 1;

io.on('connection',(socket)=>{
    if(connections.size < 2){
        if(!xFilled) {
            connections.set(socket.id,{role: 1});
            xFilled = true;
        }
        else if(!oFilled) {
            connections.set(socket.id,{role: 2});
            oFilled = true;
        }   
    } else connections.set(socket.id,{role: 3}); //spectator

    console.log(`New Connection: ${socket.id}, role: ${connections.get(socket.id).role}`);
    
    socket.on('disconnect',()=> {
        const conRole = connections.get(socket.id).role;
        if(conRole===1) xFilled = false;
        else if(conRole===2) oFilled = false;

        console.log(`Disconnected: ${socket.id}, role: ${connections.get(socket.id).role}`);
        connections.delete(socket.id);
    });

    socket.on('move', (r,c,p)=>{
        console.log(r,c,p,socket.id);

        if(player === p) {
            
            const updateStatus = board.update(r,c,p);
            const data = board.serialize(updateStatus,p);
            socket.emit('status', data);
            if(updateStatus){
                player += 1;
                if(player > 2) player = 1;
                socket.broadcast.emit('status', data);
            }
        }
    });

    socket.on('newgame',()=>{
        console.log('New board requested');
        board = new Board();
        const payload = {
            status:'success', 
            role: connections.get(socket.id).role
        };
        socket.emit('newboard',payload);
    });

    socket.on('message', (msg)=>{
        console.log('Emitting',msg);
        socket.emit('showMsg', msg);
        socket.broadcast.emit('showMsg', msg);
    });
});