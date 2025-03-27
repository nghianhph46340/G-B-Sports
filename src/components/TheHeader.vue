<template>
    <div class="header-container fixed-top" @mouseout="store.hideModalSideBar(0)">
        <div class="row">
            <div class="col-12 headers d-flex align-items-center">
                <div class="logo-section col-sm-3 d-flex justify-content-center align-items-center">
                    <img src="../images/logo/logo2.png" class="logo-image img-fluid ms-2" alt="GB Sports Logo">
                    <div class="language-selector col-sm-3 d-flex justify-content-center align-items-center">
                        <span class="h-100 langue" @click="store.getLangue(store.check)">
                            {{ !store.changeLanguage.nguoiDung ? 'EN' : store.language }}
                        </span>
                    </div>
                </div>
                <div class="search-section col-sm-6">
                    <div class="search-container d-flex align-items-center">
                        <Search class="search-icon ms-3" />
                        <input type="text" @click="store.showModal(true)" class="search-input form-control"
                            :placeholder="!store.changeLanguage.timKiem ? 'Bạn đang muốn tìm kiếm gì?' : store.changeLanguage.timKiem">
                    </div>
                    <TheHeaderSearchModal />
                </div>
                <div class="nav-icons col-sm-3 d-flex justify-content-evenly align-items-center">
                    <div class="nav-item text-center" @mouseenter="animateIcon('user')">
                        <div class="icon-container">
                            <User class="nav-icon" :class="{ 'icon-animated': animatedIcon === 'user' }" />
                        </div>
                        <span class="nav-text">{{ !store.changeLanguage.nguoiDung ? 'Đăng nhập' :
                            store.changeLanguage.nguoiDung }}</span>
                    </div>
                    <div class="nav-item text-center" @mouseenter="animateIcon('store')">
                        <div class="icon-container">
                            <Store class="nav-icon" :class="{ 'icon-animated': animatedIcon === 'store' }" />
                        </div>
                        <span class="nav-text">{{ !store.changeLanguage.cuaHang ? 'Cửa hàng' :
                            store.changeLanguage.cuaHang }}</span>
                    </div>
                    <div class="nav-item text-center" @mouseenter="animateIcon('support')">
                        <div class="icon-container">
                            <MessageCircleQuestion class="nav-icon"
                                :class="{ 'icon-animated': animatedIcon === 'support' }" />
                        </div>
                        <span class="nav-text">{{ !store.changeLanguage.hoTro ? 'Hỗ trợ' : store.changeLanguage.hoTro
                            }}</span>
                    </div>
                    <div class="nav-item text-center" @mouseenter="animateIcon('cart')">
                        <div class="icon-container">
                            <ShoppingCart class="nav-icon" :class="{ 'icon-animated': animatedIcon === 'cart' }" />
                            <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
                        </div>
                        <span class="nav-text">{{ !store.changeLanguage.gioHang ? 'Giỏ hàng' :
                            store.changeLanguage.gioHang }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next';
import { User } from 'lucide-vue-next';
import { Store } from 'lucide-vue-next';
import { MessageCircleQuestion } from 'lucide-vue-next';
import { ShoppingCart } from 'lucide-vue-next';
import { useGbStore } from '@/stores/gbStore';
import TheHeaderSearchModal from './TheHeaderSearchModal.vue';
import { ref } from 'vue';

const store = useGbStore();
const animatedIcon = ref(null);
const cartItemCount = ref(0); // Giả sử số lượng sản phẩm trong giỏ hàng

const animateIcon = (iconName) => {
    animatedIcon.value = iconName;
    setTimeout(() => {
        animatedIcon.value = null;
    }, 500);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.header-container {
    padding: 0 2rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    background: linear-gradient(to right, #ffffff, #f8f9fa);
    z-index: 1030;
    width: 100%;
}

.headers {
    height: 5rem;
    background-color: transparent;
    position: relative;
}

.logo-image {
    height: 4rem;
    width: auto;
    transition: transform 0.3s ease;
}

.logo-image:hover {
    transform: scale(1.05);
}

.language-selector {
    position: relative;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 20px;
    transition: all 0.3s ease;
}

.langue {
    font-size: 1.1rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    color: #333;
    transition: all 0.3s ease;
}

.language-selector:hover {
    background-color: #3a86ff;
}

.language-selector:hover .langue {
    color: white;
}

.search-container {
    height: 3rem;
    border: 1px solid #e0e0e0;
    border-radius: 30px;
    overflow: hidden;
    transition: all 0.3s ease;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-container:focus-within {
    border-color: #3a86ff;
    box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.2);
    transform: translateY(-2px);
}

.search-icon {
    color: #666;
    transition: color 0.3s ease;
}

.search-container:focus-within .search-icon {
    color: #3a86ff;
}

.search-input {
    border: none;
    outline: none;
    box-shadow: none;
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
}

.search-input:focus {
    background-color: transparent;
}

.nav-icons {
    display: flex;
    justify-content: space-around;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    padding: 5px;
    border-radius: 8px;
}

.nav-item:hover {
    transform: translateY(-3px);
}

.icon-container {
    position: relative;
    margin-bottom: 5px;
}

.nav-icon {
    width: 24px;
    height: 24px;
    color: #333;
    transition: all 0.3s ease;
}

.nav-item:hover .nav-icon {
    color: #3a86ff;
}

.icon-animated {
    animation: pulse 0.5s ease;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

.nav-text {
    font-size: 11px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    color: #555;
    transition: color 0.3s ease;
}

.nav-item:hover .nav-text {
    color: #3a86ff;
}

.cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff3a3a;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}
</style>