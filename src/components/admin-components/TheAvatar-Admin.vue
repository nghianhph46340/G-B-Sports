<template>
  <div>
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
            <a target="_blank" style="text-decoration: none;" rel="noopener noreferrer" href="http://www.taobao.com/">
              Đăng xuất
            </a>
          </a-menu-item>
          <!-- <a-menu-divider /> -->

        </a-menu>
      </template>

    </a-dropdown>
    <span class="ms-2 " style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Admin</span>
  </div>
</template>
<script setup>
import { UserOutlined } from '@ant-design/icons-vue';
</script>