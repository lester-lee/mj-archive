const G = require('./gameplay');
const DEBUG = true;

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
      if (DEBUG){
        io.emit('update shownHands', [1,1,1,1]);
      }
    })

    socket.on('update playerNum', info => {
      let g = games[info.gameId];
      socket.emit('update playerNum', g.getPlayerNum(info.username));
      io.emit('update turn', {
        curPlayer: g.curPlayer,
        chowPlayer: g.chowPlayer,
        pongPlayer: g.pongPlayer,
        gongPlayer: g.gongPlayer,
      });
    });


    // Game Information updates
    socket.on('update tiles', gameId => {
      let g = games[gameId];
      io.emit('update hands', g.hands);
      io.emit('update melds', g.melds);
      io.emit('update discards', g.discards);
    })

    socket.on('discard tile', info => {
      let g = games[info.gameId];
      G.handleDiscard(g, info.playerNum, info.discard);
      G.progressPlayer(g);

      io.emit('update hands', g.hands);
      io.emit('update discards', g.discards);
      io.emit('update turn', {
        curPlayer: g.curPlayer,
        chowPlayer: g.chowPlayer,
        pongPlayer: g.pongPlayer,
        gongPlayer: g.gongPlayer,
      });
    })

    // Player Actions
    socket.on('draw', info => {
      let g = games[info.gameId];
      G.handleDraw(g);

      io.emit('update hands', g.hands);
    });

    socket.on('show hand', info => {
      let g = games[info.gameId];
      g.shownHands[info.playerNum] = 1;
      io.emit('update shownHands', g.shownHands);
    });
  });
}

module.exports = attachListeners;