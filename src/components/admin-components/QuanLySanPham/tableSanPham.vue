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

        <!-- Loading skeleton - Đa dạng với nhiều dạng skeleton -->
        <template v-if="isLoading">
            <div class="skeleton-container">
                <div class="mb-3">
                    <a-skeleton-button active size="default" shape="round" block class="mb-2" />
                    <div class="d-flex gap-2">
                        <a-skeleton-button active size="small" shape="round" :style="{ width: '100px' }" />
                        <a-skeleton-button active size="small" shape="round" :style="{ width: '100px' }" />
                        <a-skeleton-button active size="small" shape="round" :style="{ width: '100px' }" />
                    </div>
                </div>
                <a-skeleton active :paragraph="{ rows: 10 }" />
            </div>
        </template>

        <!-- Loading more indicator -->
        <div v-if="isLoadingMore && !isLoading" class="loading-more-indicator">
            <a-alert type="info" show-icon>
                <template #message>Đang tải thêm dữ liệu...</template>
                <template #description>Hiển thị {{ data.length }} sản phẩm đầu tiên trong khi tải nốt dữ liệu</template>
            </a-alert>
        </div>

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
                :scroll="{ y: '65vh', x: 1300 }" :pagination="{
                    pageSize: virtualPageSize,
                    total: store.getAllSanPham?.length || 0,
                    current: currentVirtualPage,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (page) => handleVirtualPageChange(page),
                    onShowSizeChange: (current, size) => {
                        virtualPageSize.value = size;
                        handleVirtualPageChange(1);
                    }
                }" v-bind="handleVirtualScroll()" :sticky="true" @change="handleTableChange" :loading="isChangingPage">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'trang_thai'">
                        <a-switch @change="(checked) => changeStatusSanPham(record.id_san_pham, checked)"
                            :style="{ backgroundColor: record.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                            :checked="record.trang_thai === 'Hoạt động' ? true : false"
                            :disabled="record.trang_thai === 'Không hoạt động'" />
                    </template>
                    <template v-if="column.key === 'hinh_anh'">
                        <a-image style="width: 40px; height: 40px;" :src="record.hinh_anh"
                            :preview="{ src: record.hinh_anh }">
                            <template #placeholder>
                                <div class="image-placeholder">
                                    <a-spin size="small" />
                                </div>
                            </template>
                        </a-image>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="d-flex gap-2">
                            <a-button @click="changeRouter(record.id_san_pham)" type="" style="color: white;"
                                class="d-flex align-items-center btn btn-warning">
                                <EditOutlined /> Sửa
                            </a-button>
                            <a-button @click="showVariants(record)" type="primary" style="color: white;"
                                class="d-flex align-items-center">
                                <EyeOutlined />
                            </a-button>
                        </div>
                    </template>
                    <template v-if="column.key === 'chi_tiet'">
                        <a-table :columns="columnsCTSP" :row-selection="{
                            selectedRowKeys: selectedCTSPKeys,
                            onChange: (keys, rows) => handleCTSPSelection(keys, rows, currentProduct.id_san_pham)
                        }" :data-source="filteredCTSPData" :pagination="false"
                            :row-key="record => record.id_chi_tiet_san_pham">
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
                            </template>
                        </a-table>
                    </template>
                </template>
            </a-table>

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
                            <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc"
                                :value="item.id_danh_muc">
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

            <!-- Drawer cho hiển thị biến thể -->
            <a-drawer v-model:open="drawerVisible" title="Chi tiết biến thể sản phẩm" width="80%" placement="right"
                :footer-style="{ textAlign: 'right' }" @close="closeVariantDrawer">
                <div v-if="currentProduct">
                    <h4>{{ currentProduct.ten_san_pham }}</h4>
                    <p><strong>Mã sản phẩm:</strong> {{ currentProduct.ma_san_pham }}</p>

                    <!-- Thêm bộ lọc trạng thái -->
                    <div class="variant-status-filter">
                        <a-radio-group v-model:value="ctspStatusFilter" @change="filterCTSPByStatus"
                            button-style="solid" class="custom-radio-group">
                            <a-radio-button value="">Tất cả</a-radio-button>
                            <a-radio-button value="Hoạt động">Hoạt động</a-radio-button>
                            <a-radio-button value="Không hoạt động">Không hoạt động</a-radio-button>
                        </a-radio-group>
                        <span class="ms-3">
                            <span class="badge bg-primary">{{ filteredCTSPData.length }} biến thể</span>
                            <template v-if="ctspStatusFilter">
                                <strong class="ms-2">Lọc theo: {{ ctspStatusFilter }}</strong>
                            </template>
                        </span>
                    </div>

                    <!-- Hiển thị biến thể -->
                    <a-table :columns="columnsCTSP" :data-source="filteredCTSPData"
                        :pagination="{ pageSize: 10, showSizeChanger: true }"
                        :row-key="record => record.id_chi_tiet_san_pham" :row-selection="{
                            selectedRowKeys: selectedCTSPKeys,
                            onChange: (keys, rows) => handleCTSPSelection(keys, rows, currentProduct.id_san_pham)
                        }" class="ctsp-table">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'trang_thai'">
                                <a-switch
                                    :style="{ backgroundColor: record.trang_thai === 'Hoạt động' ? '#f33b47' : '#ccc' }"
                                    size="small" :checked="record.trang_thai === 'Hoạt động' ? true : false"
                                    @change="() => changeStatusCTSP(record)" />
                            </template>
                            <template v-if="column.key === 'gia_ban'">
                                {{ formatCurrency(record.gia_ban) }}
                            </template>
                        </template>
                    </a-table>

                    <!-- Bulk actions -->
                    <div class="bulk-actions mt-3" v-if="selectedCTSPKeys.length > 0">
                        <div class="d-flex gap-2">
                            <a-button @click="bulkChangeStatus('Hoạt động')" type="primary" class="bulk-action-btn">
                                <CheckCircleOutlined /> Kích hoạt {{ selectedCTSPKeys.length }} biến thể đã chọn
                            </a-button>
                            <a-button @click="bulkChangeStatus('Không hoạt động')" danger class="bulk-action-btn">
                                <StopOutlined /> Vô hiệu hóa {{ selectedCTSPKeys.length }} biến thể đã chọn
                            </a-button>
                        </div>
                    </div>
                </div>
            </a-drawer>
        </template>
    </div>
