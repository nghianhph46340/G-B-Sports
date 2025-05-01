<template>
  <!-- No changes to template section -->
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const searchInput = ref('');
    const route = ref(null);

    // Hàm xử lý tìm kiếm
    const handleSearch = async () => {
      if (!searchInput.value || searchInput.value.trim() === '') {
        // Nếu ô tìm kiếm trống, xóa kết quả tìm kiếm
        clearSearchResults();
        return;
      }

      console.log('Đang tìm kiếm với từ khóa:', searchInput.value);

      try {
        // Tìm kiếm dựa trên route hiện tại
        if (route.value.name === 'admin-quan-ly-san-pham') {
          // Thêm log debug
          console.log('Tìm kiếm sản phẩm với từ khóa:', searchInput.value);
          
          // Thay thế searchSP bằng applySearchAndFilter với chỉ keyword
          await store.applySearchAndFilter(
            searchInput.value, // keyword
            null, // tenSanPham (null thay vì truyền giá trị)
            null, // giaBanMin
            null, // giaBanMax
            null, // soLuongMin (null thay vì 0)
            null, // soLuongMax (null thay vì 0)
            null, // trangThai (null thay vì giá trị rỗng)
            [], // listMauSac
            [], // listDanhMuc
            [], // listThuongHieu
            [], // listChatLieu
            [] // listKichThuoc
          );
          
          console.log('Kết quả tìm kiếm:', store.filteredProductsData);
          console.log('Số lượng sản phẩm tìm thấy:', store.filteredProductsData.length);
          
          // Phát sự kiện để thông báo thay đổi
          window.dispatchEvent(new CustomEvent('search-filter-changed', {
            detail: { 
              results: store.filteredProductsData,
              keyword: searchInput.value
            }
          }));
        }
        // ... existing code ...
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
      }
    };

    return {
      searchInput,
      route,
      handleSearch
    };
  }
};
</script>

<style>
  /* No changes to style section */
</style> 