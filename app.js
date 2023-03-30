const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 80;
const { execFile } = require("child_process");

app.use(express.static(__dirname + '/public'));

//Get recommended move (State format: "2 0-0-0-0- 0-0-0-0- 0-0-0-0- 1-1-1-1- 1-1-1-1- 2-2-2-2- 2-2-2-2- 2-2-2-2-")
app.get('/move/:boardState', (req, res) => {
  var state = req.params.boardState;

  if(state){
    var start = Date.now();
    var boardString = decodeURI(state)
      .replaceAll(' ', '')
      .replaceAll('-', '0')
      .replaceAll('C', '1');
      
    console.log(boardString);
    execFile("./alpha-beta-ai", [boardString], (error, stdout, stderr) => {
      if(error){
        res.status(500).send(error);
      }else{
        res.send(stdout);
        console.log(Date.now() - start + " milliseconds")
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});