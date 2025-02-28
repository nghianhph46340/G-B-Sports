<template>
    <div v-if="store.checkNoitification" class="sale-notification">
        <h1>Siêu Sale Sập Sàn!</h1>
        <p>Giảm đến 50% cho mỗi sản phẩm, khám phá ngay</p>
        <p><img src="../images/product/shoe/anhGiayTheThao.webp" class="w-50" alt=""></p>
        <button @click="store.closeNoitification">Close</button>
    </div>
</template>

<script setup>
import { useGbStore } from '../stores/gbStore';
const store = useGbStore();
</script>

<style scoped>
.sale-notification {
    padding: 20px;
    background-color: #ff4757;
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    /* Đảm bảo thông báo hiển thị trên cùng */
}

button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: white;
    color: #ff4757;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>