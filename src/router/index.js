import { createRouter, createWebHistory } from 'vue-router'
import home from './home-router.js';
import admin from './admin-router.js';
import test from './test-router.js';
import sell from './sell-router.js';
const routes = [...home, ...admin, ...test, ...sell];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
