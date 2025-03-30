<template>
    <div class="login-wrapper">
        <!-- Background với overlay gradient -->
        <div class="background-container">
            <div class="background-overlay"></div>
        </div>

        <div class="breadcrumb">
            <div class="breadcrumb-content">
                <a @click="chuyenTrang('/home')" class="breadcrumb-link" style="cursor: pointer;">Trang chủ</a>
                <span class="separator">/</span>
                <span class="current">Đăng nhập</span>
            </div>
        </div>
        <!-- Form đăng nhập -->
        <div class="login-container">
            <div class="login-box">
                <div class="login-header">
                    <a href="">
                        <img src="../../images/logo/logoGB.png" alt="Logo G&B SPORTS"
                            class="container-fluid d-flex justify-content-center align-items-center mb-3"
                            style="width:150px">
                    </a>

                    <p>Chào mừng bạn quay trở lại với G&B SPORTS! 👋</p>
                </div>

                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label for="email">
                            <i class="fas fa-envelope"></i> Email
                        </label>
                        <input type="email" id="email" v-model="email" class="form-control"
                            placeholder="Nhập email của bạn" required />
                    </div>

                    <div class="form-group">
                        <label for="password">
                            <i class="fas fa-lock"></i> Mật khẩu
                        </label>
                        <div class="password-input">
                            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                                class="form-control" placeholder="Nhập mật khẩu" required />
                            <span class="password-toggle" @click="togglePassword">
                                <EyeInvisibleOutlined v-if="!showPassword" />
                                <EyeOutlined v-else />
                            </span>
                        </div>
                    </div>

                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox" v-model="rememberMe" />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" class="forgot-password">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" class="login-button" :disabled="isLoading">
                        <span v-if="!isLoading">Đăng nhập</span>
                        <span v-else class="loading-spinner"></span>
                    </button>

                    <div class="signup-prompt">
                        Bạn chưa có tài khoản? <a @click="chuyenTrang('/login-register/register')" class="signup-link">Đăng
                            ký</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);

const chuyenTrang = (path) => {
    router.push(path);
}

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
    try {
        isLoading.value = true;
        // Xử lý logic đăng nhập ở đây
        await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập API call

        toast.success('Đăng nhập thành công!');
        router.push('/dashboard');
    } catch (error) {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.login-wrapper {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

.background-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://cdn.hpdecor.vn/wp-content/uploads/2022/01/cua-hang-quan-ao-the-thao.jpg');
    background-size: cover;
    background-position: center;
    z-index: 1;
}

.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.4) 100%);
    backdrop-filter: blur(2px);
    z-index: 2;
}

.login-container {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    padding: 20px;
}

.login-box {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 40px;
    width: 100%;
    max-width: 480px;
    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.login-header h2 {
    color: #000000;
    font-size: 28px;
    margin-bottom: 10px;
}

.login-header p {
    color: #333333;
    font-size: 16px;
}

.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
}

.form-control {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.7);
}

.form-control:focus {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
}

.password-input {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.6);
    z-index: 10;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.password-toggle:hover {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.8);
}

.password-toggle i {
    font-size: 18px;
}

.password-input .form-control {
    padding-right: 55px;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
}

.forgot-password {
    color: rgba(0, 0, 0, 0.7);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.forgot-password:hover {
    color: rgba(0, 0, 0, 0.9);
    text-decoration: underline;
}

.login-button {
    width: 100%;
    padding: 14px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.login-button:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.login-button:active {
    transform: translateY(0);
}

.login-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Custom checkbox style */
input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    accent-color: #000000;
}

@media (max-width: 480px) {
    .login-box {
        padding: 24px;
        margin: 20px;
    }

    .login-header h2 {
        font-size: 24px;
    }

    .form-options {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
}

.signup-prompt {
    text-align: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.7);
    font-size: 15px;
}

.signup-link {
    color: #000;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
}

.signup-link:hover {
    opacity: 0.7;
    text-decoration: underline;
}

.breadcrumb {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 10;
}

.breadcrumb-content {
    font-size: 15px;
    display: flex;
    align-items: center;
}

.breadcrumb-link {
    color: #000;
    text-decoration: none;
    font-weight: normal;
    transition: all 0.2s ease;
    position: relative;
}

.breadcrumb-link:after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: #000;
    transition: width 0.2s ease;
}

.breadcrumb-link:hover:after {
    width: 100%;
}

.breadcrumb-link:hover {
    opacity: 0.7;
}

.breadcrumb .separator {
    margin: 0 8px;
    color: #000;
    font-weight: normal;
}

.breadcrumb .current {
    color: #000;
    font-weight: 600;
}

@media (max-width: 480px) {
    .breadcrumb {
        top: 20px;
        left: 20px;
    }
}
</style>