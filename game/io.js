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
      if (DEBUG) {
        io.emit('update shownHands', [1, 1, 1, 1]);
      }
    });

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
      io.emit('update discards', {
        discards: g.discards,
        lastDiscard: g.lastDiscard,
      });
    });

    socket.on('discard tile', info => {
      let g = games[info.gameId];
      G.handleDiscard(g, info.playerNum, info.discard);
      io.emit('update discards', {
        discards: g.discards,
        lastDiscard: g.lastDiscard,
      });
      io.emit('update hands', g.hands);
      io.emit('update melds', g.melds);

      // See if other players can do anything with discard
      let meldInfo = G.checkMelds(g);

      // Prepare pong / gong prompts
      if(meldInfo.pongExists){
        io.emit('prompt pong', {
          pongPlayer: g.pongPlayer,
          gongPlayer: g.gongPlayer,
        });
      }

      // Prepare chow prompt
      if (meldInfo.chowExists){
        io.emit('prompt chow', {
          chowPlayer: g.chowPlayer,
          chows: meldInfo.chows,
        });
      }

      if(DEBUG){
        console.log(meldInfo);
      }

      // Go to next turn if no prompts
      // Otherwise prompts will handle turn progression
      if (!meldInfo.pongExists && !meldInfo.chowExists){
        G.progressPlayer(g);
        G.handleDraw(g);
        io.emit('update hands', g.hands);
        io.emit('update turn', {
          curPlayer: g.curPlayer,
          chowPlayer: -1,
          pongPlayer: -1,
          gongPlayer: -1,
        });
      }
    });

    // Player Actions
    socket.on('draw', info => {
      let g = games[info.gameId];
      G.handleDraw(g);

      io.emit('update hands', g.hands);
    });

    socket.on('show hand', info => {
      if (DEBUG) {
        console.log('show hand', info.playerNum);
      }

      let g = games[info.gameId];
      g.shownHands[info.playerNum] = 1;
      io.emit('update shownHands', g.shownHands);
    });

    updateAfterAction = function(g){
      io.emit('update hands', g.hands);
      io.emit('update melds', g.melds);
      io.emit('update discards', {
        discards: g.discards,
        lastDiscard: g.lastDiscard,
      });
      io.emit('update turn', {
        curPlayer: g.curPlayer,
        chowPlayer: -1,
        pongPlayer: -1,
        gongPlayer: -1,
      });
    }

    socket.on('上', info => {
      if (DEBUG) {
        console.log('pong, info.playerNum');
      }
      let g = games[info.gameId];
      G.handleChow(g, info.playerNum, info.chowType);

      updateAfterAction(g);
    });

    socket.on('碰', info => {
      if (DEBUG) {
        console.log('pong', info.playerNum);
      }

      let g = games[info.gameId];
      G.handlePong(g, info.playerNum);

      updateAfterAction(g);
    });

    socket.on('杠', info => {
      if (DEBUG) {
        console.log('gong', info.playerNum);
      }

      let g = games[info.gameId];
      G.handleGong(g, info.playerNum);

      updateAfterAction(g);
    });
  });
}

module.exports = attachListeners;