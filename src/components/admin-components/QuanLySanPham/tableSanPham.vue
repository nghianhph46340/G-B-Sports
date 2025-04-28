<template>
    <!-- <a-space align="center" style="margin-bottom: 16px">
        CheckStrictly:
        <a-switch v-model:checked="rowSelection.checkStrictly"></a-switch>
    </a-space> -->
    <!-- <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :expandable="expandableConfig"
        class="components-table-demo-nested" /> -->
    <div>
        <menuAction ref="menuActionRef" @refresh-data="handleMenuActionRefresh" />
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="ms-3 mb-0">Danh sách sản phẩm</h4>
            <a-button @click="refreshData" :loading="isLoading" type="primary" class="refresh-button" shape="circle">
                <ReloadOutlined />
            </a-button>
        </div>

        <!-- Loading skeleton -->
        <template v-if="isLoading">
            <a-skeleton active :paragraph="{ rows: 10 }" />
        </template>

        <!-- Data table -->
        <template v-else>
            <!-- Thêm bộ lọc trạng thái -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="status-filter">
                    <a-radio-group v-model:value="statusFilter" @change="handleStatusFilterChange" button-style="solid"
                        class="custom-radio-group">
                        <a-radio-button value="">Tất cả</a-radio-button>
                        <a-radio-button value="Hoạt động">Hoạt động</a-radio-button>
                        <a-radio-button value="Không hoạt động">Không hoạt động</a-radio-button>
                    </a-radio-group>
                    <span class="ms-3">
                        <span class="badge bg-primary">{{ displayData.length }} sản phẩm</span>
                        <template v-if="statusFilter">
                            <strong class="ms-2">Lọc theo: {{ statusFilter }}</strong>
                        </template>
                    </span>
                </div>
            </div>

            <a-table :columns="columns" :row-selection="rowSelection" :data-source="displayData"
                class="components-table-demo-nested" :row-key="record => record.id_san_pham"
                :pagination="{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }"
                :scroll="{ x: 1300 }" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'trang_thai'">
                        <a-switch @change="(checked) => changeStatusSanPham(record.id_san_pham, checked)"
                            :style="{ backgroundColor: record.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                            :checked="record.trang_thai === 'Hoạt động' ? true : false"
                            :disabled="record.trang_thai === 'Không hoạt động'" />
                    </template>
                    <template v-if="column.key === 'hinh_anh'">
                        <a-image style="width: 40px; height: 40px;" :src="record.hinh_anh" @error="handleImageError" />
                    </template>
                    <template v-if="column.key === 'gia_ban'">
                        {{ formatCurrency(record.gia_ban) }}
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="d-flex gap-2">
                            <a-button type="" @click="changeRouter(record.id_san_pham)" style="color: white;"
                                class="d-flex align-items-center btn btn-warning">
                                <EditOutlined />Sửa
                            </a-button>
                            <a-button type="primary" @click="() => showVariants(record)"
                                class="d-flex align-items-center">
                                <EyeOutlined />
                            </a-button>
                        </div>
                    </template>
                </template>
            </a-table>

            <!-- Cache info -->
            <a-alert class="mt-3" type="info" show-icon>
                <template #message>
                    <span>Dữ liệu được lưu trong bộ nhớ tạm (cache) để tối ưu tốc độ tải. Thời gian lưu: 5 phút.</span>
                </template>
                <template #description>
                    <span>Thời gian tải trang: {{ loadTime }}ms</span>
                </template>
            </a-alert>
        </template>

        <!-- Drawer for product variants -->
        <template v-if="drawerVisible">
            <a-drawer v-model:open="drawerVisible" title="Chi tiết biến thể sản phẩm" placement="right" :width="700"
                :footer-style="{ textAlign: 'right' }" @close="closeVariantDrawer">
                <template v-if="currentProduct">
                    <div class="product-info mb-4">
                        <h3>{{ currentProduct.ten_san_pham }}</h3>
                        <div class="d-flex gap-3 align-items-center">
                            <a-image style="width: 60px; height: 60px;" :src="currentProduct.hinh_anh"
                                @error="handleImageError" />
                            <div>
                                <p><strong>Mã sản phẩm:</strong> {{ currentProduct.ma_san_pham }}</p>
                                <p><strong>Trạng thái:</strong> {{ currentProduct.trang_thai }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Loading skeleton cho CTSP -->
                    <template v-if="drawerLoading">
                        <a-skeleton active :paragraph="{ rows: 5 }" />
                    </template>

                    <template v-else>
                        <h4>Danh sách biến thể</h4>

                        <!-- Bộ lọc trạng thái CTSP -->
                        <div class="variant-status-filter mb-3">
                            <a-radio-group v-model:value="ctspStatusFilter" @change="filterCTSPByStatus"
                                class="custom-radio-group">
                                <a-radio-button value="">Tất cả</a-radio-button>
                                <a-radio-button value="Hoạt động">Hoạt động</a-radio-button>
                                <a-radio-button value="Không hoạt động">Không hoạt động</a-radio-button>
                            </a-radio-group>
                            <span class="ms-3" v-if="ctspStatusFilter">
                                <strong>Lọc theo:</strong> {{ ctspStatusFilter }}
                                <span class="badge bg-primary ms-2">{{ filteredCTSPCount }} biến thể</span>
                            </span>
                        </div>

                        <!-- Các nút chức năng bulk action -->
                        <div v-if="selectedCTSPKeys.length >= 2" class="bulk-actions mb-3 d-flex gap-2">
                            <a-button type="primary" @click="bulkChangeStatus('Hoạt động')" class="bulk-action-btn">
                                <CheckCircleOutlined />
                                <span>Chuyển thành Hoạt động</span>
                            </a-button>
                            <a-button danger @click="bulkChangeStatus('Không hoạt động')" class="bulk-action-btn">
                                <StopOutlined />
                                <span>Chuyển thành Không hoạt động</span>
                            </a-button>
                        </div>

                        <!-- Bảng CTSP -->
                        <a-table :columns="columnsCTSP" :row-selection="{
                            selectedRowKeys: selectedCTSPKeys,
                            onChange: (keys, rows) => handleCTSPSelection(keys, rows, currentProduct.id_san_pham)
                        }" :data-source="filteredCTSPData" :pagination="false"
                            :row-key="record => record.id_chi_tiet_san_pham" class="ctsp-table">
                            <template #bodyCell="{ column, record: ctspRecord }">
                                <template v-if="column.key === 'trang_thai'">
                                    <a-switch
                                        :style="{ backgroundColor: ctspRecord.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                                        size="small" :checked="ctspRecord.trang_thai === 'Hoạt động' ? true : false"
                                        @change="() => changeStatusCTSP(ctspRecord)" />
                                </template>
                                <template v-if="column.key === 'gia_ban'">
                                    {{ formatCurrency(ctspRecord.gia_ban) }}
                                </template>
                                <template v-if="column.key === 'action'">
                                    <a-button @click="showDrawer" type="" style="color: white;"
                                        class="d-flex align-items-center btn btn-warning">
                                        <EditOutlined />Sửa
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                    </template>
                </template>
            </a-drawer>
        </template>

        <!-- Existing drawer for editing product details -->
        <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
            :root-style="{ color: 'black' }" title="Chi tiết sản phẩm" placement="left"
            @after-open-change="afterOpenChange" :footer-style="{ textAlign: 'right' }">
            <a-form :model="productDetails" layout="vertical" @submit.prevent="handleSubmit">
                <a-form-item label="Tên sản phẩm" name="ten_san_pham">
                    <a-input v-model:value="productDetails.ten_san_pham" placeholder="Nhập tên sản phẩm" />
                </a-form-item>

                <a-form-item label="Danh mục" name="danh_muc_id">
                    <a-select v-model:value="productDetails.danh_muc_id" placeholder="Chọn danh mục">
                        <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc" :value="item.id_danh_muc">
                            {{ item.ten_danh_muc }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Giá bán" name="gia_ban">
                    <a-input-number v-model:value="productDetails.gia_ban" placeholder="Nhập giá bán"
                        style="width: 100%;" />
                </a-form-item>

                <!-- Thêm các trường khác tương tự -->

                <a-form-item>
                    <a-button type="primary" html-type="submit">Lưu</a-button>
                    <a-button @click="closeDrawer">Hủy</a-button>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>

</template>
<script setup>
import menuAction from '@/components/admin-components/QuanLySanPham/menuAction.vue';
import {
    EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined,
    CheckCircleOutlined, StopOutlined
} from '@ant-design/icons-vue';
import { onMounted, ref, render, computed, watch, onBeforeUnmount, nextTick } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';

// Khai báo các key cache và thời gian cache
const PRODUCTS_CACHE_KEY = 'products_data';
const CTSP_CACHE_PREFIX = 'ctsp_for_product_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

// Hàm kiểm tra cache còn hạn không
const isCacheValid = (cacheKey) => {
    const cacheData = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (!cacheData) return false;
    return Date.now() - cacheData.timestamp < CACHE_DURATION;
};

// Hàm lấy dữ liệu từ cache
const getFromCache = (cacheKey) => {
    const cacheData = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (!cacheData) return null;
    return cacheData.data;
};

// Hàm lưu dữ liệu vào cache
const saveToCache = (cacheKey, data) => {
    const cacheData = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
};

// Xóa cache
const clearCache = (key) => {
    try {
        localStorage.removeItem(key);
        console.log(`Đã xóa cache: ${key}`);
    } catch (e) {
        console.error('Lỗi khi xóa cache:', e);
    }
};

// Xóa tất cả cache liên quan đến sản phẩm
const clearAllProductsCache = () => {
    try {
        // Xóa cache danh sách sản phẩm
        clearCache(PRODUCTS_CACHE_KEY);

        // Xóa tất cả cache chi tiết sản phẩm
        // Lặp qua tất cả các key trong localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Nếu key bắt đầu bằng prefix của CTSP, xóa nó
            if (key && key.startsWith(CTSP_CACHE_PREFIX)) {
                clearCache(key);
            }
        }

        console.log('Đã xóa tất cả cache sản phẩm');
    } catch (e) {
        console.error('Lỗi khi xóa tất cả cache sản phẩm:', e);
    }
};

