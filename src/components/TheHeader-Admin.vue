<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo" style="text-align: center;">
                <img class="w-75" src="../images/logo/logoGB2.png" alt="Logo" />
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item key="1">
                    <pie-chart-outlined />
                    <span>Option 1</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <desktop-outlined />
                    <span>Option 2</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>User</span>
                        </span>
                    </template>
                    <a-menu-item key="3">Tom</a-menu-item>
                    <a-menu-item key="4">Bill</a-menu-item>
                    <a-menu-item key="5">Alex</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                    <template #title>
                        <span>
                            <team-outlined />
                            <span>Team</span>
                        </span>
                    </template>
                    <a-menu-item key="6">Team 1</a-menu-item>
                    <a-menu-item key="8">Team 2</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="9">
                    <file-outlined />
                    <span>File</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0" />
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item>User</a-breadcrumb-item>
                    <a-breadcrumb-item>Bill</a-breadcrumb-item>
                </a-breadcrumb>
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Mã sản phẩm</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Hình ảnh</th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Chất liệu</th>
                                <th scope="col">Thương hiệu</th>
                                <th scope="col">Danh mục</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ctsp, index) in store.getAllChiTietSanPham" :key="ctsp.id_chi_tiet_san_pham">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>Đôn có gì</td>
                                <td>{{ ctsp.ten_san_pham }}</td>
                                <td>Đôn có gì</td>
                                <td>Đôn có gì</td>
                                <td>{{ ctsp.trang_thai }}</td>
                                <td>Giới tính</td>
                                <td>{{ ctsp.ten_chat_lieu }}</td>
                                <td>{{ ctsp.ten_thuong_hieu }}</td>
                                <td>{{ ctsp.ten_danh_muc }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                G-B Sports ©2024 Created by GB-Sports
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup>
import { useGbStore } from '@/stores/gbStore';
import { ref } from 'vue';
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons-vue';
import { onMounted } from 'vue';
onMounted(() => {
    store.getAllSP();
    store.getAllCTSP();
})
const store = useGbStore();
const collapsed = ref(false);
const selectedKeys = ref(['1']);
</script>
<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>