</template>
<script setup>
import menuAction from '@/components/admin-components/QuanLySanPham/menuAction.vue';
import {
    EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined,
    CheckCircleOutlined, StopOutlined
} from '@ant-design/icons-vue';
import { onMounted, ref, render, computed, watch, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import { debounce } from 'lodash-es';

// IndexedDB constants và utilities
const DB_NAME = 'gb-sport-db';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';
const CTSP_STORE = 'product_details';

// Khởi tạo IndexedDB
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Lỗi khi mở IndexedDB:", event);
            reject("Không thể mở IndexedDB");
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
                db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id_san_pham' });
            }

            if (!db.objectStoreNames.contains(CTSP_STORE)) {
                const ctspStore = db.createObjectStore(CTSP_STORE, { keyPath: 'id_chi_tiet_san_pham' });
                ctspStore.createIndex('id_san_pham', 'id_san_pham', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

// Lưu dữ liệu vào IndexedDB
const saveToIDB = async (storeName, data) => {
    try {
        const db = await initDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        // Hàm cleanObject để loại bỏ các thuộc tính không thể clone
        const cleanObject = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;

            // Tạo bản sao để tránh thay đổi đối tượng gốc
            const cleaned = Array.isArray(obj) ? [...obj] : { ...obj };

            // Loại bỏ các thuộc tính không thể clone
            for (const key in cleaned) {
                const value = cleaned[key];
                // Loại bỏ functions
                if (typeof value === 'function') {
                    delete cleaned[key];
                    continue;
                }

                // Loại bỏ đối tượng không thể clone
                if (value && typeof value === 'object') {
                    if (value instanceof Map || value instanceof Set ||
                        value instanceof WeakMap || value instanceof WeakSet ||
                        value instanceof Promise || value instanceof RegExp ||
                        value instanceof Error || value instanceof Date ||
                        value instanceof FileList || value instanceof File) {
                        // Chuyển đổi Map và Set thành mảng nếu cần
                        if (value instanceof Map) {
                            cleaned[key] = Array.from(value.entries());
                        } else if (value instanceof Set) {
                            cleaned[key] = Array.from(value.values());
                        } else if (value instanceof Date) {
                            cleaned[key] = value.toISOString();
                        } else {
                            // Nếu không thể chuyển đổi, loại bỏ
                            delete cleaned[key];
                        }
                        continue;
                    }

                    // Xử lý đệ quy cho đối tượng con
                    cleaned[key] = cleanObject(value);
                }
            }
            return cleaned;
        };

        if (Array.isArray(data)) {
            for (const item of data) {
                // Làm sạch đối tượng trước khi lưu
                const cleanedItem = cleanObject(item);
                cleanedItem.timestamp = Date.now();
                store.put(cleanedItem);
            }
        } else {
            // Làm sạch đối tượng trước khi lưu
            const cleanedData = cleanObject(data);
            cleanedData.timestamp = Date.now();
            store.put(cleanedData);
        }

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => {
                console.log(`Đã cache dữ liệu: ${storeName}`);
                resolve(true);
            };

            tx.onerror = (event) => {
                console.error('Lỗi khi lưu cache:', event);
                reject(event);
            };
        });
    } catch (error) {
        console.error('Lỗi khi lưu vào IndexedDB:', error);
        return false;
    }
};

// Lấy dữ liệu từ store theo khóa
const getFromIDB = async (storeName, key) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error(`Lỗi khi đọc từ IndexedDB:`, event);
                reject(null);
            };
        });
    } catch (error) {
        console.error(`Lỗi khi đọc từ IndexedDB:`, error);
        return null;
    }
};

// Lấy tất cả dữ liệu từ store
const getAllFromIDB = async (storeName) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error(`Lỗi khi đọc tất cả từ IndexedDB:`, event);
                reject([]);
            };
        });
    } catch (error) {
        console.error(`Lỗi khi đọc tất cả từ IndexedDB:`, error);
        return [];
    }
};

// Lấy chi tiết sản phẩm theo product ID
const getCTSPByProductIdFromIDB = async (productId) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(CTSP_STORE, 'readonly');
            const store = tx.objectStore(CTSP_STORE);
            const index = store.index('id_san_pham');
            const request = index.getAll(productId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error(`Lỗi khi đọc CTSP từ IndexedDB:`, event);
                reject([]);
            };
        });
    } catch (error) {
        console.error(`Lỗi khi đọc CTSP từ IndexedDB:`, error);
        return [];
    }
};

// Kiểm tra cache còn hạn không
const isIDBCacheValid = async (storeName, key, expiryTime = CACHE_EXPIRY_TIME) => {
    try {
        const data = await getFromIDB(storeName, key);
        if (!data || !data.timestamp) return false;
        return (Date.now() - data.timestamp) < expiryTime;
    } catch (error) {
        console.error('Lỗi khi kiểm tra cache:', error);
        return false;
    }
};