// Force refresh cache param
const forceRefresh = ref(false);

// Thêm biến loading để hiển thị skeleton
const isLoading = ref(true);

const router = useRouter();
const open = ref(false);
const store = useGbStore();

// New refs for variant drawer
const drawerVisible = ref(false);
const currentProduct = ref(null);

// Thêm biến loading state cho drawer
const drawerLoading = ref(false);

// Biến lưu thời gian tải trang
const loadTime = ref(0);

// Function to show variants drawer with lazy loading
const showVariants = async (product) => {
    drawerVisible.value = true;
    drawerLoading.value = true;
    currentProduct.value = product;

    try {
        // Kiểm tra cache trước khi gọi API
        const cacheKey = `${CTSP_CACHE_PREFIX}${product.id_san_pham}`;

        if (!forceRefresh.value && isCacheValid(cacheKey)) {
            console.log('Sử dụng cache cho CTSP');
            const cachedData = getFromCache(cacheKey);
            if (cachedData) {
                productCTSPMap.value.set(product.id_san_pham, cachedData);
                drawerLoading.value = false;
                return;
            }
        }

        // Nếu không có cache, gọi API để lấy CTSP cho sản phẩm cụ thể
        console.log('Gọi API lấy CTSP cho sản phẩm:', product.id_san_pham);
        await getCTSPForProduct(product);

    } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
        message.error('Không thể tải thông tin chi tiết sản phẩm');
    } finally {
        drawerLoading.value = false;
    }
};

// Function to close variant drawer and clean up
const closeVariantDrawer = () => {
    drawerVisible.value = false;
    currentProduct.value = null;
    ctspStatusFilter.value = ''; // Reset bộ lọc
    drawerLoading.value = false;
};

const changeRouter = (path) => {
    try {
        // Wait until current tick completes before navigating
        setTimeout(() => {
            router.push('/admin/quanlysanpham/update/' + path);
        }, 0);
    } catch (error) {
        console.error('Navigation error:', error);
        message.error('Không thể mở trang chỉnh sửa. Vui lòng thử lại.');
    }
}
const productDetails = ref({
    ten_san_pham: '',
    danh_muc_id: null,
    gia_ban: null,
    // Thêm các trường khác
});
function handleSubmit() {
    // Xử lý logic lưu sản phẩm
    console.log('Product details:', productDetails.value);
    // Gọi; API hoặc cập nhật store
};
function closeDrawer() {
    open.value = false;
};
const danhMucList = ref([]);

const variants = ref([]);

const showDrawer = () => {
    open.value = true;
}
// Update the columns to include options for both highest and lowest price
const columns = [
    {
        title: '#',
        dataIndex: 'stt',
        key: 'stt',
        width: '5%',
        align: 'center',
        render: (text, record, index) => index + 1
    },
    {
        title: 'Mã sản phẩm',
        dataIndex: 'ma_san_pham',
        key: 'ma_san_pham',
        width: '8%',
        sorter: (a, b) => a.ma_san_pham.localeCompare(b.ma_san_pham),
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'ten_san_pham',
        key: 'ten_san_pham',
        width: '15%',
        sorter: (a, b) => a.ten_san_pham.localeCompare(b.ten_san_pham),
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'hinh_anh',
        key: 'hinh_anh',
        width: '8%',
    },
    {
        title: 'SL',
        dataIndex: 'tong_so_luong',
        key: 'tong_so_luong',
        width: '8%',
        sorter: (a, b) => a.tong_so_luong - b.tong_so_luong,
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: 'Danh mục/Thương hiệu/Chất liệu',
        dataIndex: 'chi_muc',
        key: 'chi_muc',
        width: '22%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
        width: '10%',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        width: '25%',
    },
];
const columnsCTSP = [
    // {
    //     title: 'Tên sản phẩm',
    //     dataIndex: 'ten_san_pham',
    //     key: 'ten_san_pham',
    // },
    {
        title: 'Màu sắc',
        dataIndex: 'mau_sac',
        key: 'mau_sac',
    },
    {
        title: 'Size',
        dataIndex: 'size',
        key: 'size',
    },
    {
        title: 'Số lượng',
        dataIndex: 'so_luong',
        key: 'so_luong',
        sorter: (a, b) => a.so_luong - b.so_luong,
        sortDirections: ['ascend', 'descend'],
    },
    {
        title: 'Giá',
        dataIndex: 'gia_ban',
        key: 'gia_ban',
        sorter: (a, b) => a.gia_ban - b.gia_ban,
        sortDirections: ['ascend', 'descend'],
        render: (text) => formatCurrency(text)
    },
    {
        title: 'Trạng thái',
        dataIndex: 'trang_thai',
        key: 'trang_thai',
    },
    // {
    //     title: 'Hành động',
    //     dataIndex: 'action',
    //     key: 'action',
    // },
];
const data = ref([]);
const selectedCTSPKeys = ref([]);
const rowSelection = ref({
    selectedRowKeys: [],
    onChange: (selectedRowKeys, selectedRows) => {
        rowSelection.value.selectedRowKeys = selectedRowKeys;

        // Lưu danh sách các sản phẩm đã chọn
        const selectedProducts = new Set(selectedRowKeys);

        // Cập nhật chọn CTSP cho các sản phẩm đã chọn
        selectedRowKeys.forEach(async (key) => {
            const record = data.value.find(item => item.id_san_pham === key);
            if (record) {
                await getCTSPForProduct(record);
                const childItems = productCTSPMap.value.get(record.id_san_pham) || [];
                childItems.forEach(item => {
                    if (!selectedCTSPKeys.value.includes(item.id_chi_tiet_san_pham)) {
                        selectedCTSPKeys.value.push(item.id_chi_tiet_san_pham);
                    }
                });
            }
        });

        // Loại bỏ CTSP của các sản phẩm bị bỏ chọn
        data.value.forEach(item => {
            if (!selectedProducts.has(item.id_san_pham)) {
                const childItems = productCTSPMap.value.get(item.id_san_pham) || [];
                selectedCTSPKeys.value = selectedCTSPKeys.value.filter(
                    key => !childItems.some(child => child.id_chi_tiet_san_pham === key)
                );
            }
        });

        // Truyền danh sách sản phẩm đã chọn cho menuAction component
        if (menuActionRef.value) {
            menuActionRef.value.updateSelectedRows(selectedRows);
        }
    }
});

