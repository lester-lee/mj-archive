const G = require('./gameplay');

function attachListeners(io, games) {

  io.on('connection', socket => {
    console.log('user connected', socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id)
    });

    /** Login & Lobby */

    socket.on('login', loginInfo => {
      let game;
      let id = loginInfo.gameId;

      // Try to find game; create if not found
      if (!id || !(id in games)) {
        game = G.createGame(id);
        games[game.id] = game;
      } else {
        game = games[id];
      }

      game.addPlayer(loginInfo.username);

      io.emit('lobby update', {
        readyToStart: game.players.length == 4,
        players: game.players,
        numPlayers: game.players.length
      });
    });


    socket.on('join game', id => {
      let g = games[id];
      io.emit('start game', g);
    })

    socket.on('update playerNum', info => {
      let g = games[info.gameId];
      socket.emit('update playerNum', g.getPlayerNum(info.username));
      io.emit('update turn', g.curPlayer);
    });


    // Game Information updates
    socket.on('update tiles', gameId => {
      let g = games[gameId];
      io.emit('update hand', g.hands);
      io.emit('update melds', g.melds);
      io.emit('update discards', g.discards);
    })

    socket.on('discard tile', info => {
      //console.log(info);
      let g = games[info.gameId];
      G.handleDiscard(g, info.playerNum, info.discard);
      io.emit('update hand', g.hands);
      io.emit('update discards', g.discards)

      // Should emit twice?
      G.progressGame(g);
      io.emit('update hand', g.hands);
      io.emit('update discards', g.discards);
      io.emit('update turn', g.curPlayer);
    })

    // Player Actions
    socket.on('show hand', info => {
      let g = games[info.gameId];
      g.shownHands[info.playerNum] = 1;
      io.emit('update shownHands', g.shownHands);
    });
  });
}

module.exports = attachListeners;