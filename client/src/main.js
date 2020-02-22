import Vue from 'vue';
import App from './App';
import router from './router';
import io from 'socket.io-client';
import attachListeners from './io';

Vue.config.productionTip = false;

// Game state
let store = {
  gameId: '12345',
  hands: [],
  melds: [],
  discardPile: [],
  playerNum: 0,
  myTurn: false,
};

// Socket connections
const socket = io('http://localhost:4000');
attachListeners(socket, store);

new Vue({
  render: (h) => h(App),
  router,
  data: store
}).$mount('#app');
