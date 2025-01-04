import { createRouter, createWebHistory } from 'vue-router'
import home from './home-router.js';

const routes = [...home];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
