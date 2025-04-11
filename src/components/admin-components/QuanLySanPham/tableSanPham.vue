<template>
    <!-- <a-space align="center" style="margin-bottom: 16px">
        CheckStrictly:
        <a-switch v-model:checked="rowSelection.checkStrictly"></a-switch>
    </a-space> -->
    <!-- <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :expandable="expandableConfig"
        class="components-table-demo-nested" /> -->
    <div>
        <menuAction ref="menuActionRef" />
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="ms-3 mb-0">Danh sách sản phẩm</h4>
            <a-button @click="refreshData" :loading="isLoading" type="primary" size="small">
                <template #icon>
                    <ReloadOutlined />
                </template>
                Làm mới dữ liệu
            </a-button>
        </div>

        <!-- Loading skeleton -->
        <template v-if="isLoading">
            <a-skeleton active :paragraph="{ rows: 10 }" />
        </template>

        <!-- Data table -->
        <template v-else>
            <a-table :columns="columns" :row-selection="rowSelection" :data-source="displayData"
                class="components-table-demo-nested" :row-key="record => record.id_san_pham"
                :pagination="{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'trang_thai'">
                        <a-switch @change="(checked) => changeStatusSanPham(record.id_san_pham, checked)"
                            :style="{ backgroundColor: record.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                            :checked="record.trang_thai === 'Hoạt động' ? true : false" />
                    </template>
                    <template v-if="column.key === 'hinh_anh'">
                        <a-image style="width: 40px; height: 40px;" :src="record.hinh_anh" />
                    </template>
                    <template v-if="column.key === 'gia_ban'">
                        {{ record.gia_ban }}
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="d-flex gap-2">
                            <a-button type="" @click="changeRouter(record.id_san_pham)" style="color: white;"
                                class="d-flex align-items-center btn btn-warning">
                                <EditOutlined />Sửa
                            </a-button>
                            <a-button type="primary" @click="() => showVariants(record)"
                                class="d-flex align-items-center">
                                <EyeOutlined />Biến thể
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
        <a-drawer v-model:open="drawerVisible" title="Chi tiết biến thể sản phẩm" placement="right" :width="700"
            :footer-style="{ textAlign: 'right' }" @close="closeVariantDrawer">
            <template v-if="currentProduct">
                <div class="product-info mb-4">
                    <h3>{{ currentProduct.ten_san_pham }}</h3>
                    <div class="d-flex gap-3 align-items-center">
                        <a-image style="width: 60px; height: 60px;" :src="currentProduct.hinh_anh" />
                        <div>
                            <p><strong>Mã sản phẩm:</strong> {{ currentProduct.ma_san_pham }}</p>
                            <p><strong>Trạng thái:</strong> {{ currentProduct.trang_thai }}</p>
                        </div>
                    </div>
                </div>

                <h4>Danh sách biến thể</h4>
                <a-table :columns="columnsCTSP" :row-selection="{
                    selectedRowKeys: selectedCTSPKeys,
                    onChange: (keys, rows) => handleCTSPSelection(keys, rows, currentProduct.id_san_pham)
                }" :data-source="productCTSPMap.get(currentProduct.id_san_pham) || []" :pagination="false"
                    :row-key="record => record.id_chi_tiet_san_pham">
                    <template #bodyCell="{ column, record: ctspRecord }">
                        <template v-if="column.key === 'trang_thai'">
                            <a-switch
                                :style="{ backgroundColor: ctspRecord.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                                size="small" :checked="ctspRecord.trang_thai === 'Hoạt động' ? true : false" />
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
        </a-drawer>

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
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { onMounted, ref, render, computed, watch } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

// Cache utilities
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 phút (đơn vị milliseconds)
const PRODUCTS_CACHE_KEY = 'cached_products';
const CTSP_CACHE_PREFIX = 'cached_ctsp_';

// Hàm kiểm tra xem cache có còn hạn hay không
const isCacheValid = (cacheKey) => {
    const cacheData = localStorage.getItem(cacheKey);
    if (!cacheData) return false;

    try {
        const { timestamp } = JSON.parse(cacheData);
        return (Date.now() - timestamp) < CACHE_EXPIRY_TIME;
    } catch (e) {
        console.error('Lỗi khi đọc cache:', e);
        return false;
    }
};

// Hàm lưu dữ liệu vào cache với timestamp
const saveToCache = (key, data) => {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`Đã cache dữ liệu: ${key}`);
    } catch (e) {
        console.error('Lỗi khi lưu cache:', e);
    }
};

