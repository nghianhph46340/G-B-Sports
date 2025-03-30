import { createRouter, createWebHistory } from 'vue-router'
import home from './home-router.js';
import admin from './admin-router.js';
import test from './test-router.js';
import sell from './sell-router.js';
const routes = [...home, ...admin, ...test, ...sell];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Nếu có savedPosition (khi sử dụng nút back/forward của trình duyệt)
    if (savedPosition) {
      return savedPosition;
    }
    
    // Mặc định luôn cuộn lên đầu trang khi chuyển route
    return { top: 0 };
  }
})

export default router
