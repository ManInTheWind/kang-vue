import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import HomePageVue from '../views/HomePage/HomePage.vue';

const routes:Array<RouteRecordRaw> = [
  {
    path:'/',
    component:HomePageVue,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