// Xóa tất cả dữ liệu 
const clearIDBStore = async (storeName) => {
    try {
        const db = await initDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        store.clear();

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => {
                console.log(`Đã xóa cache: ${storeName}`);
                resolve(true);
            };

            tx.onerror = (event) => {
                console.error(`Lỗi khi xóa cache:`, event);
                reject(event);
            };
        });
    } catch (error) {
        console.error(`Lỗi khi xóa dữ liệu từ IndexedDB:`, error);
        return false;
    }
};

// Xóa tất cả cache liên quan đến sản phẩm
const clearAllProductsIDBCache = async () => {
    try {
        await clearIDBStore(PRODUCTS_STORE);
        await clearIDBStore(CTSP_STORE);
        console.log('Đã xóa tất cả cache sản phẩm');
        return true;
    } catch (error) {
        console.error('Lỗi khi xóa tất cả cache:', error);
        return false;
    }
};

// Cache utilities (giữ lại cho tương thích ngược)
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
const clearAllProductsCache = async () => {
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

// Thêm directive cho lazy loading hình ảnh
// Đã xóa directive vLazyImage để tránh lỗi

// Cache cho việc tính toán giá sản phẩm
const priceCalculationCache = ref(new Map());

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
    ctspStatusFilter.value = ''; // Reset bộ lọc khi đóng drawer
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
const getCTSPForProduct = async (record) => {
    const productId = record.id_san_pham;

    if (!productCTSPMap.value.has(productId)) {
        // Kiểm tra cache từ IndexedDB trước
        if (!forceRefresh.value) {
            try {
                const cachedData = await getCTSPByProductIdFromIDB(productId);
                if (cachedData && cachedData.length > 0) {
                    console.log(`Sử dụng cache IndexedDB cho CTSP của sản phẩm ${productId}`);
                    productCTSPMap.value.set(productId, cachedData);
                    return cachedData;
                }
            } catch (error) {
                console.error('Lỗi khi đọc IndexedDB, fallback về localStorage:', error);
                // Fallback to localStorage
                const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;
                if (!forceRefresh.value && isCacheValid(cacheKey)) {
                    console.log(`Sử dụng localStorage cache cho CTSP của sản phẩm ${productId}`);
                    const cachedData = getFromCache(cacheKey);
                    if (cachedData) {
                        productCTSPMap.value.set(productId, cachedData);
                        return cachedData;
                    }
                }
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

        // Lưu vào map, IndexedDB và localStorage
        productCTSPMap.value.set(productId, ctspList);
        try {
            await saveToIDB(CTSP_STORE, ctspList); // Lưu vào IndexedDB
        } catch (error) {
            console.error('Lỗi khi lưu vào IndexedDB, fallback về localStorage:', error);
            saveToCache(`${CTSP_CACHE_PREFIX}${productId}`, ctspList); // Fallback
        }
    }

    return productCTSPMap.value.get(productId) || [];
};

const changeStatusSanPham = async (id, checked) => {
    try {
        await store.changeStatusSanPham(id);

        // Cập nhật trạng thái cho sản phẩm chính
        const newStatus = checked ? 'Hoạt động' : 'Không hoạt động';
        data.value = data.value.map(item => {
            if (item.id_san_pham === id) {
                return {
                    ...item,
                    trang_thai: newStatus
                };
            }
            return item;
        });

        // Cập nhật trạng thái cho tất cả chi tiết sản phẩm liên quan
        if (productCTSPMap.value.has(id)) {
            const ctspList = productCTSPMap.value.get(id);
            if (ctspList && ctspList.length > 0) {
                const updatedCtspList = ctspList.map(ctsp => ({
                    ...ctsp,
                    trang_thai: newStatus
                }));
                productCTSPMap.value.set(id, updatedCtspList);

                // Nếu sản phẩm đang hiển thị trong drawer thì cập nhật hiển thị
                if (currentProduct.value && currentProduct.value.id_san_pham === id) {
                    currentProduct.value = {
                        ...currentProduct.value,
                        trang_thai: newStatus
                    };
                }
            }
        }

        // Xóa cache khi có thay đổi
        clearCache(PRODUCTS_CACHE_KEY);
        clearCache(`${CTSP_CACHE_PREFIX}${id}`);
    } catch (error) {
        console.log('Lỗi khi thay đổi trạng thái:', error);
        message.error('Có lỗi xảy ra khi thay đổi trạng thái sản phẩm');
    }
};
const changeStatusCTSP = async (record) => {
    try {
        const ctspId = record.id_chi_tiet_san_pham;
        const currentStatus = record.trang_thai;
        const newStatus = currentStatus === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';

        // Tìm sản phẩm cha
        const productId = currentProduct.value.id_san_pham;
        const parentProductIndex = data.value.findIndex(item => item.id_san_pham === productId);

        // Kiểm tra số lượng nếu đang chuyển sang Hoạt động
        if (newStatus === 'Hoạt động' && record.so_luong === 0) {
            message.error('Không thể kích hoạt chi tiết sản phẩm có số lượng bằng 0');
            return;
        }

        // Thông báo đang xử lý
        message.loading({ content: 'Đang cập nhật trạng thái...', key: 'statusChange' });

        // Cập nhật UI trước khi gọi API (optimistic update)
        // 1. Cập nhật CTSP
        const ctspList = [...productCTSPMap.value.get(productId) || []];
        const updatedCtspList = ctspList.map(item => {
            if (item.id_chi_tiet_san_pham === ctspId) {
                return { ...item, trang_thai: newStatus };
            }
            return item;
        });
        productCTSPMap.value.set(productId, updatedCtspList);

        // 2. Cập nhật sản phẩm cha
        if (parentProductIndex !== -1) {
            // Nếu một CTSP chuyển sang Hoạt động, sản phẩm cha luôn chuyển sang Hoạt động
            if (newStatus === 'Hoạt động') {
                data.value[parentProductIndex].trang_thai = 'Hoạt động';
                if (currentProduct.value) {
                    currentProduct.value.trang_thai = 'Hoạt động';
                }
            }
            // Nếu CTSP chuyển sang Không hoạt động, kiểm tra xem còn CTSP nào đang Hoạt động không
            else {
                const hasOtherActiveCTSP = updatedCtspList.some(
                    item => item.id_chi_tiet_san_pham !== ctspId && item.trang_thai === 'Hoạt động'
                );

                if (!hasOtherActiveCTSP) {
                    data.value[parentProductIndex].trang_thai = 'Không hoạt động';
                    if (currentProduct.value) {
                        currentProduct.value.trang_thai = 'Không hoạt động';
                    }
                }
            }
        }

        // Gọi API để cập nhật trạng thái
        if (newStatus === 'Hoạt động') {
            await store.changeAllCTSPHoatDong(ctspId);
        } else {
            await store.changeAllCTSPKhongHoatDong(ctspId);
        }

        // Cập nhật UI sau khi API thành công
        message.success({
            content: `Đã chuyển chi tiết sản phẩm thành ${newStatus}`,
            key: 'statusChange'
        });

        // Xóa cache để lần sau tải dữ liệu mới
        clearCache(`${CTSP_CACHE_PREFIX}${productId}`);
        clearCache(PRODUCTS_CACHE_KEY);

    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        message.error({
            content: 'Có lỗi xảy ra khi thay đổi trạng thái',
            key: 'statusChange'
        });

        // Nếu có lỗi, tải lại dữ liệu từ server để reset UI
        try {
            await fetchData();
        } catch (e) {
            console.error('Không thể tải lại dữ liệu sau lỗi:', e);
        }
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

// Thêm debounce cho các thao tác tìm kiếm/lọc
const debouncedStatusFilter = debounce((value) => {
    statusFilter.value = value;
}, 300);

// Cập nhật hàm xử lý lọc trạng thái
const handleStatusFilterChange = (e) => {
    debouncedStatusFilter(e.target.value);
    console.log('Lọc theo trạng thái (debounced):', e.target.value);
};

// Thêm debounce cho bộ lọc trạng thái chi tiết sản phẩm
const debouncedCTSPStatusFilter = debounce((value) => {
    ctspStatusFilter.value = value;
}, 300);

// Cập nhật hàm xử lý lọc trạng thái chi tiết
const filterCTSPByStatus = (e) => {
    debouncedCTSPStatusFilter(e.target.value);
    console.log('Lọc theo trạng thái chi tiết (debounced):', e.target.value);
};

// Cập nhật computed property để lọc theo trạng thái
const displayData = computed(() => {
    // Đầu tiên kiểm tra xem có dữ liệu lọc từ store không
    const filteredProducts = store.getFilteredProducts;

    // Nếu có lọc/tìm kiếm từ store (menuAction), ưu tiên dùng kết quả này
    if (filteredProducts && filteredProducts.length > 0) {
        console.log(`Hiển thị ${filteredProducts.length} sản phẩm đã lọc/tìm kiếm`);

        // Format dữ liệu để phù hợp với cấu trúc bảng
        let formattedProducts = filteredProducts.map((item, index) => {
            // Lấy giá từ cache nếu có
            let highestPrice = 0;
            let lowestPrice = 0;
            const productId = item.id_san_pham;

            if (priceCalculationCache.value.has(productId)) {
                const prices = priceCalculationCache.value.get(productId);
                highestPrice = prices.highest;
                lowestPrice = prices.lowest;
            } else if (productCTSPMap.value.has(productId)) {
                const variants = productCTSPMap.value.get(productId);
                if (variants && variants.length > 0) {
                    const prices = variants
                        .map(variant => variant.gia_ban || 0)
                        .filter(price => price > 0);

                    if (prices.length > 0) {
                        highestPrice = Math.max(...prices);
                        lowestPrice = Math.min(...prices);
                        // Lưu vào cache
                        priceCalculationCache.value.set(productId, { highest: highestPrice, lowest: lowestPrice });
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

        // Áp dụng lọc trạng thái nếu có
        if (statusFilter.value) {
            formattedProducts = formattedProducts.filter(item => item.trang_thai === statusFilter.value);
        }

        return formattedProducts;
    }

    // Nếu không có lọc/tìm kiếm từ store, dùng data đã phân trang
    // Lọc theo trạng thái nếu người dùng đã chọn
    if (statusFilter.value) {
        return data.value.filter(item => item.trang_thai === statusFilter.value);
    }

    // Trả về dữ liệu phân trang hiện tại
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
        await clearAllProductsIDBCache();
        clearAllProductsCache(); // Backup xóa localStorage cache
        isLoading.value = true;

        // Xóa cache giá
        priceCalculationCache.value.clear();

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
            store.getAllCTSP(), // Chi tiết sản phẩm
        ]);

        console.log('Đã cập nhật dữ liệu bộ lọc');

        // Xử lý dữ liệu theo chunks để không block UI
        data.value = await loadProductsInChunks(store.getAllSanPham);

        // Lưu vào both caches
        try {
            await saveToIDB(PRODUCTS_STORE, data.value);
        } catch (error) {
            console.error('Lỗi khi lưu vào IndexedDB, fallback về localStorage:', error);
            saveToCache(PRODUCTS_CACHE_KEY, data.value);
        }

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

    // Bỏ phần đăng ký directive lazy image

    const startTime = performance.now();
    isLoading.value = true;

    try {
        // Tải chi tiết sản phẩm cho bộ lọc
        await store.getAllCTSP();
        console.log('Đã tải dữ liệu chi tiết sản phẩm:', store.getAllChiTietSanPham.length);

        // Kiểm tra xem có cần refresh cache không
        if (store.justAddedProduct || store.justUpdatedProduct) {
            // Nếu vừa thêm hoặc sửa sản phẩm, xóa toàn bộ cache
            await clearAllProductsIDBCache();
            clearAllProductsCache(); // Backup xóa localStorage cache
            forceRefresh.value = true;

            // Lấy danh sách theo ngày sửa
            await store.getAllSanPhamNgaySua();
            store.justAddedProduct = false;
            store.justUpdatedProduct = false;
        } else {
            // Kiểm tra cache từ IndexedDB
            try {
                const cachedProducts = await getAllFromIDB(PRODUCTS_STORE);
                if (!forceRefresh.value && cachedProducts && cachedProducts.length > 0) {
                    console.log('Sử dụng cache IndexedDB cho danh sách sản phẩm');
                    data.value = cachedProducts;
                    isLoading.value = false;

                    const endTime = performance.now();
                    loadTime.value = Math.round(endTime - startTime);
                    return;
                }
            } catch (error) {
                console.error('Lỗi khi đọc từ IndexedDB, fallback về localStorage:', error);
                // Fallback to localStorage
                if (isCacheValid(PRODUCTS_CACHE_KEY)) {
                    console.log('Sử dụng localStorage cache cho danh sách sản phẩm');
                    const cachedProducts = getFromCache(PRODUCTS_CACHE_KEY);
                    if (cachedProducts) {
                        data.value = cachedProducts;
                        isLoading.value = false;

                        const endTime = performance.now();
                        loadTime.value = Math.round(endTime - startTime);
                        return;
                    }
                }
            }

            // Nếu không có cache hoặc cache hết hạn, gọi API
            await store.getAllSP();
        }

        // Xử lý dữ liệu và lưu vào cache bằng chunking
        data.value = await loadProductsInChunks(store.getAllSanPham);

        // Lưu vào IndexedDB và localStorage cho redundancy
        try {
            await saveToIDB(PRODUCTS_STORE, data.value);
        } catch (error) {
            console.error('Lỗi khi lưu vào IndexedDB, fallback về localStorage:', error);
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
            saveToCache(`${CTSP_CACHE_PREFIX}${productId}`, ctspList);
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

// Hàm thay đổi trạng thái cho nhiều chi tiết sản phẩm một lúc
const bulkChangeStatus = async (newStatus) => {
    if (!selectedCTSPKeys.value || selectedCTSPKeys.value.length === 0) {
        message.error('Vui lòng chọn ít nhất một chi tiết sản phẩm');
        return;
    }

    if (!currentProduct.value) {
        return;
    }

    const productId = currentProduct.value.id_san_pham;
    const selectedIds = [...selectedCTSPKeys.value];

    try {
        message.loading({
            content: `Đang chuyển ${selectedIds.length} chi tiết sản phẩm thành ${newStatus}...`,
            key: 'bulkStatusChange'
        });

        // Lọc ra các CTSP có số lượng 0 nếu đang chuyển sang Hoạt động
        let filteredIds = [...selectedIds];
        let skippedItems = [];

        if (newStatus === 'Hoạt động') {
            const ctspList = productCTSPMap.value.get(productId) || [];
            skippedItems = ctspList.filter(
                item => selectedIds.includes(item.id_chi_tiet_san_pham) && item.so_luong === 0
            );

            if (skippedItems.length > 0) {
                filteredIds = selectedIds.filter(id =>
                    !skippedItems.some(item => item.id_chi_tiet_san_pham === id)
                );

                // Thông báo về các mục bị bỏ qua
                if (skippedItems.length === selectedIds.length) {
                    message.error({
                        content: 'Không thể chuyển các chi tiết sản phẩm hết hàng sang trạng thái Hoạt động',
                        key: 'bulkStatusChange',
                        duration: 3
                    });
                    return;
                }
            }
        }

        // Cập nhật UI trước (optimistic update)
        const ctspList = [...productCTSPMap.value.get(productId) || []];
        const updatedCtspList = ctspList.map(item => {
            if (filteredIds.includes(item.id_chi_tiet_san_pham)) {
                return {
                    ...item,
                    trang_thai: newStatus
                };
            }
            return item;
        });

        // Cập nhật Map và UI
        productCTSPMap.value.set(productId, updatedCtspList);

        // Cập nhật trạng thái sản phẩm cha dựa trên trạng thái mới của các CTSP
        const parentProductIndex = data.value.findIndex(item => item.id_san_pham === productId);

        if (parentProductIndex !== -1) {
            // Nếu đang chuyển ít nhất một CTSP thành "Hoạt động"
            if (newStatus === 'Hoạt động') {
                // Luôn cập nhật sản phẩm cha thành "Hoạt động" khi có bất kỳ CTSP nào hoạt động
                data.value[parentProductIndex].trang_thai = 'Hoạt động';
                if (currentProduct.value) {
                    currentProduct.value.trang_thai = 'Hoạt động';
                }
            }
            // Nếu đang chuyển nhiều CTSP thành "Không hoạt động" 
            else {
                // Kiểm tra xem còn CTSP nào khác đang "Hoạt động" không
                const hasOtherActiveCTSP = updatedCtspList.some(
                    item => !filteredIds.includes(item.id_chi_tiet_san_pham) && item.trang_thai === 'Hoạt động'
                );

                // Nếu không còn CTSP nào hoạt động, cập nhật sản phẩm cha thành "Không hoạt động"
                if (!hasOtherActiveCTSP) {
                    data.value[parentProductIndex].trang_thai = 'Không hoạt động';
                    if (currentProduct.value) {
                        currentProduct.value.trang_thai = 'Không hoạt động';
                    }
                }
            }
        }

        // Gọi API để cập nhật trạng thái
        if (filteredIds.length > 0) {
            if (newStatus === 'Hoạt động') {
                await Promise.all(filteredIds.map(id => store.changeAllCTSPHoatDong(id)));
            } else {
                await Promise.all(filteredIds.map(id => store.changeAllCTSPKhongHoatDong(id)));
            }
        }

        // Xóa cache
        clearCache(`${CTSP_CACHE_PREFIX}${productId}`);
        clearCache(PRODUCTS_CACHE_KEY);

        // Hiển thị thông báo thành công
        let successMessage = `Đã chuyển ${filteredIds.length} chi tiết sản phẩm thành ${newStatus}`;
        if (skippedItems.length > 0) {
            successMessage += `, bỏ qua ${skippedItems.length} chi tiết hết hàng`;
        }

        setTimeout(() => {
            message.success({
                content: successMessage,
                key: 'bulkStatusChange',
                duration: 2
            });
        }, 500);

        // Xóa các mục đã được chọn sau khi hoàn tất
        selectedCTSPKeys.value = [];

    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái nhiều chi tiết sản phẩm:', error);
        message.error({
            content: 'Đã xảy ra lỗi khi thay đổi trạng thái',
            key: 'bulkStatusChange',
            duration: 2
        });

        // Hoàn tác UI nếu có lỗi
        try {
            const ctspData = await store.getCTSPBySanPham(productId);
            const updatedList = ctspData.map(ctsp => ({
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
            productCTSPMap.value.set(productId, updatedList);

            // Cập nhật lại trạng thái sản phẩm cha từ server
            await fetchData();
        } catch (fetchError) {
            console.error('Lỗi khi hoàn tác UI:', fetchError);
        }

        // Xóa các mục đã được chọn
        selectedCTSPKeys.value = [];
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

        // Reset về trang 1 khi refresh
        currentVirtualPage.value = 1;

        // Xóa cache trang
        nextPageCache.value.clear();

        // Update local data from store with virtual pagination
        data.value = await loadProductsInChunks(store.getAllSanPham);

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
            saveToCache(cacheKey, formattedVariants);

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
        // Kiểm tra cache
        if (priceCalculationCache.value.has(productId) && !forceRefresh.value) {
            return priceCalculationCache.value.get(productId);
        }

        // First check if we already have loaded CTSP for this product
        if (productCTSPMap.value.has(productId)) {
            const variants = productCTSPMap.value.get(productId);
            if (variants && variants.length > 0) {
                // Get all prices from variants (ignore 0 or null prices)
                const prices = variants
                    .map(variant => variant.gia_ban || 0)
                    .filter(price => price > 0);

                if (prices.length > 0) {
                    const result = {
                        highest: Math.max(...prices),
                        lowest: Math.min(...prices)
                    };
                    priceCalculationCache.value.set(productId, result);
                    return result;
                }
                return { highest: 0, lowest: 0 };
            }
            return { highest: 0, lowest: 0 };
        }

        // If not loaded, try to get from IndexedDB first
        try {
            const cachedVariants = await getCTSPByProductIdFromIDB(productId);
            if (cachedVariants && cachedVariants.length > 0) {
                const prices = cachedVariants
                    .map(variant => variant.gia_ban || 0)
                    .filter(price => price > 0);

                if (prices.length > 0) {
                    const result = {
                        highest: Math.max(...prices),
                        lowest: Math.min(...prices)
                    };
                    priceCalculationCache.value.set(productId, result);
                    return result;
                }
                return { highest: 0, lowest: 0 };
            }
        } catch (error) {
            console.error('Error getting variants from IndexedDB:', error);
            // Fall back to localStorage
            const cacheKey = `${CTSP_CACHE_PREFIX}${productId}`;
            if (!forceRefresh.value && isCacheValid(cacheKey)) {
                const cachedVariants = getFromCache(cacheKey);
                if (cachedVariants && cachedVariants.length > 0) {
                    const prices = cachedVariants
                        .map(variant => variant.gia_ban || 0)
                        .filter(price => price > 0);

                    if (prices.length > 0) {
                        const result = {
                            highest: Math.max(...prices),
                            lowest: Math.min(...prices)
                        };
                        priceCalculationCache.value.set(productId, result);
                        return result;
                    }
                    return { highest: 0, lowest: 0 };
                }
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

            // Lưu vào both caches for best performance
            try {
                await saveToIDB(CTSP_STORE, formattedVariants);
            } catch (error) {
                console.error('Error saving to IndexedDB:', error);
                saveToCache(`${CTSP_CACHE_PREFIX}${productId}`, formattedVariants);
            }

            const prices = formattedVariants
                .map(variant => variant.gia_ban || 0)
                .filter(price => price > 0);

            if (prices.length > 0) {
                const result = {
                    highest: Math.max(...prices),
                    lowest: Math.min(...prices)
                };
                priceCalculationCache.value.set(productId, result);
                return result;
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

    // Xử lý chuyển trang
    if (pagination && pagination.current !== currentVirtualPage.value) {
        handleVirtualPageChange(pagination.current);
    }

    // Xử lý sorting nếu cần
    if (sorter && sorter.order) {
        console.log(`Sorting by ${sorter.field}, order: ${sorter.order}`);
        // Sắp xếp dữ liệu nếu cần
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

    // Bỏ phần đăng ký directive lazy image

    const startTime = performance.now();
    isLoading.value = true;

    try {
        // Tải chi tiết sản phẩm cho bộ lọc
        await store.getAllCTSP();
        console.log('Đã tải dữ liệu chi tiết sản phẩm:', store.getAllChiTietSanPham.length);

        // Kiểm tra xem có cần refresh cache không
        if (store.justAddedProduct || store.justUpdatedProduct) {
            // Nếu vừa thêm hoặc sửa sản phẩm, xóa toàn bộ cache
            await clearAllProductsIDBCache();
            clearAllProductsCache(); // Backup xóa localStorage cache
            forceRefresh.value = true;

            // Lấy danh sách theo ngày sửa
            await store.getAllSanPhamNgaySua();
            store.justAddedProduct = false;
            store.justUpdatedProduct = false;
        } else {
            // Kiểm tra cache từ IndexedDB
            try {
                const cachedProducts = await getAllFromIDB(PRODUCTS_STORE);
                if (!forceRefresh.value && cachedProducts && cachedProducts.length > 0) {
                    console.log('Sử dụng cache IndexedDB cho danh sách sản phẩm');
                    data.value = cachedProducts;
                    isLoading.value = false;

                    const endTime = performance.now();
                    loadTime.value = Math.round(endTime - startTime);
                    return;
                }
            } catch (error) {
                console.error('Lỗi khi đọc từ IndexedDB, fallback về localStorage:', error);
                // Fallback to localStorage
                if (isCacheValid(PRODUCTS_CACHE_KEY)) {
                    console.log('Sử dụng localStorage cache cho danh sách sản phẩm');
                    const cachedProducts = getFromCache(PRODUCTS_CACHE_KEY);
                    if (cachedProducts) {
                        data.value = cachedProducts;
                        isLoading.value = false;

                        const endTime = performance.now();
                        loadTime.value = Math.round(endTime - startTime);
                        return;
                    }
                }
            }

            // Nếu không có cache hoặc cache hết hạn, gọi API
            await store.getAllSP();
        }

        // Xử lý dữ liệu và lưu vào cache bằng chunking
        data.value = await loadProductsInChunks(store.getAllSanPham);

        // Lưu vào IndexedDB và localStorage cho redundancy
        try {
            await saveToIDB(PRODUCTS_STORE, data.value);
        } catch (error) {
            console.error('Lỗi khi lưu vào IndexedDB, fallback về localStorage:', error);
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

onBeforeUnmount(() => {
    // Remove event listener
    window.removeEventListener('sort-option-changed', handleExternalSort);
});

// Hàm tải sản phẩm theo từng phần (chunking) - Phiên bản tối ưu hóa
const loadProductsInChunks = async (productsData, chunkSize = 50) => {
    // Tạo tên timer duy nhất bằng cách thêm timestamp
    const timerId = `loadProductsInChunks_${Date.now()}`;
    console.time(timerId);

    if (!productsData || productsData.length === 0) return [];

    // Chỉ xử lý dữ liệu trang hiện tại trước
    const start = (currentVirtualPage.value - 1) * virtualPageSize.value;
    const end = Math.min(start + virtualPageSize.value, productsData.length);
    const currentPageProducts = productsData.slice(start, end);

    // Tức thì xử lý và hiển thị sản phẩm của trang hiện tại
    isLoading.value = true;
    const processedCurrentPage = await Promise.all(currentPageProducts.map(async (item, index) => {
        const prices = priceCalculationCache.value.get(item.id_san_pham) ||
            await getProductPrices(item.id_san_pham);

        return {
            stt: start + index + 1,
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
            ngay_cap_nhat: item.ngay_cap_nhat || ''
        };
    }));

    data.value = processedCurrentPage;
    isLoading.value = false;

    // Trong nền, chuẩn bị dữ liệu cho các trang tiếp theo khi người dùng đang duyệt trang hiện tại
    if (productsData.length > end) {
        isLoadingMore.value = true;

        setTimeout(async () => {
            // Load thêm 2 trang tiếp theo trong nền để người dùng có thể xem ngay khi chuyển trang
            const nextPagesEnd = Math.min(end + virtualPageSize.value * 2, productsData.length);
            const nextPagesProducts = productsData.slice(end, nextPagesEnd);

            if (nextPagesProducts.length > 0) {
                // Xử lý dữ liệu trong background
                const processedNextPages = await Promise.all(nextPagesProducts.map(async (item, index) => {
                    const prices = priceCalculationCache.value.get(item.id_san_pham) ||
                        await getProductPrices(item.id_san_pham);

                    return {
                        stt: end + index + 1,
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
                        ngay_cap_nhat: item.ngay_cap_nhat || ''
                    };
                }));

                // Lưu vào cache cho các trang tiếp theo
                nextPageCache.value = new Map([
                    ...Array.from(nextPageCache.value.entries()),
                    ...processedNextPages.map(item => [item.id_san_pham, item])
                ]);
            }

            isLoadingMore.value = false;
            console.timeEnd(timerId);
        }, 100);
    } else {
        console.timeEnd(timerId);
    }

    return processedCurrentPage;
};

// Thêm biến quản lý trạng thái tải thêm
const isLoadingMore = ref(false);

// Cải thiện virtual scrolling
const handleVirtualScroll = () => {
    if (data.value.length > 1000) {
        // Với dữ liệu lớn, kích hoạt phân trang tự động
        return {
            virtual: true,
            scrollingX: false,
            scrollingY: true,
            itemHeight: 54, // Chiều cao của hàng trong bảng
            buffer: 200 // Số hàng buffer
        };
    }
    return { virtual: true }; // Default config
};

// Thêm biến và computed cho virtual pagination
const currentVirtualPage = ref(1);
const virtualPageSize = ref(20);
const totalVirtualPages = computed(() => {
    const total = store.getAllSanPham?.length || 0;
    return Math.ceil(total / virtualPageSize.value);
});

// Data đã phân trang ảo
const virtualPaginatedData = computed(() => {
    if (!store.getAllSanPham || store.getAllSanPham.length === 0) return [];

    const start = (currentVirtualPage.value - 1) * virtualPageSize.value;
    const end = start + virtualPageSize.value;

    // Lấy phần dữ liệu cần thiết từ mảng gốc
    return store.getAllSanPham.slice(start, end);
});

// Handler for virtual pagination
const handleVirtualPageChange = async (page) => {
    if (page === currentVirtualPage.value) return;

    const prevPage = currentVirtualPage.value;
    currentVirtualPage.value = page;

    // Hiển thị loading khi chuyển trang
    isChangingPage.value = true;

    try {
        // Kiểm tra xem có đang lọc không
        const isFiltering = store.getFilteredProducts && store.getFilteredProducts.length > 0;

        // Nếu đang lọc, không cần tải dữ liệu trang mới
        if (isFiltering) {
            isChangingPage.value = false;
            return;
        }

        // Xử lý tương tự như code cũ
        const start = (page - 1) * virtualPageSize.value;
        const end = start + virtualPageSize.value;

        // Nếu đã xử lý trước và có trong cache
        if (nextPageCache.value.size > 0) {
            // Lấy các sản phẩm của trang từ cache
            const pageProducts = store.getAllSanPham.slice(start, end);
            const cachedPageData = pageProducts
                .map(item => nextPageCache.value.get(item.id_san_pham))
                .filter(Boolean);

            // Nếu có đủ dữ liệu trong cache
            if (cachedPageData.length === pageProducts.length) {
                // Cập nhật trực tiếp từ cache
                data.value = cachedPageData;
                isChangingPage.value = false;

                // Tiếp tục load dữ liệu cho các trang tiếp theo
                preloadNextPages(page);
                return;
            }
        }

        // Nếu không có trong cache, tải lại dữ liệu
        const pageProducts = store.getAllSanPham.slice(start, end);
        const processedPageData = await Promise.all(pageProducts.map(async (item, index) => {
            const prices = priceCalculationCache.value.get(item.id_san_pham) ||
                await getProductPrices(item.id_san_pham);

            return {
                stt: start + index + 1,
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
                ngay_cap_nhat: item.ngay_cap_nhat || ''
            };
        }));

        data.value = processedPageData;

        // Tiếp tục load dữ liệu cho các trang tiếp theo
        preloadNextPages(page);
    } catch (error) {
        console.error('Lỗi khi chuyển trang:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu trang ' + page);
        // Khôi phục lại trang trước
        currentVirtualPage.value = prevPage;
    } finally {
        isChangingPage.value = false;
    }
};

// Hàm tải trước dữ liệu cho các trang tiếp theo
const preloadNextPages = (currentPage) => {
    if (!store.getAllSanPham || store.getAllSanPham.length === 0) return;

    // Tải trước dữ liệu cho trang tiếp theo
    if (currentPage < totalVirtualPages.value) {
        setTimeout(async () => {
            const nextPage = currentPage + 1;
            const start = (nextPage - 1) * virtualPageSize.value;
            const end = start + virtualPageSize.value;

            const nextPageProducts = store.getAllSanPham.slice(start, end);
            await Promise.all(nextPageProducts.map(async (item) => {
                if (!priceCalculationCache.value.has(item.id_san_pham)) {
                    const prices = await getProductPrices(item.id_san_pham);
                    priceCalculationCache.value.set(item.id_san_pham, prices);
                }
            }));
        }, 200);
    }
};

// Thêm biến trạng thái để hiển thị loading khi chuyển trang
const isChangingPage = ref(false);

// Cache cho dữ liệu trang kế tiếp
const nextPageCache = ref(new Map());

// Đảm bảo lọc đa trường từ menuAction vẫn hoạt động
const updateMenuActionFilters = () => {
    if (menuActionRef.value) {
        menuActionRef.value.updateVirtualPaginationInfo({
            currentPage: currentVirtualPage.value,
            pageSize: virtualPageSize.value,
            total: store.getAllSanPham?.length || 0
        });
    }
};

// Theo dõi sự thay đổi của currentVirtualPage để cập nhật menuAction
watch(currentVirtualPage, (newPage) => {
    updateMenuActionFilters();
});

// Theo dõi sự thay đổi của virtualPageSize để cập nhật menuAction
watch(virtualPageSize, (newSize) => {
    updateMenuActionFilters();
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

.image-placeholder {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.loading-more-indicator {
    margin-bottom: 12px;
}

.skeleton-container {
    padding: 12px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Cải thiện tốc độ render bằng cách tận dụng GPU */
.components-table-demo-nested {
    transform: translateZ(0);
    will-change: transform;
}

/* Giảm dung lượng bộ nhớ khi scroll bằng việc ẩn hình ảnh ngoài view */
:deep(.ant-table-body) {
    overflow-anchor: auto;
    contain: content;
}

:deep(.ant-table-row) {
    contain: layout style;
}

/* Tối ưu hóa lazy-load hình ảnh */
:deep(.ant-image) {
    content-visibility: auto;
}

/* Sử dụng render hints để cải thiện tốc độ */
:deep(.ant-table) {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
</style>