const G = require('./gameplay');
const DEBUG = false;

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
        readyCheck: game.players.length == 4,
        players: game.players,
        numPlayers: game.players.length
      });
    });

    socket.on('lobby ready', info => {
      let g = games[info.gameId];
      let p = g.getPlayerNum(info.username);
      g.confirmCheck[p] = 1;

      if(g.confirmedAll()){
        io.emit('start game', g);
      }else{
        io.emit('update confirm', g.confirmCheck)
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


    /** Game Information Updates */
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

      // Send pong / gong prompt
      if(meldInfo.pongExists){
        g.waitPong = true;
        io.emit('prompt pong', {
          pongPlayer: g.pongPlayer,
          gongPlayer: g.gongPlayer,
        });
      }

      // Send chow prompt
      if (meldInfo.chowExists){
        io.emit('prompt chow', {
          chowPlayer: g.chowPlayer,
          chowTiles: meldInfo.chowTiles,
        });
      }

      if(DEBUG){
        console.log(meldInfo);
      }

      // Go to next turn if no prompts
      // Otherwise prompts will handle turn progression
      if (!meldInfo.pongExists && !meldInfo.chowExists){
        goToNextPlayer(g);
      }
    });

    /** Player Actions */
    // Helper Functions
    goToNextPlayer = function (g) {
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

    updateAfterAction = function (g) {
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

    socket.on('show hand', info => {
      if (DEBUG) {
        console.log('show hand', info.playerNum);
      }

      let g = games[info.gameId];
      g.shownHands[info.playerNum] = 1;
      io.emit('update shownHands', g.shownHands);
    });

    socket.on('prompt close', info => {
      //Close pong/gong
      let g = games[info.gameId];
      if(info.playerNum == g.pongPlayer || info.playerNum == g.gongPlayer){
        g.waitPong = false;

        if(g.chowPlayer == -1){ // No chow to wait for => progress game
         goToNextPlayer(g);
        }
      }

      //Close chow
      if(info.playerNum == g.chowPlayer){
        if(g.waitPong){
          socket.emit('wait pong');
          return;
        } else {
          goToNextPlayer(g);
        }
      }
    });

    socket.on('上', info => {
      if (DEBUG) {
        console.log('chow', info.playerNum, info.options.chowType);
      }
      let g = games[info.gameId];
      if (g.waitPong){
        socket.emit('wait pong');
        return; // TODO: better feedback for user
      }
      G.handleChow(g, info.playerNum, info.options.chowType);

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

    /** Game Progression */
    socket.on('go next', info => {
      let g = games[info.gameId];
      G.startNextRound(g);

      updateAfterAction(g);
      io.emit('update seats', {
        dealerNum: g.dealerNum,
        curWind: g.curWind,
      })
    });
  });
}

module.exports = attachListeners;