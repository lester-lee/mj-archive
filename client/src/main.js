import Vue from 'vue';
import App from './App';
import router from './router';
import io from 'socket.io-client';
import attachListeners from './io';

Vue.config.productionTip = false;
Vue.prototype.log = console.log;

// Socket connections
const socket = io('http://192.168.0.108:4000');

// Game state
let store = {
  gameId: 'asdf',
  username: 'username',
  socket: socket,

  // Lobby
  inLobby: false,
  lobby: {
    readyToStart: false,
    numPlayers: 0,
    players: [],
  },

  // Game state
  hands: [[],[],[],[]],
  shownHands: [0,0,0,0],
  melds: [[],[],[],[]],
  discards: [[],[],[],[]],
  dealerNum: 0,
  curWind: 0,

  // Player info
  playerNum: 0,
  myTurn: false,
  canChow: false,
  canPong: false,
  canGong: false,
};

attachListeners(socket, store);

new Vue({
  render: (h) => h(App),
  router,
  data: store
}).$mount('#app');
