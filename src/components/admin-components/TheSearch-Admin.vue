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
        store.resetSearch();
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
        clearSearchResults();

        // Load lại dữ liệu dựa trên route hiện tại
        if (route.name === 'admin-quan-ly-san-pham') {
            // Sử dụng resetSearch thay vì getAllSP
            store.resetSearch();
        }
        else if (route.name === 'admin-quan-ly-nhan-vien') {
            store.getAllNhanVien(0, 5);
        }
        else if (route.name === 'admin-quan-ly-khach-hang') {
            store.getAllKhachHang(0, 3, null, null);
        }
        // Thêm các route khác nếu cần
    }
});

// Hàm xử lý tìm kiếm
const handleSearch = async () => {
    // Lấy chuỗi tìm kiếm đã được xử lý
    const formattedValue = formattedSearchInput.value;

    // Giữ lại các bộ lọc hiện tại
    const currentFilters = { ...store.searchFilterParams };
    if (!searchInput.value || searchInput.value.trim() === '') {
        // Nếu ô tìm kiếm trống, xóa kết quả tìm kiếm
        clearSearchResults();
        return;
    }

    console.log('Đang tìm kiếm với từ khóa:', searchInput.value);

    try {
        // Tìm kiếm dựa trên route hiện tại
        if (route.name === 'admin-quan-ly-san-pham') {
            if (!formattedValue) {
                // Nếu ô tìm kiếm trống, chỉ xóa keyword, giữ nguyên các bộ lọc
                currentFilters.keyword = '';
                store.updateSearchFilterParams(currentFilters);
            } else {
                // Cập nhật keyword nhưng giữ nguyên các bộ lọc
                currentFilters.keyword = formattedValue;
                store.updateSearchFilterParams(currentFilters);

                console.log('Đang tìm kiếm với từ khóa:', formattedValue);
                console.log('Các bộ lọc hiện tại:', currentFilters);
            }

            try {
                // Áp dụng cả tìm kiếm và lọc
                await store.applySearchAndFilter();

                // Phát sự kiện để thông báo thay đổi
                window.dispatchEvent(new CustomEvent('search-filter-changed', {
                    detail: {
                        results: store.filteredProductsData,
                        keyword: formattedValue
                    }
                }));

                console.log('Kết quả tìm kiếm và lọc:', store.filteredProductsData.length, 'sản phẩm');
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
            }

            // Cập nhật giá trị hiển thị trong ô tìm kiếm để người dùng thấy chuỗi đã được chuẩn hóa
            searchInput.value = formattedValue;
        }
        else if (route.name === 'admin-quan-ly-nhan-vien') {
            // Cập nhật giá trị tìm kiếm vào store cho các route khác
            store.searchs = searchInput.value;
            await store.searchNhanVien(searchInput.value, 0, 5);
            console.log('Kết quả tìm kiếm nhân viên:', store.nhanVienSearch);
        }
        else if (route.name === 'admin-quan-ly-khach-hang') {
            // Cập nhật giá trị tìm kiếm vào store cho các route khác
            store.searchs = searchInput.value;
            await store.getAllKhachHang(0, 3, searchInput.value, null);
            console.log('Kết quả tìm kiếm khách hàng:', store.khachHangSearch);
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