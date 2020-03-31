import Vue from 'vue';
import App from './App';
import router from './router';
import io from 'socket.io-client';
import attachListeners from './io';

Vue.config.productionTip = false;
Vue.prototype.log = console.log;

// Socket connections
const socket = io('http://localhost:4000');

// Game state
let store = {
  gameId: 'asdf',
  username: 'username',
  lobby: {
    readyToStart: false,
    numPlayers: 0,
    players: [],
  },
  hands: [[],[],[],[]],
  shownHands: [0,0,0,0],
  melds: [[],[],[],[]],
  discards: [[],[],[],[]],
  playerNum: 0,
  myTurn: false,
  curWind: 0,
  dealerNum: 0,
  socket: socket,
};

attachListeners(socket, store);

new Vue({
  render: (h) => h(App),
  router,
  data: store
}).$mount('#app');
