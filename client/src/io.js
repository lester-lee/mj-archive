export default function attachListeners(socket, store) {

  // Login & Lobby
  socket.on('lobby update', lobbyInfo => {
    store.lobby = lobbyInfo;
  });

  socket.on('start game', game => {
    store.gameId = game.id;
    socket.emit('update playerNum', {
      gameId: game.id,
      username: store.username
    });
    socket.emit('update tiles', game.id);
  });

  socket.on('update playerNum', p => {
    store.playerNum = p;
  });

  // Game Information updates
  socket.on('update hand', hands => {
    store.hands = hands;
  });

  socket.on('update melds', melds => {
    store.melds = melds;
  });

  socket.on('update discards', discards => {
    store.discards = discards;
  });

  socket.on('update turn', curPlayer => {
    store.myTurn = store.playerNum == curPlayer;
  });

}