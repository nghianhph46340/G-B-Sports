<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible theme="light">
            <div class="logo p-3" style="text-align: center;">
                <img class="w-75" src="../../images/logo/logo2.png" alt="Logo" />
            </div>

            <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
                <a-menu-item key="1" @click="changeRoute('/admin')">
                    <HomeOutlined />
                    <span>Bán hàng</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <AreaChartOutlined />
                    <span>Báo cáo thống kê</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <ReconciliationOutlined />
                            <span>Sản phẩm</span>
                        </span>
                    </template>
                    <a-menu-item key="3" @click="changeRoute('/admin/quanlysanpham')">Tất cả
                        sản
                        phẩm</a-menu-item>
                    <a-menu-item key="4">Sản phẩm</a-menu-item>
                    <a-menu-item key="5">Thương hiệu</a-menu-item>
                    <a-menu-item key="6">Danh mục</a-menu-item>
                    <a-menu-item key="7">Thuộc tính</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="8">
                    <AccountBookOutlined />
                    <span>Hóa đơn</span>
                </a-menu-item>
                <a-menu-item key="9">
                    <SolutionOutlined />
                    <span>Nhân viên</span>
                </a-menu-item>
                <a-sub-menu key="sub2">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>Tài khoản</span>
                        </span>
                    </template>
                    <a-menu-item key="10">Nhân viên</a-menu-item>
                    <a-menu-item key="11">Khách hàng</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="12">
                    <LaptopOutlined />
                    <span>Cửa hàng</span>
                </a-menu-item>
                <a-menu-item key="13">
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header class=" d-flex align-items-center justify-content-between pe-4"
                style="background: #fff; padding: 0">
                <div class="">
                    <h3 class="mt-2 ms-2">{{ pageTitle }}</h3>
                </div>
                <TheSearchAdmin />
                <div class="">

                    <TheAvatarAdmin />
                </div>
            </a-layout-header>
            <a-layout-content style="margin: 16px 16px">

                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                G-B Sports ©2024 Created by GB-Sports
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup>

import { computed, onMounted, ref } from 'vue';
import { HomeOutlined, AreaChartOutlined, UserOutlined, ReconciliationOutlined, SolutionOutlined, LaptopOutlined, LogoutOutlined, AccountBookOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import TheAvatarAdmin from './TheAvatar-Admin.vue';
import TheSearchAdmin from './TheSearch-Admin.vue';
import { useGbStore } from '@/stores/gbStore';
const router = useRouter();
const store = useGbStore();
const collapsed = ref(false);
const selectedKeys = ref(['1']);
const pageTitle = ref('Bán hàng');
const changeRoute = (path) => {
    console.log(path);
    router.push(path);
    store.getPath(path);
    switch (path) {
        case '/admin':
            pageTitle.value = 'Bán hàng';
            break;

        case '/admin/quanlysanpham':
            pageTitle.value = 'Sản phẩm';
            break;

        default:
            pageTitle.value = 'Bán hàng';
            break;

    }
};
// watch(() => router.path, (newPath) => {
//     selectedKeys.value = [getKeyByPath(newPath)];
// });
</script>
<style scoped>
:deep(.ant-menu-item-selected) {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    background-color: #7D3C98 !important;
    color: white !important;
}

:deep(.ant-menu-light .ant-menu-submenu-selected>.ant-menu-submenu-title) {
    color: #7D3C98 !important;
}

#components-layout-demo-sider .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 253, 253, 0.3);
}

.site-layout .site-layout-background {
    background: #010101;
}

[data-theme='light'] .site-layout .site-layout-background {
    background: #484848;
}
</style>