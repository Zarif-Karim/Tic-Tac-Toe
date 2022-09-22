const http = require('http');

const server = http.createServer((req,res)=>{
    console.log(req.url);
    res.
    res.end();
});

server.listen(5000);