import Vue from 'vue';
import Router from 'vue-router';
import chat from '@/pages/chat.vue';
import login from '@/pages/login.vue';
import room from '@/pages/room.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/chatroom',
      name: 'chat',
      component: chat
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/room',
      name: room,
      component: room
    }
  ]
})
