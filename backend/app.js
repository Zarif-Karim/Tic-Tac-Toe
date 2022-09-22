const http = require('http');
const Board = require('./board');
const parseParams = require('./utils');

let board = new Board();

const port = 5000;

http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
}

if (['GET', 'POST'].indexOf(req.method) > -1) {
    console.log(req.url);
    res.writeHead(200, headers);

    if(req.url == "/?game=new"){
        board = new Board();
        res.end('New board created!');
        return;
    }

    const params = parseParams(req.url);
    if(params) {
        const {r,c,p} = params;
        const updateStatus = board.update(r,c,p);
        res.end(board.serialize(updateStatus,p));
        return;
    }
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
}).listen(port);