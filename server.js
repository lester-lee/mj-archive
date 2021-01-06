const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const DEBUG = process.env.DEBUG || false;
const PORT = process.env.PORT || 4000;

const attachListeners = require('./game/io');

// Priority serve any static files
if (!DEBUG){
  app.use(express.static(path.resolve(__dirname, './client/dist')));
}


// Attach IO listeners to games
// TODO: Redo so it uses database instead of memory
let games = {};
attachListeners(io, games);

if (DEBUG) {
  app.get('/', (req, res) => {
    res.json(games);
  });
}

// All remaining requests get sent to Vue, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
})

http.listen(PORT, () => {
  console.log(`${DEBUG ? 'dev server' : 'heroku' + process.pid} listening on ${PORT}`);
})