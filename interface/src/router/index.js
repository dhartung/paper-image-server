import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DetailView from '../views/DetailView.vue';
import CreateRoom from '../views/CreateRoom.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/details/:id',
      name: "details",
      component: DetailView
    },
    {
      path: "/create",
      name: "create",
      component: CreateRoom
    }
  ]
})

export default router
