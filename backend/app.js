const cors = require('cors');
const app = require('express')();
const port = 5000;

const Board = require('./board');
let board = new Board();

app.use(cors());

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

app.listen(port, ()=> console.log(`Server Started: http://localhost::${port}`));