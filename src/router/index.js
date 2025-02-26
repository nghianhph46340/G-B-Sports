import { createRouter, createWebHistory } from 'vue-router'
import home from './home-router.js';
import admin from './admin-router.js';

const routes = [...home, ...admin];


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
