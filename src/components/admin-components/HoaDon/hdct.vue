<template>
    <div class="container-fluid">
        <span class="text-center pb-2">Thông tin chi tiết đơn hàng </span>

    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id;
import { useGbStore } from '@/stores/gbStore';
const store = useGbStore();
const hoaDon = ref(store.getAllHoaDonArr.find(hoaDon => hoaDon.id_hoa_don === id));
// {{  hoaDon ? hoaDon.ma_hoa_don : 'Không tìm thấy hóa đơn'  }}

</script> 
<style scoped>

</style>
