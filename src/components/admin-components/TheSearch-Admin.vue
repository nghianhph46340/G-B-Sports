<template>
    <div class="container-fluid" style="width: 85%;">
        <form class="d-flex align-items-center justify-content-start" role="search" @submit.prevent="handleSearch">
            <SearchOutlined class="icon-search" @click="handleSearch" />
            <input class="form-control me-2" v-model="search" type="search" placeholder="Bạn muốn tìm gì?"
                aria-label="Search" @input="debounceSearch">
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';


const store = useGbStore();
const route = useRoute();
const search = computed({
    get: () => store.searchs,
    set: (value) => store.searchs = value
});

// Biến để lưu timeout ID cho debounce
let searchTimeout = null;

// Hàm debounce cho tìm kiếm
const debounceSearch = () => {
    // Xóa timeout cũ nếu có
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Tạo timeout mới
    searchTimeout = setTimeout(() => {
        if (search.value && search.value.trim() !== '') {
            handleSearch();
        }
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
};

// Hàm xử lý tìm kiếm
const handleSearch = async () => {
    if (!search.value || search.value.trim() === '') {
        return;
    }

    console.log('Đang tìm kiếm với từ khóa:', search.value);

    try {
        // Tìm kiếm cả sản phẩm và chi tiết sản phẩm
        if (route.name === 'admin-quan-ly-san-pham') {
            await store.searchSP(search.value);
            // await store.searchCTSP(search.value);
            console.log('Kết quả tìm kiếm sản phẩm:', store.searchSanPham);
        }
        if (route.name === 'admin-quan-ly-nhan-vien') {
            await store.searchNV(search.value);
            console.log('Kết quả tìm kiếm nhân viên:', store.searchNhanVien);
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
    }
};
</script>

<style scoped>
.form-control {
    border: none;
    outline: none;
}

.icon-search {
    font-size: 16px;
    color: #565656;
    cursor: pointer;
}

.form-control:focus {
    box-shadow: none;
}
</style>