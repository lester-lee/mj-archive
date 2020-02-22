import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

let store = {
  gameId: '12345',
  hands: [],
  melds: [],
  discardPile: [],
  playerNum: 0,
};

new Vue({
  render: (h) => h(App),
  router,
  data: store
}).$mount('#app');
