<template>
  <div class="d-flex align-items-center">
    <!-- Hiển thị tên tài khoản -->
    <span class="ms-2 me-2" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
      {{ store.userDetails?.ten_nhan_vien || store.userDetails?.ten_khach_hang || store.userInfo?.ten_dang_nhap ||
      'Người dùng' }}
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

const store = useGbStore();

// In thông tin để kiểm tra
console.log('Store trong TheAvatar:', store);
console.log('User Info trong TheAvatar:', store.userInfo);
console.log('User Details trong TheAvatar:', store.userDetails);
</script>