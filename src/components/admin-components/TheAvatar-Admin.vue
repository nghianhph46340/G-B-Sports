<template>
  <div class="d-flex align-items-center">
    <!-- Hiển thị tên tài khoản -->
    <span class="ms-2 me-2" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
      {{ store.userDetails?.tenNhanVien || store.userDetails?.tenKhachHang || store.userInfo?.ten_dang_nhap || 'Người dùng' }}
    </span>

    <!-- Dropdown với avatar -->
    <a-dropdown>
      <a-avatar size="large">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>

      <template #overlay>
        <a-menu>
          <a-menu-item key="0">
            <a target="_blank" style="text-decoration: none;" rel="noopener noreferrer" href="#">
              Hồ sơ
            </a>
          </a-menu-item>
          <a-menu-item key="1">
            <a target="_blank" style="text-decoration: none;" rel="noopener noreferrer" @click="store.logout()">
              Đăng xuất
            </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { useGbStore } from '@/stores/gbStore';
import { onMounted } from 'vue';
import { khachHangService } from '@/services/khachHangService';
const store = useGbStore();

// Kiểm tra trạng thái khi component được mount
onMounted(() => {
    console.log('Store trong TheAvatar (onMounted):', store);
    console.log('User Info trong TheAvatar:', store.userInfo);
    console.log('User Details trong TheAvatar:', store.userDetails);

    // Nếu không có userDetails nhưng đã đăng nhập, thử lấy lại thông tin chi tiết
    if (store.isLoggedIn && !store.userDetails && store.userInfo?.ten_dang_nhap) {
        console.log('Khôi phục userDetails từ API...');
        khachHangService.getUserDetail({
            username: store.userInfo.ten_dang_nhap,
            id_roles: store.id_roles
        }).then(userDetails => {
            store.userDetails = userDetails;
            sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
            if (localStorage.getItem('isLoggedIn') === 'true') {
                localStorage.setItem('userDetails', JSON.stringify(userDetails));
            }
            console.log('User Details sau khi khôi phục:', store.userDetails);
        }).catch(error => {
            console.error('Lỗi khi khôi phục userDetails:', error);
        });
    }
});
</script>