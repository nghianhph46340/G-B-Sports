<template>
    <a-layout class="" style="min-height: 100vh">
        <a-layout-sider class="sider " v-model:collapsed="collapsed" :trigger="null" collapsible theme="light">
            <div class="logo p-3 " style="text-align: center;">
                <img class="w-50 " src="../../images/logo/logo2.png" alt="Logo" />
            </div>

            <a-menu class="" v-model:selectedKeys="selectedKeys" theme="light" mode="inline">

                <a-menu-item key="2" @click="changeRoute('/admin/baocaothongke')">
                    <AreaChartOutlined />
                    <span>Thống kê</span>
                </a-menu-item>
                <a-menu-item key="1" @click="changeRoute('/admin');">
                    <HomeOutlined />
                    <span>Bán hàng</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <ReconciliationOutlined />
                            <span>Sản phẩm</span>
                        </span>
                    </template>
                    <a-menu-item key="3" @click="changeRoute('/admin/quanlysanpham');">Tất cả
                        sản
                        phẩm</a-menu-item>
                    <a-menu-item key="4">Sản phẩm</a-menu-item>
                    <a-menu-item key="5">Biến thể sản phẩm</a-menu-item>
                    <!-- <a-menu-item key="6">Thuộc tính</a-menu-item> -->
                    <a-menu-item key="7">Thuộc tính</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="8" @click="changeRoute('/admin/quanlyhoadon');">
                    <AccountBookOutlined />
                    <span>Hóa đơn</span>
                </a-menu-item>
                <a-sub-menu key="sub2">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>Tài khoản</span>
                        </span>
                    </template>
                    <a-menu-item key="10" @click="changeRoute('/admin/quanlynhanvien');">Nhân viên</a-menu-item>
                    <a-menu-item key="11">Khách hàng</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub3">
                    <template #title>
                        <span>
                            <ReconciliationOutlined />
                            <span>Ưu đãi</span>
                        </span>
                    </template>
                    <a-menu-item key="12">Voucher</a-menu-item>
                    <a-menu-item key="13">Khuyến mãi</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="14">
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header class="sticky-top d-flex align-items-center justify-content-evenly pe-4 header-admin"
                style="background: #fff; padding: 0; z-index: 1;">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                <TheSearchAdmin />
                <div class="">

                    <TheAvatarAdmin />
                </div>
            </a-layout-header>
            <a-layout-content class="content-admin" style="margin: 16px 16px">

                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px', borderRadius: '10px' }">
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
import { HomeOutlined, AreaChartOutlined, UserOutlined, ReconciliationOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LaptopOutlined, LogoutOutlined, AccountBookOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import TheAvatarAdmin from './TheAvatar-Admin.vue';
import TheSearchAdmin from './TheSearch-Admin.vue';
import { useGbStore } from '@/stores/gbStore';
import { useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const store = useGbStore();
const collapsed = ref(false);
const selectedKeys = ref([store.indexMenu]);
console.log(selectedKeys);

const pageTitle = ref('Bán hàng');
const changeRoute = (path) => {
    store.getPath(path);
    store.getIndex(path);
    router.push(path);
    console.log(store.checkRouter);
    // let paths = router.path;
    switch (path) {
        case '/admin':
            pageTitle.value = 'Bán hàng';
            break;
        case '/admin/baocaothongke':
            pageTitle.value = 'Thống kê';
            break;
        case '/admin/quanlysanpham':
            pageTitle.value = 'Sản phẩm';
            break;
        case '/admin/quanlynhanvien':
            pageTitle.value = 'Nhân viên';
            break;
        case '/admin/quanlynhanvien/add':
            pageTitle.value = 'Nhân viên';
            break;
        case '/admin/quanlynhanvien/update':
            pageTitle.value = 'Nhân viên';
            break;
        default:
            pageTitle.value = 'Bán hàng';
            break;

    }
};
// const getIndexPath = () => {
//     const paths = route.path;
//     console.log(paths + 'patchGetIndex');
//     switch (paths) {
//         case '/admin':
//             selectedKeys.value = ['1'];
//             break;

//         case '/admin/quanlysanpham':
//             selectedKeys.value = ['3'];
//             break;

//         default:
//             selectedKeys.value = ['1'];
//             break;

//     }
// }
// watch(() => router.path, (newPath) => {
//     selectedKeys.value = [getKeyByPath(newPath)];
// });
onMounted(() => {
    store.getIndex(route.path);
    selectedKeys.value = store.indexMenu;
})
</script>
<style scoped>
:deep(.ant-menu-item-selected) {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    background-color: #343434 !important;
    color: white !important;
}

:deep(.ant-menu-light .ant-menu-submenu-selected>.ant-menu-submenu-title) {
    color: #030303 !important;
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

#title-page {
    background-color: #484848;
    color: white;
}

.trigger {
    font-size: 20px;
    margin-left: 1rem;
}

.sider {
    /* background-color: #484848; */
    /* border-radius: 10px; */
    /* box-shadow: 0 50px 50px rgba(0, 0, 0, 0.6); */
}

.header-admin {
    /* box-shadow: 0 0 50px rgba(0, 0, 0, 0.6); */
    border-bottom-right-radius: 10px;
    box-shadow: 0 4px 10px -5px rgba(122, 122, 122, 0.6);
    /* filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.6)); */

}

.content-admin {
    box-shadow: 0 0 10px rgba(207, 207, 207, 0.6);
    border-radius: 10px;
}

.logo {
    /* border-bottom: 1px solid rgba(207, 207, 207, 0.6); */
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
}
</style>