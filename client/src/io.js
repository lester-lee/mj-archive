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
  socket.on('update hands', hands => {
    store.hands = hands;
  });

  socket.on('update melds', melds => {
    store.melds = melds;
  });

  socket.on('update discards', info => {
    store.discards = info.discards;
    store.lastDiscard = info.lastDiscard;
  });

  socket.on('update turn', turnInfo => {
    store.myTurn = store.playerNum == turnInfo.curPlayer;
    store.canChow = store.playerNum == turnInfo.chowPlayer;
    store.canPong = store.playerNum == turnInfo.pongPlayer;
    store.canGong = store.playerNum == turnInfo.gongPlayer;
  });

  socket.on('update shownHands', shownHands => {
    store.shownHands = shownHands;
  });

  // Player Prompts
  socket.on('prompt pong', info => {
    store.prompt = store.playerNum == info.pongPlayer;
    store.canPong = store.playerNum == info.pongPlayer;
    store.canGong = store.playerNum == info.gongPlayer;
  });

  socket.on('prompt chow', info => {
    store.prompt = store.playerNum == info.chowPlayer;
    store.canChow = store.playerNum == info.chowPlayer;
    store.chowTiles = info.chowTiles;
  })
}