// Hàm format dữ liệu CTSP
const formatCTSPData = (ctspList) => {
    return ctspList.map(item => ({
        key: item.id_chi_tiet_san_pham,
        ten_san_pham: item.ten_san_pham,
        hinh_anh: item.hinh_anh,
        gia_ban: item.gia_ban,
        mau_sac: item.ten_mau,
        size: item.gia_tri + ' ' + item.don_vi,
        so_luong: item.so_luong,
        trang_thai: item.trang_thai,
    }));
};
// Thêm ref để lưu trữ CTSP cho từng sản phẩm
const productCTSPMap = ref(new Map());
const getCTSPForProduct = async (product) => {
    try {
        // Gọi API để lấy CTSP cho sản phẩm cụ thể
        console.log('Gọi API lấy CTSP cho sản phẩm:', product.id_san_pham);
        await store.getCTSPBySanPham(product.id_san_pham);
        const ctspList = store.getCTSPBySanPhams.map(ctsp => ({
            key: ctsp.id_chi_tiet_san_pham,
            id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
            id_san_pham: product.id_san_pham,
            ten_san_pham: ctsp.ten_san_pham,
            hinh_anh: ctsp.hinh_anh,
            gia_ban: ctsp.gia_ban,
            mau_sac: ctsp.ten_mau,
            size: ctsp.gia_tri + ' ' + ctsp.don_vi,
            so_luong: ctsp.so_luong,
            trang_thai: ctsp.trang_thai,
        }));

        // Lưu vào map để sử dụng
        productCTSPMap.value.set(product.id_san_pham, ctspList);
        return ctspList;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu CTSP:', error);
        message.error('Không thể lấy thông tin chi tiết sản phẩm');
        return [];
    }
};

const changeStatusSanPham = async (id, checked) => {
    try {
        // Hiển thị thông báo đang xử lý
        const messageKey = `status-change-${id}`;
        message.loading({ content: 'Đang cập nhật trạng thái...', key: messageKey });

        // Lưu lại trạng thái gốc trước khi cập nhật
        const originalData = [...data.value];

        // Gọi API thông qua store
        const result = await store.changeStatusSanPham(id);

        if (result.success) {
            // Hiển thị thông báo thành công
            message.success({
                content: result.message,
                key: messageKey,
                duration: 2
            });

            // Đảm bảo UI đã được cập nhật chính xác theo response
            // Tìm và cập nhật sản phẩm trong danh sách hiển thị
            data.value = data.value.map(item => {
                if (item.id_san_pham === id) {
                    return { ...item, trang_thai: result.newStatus };
                }
                return item;
            });

            // Cập nhật cache nếu có
            // const productsCache = getFromCache(PRODUCTS_CACHE_KEY);
            // if (productsCache) {
            //     const updatedCache = productsCache.map(p => {
            //         if (p.id_san_pham === id) {
            //             return { ...p, trang_thai: result.newStatus };
            //         }
            //         return p;
            //     });
            //     saveToCache(PRODUCTS_CACHE_KEY, updatedCache);
            // }

            // Nếu CTSP đã được tải cho sản phẩm này, cần cập nhật chúng
            if (productCTSPMap.value.has(id)) {
                // Lấy và tải lại chi tiết sản phẩm để đảm bảo đồng bộ dữ liệu
                await getCTSPForProduct({ id_san_pham: id });
            }
        } else {
            // Hiển thị thông báo lỗi
            message.error({
                content: result.message || 'Không thể cập nhật trạng thái',
                key: messageKey,
                duration: 2
            });

            // Khôi phục dữ liệu ban đầu trong trường hợp lỗi
            data.value = originalData;
        }
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        message.error('Có lỗi xảy ra khi thay đổi trạng thái');
    }
};
const changeStatusCTSP = async (ctspRecord) => {
    try {
        const ctspId = ctspRecord.id_chi_tiet_san_pham;
        const currentStatus = ctspRecord.trang_thai;
        const productId = currentProduct.value.id_san_pham;

        // Xác định trạng thái mới (ngược lại với trạng thái hiện tại)
        const newStatus = currentStatus === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';

        // Thông báo đang xử lý
        const messageKey = `status-change-${ctspId}`;
        message.loading({ content: 'Đang cập nhật trạng thái...', key: messageKey });

        // Lưu trạng thái ban đầu để hoàn tác nếu cần
        const originalCtspList = [...productCTSPMap.value.get(productId) || []];
        const originalData = [...data.value];
        const originalCurrentProduct = { ...currentProduct.value };

        // Cập nhật UI ngay lập tức - Optimistic Update
        const updatedCtspList = originalCtspList.map(item => {
            if (item.id_chi_tiet_san_pham === ctspId) {
                return { ...item, trang_thai: newStatus };
            }
            return item;
        });

        // Cập nhật Map để UI hiển thị đúng - Dùng cách set lại toàn bộ Map để trigger reactivity
        const newMap = new Map(productCTSPMap.value);
        newMap.set(productId, updatedCtspList);
        productCTSPMap.value = newMap;

        // Gọi API thông qua store
        const result = await store.updateCTSPStatus(ctspId, newStatus);

        if (result.success) {
            // Hiển thị thông báo thành công
            message.success({
                content: result.message,
                key: messageKey,
                duration: 2
            });

            // Cập nhật cache chi tiết sản phẩm
            // const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;
            // saveToCache(cacheKey, updatedCtspList);

            // Nếu có thông tin về cập nhật sản phẩm cha trong dữ liệu trả về
            if (result.data && result.data.sanPham && result.data.sanPham.id_san_pham && result.data.sanPham.trang_thai) {
                const parentId = result.data.sanPham.id_san_pham;
                const newParentStatus = result.data.sanPham.trang_thai;

                console.log(`Cập nhật UI sản phẩm ${parentId} thành ${newParentStatus}`);

                // Cập nhật danh sách sản phẩm với trạng thái mới của sản phẩm cha
                data.value = data.value.map(item => {
                    if (item.id_san_pham === parentId) {
                        return { ...item, trang_thai: newParentStatus };
                    }
                    return item;
                });

                // Cập nhật sản phẩm trong drawer nếu đang hiển thị
                if (currentProduct.value && currentProduct.value.id_san_pham === parentId) {
                    currentProduct.value = {
                        ...currentProduct.value,
                        trang_thai: newParentStatus
                    };
                }

                // Cập nhật cache sản phẩm
                // const productsCache = getFromCache(PRODUCTS_CACHE_KEY);
                // if (productsCache) {
                //     const updatedCache = productsCache.map(p => {
                //         if (p.id_san_pham === parentId) {
                //             return { ...p, trang_thai: newParentStatus };
                //         }
                //         return p;
                //     });
                //     saveToCache(PRODUCTS_CACHE_KEY, updatedCache);
                // }
            }
        } else {
            // Hiển thị thông báo lỗi
            message.error({
                content: result.message || 'Không thể cập nhật trạng thái',
                key: messageKey,
                duration: 2
            });

            // Hoàn tác UI nếu có lỗi
            const rollbackMap = new Map(productCTSPMap.value);
            rollbackMap.set(productId, originalCtspList);
            productCTSPMap.value = rollbackMap;

            data.value = originalData;
            if (currentProduct.value) {
                currentProduct.value = originalCurrentProduct;
            }
        }
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        message.error('Có lỗi xảy ra khi thay đổi trạng thái');
    }
};

