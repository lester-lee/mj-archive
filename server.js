// Express
const express = require('express');
const app = express();
const path = require('path');
// Socket.io
const server = require('http').createServer(app);
const options = {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
};
const io = require('socket.io')(server, options);

// Attach IO listeners to games
// TODO: Redo so it uses database instead of memory
let games = {};
const attachListeners = require('./game/io');
attachListeners(io, games);

// Environment variables
const DEBUG = process.env.DEBUG || false;
const PORT = process.env.PORT || 4000;

// Priority serve any static files
if (!DEBUG){
  app.use(express.static(path.resolve(__dirname, './client/dist')));
}

// Routes
if (DEBUG) {
  app.get('/', (req, res) => {
    res.json(games);
  });
}

// All remaining requests get sent to Vue, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
})


server.listen(PORT, () => {
  console.log(`${DEBUG ? 'dev server' : 'heroku' + process.pid} listening on ${PORT}`);
})