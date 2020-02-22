export default function attachListeners(socket, store) {
  socket.emit('new game', 'id1234');
  socket.on('new game', game => {
    store.gameId = game.id;
    socket.emit('update tiles', {
      gameId: game.id,
      playerNum: store.playerNum,
    });
  });

  socket.on('update hand', hands => {
    store.hands = hands;
  });

  socket.on('update melds', melds => {
    store.melds = melds;
  });

  socket.on('update discard', pile => {
    store.discardPile = pile;
  });

  socket.on('update turn', curPlayer => {
    store.myTurn = store.playerNum === curPlayer;
  });

}