const afterOpenChange = bool => {
    console.log('open', bool);
};

const handleOk = e => {
    console.log(e);
    open.value = false;
};

// Update the handleCTSPSelection to work with the drawer
const handleCTSPSelection = (selectedKeys, selectedRows, parentId) => {
    // Cập nhật lại danh sách CTSP đã chọn, loại bỏ các CTSP cũ của sản phẩm hiện tại
    const otherProductCTSPs = selectedCTSPKeys.value.filter(key => {
        // Kiểm tra key có thuộc sản phẩm hiện tại không
        const currentProductCTSPs = productCTSPMap.value.get(parentId) || [];
        return !currentProductCTSPs.some(item => item.id_chi_tiet_san_pham === key);
    });

    // Thêm các CTSP mới được chọn của sản phẩm hiện tại
    selectedCTSPKeys.value = [...otherProductCTSPs, ...selectedKeys];

    // Cập nhật selection của sản phẩm cha
    const childItems = productCTSPMap.value.get(parentId) || [];
    const allChildKeys = childItems.map(item => item.id_chi_tiet_san_pham);
    const allChildrenSelected = allChildKeys.length > 0 && allChildKeys.every(key => selectedKeys.includes(key));

    const currentParentKeys = [...rowSelection.value.selectedRowKeys];
    if (allChildrenSelected && !currentParentKeys.includes(parentId)) {
        rowSelection.value.selectedRowKeys = [...currentParentKeys, parentId];
    } else if (!allChildrenSelected && currentParentKeys.includes(parentId)) {
        rowSelection.value.selectedRowKeys = currentParentKeys.filter(key => key !== parentId);
    }
};

// Cập nhật hàm xử lý lọc trạng thái
const handleStatusFilterChange = () => {
    console.log('Lọc theo trạng thái:', statusFilter.value);
    // Không cần gọi API, chỉ cần cập nhật biến statusFilter
    // và để computed displayData tự động lọc lại dữ liệu
};

// Cập nhật computed property để lọc theo trạng thái
const displayData = computed(() => {
    // Lấy danh sách sản phẩm đã lọc/tìm kiếm từ store
    const filteredProducts = store.getFilteredProducts;

    // Tạo danh sách sản phẩm từ nguồn dữ liệu
    let productsToDisplay = [];

    // Kiểm tra xem có sản phẩm nào được lọc/tìm kiếm không
    if (filteredProducts && filteredProducts.length > 0) {
        console.log(`Hiển thị ${filteredProducts.length} sản phẩm đã lọc/tìm kiếm`);

        // Format dữ liệu để phù hợp với cấu trúc bảng
        productsToDisplay = filteredProducts.map((item, index) => {
            // Try to get the prices from the cached data if available
            let highestPrice = 0;
            let lowestPrice = 0;
            const productId = item.id_san_pham;

            if (productCTSPMap.value.has(productId)) {
                const variants = productCTSPMap.value.get(productId);
                if (variants && variants.length > 0) {
                    const prices = variants
                        .map(variant => variant.gia_ban || 0)
                        .filter(price => price > 0);

                    if (prices.length > 0) {
                        highestPrice = Math.max(...prices);
                        lowestPrice = Math.min(...prices);
                    }
                }
            }

            return {
                stt: index + 1,
                key: item.id_san_pham,
                id_san_pham: item.id_san_pham,
                ma_san_pham: item.ma_san_pham,
                ten_san_pham: item.ten_san_pham,
                hinh_anh: item.hinh_anh,
                chi_muc: (item.ten_danh_muc || '') + "/" +
                    (item.ten_thuong_hieu || '') + "/" +
                    (item.ten_chat_lieu || ''),
                trang_thai: item.trang_thai,
                tong_so_luong: item.tong_so_luong || 0,
                gia_cao_nhat: highestPrice,
                gia_thap_nhat: lowestPrice,
                ngay_cap_nhat: item.ngay_cap_nhat || ''
            };
        });
    } else {
        // Nếu không có kết quả lọc hoặc tìm kiếm, hiển thị tất cả sản phẩm
        console.log(`Hiển thị tất cả ${data.value.length} sản phẩm`);
        productsToDisplay = data.value;
    }

    // Lọc theo trạng thái nếu người dùng đã chọn
    if (statusFilter.value) {
        console.log(`Lọc theo trạng thái: ${statusFilter.value}`);
        return productsToDisplay.filter(item => item.trang_thai === statusFilter.value);
    }

    // Trả về danh sách không lọc nếu không chọn trạng thái
    return productsToDisplay;
});

// Tham chiếu tới menuAction component
const menuActionRef = ref(null);

// Hàm làm mới dữ liệu
const refreshData = async () => {
    try {
        const startTime = performance.now();
        message.loading({ content: 'Đang làm mới dữ liệu...', key: 'refreshData' });

        // Xóa cache và đặt cờ refresh
        forceRefresh.value = true;
        clearAllProductsCache();
        isLoading.value = true;

        // Tải lại dữ liệu từ API
        await store.getAllSP();

        // Đồng thời cập nhật dữ liệu bộ lọc để bao gồm các giá trị mới
        console.log('Đang cập nhật dữ liệu bộ lọc...');

        // Tải lại toàn bộ dữ liệu lọc song song (Promise.all để tối ưu thời gian tải)
        await Promise.all([
            store.getAllDM(),   // Danh mục
            store.getAllTH(),   // Thương hiệu
            store.getAllCL(),   // Chất liệu
            store.getAllMS(),   // Màu sắc
            store.getAllKT(),   // Kích thước
            // Chi tiết sản phẩm
        ]);

        console.log('Đã cập nhật dữ liệu bộ lọc');

        data.value = await Promise.all(store.getAllSanPham.map(async (item, index) => {
            // Get the product prices (highest and lowest)
            const prices = await getProductPrices(item.id_san_pham);

            return {
                stt: index + 1,
                key: item.id_san_pham,
                id_san_pham: item.id_san_pham,
                ma_san_pham: item.ma_san_pham,
                ten_san_pham: item.ten_san_pham,
                hinh_anh: item.hinh_anh,
                chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
                trang_thai: item.trang_thai,
                tong_so_luong: item.tong_so_luong || 0,
                gia_cao_nhat: prices.highest,
                gia_thap_nhat: prices.lowest,
                ngay_cap_nhat: item.ngay_cap_nhat || '' // Don't use current date as fallback
            };
        }));

        // Lưu vào cache nếu có dữ liệu
        // if (data.value.length > 0) {
        //     saveToCache(PRODUCTS_CACHE_KEY, data.value);
        // }

        // Cập nhật lại menuAction nếu có tham chiếu
        if (menuActionRef.value && typeof menuActionRef.value.checkAndLoadFilterData === 'function') {
            try {
                await menuActionRef.value.checkAndLoadFilterData();
                console.log('Đã cập nhật dữ liệu lọc trong menuAction');
            } catch (error) {
                console.error('Lỗi khi gọi checkAndLoadFilterData:', error);
            }
        } else {
            console.log('menuActionRef không tồn tại hoặc không có phương thức checkAndLoadFilterData');
        }

        const endTime = performance.now();
        loadTime.value = Math.round(endTime - startTime);
        message.success({ content: 'Đã làm mới dữ liệu thành công!', key: 'refreshData', duration: 2 });
    } catch (error) {
        console.error('Lỗi khi làm mới dữ liệu:', error);
        message.error({ content: 'Có lỗi xảy ra khi làm mới dữ liệu!', key: 'refreshData', duration: 2 });
    } finally {
        isLoading.value = false;
        forceRefresh.value = false;
    }
};

onMounted(async () => {
    // Add event listener for external sorting
    window.addEventListener('sort-option-changed', handleExternalSort);

    const startTime = performance.now();
    isLoading.value = true;

    try {
        // Kiểm tra xem có cần refresh cache không
        if (store.justAddedProduct || store.justUpdatedProduct) {
            // Nếu vừa thêm hoặc sửa sản phẩm, xóa toàn bộ cache
            clearAllProductsCache();
            forceRefresh.value = true;

            // Lấy danh sách theo ngày sửa
            await store.getAllSanPhamNgaySua();
            store.justAddedProduct = false;
            store.justUpdatedProduct = false;
        } else {
            // Kiểm tra cache trước khi gọi API
            if (isCacheValid(PRODUCTS_CACHE_KEY)) {
                console.log('Sử dụng cache cho danh sách sản phẩm');
                const cachedProducts = getFromCache(PRODUCTS_CACHE_KEY);
                if (cachedProducts) {
                    data.value = cachedProducts;
                    isLoading.value = false;
                    const endTime = performance.now();
                    loadTime.value = Math.round(endTime - startTime);
                    return;
                }
            }

            // Nếu không có cache hoặc cache hết hạn, gọi API
            await store.getAllSP();
        }

        // Xử lý dữ liệu và lưu vào cache
        data.value = store.getAllSanPham.map((item, index) => ({
            stt: index + 1,
            key: item.id_san_pham,
            id_san_pham: item.id_san_pham,
            ma_san_pham: item.ma_san_pham,
            ten_san_pham: item.ten_san_pham,
            hinh_anh: item.hinh_anh,
            chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
            trang_thai: item.trang_thai,
            tong_so_luong: item.tong_so_luong || 0,
            ngay_cap_nhat: item.ngay_cap_nhat || ''
        }));

        // Lưu vào cache nếu có dữ liệu
        // if (data.value.length > 0) {
        //     saveToCache(PRODUCTS_CACHE_KEY, data.value);
        // }

        const endTime = performance.now();
        loadTime.value = Math.round(endTime - startTime);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu sản phẩm');
    } finally {
        isLoading.value = false;
    }
});

onBeforeUnmount(() => {
    // Remove event listener
    window.removeEventListener('sort-option-changed', handleExternalSort);
});

const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};

// Add this function near the formatCurrency function
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// Hàm làm mới dữ liệu chi tiết
const fetchData = async () => {
    try {
        isLoading.value = true;
        message.loading({ content: 'Đang cập nhật dữ liệu...', key: 'fetchData' });

        // Xóa cache của sản phẩm hiện tại
        if (currentProduct.value) {
            const productId = currentProduct.value.id_san_pham;
            clearCache(`${CTSP_CACHE_PREFIX}${productId}`);

            // Làm mới dữ liệu CTSP cho sản phẩm hiện tại
            await store.getCTSPBySanPham(productId);
            const ctspList = store.getCTSPBySanPhams.map(ctsp => ({
                key: ctsp.id_chi_tiet_san_pham,
                id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
                id_san_pham: productId,
                ten_san_pham: ctsp.ten_san_pham,
                hinh_anh: ctsp.hinh_anh,
                gia_ban: ctsp.gia_ban,
                mau_sac: ctsp.ten_mau,
                size: ctsp.gia_tri + ' ' + ctsp.don_vi,
                so_luong: ctsp.so_luong,
                trang_thai: ctsp.trang_thai,
            }));

            // Cập nhật vào Map
            productCTSPMap.value.set(productId, ctspList);

            // Cập nhật cache mới
            // saveToCache(`${CTSP_CACHE_PREFIX}${productId}`, ctspList);
        }

        message.success({ content: 'Dữ liệu đã được cập nhật', key: 'fetchData', duration: 2 });
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
        message.error({ content: 'Có lỗi xảy ra khi cập nhật dữ liệu', key: 'fetchData', duration: 2 });
    } finally {
        isLoading.value = false;
    }
};

// Thêm biến lọc trạng thái
const statusFilter = ref('');

// Thêm biến đếm số lượng sản phẩm hiển thị
const filteredCount = computed(() => {
    if (statusFilter.value) {
        return displayData.value.length;
    }
    return null;
});

// Thêm biến lọc trạng thái chi tiết sản phẩm
const ctspStatusFilter = ref('');

// Thêm biến đếm số lượng biến thể hiển thị
const filteredCTSPCount = computed(() => {
    if (!currentProduct.value) return 0;
    return filteredCTSPData.value.length;
});

// Thêm ref để lưu trữ dữ liệu biến thể đã lọc
const filteredCTSPData = computed(() => {
    if (!currentProduct.value) return [];

    // Lấy danh sách chi tiết sản phẩm từ Map
    const ctspList = productCTSPMap.value.get(currentProduct.value.id_san_pham) || [];

    // Nếu không có bộ lọc trạng thái, trả về tất cả
    if (!ctspStatusFilter.value) {
        return ctspList;
    }

    // Lọc theo trạng thái
    console.log(`Đang lọc ${ctspList.length} chi tiết sản phẩm theo trạng thái: ${ctspStatusFilter.value}`);
    return ctspList.filter(item => item.trang_thai === ctspStatusFilter.value);
});

// Hàm xử lý lọc trạng thái chi tiết sản phẩm
const filterCTSPByStatus = () => {
    console.log('Lọc theo trạng thái chi tiết:', ctspStatusFilter.value);
};

// Hàm xử lý lỗi khi tải hình ảnh
const handleImageError = (e) => {
    const imgElement = e.target;
    console.error('Không thể tải hình ảnh:', e.target.src);
    imgElement.src = 'https://via.placeholder.com/150?text=No+Image'; // Đường dẫn đến hình ảnh mặc định
    console.log('Không thể tải hình ảnh, đã thay thế bằng ảnh mặc định');
};

// Hàm thay đổi trạng thái cho nhiều chi tiết sản phẩm một lúc
const bulkChangeStatus = async (newStatus) => {
    try {
        const selectedRowKeys = selectedCTSPKeys.value;
        if (!selectedRowKeys.length) {
            message.warning('Vui lòng chọn ít nhất một biến thể sản phẩm');
            return;
        }

        if (!currentProduct.value) {
            message.error('Không tìm thấy thông tin sản phẩm hiện tại');
            return;
        }

        const productId = currentProduct.value.id_san_pham;

        // Thông báo đang xử lý
        const messageKey = `bulk-status-change-${productId}`;
        message.loading({ content: 'Đang cập nhật trạng thái...', key: messageKey });

        // Lưu trạng thái ban đầu để hoàn tác nếu cần
        const originalCtspList = [...productCTSPMap.value.get(productId) || []];
        const originalData = [...data.value];
        const originalCurrentProduct = { ...currentProduct.value };

        // 1. Cập nhật UI ngay lập tức - Optimistic Update
        const updatedCtspList = originalCtspList.map(item => {
            if (selectedRowKeys.includes(item.id_chi_tiet_san_pham)) {
                return { ...item, trang_thai: newStatus };
            }
            return item;
        });

        // Cập nhật Map để UI hiển thị đúng - Dùng cách set lại toàn bộ Map để trigger reactivity
        const newMap = new Map(productCTSPMap.value);
        newMap.set(productId, updatedCtspList);
        productCTSPMap.value = newMap;

        // 2. Gọi API thông qua store
        const result = await store.bulkUpdateCTSPStatus(selectedRowKeys, newStatus);

        if (result.success) {
            // Hiển thị thông báo thành công
            message.success({
                content: result.message,
                key: messageKey,
                duration: 2
            });

            // Xóa các hàng đã chọn sau khi thay đổi trạng thái
            selectedCTSPKeys.value = [];

            // Cập nhật cache chi tiết sản phẩm
            // const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;
            // saveToCache(cacheKey, updatedCtspList);

            // Nếu có sản phẩm cha đã được cập nhật
            if (result.parentStatusUpdated && result.updatedParents && result.updatedParents.length > 0) {
                console.log(`Cập nhật UI cho ${result.updatedParents.length} sản phẩm cha`);

                // Cập nhật danh sách sản phẩm với trạng thái mới của các sản phẩm cha
                data.value = data.value.map(item => {
                    // Tìm sản phẩm cha tương ứng trong danh sách đã cập nhật
                    const updatedParent = result.updatedParents.find(p => p.id === item.id_san_pham);
                    if (updatedParent) {
                        console.log(`Cập nhật UI sản phẩm ${item.id_san_pham} thành ${updatedParent.status}`);
                        return { ...item, trang_thai: updatedParent.status };
                    }
                    return item;
                });

                // Cập nhật sản phẩm trong drawer nếu đang hiển thị
                if (currentProduct.value) {
                    const updatedCurrentParent = result.updatedParents.find(p => p.id === currentProduct.value.id_san_pham);
                    if (updatedCurrentParent) {
                        currentProduct.value = {
                            ...currentProduct.value,
                            trang_thai: updatedCurrentParent.status
                        };
                    }
                }

                // Cập nhật cache sản phẩm
                // const productsCache = getFromCache(PRODUCTS_CACHE_KEY);
                // if (productsCache) {
                //     const updatedCache = productsCache.map(p => {
                //         // Tìm sản phẩm tương ứng trong danh sách đã cập nhật
                //         const updatedParent = result.updatedParents.find(up => up.id === p.id_san_pham);
                //         if (updatedParent) {
                //             return { ...p, trang_thai: updatedParent.status };
                //         }
                //         return p;
                //     });
                //     saveToCache(PRODUCTS_CACHE_KEY, updatedCache);
                // }
            }
        } else {
            // Hiển thị thông báo lỗi
            message.error({
                content: result.message || 'Không thể cập nhật trạng thái',
                key: messageKey,
                duration: 2
            });

            // Hoàn tác UI nếu có lỗi
            const rollbackMap = new Map(productCTSPMap.value);
            rollbackMap.set(productId, originalCtspList);
            productCTSPMap.value = rollbackMap;

            data.value = originalData;
            if (currentProduct.value) {
                currentProduct.value = originalCurrentProduct;
            }
        }
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái hàng loạt:', error);
        message.error('Có lỗi xảy ra khi thay đổi trạng thái hàng loạt');
    }
};

// Handler for refresh-data event from menuAction component
const handleMenuActionRefresh = async () => {
    console.log('Received refresh-data event from menuAction');

    // Force refresh all data and clear cache
    forceRefresh.value = true;
    clearAllProductsCache();
    isLoading.value = true;

    try {
        // Make sure to load the latest data by date
        console.log('Tải dữ liệu sản phẩm mới nhất sau khi import Excel...');
        await store.getAllSanPhamNgaySua();
        console.log('Số lượng sản phẩm sau khi refresh:', store.getAllSanPham?.length || 0);

        // Update local data from store
        data.value = await Promise.all(store.getAllSanPham.map(async (item, index) => {
            // Get the product prices (highest and lowest)
            const prices = await getProductPrices(item.id_san_pham);

            return {
                stt: index + 1,
                key: item.id_san_pham,
                id_san_pham: item.id_san_pham,
                ma_san_pham: item.ma_san_pham,
                ten_san_pham: item.ten_san_pham,
                hinh_anh: item.hinh_anh,
                chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
                trang_thai: item.trang_thai,
                tong_so_luong: item.tong_so_luong || 0,
                gia_cao_nhat: prices.highest,
                gia_thap_nhat: prices.lowest,
                ngay_cap_nhat: item.ngay_cap_nhat || '' // Don't use current date as fallback
            };
        }));

        // Update cache
        // if (data.value.length > 0) {
        //     saveToCache(PRODUCTS_CACHE_KEY, data.value);
        // }

        message.success('Dữ liệu đã được cập nhật sau khi import Excel');
    } catch (error) {
        console.error('Lỗi khi làm mới dữ liệu sau import Excel:', error);
        message.error('Có lỗi xảy ra khi cập nhật dữ liệu');
    } finally {
        isLoading.value = false;
        forceRefresh.value = false;
    }
};

