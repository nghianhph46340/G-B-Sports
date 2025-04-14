import axios from "axios";
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
        const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.error('Token not found in localStorage');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance