const http = require('http');

const server = http.createServer((req,res)=>{
    console.log(req.url);
    res.
    res.end();
});

server.listen(5000);



// function game() {

// let moves = 0;
// let v = 1;
// let r = 1;
// let c = 1;
// while(moves < 1) 
// {
//     board.print();
//     console.log(`Player ${v++}`);
    
//     if(board.update(r,c,v)) moves += 1;
//     console.log('');
//     if(v > 2) v = 1;
// }


// console.log("game finished");
// };

// game();