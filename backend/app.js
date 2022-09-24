const http = require('http');
const cors = require('cors');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
const port = 5000;

const Board = require('./board');
let board = new Board();

app.use(cors());
app.use(express.static('../frontend/buttonGrid'))

app.get('/',(req,res)=>{
    console.log(req.url, req.query);
    const {r,c,p} = req.query;
    const updateStatus = board.update(r,c,p);
    res.send(board.serialize(updateStatus,p));
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

io.on('connection',(socket)=>{
    console.log(`New Connection: ${socket.id}`);
    socket.on('disconnect',()=> {
        console.log(`Disconnected: ${socket.id}`)
    });

    socket.emit('message','this is a test');
});

server.listen(port, ()=> console.log(`Server Started: http://localhost::${port}`));