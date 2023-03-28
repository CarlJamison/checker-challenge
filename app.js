const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 80;

app.use(express.static(__dirname + '/public'));

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});