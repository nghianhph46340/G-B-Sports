<template>
    <div class="container-fluid" style="width: 70%;">
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
    if (route.name === 'admin-quan-ly-san-pham') {
        // Chỉ cập nhật keyword, giữ nguyên các tham số lọc khác
        store.updateSearchFilterParams({ keyword: '' });
        store.applySearchAndFilter();
    } else {
        // Xử lý các trường hợp khác
        store.searchs = '';
        store.nhanVienSearch = [];
        store.getAllKhachHangArr = [];
    }
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
        if (route.name === 'admin-quan-ly-san-pham') {
            // Chỉ cập nhật keyword, giữ nguyên các tham số lọc khác
            store.updateSearchFilterParams({ keyword: '' });
            store.applySearchAndFilter();
        } else if (route.name === 'admin-quan-ly-nhan-vien') {
            store.getAllNhanVien(0, 5);
        } else if (route.name === 'admin-quan-ly-khach-hang') {
            store.getAllKhachHang(0, 3, null, null);
        }
    }
});

// Hàm xử lý tìm kiếm
const handleSearch = async () => {
    if (!searchInput.value || searchInput.value.trim() === '') {
        clearSearchResults();
        return;
    }

    console.log('Đang tìm kiếm với từ khóa:', searchInput.value);

    try {
        // Tìm kiếm dựa trên route hiện tại
        if (route.name === 'admin-quan-ly-san-pham') {
            // Cập nhật keyword trong đối tượng searchFilterParams, giữ nguyên các tham số lọc khác
            store.updateSearchFilterParams({ keyword: searchInput.value });
            
            // Áp dụng tìm kiếm và lọc với tất cả tham số
            await store.applySearchAndFilter();
            
            console.log('Kết quả tìm kiếm:', store.filteredProductsData);
            console.log('Số lượng sản phẩm tìm thấy:', store.filteredProductsData.length);
        }
        else if (route.name === 'admin-quan-ly-nhan-vien') {
            // Xử lý tìm kiếm nhân viên như cũ
            store.searchs = searchInput.value;
            await store.searchNhanVien(searchInput.value, 0, 5);
            console.log('Kết quả tìm kiếm nhân viên:', store.nhanVienSearch);
        }
        else if (route.name === 'admin-quan-ly-khach-hang') {
            // Xử lý tìm kiếm khách hàng như cũ
            store.searchs = searchInput.value;
            await store.getAllKhachHang(0, 3, searchInput.value, null);
            console.log('Kết quả tìm kiếm khách hàng:', store.khachHangSearch);
        }
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