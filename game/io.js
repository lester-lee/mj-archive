const G = require('./gameplay');

function attachListeners(io, games) {

  io.on('connection', socket => {
    console.log('user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected')
    });

    socket.on('join game', id => {
      let game;
      if (id) {
        game = G.createGame(id);
        games[game.id] = game;
      }else{
        game = games[id];
      }
      io.emit('join game', game);
      io.emit('update turn', game.curPlayer);
    })

    socket.on('update tiles', info => {
      //console.log(info);
      io.emit('update hand', games[info.gameId].hands);
      io.emit('update melds', games[info.gameId].melds);
    })

    socket.on('discard tile', info => {
      //console.log(info);
      let g = games[info.gameId];
      G.handleDiscard(g, info.playerNum, info.discard);
      io.emit('update hand', g.hands);
      io.emit('update discard', g.discardPile)

      // Should emit twice?
      G.progressGame(g);
      io.emit('update hand', g.hands);
      io.emit('update discard', g.discardPile);
      io.emit('update turn', g.curPlayer);
    })
  });
}

module.exports = attachListeners;