// Function to get the highest price for a product from its variants
const getHighestPrice = async (productId) => {
    try {
        // First check if we already have loaded CTSP for this product
        if (productCTSPMap.value.has(productId)) {
            const variants = productCTSPMap.value.get(productId);
            if (variants && variants.length > 0) {
                // Find the highest price among variants
                return Math.max(...variants.map(variant => variant.gia_ban || 0));
            }
            return 0;
        }

        // If not loaded, load from API or cache
        const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;
        if (!forceRefresh.value && isCacheValid(cacheKey)) {
            const cachedVariants = getFromCache(cacheKey);
            if (cachedVariants && cachedVariants.length > 0) {
                return Math.max(...cachedVariants.map(variant => variant.gia_ban || 0));
            }
        }

        // If no cached data, load from API
        await store.getCTSPBySanPham(productId);
        const variants = store.getCTSPBySanPhams;
        if (variants && variants.length > 0) {
            const formattedVariants = variants.map(ctsp => ({
                key: ctsp.id_chi_tiet_san_pham,
                id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
                id_san_pham: productId,
                ten_san_pham: ctsp.ten_san_pham,
                hinh_anh: ctsp.hinh_anh,
                gia_ban: ctsp.gia_ban,
                mau_sac: ctsp.ten_mau,
                size: ctsp.gia_tri + ' ' + ctsp.don_vi,
                so_luong: ctsp.so_luong,
                trang_thai: ctsp.trang_thai,
            }));

            // Store the variants in the map for future use
            productCTSPMap.value.set(productId, formattedVariants);
            // saveToCache(cacheKey, formattedVariants);

            return Math.max(...formattedVariants.map(variant => variant.gia_ban || 0));
        }

        return 0;
    } catch (error) {
        console.error('Error getting highest price for product:', error);
        return 0;
    }
};

// Function to get highest and lowest prices for a product from its variants
const getProductPrices = async (productId) => {
    try {
        // First check if we already have loaded CTSP for this product
        if (productCTSPMap.value.has(productId)) {
            const variants = productCTSPMap.value.get(productId);
            if (variants && variants.length > 0) {
                // Get all prices from variants (ignore 0 or null prices)
                const prices = variants
                    .map(variant => variant.gia_ban || 0)
                    .filter(price => price > 0);

                if (prices.length > 0) {
                    return {
                        highest: Math.max(...prices),
                        lowest: Math.min(...prices)
                    };
                }
                return { highest: 0, lowest: 0 };
            }
            return { highest: 0, lowest: 0 };
        }

        // If not loaded, load from API or cache
        const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;
        if (!forceRefresh.value && isCacheValid(cacheKey)) {
            const cachedVariants = getFromCache(cacheKey);
            if (cachedVariants && cachedVariants.length > 0) {
                const prices = cachedVariants
                    .map(variant => variant.gia_ban || 0)
                    .filter(price => price > 0);

                if (prices.length > 0) {
                    return {
                        highest: Math.max(...prices),
                        lowest: Math.min(...prices)
                    };
                }
                return { highest: 0, lowest: 0 };
            }
        }

        // If no cached data, load from API
        await store.getCTSPBySanPham(productId);
        const variants = store.getCTSPBySanPhams;

        if (variants && variants.length > 0) {
            const formattedVariants = variants.map(ctsp => ({
                key: ctsp.id_chi_tiet_san_pham,
                id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
                id_san_pham: productId,
                ten_san_pham: ctsp.ten_san_pham,
                hinh_anh: ctsp.hinh_anh,
                gia_ban: ctsp.gia_ban,
                mau_sac: ctsp.ten_mau,
                size: ctsp.gia_tri + ' ' + ctsp.don_vi,
                so_luong: ctsp.so_luong,
                trang_thai: ctsp.trang_thai,
            }));

            // Store the variants in the map for future use
            productCTSPMap.value.set(productId, formattedVariants);
            // saveToCache(cacheKey, formattedVariants);

            const prices = formattedVariants
                .map(variant => variant.gia_ban || 0)
                .filter(price => price > 0);

            if (prices.length > 0) {
                return {
                    highest: Math.max(...prices),
                    lowest: Math.min(...prices)
                };
            }
        }

        return { highest: 0, lowest: 0 };
    } catch (error) {
        console.error('Error getting prices for product:', error);
        return { highest: 0, lowest: 0 };
    }
};

// Handle table change events (sorting, pagination, etc.)
const handleTableChange = (pagination, filters, sorter) => {
    console.log('Table params changed:', { pagination, filters, sorter });

    // Process sorting if sorter is provided
    if (sorter) {
        console.log(`Sorting by ${sorter.field}, order: ${sorter.order}`);
    }
};

// Function to handle sorting from menu dropdown
const handleExternalSort = (event) => {
    const sortOption = event.detail.option;
    console.log('Received external sort event with option:', sortOption);

    // Apply the sorting based on the option
    let sortedData = [...displayData.value]; // Create a copy to avoid reactivity issues

    switch (sortOption) {
        case '2': // Mã sản phẩm ascending
            sortedData.sort((a, b) => a.ma_san_pham.localeCompare(b.ma_san_pham));
            break;
        case '3': // Mã sản phẩm descending
            sortedData.sort((a, b) => b.ma_san_pham.localeCompare(a.ma_san_pham));
            break;
        case '4': // Name ascending
            sortedData.sort((a, b) => a.ten_san_pham.localeCompare(b.ten_san_pham));
            break;
        case '5': // Name descending
            sortedData.sort((a, b) => b.ten_san_pham.localeCompare(a.ten_san_pham));
            break;
        case '6': // Quantity ascending
            sortedData.sort((a, b) => a.tong_so_luong - b.tong_so_luong);
            break;
        case '7': // Quantity descending
            sortedData.sort((a, b) => b.tong_so_luong - a.tong_so_luong);
            break;
        default:
            // No sorting
            break;
    }

    // Update data with sorted array
    if (sortOption !== '1') {
        data.value = sortedData;

        // Force re-render
        isLoading.value = true;
        setTimeout(() => {
            isLoading.value = false;
        }, 100);
    }
};

// Add the event listener to the existing onMounted function
onMounted(async () => {
    // Add event listener for external sorting
    window.addEventListener('sort-option-changed', handleExternalSort);

    const startTime = performance.now();
    isLoading.value = true;

    try {
        // Kiểm tra xem có cần refresh cache không
        if (store.justAddedProduct || store.justUpdatedProduct) {
            // Nếu vừa thêm hoặc sửa sản phẩm, xóa toàn bộ cache
            clearAllProductsCache();
            forceRefresh.value = true;

            // Lấy danh sách theo ngày sửa
            await store.getAllSanPhamNgaySua();
            store.justAddedProduct = false;
            store.justUpdatedProduct = false;
        } else {
            // Kiểm tra cache trước khi gọi API
            if (isCacheValid(PRODUCTS_CACHE_KEY)) {
                console.log('Sử dụng cache cho danh sách sản phẩm');
                const cachedProducts = getFromCache(PRODUCTS_CACHE_KEY);
                if (cachedProducts) {
                    data.value = cachedProducts;
                    isLoading.value = false;
                    const endTime = performance.now();
                    loadTime.value = Math.round(endTime - startTime);
                    return;
                }
            }

            // Nếu không có cache hoặc cache hết hạn, gọi API
            await store.getAllSP();
        }

        // Xử lý dữ liệu và lưu vào cache
        data.value = store.getAllSanPham.map((item, index) => ({
            stt: index + 1,
            key: item.id_san_pham,
            id_san_pham: item.id_san_pham,
            ma_san_pham: item.ma_san_pham,
            ten_san_pham: item.ten_san_pham,
            hinh_anh: item.hinh_anh,
            chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
            trang_thai: item.trang_thai,
            tong_so_luong: item.tong_so_luong || 0,
            ngay_cap_nhat: item.ngay_cap_nhat || ''
        }));

        // Lưu vào cache nếu có dữ liệu
        // if (data.value.length > 0) {
        //     saveToCache(PRODUCTS_CACHE_KEY, data.value);
        // }

        const endTime = performance.now();
        loadTime.value = Math.round(endTime - startTime);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu sản phẩm');
    } finally {
        isLoading.value = false;
    }
});

