import Vue from 'vue';
import Router from 'vue-router';

// Components
import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/Login';
import Table from '@/components/Table';

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
      path: '/table',
      name: 'Table',
      component: Table
    }
  ]
})