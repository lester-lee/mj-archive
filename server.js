const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const attachListeners = require('./game/io');

app.get('/', (req, res) => {
  res.json({
    message: "Hello yo"
  });
});

attachListeners(io);

const port = process.env.PORT || 4000;

http.listen(port, () => {
  console.log(`listening on ${port}`);
})