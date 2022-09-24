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

app.get('/',(req,res)=>{
    console.log(req.url, req.query);
    //const {r,c,p} = req.query;
    //const updateStatus = board.update(r,c,p);
    res.send('Home Page');
});

app.get('/newgame',(req,res)=>{
    console.log('newgame', req.url);
    board = new Board();
    res.send('New board created!');
});

app.all('*',(req,res)=>{
    console.log('all', req.url, req.query);
    res.send(`404: NOT FOUND`);
});

server.listen(port, ()=> console.log(`Server Started: http://localhost::${port}`));

io.on('connection',(socket)=>{
    console.log(`New Connection: ${socket.id}`);
    socket.on('disconnect',()=> {
        console.log(`Disconnected: ${socket.id}`)
    });

    socket.on('move', (r,c,p)=>{
        console.log(r,c,p,socket.id);
        const updateStatus = board.update(r,c,p);
        const data = board.serialize(updateStatus,p);
        socket.emit('status', data);
        socket.broadcast.emit('status', data);
    });

    socket.on('newgame',()=>{
        console.log('New board requested');
        board = new Board();
        socket.emit('newboard','success');
        socket.broadcast.emit('newboard','success');
    });

    socket.on('message', (msg)=>{
        console.log('Emitting',msg);
        socket.emit('showMsg', msg);
        socket.broadcast.emit('showMsg', msg);
    });
});