onBeforeUnmount(() => {
    // Remove event listener
    window.removeEventListener('sort-option-changed', handleExternalSort);
});
</script>
<style scoped>
:deep(.ctsp-table) {

    /* Giảm padding của header */
    .ant-table-thead>tr>th {
        padding: 8px;
        font-size: 13px;
    }

    /* Giảm padding của cells */
    .ant-table-tbody>tr>td {
        padding: 6px 8px;
        font-size: 12px;
    }

    /* Style cho header */
    .ant-table-thead>tr>th {
        background: #f5f5f5;
        font-weight: 600;
    }

    /* Thêm border và màu nền nhẹ */
    .ant-table {
        border: 1px solid #f0f0f0;
        background: #fafafa;
    }
}

.custom-class {
    z-index: 1000;
}

/* Style cho bộ lọc trạng thái */
.status-filter {
    margin-bottom: 10px;
}

.status-filter .ant-radio-button-wrapper {
    margin-right: 5px;
}

/* Style cho nút lọc trạng thái với màu #f33b47 */
:deep(.custom-radio-group) {
    .ant-radio-button-wrapper {
        color: white;
        background-color: #f33b47;
        border-color: #f33b47;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

        &:first-child {
            border-left-color: #f33b47;
        }

        &:hover {
            color: white;
            background-color: #ff6b76;
            border-color: #ff6b76;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        &.ant-radio-button-wrapper-checked {
            background-color: #d62a38;
            border-color: #d62a38;
            box-shadow: 0 4px 8px rgba(214, 42, 56, 0.3);

            &:before {
                background-color: #d62a38;
            }
        }

        &:focus-within {
            box-shadow: 0 0 0 3px rgba(243, 59, 71, 0.3);
        }
    }
}

/* Style cho bộ lọc trạng thái trong drawer */
.variant-status-filter {
    margin-bottom: 15px;
}

:deep(.variant-status-filter .custom-radio-group) {
    .ant-radio-button-wrapper {
        color: white;
        background-color: #f33b47;
        border-color: #f33b47;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

        &:first-child {
            border-left-color: #f33b47;
        }

        &:hover {
            color: white;
            background-color: #ff6b76;
            border-color: #ff6b76;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        &.ant-radio-button-wrapper-checked {
            background-color: #d62a38;
            border-color: #d62a38;
            box-shadow: 0 4px 8px rgba(214, 42, 56, 0.3);

            &:before {
                background-color: #d62a38;
            }
        }

        &:focus-within {
            box-shadow: 0 0 0 3px rgba(243, 59, 71, 0.3);
        }
    }
}

/* Style cho các nút bulk action */
.bulk-actions {
    margin-top: 10px;
}

.bulk-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 15px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
}

.bulk-action-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.bulk-action-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.bulk-action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
}

.bulk-action-btn:hover::before {
    transform: translateX(0);
}

:deep(.bulk-action-btn .anticon) {
    vertical-align: middle;
    margin-right: 5px;
    font-size: 16px;
    transition: transform 0.3s ease;
}

.bulk-action-btn:hover :deep(.anticon) {
    transform: scale(1.2);
}

/* Style nút primary */
:deep(.ant-btn-primary) {
    background: #f33b47;
    border-color: #f33b47;
    box-shadow: 0 2px 5px rgba(243, 59, 71, 0.3);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.ant-btn-primary:hover),
:deep(.ant-btn-primary:focus) {
    background: #ff4d58;
    border-color: #ff4d58;
    box-shadow: 0 4px 10px rgba(243, 59, 71, 0.4);
    transform: translateY(-2px);
}

/* Style nút danger */
:deep(.ant-btn-dangerous) {
    background: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
    box-shadow: 0 2px 5px rgba(255, 77, 79, 0.3);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.ant-btn-dangerous:hover),
:deep(.ant-btn-dangerous:focus) {
    background: #ff7875;
    border-color: #ff7875;
    color: white;
    box-shadow: 0 4px 10px rgba(255, 77, 79, 0.4);
    transform: translateY(-2px);
}

/* Style nút biến thể */
:deep(.d-flex .ant-btn) {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 15px;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

:deep(.d-flex .ant-btn:hover) {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

:deep(.d-flex .ant-btn .anticon) {
    transition: transform 0.3s ease;
}

:deep(.d-flex .ant-btn:hover .anticon) {
    transform: scale(1.2);
}

:deep(.btn-warning) {
    background: #faad14;
    border-color: #faad14;
    box-shadow: 0 2px 5px rgba(250, 173, 20, 0.3);
}

:deep(.btn-warning:hover) {
    background: #ffc53d;
    border-color: #ffc53d;
    box-shadow: 0 4px 10px rgba(250, 173, 20, 0.4);
}

/* Style cho nút làm mới */
.refresh-button {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background-color: #f33b47;
    border-color: #f33b47;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    position: relative;
    overflow: hidden;
}

.refresh-button::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.5s, opacity 0.3s;
}

.refresh-button:hover {
    transform: rotate(180deg) scale(1.1);
    background-color: #ff4d58;
    border-color: #ff4d58;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.refresh-button:hover::after {
    transform: scale(2);
    opacity: 1;
}

.refresh-button:focus {
    background-color: #d62a38;
    border-color: #d62a38;
}

/* Style cho switch */
:deep(.ant-switch) {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

:deep(.ant-switch:hover) {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

:deep(.ant-switch-handle::before) {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.ant-switch-checked:hover .ant-switch-handle::before) {
    transform: scale(1.1);
}

/* Style cho checkbox */
:deep(.ant-checkbox) {
    .ant-checkbox-inner {
        border-color: #f33b47;
        border-radius: 4px;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    &:hover .ant-checkbox-inner {
        border-color: #ff6b76;
        box-shadow: 0 0 0 2px rgba(243, 59, 71, 0.2);
    }

    &.ant-checkbox-checked .ant-checkbox-inner {
        background-color: #f33b47;
        border-color: #f33b47;
    }

    &.ant-checkbox-checked:hover .ant-checkbox-inner {
        background-color: #ff6b76;
        border-color: #ff6b76;
    }

    &.ant-checkbox-indeterminate .ant-checkbox-inner::after {
        background-color: #f33b47;
    }
}

/* Style cho checkbox trong bảng */
:deep(.ant-table-selection) {

    .ant-checkbox-wrapper:hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner {
        border-color: #ff6b76;
    }

    .ant-checkbox-checked::after {
        border-color: #f33b47;
    }

    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #f33b47;
        border-color: #f33b47;
        animation: checkboxEffect 0.36s ease-in-out;
    }

    .ant-checkbox-checked:hover .ant-checkbox-inner {
        background-color: #ff6b76;
        border-color: #ff6b76;
    }
}

/* Style cho hàng được chọn trong bảng */
:deep(.ant-table-row-selected > td) {
    background-color: rgba(243, 59, 71, 0.1) !important;
}

/* Keyframes for checkbox animation */
@keyframes checkboxEffect {
    0% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>