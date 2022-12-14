const http = require('http');
const cors = require('cors');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
require('./socketevents.js')(io);
const port = 5000;

app.use(cors());

app.use(express.static('../frontend/gridlayout'));

// app.get('/',(req,res)=>{
//     console.log(req.url, req.query);
//     res.send('Home Page');
// });

app.get('/tictactoe',(req,res)=>{
    console.log(req.method, req.url);
    res.redirect('/tictactoe.html');
});

app.all('*',(req,res)=>{
    console.log('all', req.url, req.query);
    //redirecting all urls to tictactoe
    res.redirect('/tictactoe.html');
});

server.listen(port, ()=> console.log(`Server Started: http://localhost::${port}`));
