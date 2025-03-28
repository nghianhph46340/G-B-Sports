<template>
    <div class="container-fluid" style="width: 85%;">
        <form class="d-flex align-items-center justify-content-start" role="search" @submit.prevent="handleSearch">
            <SearchOutlined class="icon-search" @click="handleSearch" />
            <input class="form-control me-2" v-model="searchInput" type="search" placeholder="Bạn muốn tìm gì?"
                aria-label="Search">
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';

const store = useGbStore();
const route = useRoute();
const searchInput = ref('');

// Hàm xóa kết quả tìm kiếm
const clearSearchResults = () => {
    store.searchs = '';
    store.searchSanPham = [];
    store.searchChiSanPham = [];
    store.nhanVienSearch = [];
    searchInput.value = '';
};

// Theo dõi sự thay đổi của route và xóa kết quả tìm kiếm khi route thay đổi
watch(() => route.name, (newRouteName, oldRouteName) => {
    if (newRouteName !== oldRouteName) {
        clearSearchResults();
    }
}, { immediate: true });

// Theo dõi sự thay đổi của ô tìm kiếm
watch(searchInput, (newValue) => {
    // Nếu ô tìm kiếm trống, tự động load lại tất cả dữ liệu
    if (!newValue || newValue.trim() === '') {
        clearSearchResults();

        // Load lại dữ liệu dựa trên route hiện tại
        if (route.name === 'admin-quan-ly-san-pham') {
            store.getAllSP();
        }
        else if (route.name === 'admin-quan-ly-nhan-vien') {
            store.getAllNhanVien(0, 5);
        }
        // Thêm các route khác nếu cần
    }
});

// Hàm xử lý tìm kiếm
const handleSearch = async () => {
    if (!searchInput.value || searchInput.value.trim() === '') {
        // Nếu ô tìm kiếm trống, xóa kết quả tìm kiếm
        clearSearchResults();
        return;
    }

    console.log('Đang tìm kiếm với từ khóa:', searchInput.value);

    // Cập nhật giá trị tìm kiếm vào store
    store.searchs = searchInput.value;

    try {
        // Tìm kiếm dựa trên route hiện tại
        if (route.name === 'admin-quan-ly-san-pham') {
            await store.searchSP(searchInput.value);
            console.log('Kết quả tìm kiếm sản phẩm:', store.searchSanPham);
        }
        else if (route.name === 'admin-quan-ly-nhien') {
            await store.searchNhanVien(searchInput.value, 0, 5);
            console.log('Kết quả tìm kiếm nhân viên:', store.nhanVienSearch);
        }
        // Thêm các route khác nếu cần
        else {
            console.log('Chức năng tìm kiếm chưa được hỗ trợ cho route này:', route.name);
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