// Hàm lấy dữ liệu từ cache
const getFromCache = (key) => {
    try {
        const cacheData = localStorage.getItem(key);
        if (!cacheData) return null;

        const { data } = JSON.parse(cacheData);
        return data;
    } catch (e) {
        console.error('Lỗi khi đọc cache:', e);
        return null;
    }
};

// Hàm xóa cache
const clearCache = (key) => {
    try {
        localStorage.removeItem(key);
        console.log(`Đã xóa cache: ${key}`);
    } catch (e) {
        console.error('Lỗi khi xóa cache:', e);
    }
};

// Hàm xóa tất cả cache liên quan đến sản phẩm
const clearAllProductsCache = () => {
    try {
        // Xóa cache danh sách sản phẩm
        localStorage.removeItem(PRODUCTS_CACHE_KEY);

        // Xóa tất cả cache CTSP
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(CTSP_CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        console.log('Đã xóa tất cả cache sản phẩm');
    } catch (e) {
        console.error('Lỗi khi xóa tất cả cache:', e);
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

// Biến lưu thời gian tải trang
const loadTime = ref(0);

// Function to show variants drawer
const showVariants = async (product) => {
    currentProduct.value = product;
    await getCTSPForProduct(product);
    drawerVisible.value = true;
};

// Function to close variant drawer
const closeVariantDrawer = () => {
    drawerVisible.value = false;
    currentProduct.value = null;
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
const addVariant = () => {
    variants.value.push({
        mau_sac_id: undefined,
        size_id: undefined,
        so_luong: 0,
        gia_ban: 0,
        trang_thai: true,
        fileList: [],
        hinh_anh: []
    });
};


const variants = ref([]);



const resetForm = () => {
    Object.keys(formState).forEach(key => {
        formState[key] = '';
    });
    fileList.value = [];
    variants.value = [];
    variants.value = variants.value.map(variant => ({
        ...variant,
        fileList: [],
        hinh_anh: []
    }));
};
const removeVariant = (index) => {
    variants.value.splice(index, 1);
};
const handleVariantImageChange = async (info, variantIndex) => {
    const { fileList } = info;

    // Giới hạn số lượng file
    const limitedFileList = fileList.slice(0, 3);

    // Cập nhật fileList cho biến thể
    variants.value[variantIndex].fileList = limitedFileList;

    // Xử lý các file đã upload thành công
    const successFiles = limitedFileList.filter(file => file.status === 'done');
    variants.value[variantIndex].hinh_anh = successFiles.map(file => file.response.url);

    // Thông báo kết quả
    const lastFile = info.file;
    if (lastFile.status === 'done') {
        message.success(`${lastFile.name} đã được tải lên thành công`);
    } else if (lastFile.status === 'error') {
        message.error(`${lastFile.name} tải lên thất bại`);
    }
};
const onFinish = async (values) => {
    loading.value = true;
    try {
        // Tạo sản phẩm chính
        const response = await store.createProduct(formState);
        const productId = response.id_san_pham;

        // Tạo các biến thể CTSP với hình ảnh
        if (variants.value.length > 0) {
            const ctspPromises = variants.value.map(variant => {
                return store.createCTSP({
                    ...variant,
                    id_san_pham: productId,
                    hinh_anh: variant.hinh_anh
                });
            });

            await Promise.all(ctspPromises);
        }

        message.success('Thêm sản phẩm và biến thể thành công!');
        resetForm();
    } catch (error) {
        message.error('Có lỗi xảy ra khi thêm sản phẩm!');
        console.error(error);
    } finally {
        loading.value = false;
    }
};
const showDrawer = () => {
    open.value = true;
}

const formState = ref({});
const fileList = ref([]);
const loading = ref(false);

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
        width: '9%',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'ten_san_pham',
        key: 'ten_san_pham',
        width: '17%',
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'hinh_anh',
        key: 'hinh_anh',
        width: '10%',
    },
    {
        title: 'SL',
        dataIndex: 'tong_so_luong',
        key: 'tong_so_luong',
        width: '7%',
    },
    // {
    //     title: 'Giới tính',
    //     dataIndex: 'gioi_tinh',
    //     key: 'gioi_tinh',
    //     width: '10%',
    // },

    {
        title: 'Danh mục/Thương hiệu/Chất liệu',
        dataIndex: 'chi_muc',
        key: 'chi_muc',
        width: '28%',
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
        width: '30%',
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
    },
    {
        title: 'Giá',
        dataIndex: 'gia_ban',
        key: 'gia_ban'
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
const getCTSPForProduct = async (record) => {
    const productId = record.id_san_pham;
    const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;

    if (!productCTSPMap.value.has(productId)) {
        // Kiểm tra cache trước khi gọi API
        if (!forceRefresh.value && isCacheValid(cacheKey)) {
            console.log(`Sử dụng cache cho CTSP của sản phẩm ${productId}`);
            const cachedData = getFromCache(cacheKey);
            if (cachedData) {
                productCTSPMap.value.set(productId, cachedData);
                return cachedData;
            }
        }

        // Nếu không có cache hoặc cache hết hạn, gọi API
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

        // Lưu vào map và cache
        productCTSPMap.value.set(productId, ctspList);
        saveToCache(cacheKey, ctspList);
    }

    return productCTSPMap.value.get(productId) || [];
};

const changeStatusSanPham = async (id, checked) => {
    try {
        await store.changeStatusSanPham(id);
        data.value = data.value.map(item => {
            if (item.id_san_pham === id) {
                return {
                    ...item,
                    trang_thai: checked ? 'Hoạt động' : 'Không hoạt động'
                };
            }
            return item;
        });

        // Xóa cache khi có thay đổi
        clearCache(PRODUCTS_CACHE_KEY);
        clearCache(`${CTSP_CACHE_PREFIX}${id}`);
    } catch (error) {
        console.log('Lỗi khi thay đổi trạng thái');
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

// Computed property để xác định danh sách sản phẩm hiển thị
const displayData = computed(() => {
    // Lấy danh sách sản phẩm đã lọc/tìm kiếm từ store
    const filteredProducts = store.getFilteredProducts;

    // Kiểm tra xem có sản phẩm nào được lọc/tìm kiếm không
    if (filteredProducts && filteredProducts.length > 0) {
        console.log(`Hiển thị ${filteredProducts.length} sản phẩm đã lọc/tìm kiếm`);

        // Format dữ liệu để phù hợp với cấu trúc bảng
        return filteredProducts.map((item, index) => ({
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
        }));
    }

    // Nếu không có kết quả lọc hoặc tìm kiếm, hiển thị tất cả sản phẩm
    console.log(`Hiển thị tất cả ${data.value.length} sản phẩm`);
    return data.value;
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

        data.value = await Promise.all(store.getAllSanPham.map(async (item, index) => {
            return {
                stt: index + 1,
                key: item.id_san_pham,
                id_san_pham: item.id_san_pham,
                ma_san_pham: item.ma_san_pham,
                ten_san_pham: item.ten_san_pham,
                hinh_anh: item.hinh_anh,
                chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
                trang_thai: item.trang_thai,
                tong_so_luong: item.tong_so_luong,
            };
        }));

        // Lưu vào cache nếu có dữ liệu
        if (data.value.length > 0) {
            saveToCache(PRODUCTS_CACHE_KEY, data.value);
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
    const startTime = performance.now();
    isLoading.value = true;

    try {
        // Tải chi tiết sản phẩm cho bộ lọc
        await store.getAllCTSP();
        console.log('Đã tải dữ liệu chi tiết sản phẩm:', store.getAllChiTietSanPham.length);

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
                    return;
                }
            }

            // Nếu không có cache hoặc cache hết hạn, gọi API
            await store.getAllSP();
        }

        // Xử lý dữ liệu và lưu vào cache
        data.value = await Promise.all(store.getAllSanPham.map(async (item, index) => {
            return {
                stt: index + 1,
                key: item.id_san_pham,
                id_san_pham: item.id_san_pham,
                ma_san_pham: item.ma_san_pham,
                ten_san_pham: item.ten_san_pham,
                hinh_anh: item.hinh_anh,
                chi_muc: item.ten_danh_muc + "/" + item.ten_thuong_hieu + "/" + item.ten_chat_lieu,
                trang_thai: item.trang_thai,
                tong_so_luong: item.tong_so_luong,
            };
        }));

        // Lưu vào cache nếu có dữ liệu
        if (data.value.length > 0) {
            saveToCache(PRODUCTS_CACHE_KEY, data.value);
        }

        const endTime = performance.now();
        loadTime.value = Math.round(endTime - startTime);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu sản phẩm');
    } finally {
        isLoading.value = false;
    }
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
</style>