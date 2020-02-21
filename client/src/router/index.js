import Vue from 'vue';
import Router from 'vue-router';

// Components
import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/Login';
import Play from '@/components/Play';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/play',
      name: 'Play',
      component: Play
    }
  ]
})