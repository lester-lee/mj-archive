import Vue from 'vue';
import App from './App';
import router from './router';
import io from 'socket.io-client';
import attachListeners from './io';

Vue.config.productionTip = false;
Vue.prototype.log = console.log;

// Socket connections
const socket = io('localhost:4000');

// Game state
let store = {
  gameId: 'asdf',
  username: 'username',
  socket: socket,

  // Lobby
  inLobby: false,
  lobby: {
    readyCheck: false,
    numPlayers: 0,
    players: [],
  },
  confirmCheck: [0, 0, 0, 0],
  gameStart: false,

  // Game state
  hands: [[],[],[],[]],
  shownHands: [0,0,0,0],
  melds: [[],[],[],[]],
  discards: [[],[],[],[]],
  lastDiscard: {},
  curPlayer: 0,
  dealerNum: 0,
  curWind: 0,

  // Game prompts
  prompt: false,
  winPrompt: false,
  waitConfirm: false,

  // Player info
  playerNum: 0,
  myTurn: false,
  claimWin: false,

  // Player actions
  canChow: false,
  chowTiles: [[], [], []],
  waitPong: false,
  canPong: false,
  canGong: false,
};

attachListeners(socket, store);

new Vue({
  render: (h) => h(App),
  router,
  data: store
}).$mount('#app');
