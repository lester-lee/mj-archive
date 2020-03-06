import Vue from 'vue';
import App from './App';
import router from './router';
import io from 'socket.io-client';
import attachListeners from './io';

Vue.config.productionTip = false;

// Socket connections
const socket = io('http://localhost:4000');

// Game state
let store = {
  gameId: 'asdf',
  username: 'username',
  hands: [[],[],[],[]],
  melds: [[],[],[],[]],
  discards: [[],[],[],[]],
  playerNum: 2,
  myTurn: false,
  curWind: 0,
  dealerNum: 1,
  socket: socket,
};

attachListeners(socket, store);

new Vue({
  render: (h) => h(App),
  router,
  data: store
}).$mount('#app');
