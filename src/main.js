import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router/index.js';
import Antd from 'ant-design-vue';
import { Carousel } from 'ant-design-vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'ant-design-vue/dist/reset.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'vue3-toastify/dist/index.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';



const app = createApp(App)
const pinia = createPinia();
app.use(router);
app.use(Carousel);
app.use(pinia);
app.use(Antd);

app.mount('#app');
