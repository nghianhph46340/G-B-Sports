import axios from "axios";
import { message } from 'ant-design-vue';
import router from '../router';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})
// Thêm interceptor để gửi token trong mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.error('Token not found in localStorage');
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// Response Interceptor để xử lý lỗi 403 toàn cục
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            router.push('/login-register/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance