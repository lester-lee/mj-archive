const app = require('express')();

const serveStatic = require('serve-static');
//app.use(serveStatic(__dirname + "/client/dist"));

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const attachListeners = require('./game/io');

let games = {};

app.get('/', (req, res) => {
  res.json(games);
});


attachListeners(io, games);

const port = process.env.PORT || 4000;

http.listen(port, () => {
  console.log(`listening on ${port}`);
})