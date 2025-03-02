<template>
    <div>
        <table class="table table-hover fade-in-table">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Mã sản phẩm</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Mô tả</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Giới tính</th>
                    <th scope="col">Chất liệu</th>
                    <th scope="col">Thương hiệu</th>
                    <th scope="col">Danh mục</th>
                    <th scope="col">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ctsp, index) in store.getAllChiTietSanPham" :key="ctsp.id_chi_tiet_san_pham">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>Đôn có gì</td>
                    <td>{{ ctsp.ten_san_pham }}</td>
                    <td>Đôn có gì</td>
                    <td>Đôn có gì</td>
                    <td>{{ ctsp.trang_thai }}</td>
                    <td>Giới tính</td>
                    <td>{{ ctsp.ten_chat_lieu }}</td>
                    <td>{{ ctsp.ten_thuong_hieu }}</td>
                    <td>{{ ctsp.ten_danh_muc }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useGbStore } from '@/stores/gbStore';
import { onMounted } from 'vue';
const store = useGbStore();
onMounted(() => {
    console.log("Component mounted, fetching data...");
    store.getAllCTSP();
})
</script>

<style scoped>
.fade-in-table {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.3s ease-out forwards;
}

table {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 14px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>