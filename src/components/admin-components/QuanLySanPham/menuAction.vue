<template>
    <div class="mb-4 d-flex justify-content-between">
        <div class="d-flex gap-2 flex-wrap">
            <template v-if="!store.checkRouter.includes('/quanlysanpham/add')">
                <a-button type="" @click="showFilter" class="d-flex align-items-center btn-filter">
                    <FilterOutlined class="icon-filler" />
                    <span class="button-text">Bộ lọc</span>
                </a-button>

                <a-button v-if="isFiltering" type="danger" style="margin-left:10px;border-radius: 5px;"
                    @click="resetFilter">
                    <SyncOutlined />
                    <span class="button-text">Xóa bộ lọc</span>
                </a-button>

                <a-drawer v-model:open="visible" class="custom-class" root-class-name="root-class-name"
                    :root-style="{ color: 'black' }" title="Bộ lọc sản phẩm" placement="right"
                    @after-open-change="afterOpenChange" :footer-style="{ textAlign: 'right' }">

                    <div class="drawer-content">
                        <!-- Hiển thị trạng thái tải dữ liệu -->
                        <div v-if="danhMucList.length === 0 || thuongHieuList.length === 0" class="loading-state">
                            <p>Đang tải dữ liệu...</p>
                        </div>

                        <!-- Bộ lọc Danh mục -->
                        <div class="filter-group">
                            <div class="filter-title">Danh mục</div>
                            <a-select v-model:value="valueDanhMuc" style="width: 100%" mode="multiple"
                                placeholder="Chọn danh mục" :maxTagCount="2"
                                :maxTagPlaceholder="(omittedValues) => `+ ${omittedValues.length} danh mục khác`">
                                <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc"
                                    :value="item.id_danh_muc">
                                    {{ item.ten_danh_muc }}
                                </a-select-option>
                            </a-select>
                        </div>

                        <!-- Bộ lọc Thương hiệu -->
                        <div class="filter-group">
                            <div class="filter-title">Thương hiệu</div>
                            <a-select v-model:value="valueThuongHieu" style="width: 100%" mode="multiple"
                                placeholder="Chọn thương hiệu" :maxTagCount="2"
                                :maxTagPlaceholder="(omittedValues) => `+ ${omittedValues.length} thương hiệu khác`">
                                <a-select-option v-for="item in thuongHieuList" :key="item.id_thuong_hieu"
                                    :value="item.id_thuong_hieu">
                                    {{ item.ten_thuong_hieu }}
                                </a-select-option>
                            </a-select>
                        </div>

                        <!-- Bộ lọc Chất liệu -->
                        <div class="filter-group">
                            <div class="filter-title">Chất liệu</div>
                            <a-select v-model:value="valueChatLieu" style="width: 100%" mode="multiple"
                                placeholder="Chọn chất liệu" :maxTagCount="2"
                                :maxTagPlaceholder="(omittedValues) => `+ ${omittedValues.length} chất liệu khác`">
                                <a-select-option v-for="item in chatLieuList" :key="item.id_chat_lieu"
                                    :value="item.id_chat_lieu">
                                    {{ item.ten_chat_lieu }}
                                </a-select-option>
                            </a-select>
                        </div>

                        <!-- Bộ lọc Màu sắc -->
                        <div class="filter-group">
                            <div class="filter-title">Màu sắc</div>
                            <a-select v-model:value="valueMauSac" style="width: 100%" mode="multiple"
                                placeholder="Chọn màu sắc" :maxTagCount="2"
                                :maxTagPlaceholder="(omittedValues) => `+ ${omittedValues.length} màu sắc khác`">
                                <a-select-option v-for="item in mauSacList" :key="item.id_mau_sac"
                                    :value="item.id_mau_sac">
                                    {{ item.ten_mau_sac }}
                                </a-select-option>
                            </a-select>
                        </div>

                        <!-- Bộ lọc Kích thước -->
                        <div class="filter-group">
                            <div class="filter-title">Kích thước</div>
                            <a-select v-model:value="valueSize" style="width: 100%" mode="multiple"
                                placeholder="Chọn kích thước" :maxTagCount="2"
                                :maxTagPlaceholder="(omittedValues) => `+ ${omittedValues.length} kích thước khác`">
                                <a-select-option v-for="item in kichThuocList" :key="item.id_kich_thuoc"
                                    :value="item.id_kich_thuoc">
                                    {{ item.gia_tri + ' ' + item.don_vi }}
                                </a-select-option>
                            </a-select>
                        </div>

                        <!-- Bộ lọc Giá -->
                        <div class="filter-group">
                            <div class="filter-title">Giá</div>
                            <a-slider v-model:value="value2" range :min="0" :max="10000000" :step="100000"
                                :tipFormatter="value => `${value.toLocaleString('vi-VN')} đ`" />
                            <div class="price-range">
                                <span>{{ value2[0].toLocaleString('vi-VN') }} đ</span>
                                <span>{{ value2[1].toLocaleString('vi-VN') }} đ</span>
                            </div>
                        </div>

                        <!-- Nút Áp dụng bộ lọc -->
                        <div class="filter-actions">
                            <a-button type="primary" size="large" style="width: 100%" @click="filterProducts"
                                :disabled="danhMucList.length === 0 || thuongHieuList.length === 0">
                                Áp dụng bộ lọc
                            </a-button>
                        </div>
                    </div>
                </a-drawer>

                <a-select class="mb-2 ms-2 custom-select" v-model:value="luuBien" show-search placeholder="Sắp xếp"
                    style="width: 150px;" :options="listSort" :filter-option="filterOption"></a-select>
                <a-select class="mb-2 ms-2 custom-select" v-model:value="xemTheo" show-search placeholder="Xem theo"
                    style="width: 150px;" :options="listXemTheo" :filter-option="filterOption"></a-select>

                <a-button type="" class="d-flex align-items-center btn-filter" @click="showExportModal">
                    <ExportOutlined class="icon-filler" />
                    <span class="button-text">Xuất excel</span>
                </a-button>
            </template>
            <a-button type="" class="d-flex align-items-center btn-filter" @click="openModalImportExcel = true">
                <ImportOutlined class="icon-filler" />
                <span class="button-text">Nhập excel</span>
            </a-button>
            <!-- Modal nhập excel -->
            <a-modal v-model:open="openModalImportExcel" title="Nhập excel">
                <div class="upload-container">
                    <input type="file" ref="fileInput" style="display: none" accept=".xlsx,.xls"
                        @change="handleManualFileChange" />
                    <a-button @click="triggerFileSelect">
                        <upload-outlined />
                        Chọn file Excel
                    </a-button>
                    <p v-if="selectedFile">File đã chọn: {{ selectedFile.name }}</p>
                </div>
                <template #footer>
                    <a-button key="back" @click="openModalImportExcel = false">Hủy</a-button>
                    <a-button key="submit" type="primary" :loading="uploadLoading" :disabled="!selectedFile"
                        @click="handleImportExcel">
                        Import
                    </a-button>
                </template>
            </a-modal>
            <!-- Modal hiển thị dữ liệu import -->
            <a-modal v-model:open="importExcelModal" title="Dữ liệu import" width="90%" :style="{ top: '20px' }">
                <div class="table-container">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên sản phẩm</th>
                                <!-- <th>Giới tính</th> -->

                                <th>Giá bán</th>
                                <th>Số lượng</th>
                                <th>Danh mục</th>
                                <th>Thương hiệu</th>
                                <th>Chất liệu</th>
                                <th>Màu sắc</th>
                                <th>Kích thước</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in importExcelData" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td
                                    :style="{ backgroundColor: item.sanPham.ten_san_pham === null || item.sanPham.ten_san_pham === '' ? '#ff6b6b' : '' }">
                                    {{
                                        item.sanPham.ten_san_pham
                                    }}</td>
                                <!-- <td
                                    :style="{ backgroundColor: item.sanPham.gioi_tinh === null || item.sanPham.gioi_tinh === '' ? '#ff6b6b' : '' }">
                                    {{ item.sanPham.gioi_tinh ? "Nam" : "Nữ" }}</td> -->
                                <!-- <td :style="{ backgroundColor: item.gia_nhap === 0 ? '#ff6b6b' : '' }">{{ item.gia_nhap
                                    }}</td> -->
                                <td :style="{ backgroundColor: item.gia_ban === 0 ? '#ff6b6b' : '' }">{{ item.gia_ban }}
                                </td>
                                <td
                                    :style="{ backgroundColor: item.so_luong === 0 || item.so_luong === null ? '#ff6b6b' : '' }">
                                    {{
                                        item.so_luong
                                    }}</td>
                                <td
                                    :style="{ backgroundColor: item.sanPham.danhMuc.ten_danh_muc === null || item.sanPham.danhMuc.ten_danh_muc === '' ? '#ff6b6b' : '' }">
                                    {{ item.sanPham.danhMuc.ten_danh_muc }}</td>
                                <td
                                    :style="{ backgroundColor: item.sanPham.thuongHieu.ten_thuong_hieu === null || item.sanPham.thuongHieu.ten_thuong_hieu === '' ? '#ff6b6b' : '' }">
                                    {{ item.sanPham.thuongHieu.ten_thuong_hieu }}</td>
                                <td
                                    :style="{ backgroundColor: item.sanPham.chatLieu.ten_chat_lieu === null || item.sanPham.chatLieu.ten_chat_lieu === '' ? '#ff6b6b' : '' }">
                                    {{ item.sanPham.chatLieu.ten_chat_lieu }}</td>
                                <td
                                    :style="{ backgroundColor: item.mauSac.ma_mau_sac === null || item.mauSac.ma_mau_sac === '' ? '#ff6b6b' : '' }">
                                    {{ item.mauSac.ma_mau_sac + ' ' + item.mauSac.ten_mau_sac }}</td>
                                <td
                                    :style="{ backgroundColor: item.kichThuoc.gia_tri === null || item.kichThuoc.gia_tri === '' ? '#ff6b6b' : '' }">
                                    {{ item.kichThuoc.gia_tri + ' ' + item.kichThuoc.don_vi }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <template #footer>
                    <a-button key="back" @click="importExcelModal = false">Hủy</a-button>
                    <a-button key="submit" type="primary" :loading="uploadLoading" @click="saveExcelImport">
                        Save
                    </a-button>
                </template>
            </a-modal>
        </div>
        <template v-if="!store.checkRouter.includes('quanlysanpham/add')">
            <a-button type="primary" style="background-color: #f33b47" @click="changeRouter('/admin/quanlysanpham/add')"
                class="d-flex align-items-center">
                <PlusOutlined />
                <span class="button-text">Thêm sản phẩm</span>
            </a-button>
        </template>
    </div>

    <div class="menu-container d-flex" v-if="filteredCount"
        style="margin-left:30px; margin-top: 10px; margin-bottom: 10px">
        <span style="font-weight: 500;">
            Hiển thị: {{ filteredCount }} sản phẩm
        </span>
    </div>

    <a-modal v-model:open="exportModalVisible" title="Xuất Excel" width="700px">
        <div class="export-modal-content">
            <p>Chọn các trường thông tin bạn muốn xuất:</p>
            <a-checkbox v-model:checked="selectAllFields" @change="handleSelectAllFields">
                Chọn tất cả các trường
            </a-checkbox>

            <div class="field-selection mt-3">
                <a-row :gutter="[16, 8]">
                    <a-col :span="8" v-for="field in exportFields" :key="field.value">
                        <a-checkbox v-model:checked="field.selected">{{ field.label }}</a-checkbox>
                    </a-col>
                </a-row>
            </div>

            <a-divider />

            <p>Chọn sản phẩm:</p>
            <a-radio-group v-model:value="exportSelection" class="mb-3">
                <a-radio value="all">Tất cả sản phẩm</a-radio>
                <a-radio value="filtered" :disabled="!isFiltering">Sản phẩm đã lọc</a-radio>
                <a-radio value="selected" :disabled="!hasSelectedProducts">Sản phẩm đã chọn</a-radio>
            </a-radio-group>

            <div v-if="exportSelection === 'selected' && selectedRows.length === 0" class="alert alert-warning">
                Bạn chưa chọn sản phẩm nào. Vui lòng chọn ít nhất một sản phẩm hoặc chọn tùy chọn khác.
            </div>
        </div>

        <template #footer>
            <a-button key="back" @click="exportModalVisible = false">Hủy</a-button>
            <a-button key="submit" type="primary" :loading="exportLoading" :disabled="!canExport"
                @click="handleExportExcel">
                Xuất Excel
            </a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import {
    FilterOutlined,
    PlusOutlined,
    ExportOutlined,
    ImportOutlined,
    UploadOutlined,
    SyncOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useGbStore } from '@/stores/gbStore';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { Upload } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

const route = useRoute();
const store = useGbStore();
const visible = ref(false);
const value = ref('Hoạt động');

// Sử dụng mảng để lưu nhiều giá trị
const valueDanhMuc = ref([]);
const valueThuongHieu = ref([]);
const valueChatLieu = ref([]);
const valueMauSac = ref([]);
const valueSize = ref([]);
const value2 = ref([0, 10000000]);

const xemTheo = ref('0');

// Sử dụng computed cho isFiltering để tự động cập nhật
const isFiltering = computed(() => {
    return Object.keys(store.filterCriteria).length > 0;
});

// Lấy số lượng sản phẩm được lọc
const filteredCount = computed(() => {
    return store.getFilteredProducts?.length || 0;
});

// Định nghĩa computed cho các danh sách dropdown
const danhMucList = computed(() => {
    return store.getAllDanhMuc || [];
});

const thuongHieuList = computed(() => {
    return store.getAllThuongHieu || [];
});

const chatLieuList = computed(() => {
    return store.getAllChatLieu || [];
});

const mauSacList = computed(() => {
    return store.getAllMauSac || [];
});

const kichThuocList = computed(() => {
    return store.getAllKichThuoc || [];
});

// Theo dõi thay đổi của store để cập nhật UI
watch(() => store.getFilteredProducts, (newValue) => {
    console.log('Số lượng sản phẩm đã lọc/tìm kiếm đã thay đổi:', newValue?.length);
}, { deep: true });

const listSort = ref([
    { value: '1', label: 'Sắp xếp theo' },
    { value: '2', label: 'Tên tăng dần' },
    { value: '3', label: 'Tên giảm dần' },
    { value: '4', label: 'Giá tăng dần' },
    { value: '5', label: 'Giá giảm dần' },
    { value: '6', label: 'Mới nhất' },
    { value: '7', label: 'Cũ nhất' },
]);

const listXemTheo = ref([
    { value: '0', label: 'Tất cả sản phẩm' },
    { value: '1', label: '5 sản phẩm' },
    { value: '2', label: '10 sản phẩm' },
    { value: '3', label: '15 sản phẩm' },
    { value: '4', label: '20 sản phẩm' },
])
const luuBien = ref('1');
const openModalImportExcel = ref(false);
const fileList = ref([]);
const uploadLoading = ref(false);
const selectedFile = ref(null);
const importExcelModal = ref(false);
const importExcelData = ref([]);

const showFilter = () => {
    // Kiểm tra dữ liệu trước khi mở bộ lọc
    checkAndLoadFilterData();
    visible.value = true;
};

const onClose = () => {
    visible.value = false;
};

const router = useRouter();
const changeRouter = (routers) => {
    store.getPath(routers);
    store.getRoutePresent(route.path);
    router.push(routers);
    console.log(store.checkRouter);
};

// Hàm kiểm tra và tải dữ liệu cho bộ lọc
const checkAndLoadFilterData = async () => {
    try {
        // Kiểm tra các danh sách cần thiết và tải nếu cần
        if (!store.getAllDanhMuc || store.getAllDanhMuc.length === 0) {
            console.log('Đang tải danh mục...');
            await store.getAllDM();
        }

        if (!store.getAllThuongHieu || store.getAllThuongHieu.length === 0) {
            console.log('Đang tải thương hiệu...');
            await store.getAllTH();
        }

        if (!store.getAllChatLieu || store.getAllChatLieu.length === 0) {
            console.log('Đang tải chất liệu...');
            await store.getAllCL();
        }

        if (!store.getAllMauSac || store.getAllMauSac.length === 0) {
            console.log('Đang tải màu sắc...');
            await store.getAllMS();
        }

        if (!store.getAllKichThuoc || store.getAllKichThuoc.length === 0) {
            console.log('Đang tải kích thước...');
            await store.getAllKT();
        }

        // Log số lượng dữ liệu đã tải
        console.log(`Dữ liệu lọc sẵn sàng:
            - Danh mục: ${store.getAllDanhMuc?.length || 0}
            - Thương hiệu: ${store.getAllThuongHieu?.length || 0}
            - Chất liệu: ${store.getAllChatLieu?.length || 0}
            - Màu sắc: ${store.getAllMauSac?.length || 0}
            - Kích thước: ${store.getAllKichThuoc?.length || 0}`);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu cho bộ lọc:', error);
        message.error('Không thể tải dữ liệu cho bộ lọc');
    }
};

// Hàm tải dữ liệu ban đầu
const loadInitialData = async () => {
    try {
        console.log('Đang tải dữ liệu ban đầu...');

        // Tải dữ liệu sản phẩm nếu chưa có
        if (store.getAllSanPham.length === 0) {
            await store.getAllSP();
            console.log('Đã tải:', store.getAllSanPham.length, 'sản phẩm');
        }

        // Tải dữ liệu chi tiết sản phẩm nếu chưa có
        if (store.getAllChiTietSanPham.length === 0) {
            await store.getAllCTSP();
            console.log('Đã tải:', store.getAllChiTietSanPham.length, 'chi tiết sản phẩm');
        }

        // Tải các dữ liệu cho bộ lọc
        await checkAndLoadFilterData();

        console.log('Hoàn tất tải dữ liệu ban đầu');
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
        message.error('Có lỗi khi tải dữ liệu, vui lòng thử lại');
    }
};

onMounted(async () => {
    await loadInitialData();
});

const filterProducts = () => {
    console.log('Áp dụng bộ lọc với các giá trị:');
    console.log('- Danh mục:', valueDanhMuc.value);
    console.log('- Thương hiệu:', valueThuongHieu.value);
    console.log('- Chất liệu:', valueChatLieu.value);
    console.log('- Màu sắc:', valueMauSac.value);
    console.log('- Kích thước:', valueSize.value);
    console.log('- Giá:', value2.value);

    // Chuyển đổi mảng giá trị sang số nếu cần
    const idDanhMuc = valueDanhMuc.value.map(id => Number(id));
    const idThuongHieu = valueThuongHieu.value.map(id => Number(id));
    const idChatLieu = valueChatLieu.value.map(id => Number(id));
    const idMauSac = valueMauSac.value.map(id => Number(id));
    const idKichThuoc = valueSize.value.map(id => Number(id));

    const filterCriteria = {
        id_danh_muc: idDanhMuc,
        id_thuong_hieu: idThuongHieu,
        id_chat_lieu: idChatLieu,
        id_mau_sac: idMauSac,
        id_size: idKichThuoc,
        minPrice: value2.value[0],
        maxPrice: value2.value[1]
    };

    console.log('Tiêu chí lọc cuối cùng:', filterCriteria);

    // Gọi action lọc sản phẩm trong store
    store.applyFilter(filterCriteria);

    // Đóng drawer sau khi áp dụng bộ lọc
    visible.value = false;

    // Hiển thị thông báo
    message.success('Đã áp dụng bộ lọc');
};

const resetFilter = () => {
    console.log('Reset bộ lọc');

    // Reset các giá trị trên giao diện
    valueDanhMuc.value = [];
    valueThuongHieu.value = [];
    valueChatLieu.value = [];
    valueMauSac.value = [];
    valueSize.value = [];
    value2.value = [0, 10000000];

    // Reset bộ lọc trong store
    store.resetFilter();

    // Hiển thị thông báo
    message.success('Đã xóa bộ lọc');
};

const afterOpenChange = bool => {
    console.log('open', bool);
};

const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

const handleRemove = (file) => {
    fileList.value = [];
    selectedFile.value = null;
    return true;
};

const handleFileChange = (info) => {
    fileList.value = [...info.fileList].slice(-1);

    const file = info.file;

    if (file.status === 'removed') {
        selectedFile.value = null;
    } else {
        // Store the file object correctly - prefer the raw file object if available
        selectedFile.value = file.originFileObj ? file : file;
        console.log('File selected:', selectedFile.value);
        console.log('File is Blob?', selectedFile.value instanceof Blob);
        console.log('File is File?', selectedFile.value instanceof File);

        // Check file type and size to ensure it's valid
        if (file.type && !file.type.includes('spreadsheet') && !file.type.includes('excel')) {
            message.warning('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        }
    }
};

// Thêm hàm mới để trigger file select
const fileInput = ref(null);

const triggerFileSelect = () => {
    fileInput.value.click();
};

const handleManualFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra file type
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');

    if (!isExcel) {
        message.error('Vui lòng chỉ tải lên file Excel (.xlsx hoặc .xls)');
        event.target.value = ''; // Reset input
        return;
    }

    // Kiểm tra kích thước file (dưới 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!');
        event.target.value = ''; // Reset input
        return;
    }

    console.log('File được chọn thủ công:', file);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    selectedFile.value = file;
};

const handleImportExcel = async (event) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!selectedFile.value) {
        message.error('Vui lòng chọn file Excel!');
        return;
    }

    uploadLoading.value = true;

    try {
        console.log('File được upload:', selectedFile.value);
        console.log('File type:', selectedFile.value.type);
        console.log('File size:', selectedFile.value.size);

        // Make sure we're passing a raw File object to the service
        const result = await store.importExcel(selectedFile.value);

        console.table(result);
        message.success('Import dữ liệu thành công!');
        openModalImportExcel.value = false;

        // Reset file input
        if (fileInput.value) {
            fileInput.value.value = '';
        }

        selectedFile.value = null;
        importExcelModal.value = true;
        importExcelData.value = result;

    } catch (error) {
        console.error('Lỗi khi import Excel:', error);
        console.error('Chi tiết lỗi:', error.response?.data);
        message.error('Đã xảy ra lỗi khi import dữ liệu! ' + (error.response?.data?.message || ''));
    } finally {
        uploadLoading.value = false;
    }
};

const saveExcelImport = async () => {
    uploadLoading.value = true;
    try {
        if (!store.saveExcelImport) {
            console.error('Store không có hàm saveExcelImport');
            message.error('Lỗi hệ thống: Không thể lưu dữ liệu!');
            return;
        }
        const result = await store.saveExcelImport(importExcelData.value);
        console.log('Kết quả trả về:', result);

        if (result) {
            message.success('Lưu dữ liệu thành công!');
            importExcelModal.value = false;

            await store.getAllSanPhamNgaySua();
            store.justAddedProduct = true;
            router.push('/admin/quanlysanpham');
        }
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        message.error('Đã xảy ra lỗi khi lưu dữ liệu!');
    } finally {
        uploadLoading.value = false;
    }
}

// Thêm các biến và hàm cho tính năng xuất Excel
const exportModalVisible = ref(false);
const exportLoading = ref(false);
const exportSelection = ref('all'); // 'all', 'filtered', hoặc 'selected'
const selectAllFields = ref(false);
const exportFields = ref([
    { label: 'Mã sản phẩm', value: 'ma_san_pham', selected: true },
    { label: 'Tên sản phẩm', value: 'ten_san_pham', selected: true },
    { label: 'Danh mục', value: 'ten_danh_muc', selected: true },
    { label: 'Thương hiệu', value: 'ten_thuong_hieu', selected: true },
    { label: 'Chất liệu', value: 'ten_chat_lieu', selected: true },
    { label: 'Tổng số lượng', value: 'tong_so_luong', selected: true },
    { label: 'Giá bán', value: 'gia_ban', selected: true },
    { label: 'Màu sắc', value: 'mau_sac', selected: false },
    { label: 'Kích thước', value: 'kich_thuoc', selected: false },
    { label: 'Mô tả', value: 'mo_ta', selected: false },
    { label: 'Trạng thái', value: 'trang_thai', selected: true }
]);

// Lấy danh sách sản phẩm được chọn từ component cha
const selectedRows = ref([]);
const hasSelectedProducts = computed(() => selectedRows.value.length > 0);

// Kiểm tra xem có thể xuất được không
const canExport = computed(() => {
    // Kiểm tra nếu có ít nhất 1 trường được chọn
    const hasSelectedFields = exportFields.value.some(field => field.selected);

    // Nếu chọn sản phẩm đã chọn, cần có ít nhất 1 sản phẩm được chọn
    const hasValidSelection = exportSelection.value !== 'selected' || hasSelectedProducts.value;

    return hasSelectedFields && hasValidSelection;
});

// Hàm hiển thị modal xuất Excel
const showExportModal = () => {
    // Lấy danh sách sản phẩm đã chọn từ store hoặc component cha
    exportModalVisible.value = true;
};

// Khi người dùng chọn/bỏ chọn tất cả các trường
const handleSelectAllFields = (e) => {
    const checked = e.target.checked;
    exportFields.value.forEach(field => {
        field.selected = checked;
    });
};

// Theo dõi thay đổi của từng trường để cập nhật selectAllFields
watch(() => [...exportFields.value.map(f => f.selected)], (newVal) => {
    selectAllFields.value = newVal.every(v => v === true);
}, { deep: true });

// Xử lý xuất Excel
const handleExportExcel = async () => {
    try {
        exportLoading.value = true;

        // Lấy danh sách các trường đã chọn
        const selectedFields = exportFields.value
            .filter(field => field.selected)
            .map(field => field.value);

        // Lấy danh sách ID sản phẩm cần xuất
        let productIds = [];

        if (exportSelection.value === 'all') {
            // Xuất tất cả sản phẩm
            productIds = null; // Null có nghĩa là tất cả sản phẩm
        } else if (exportSelection.value === 'filtered' && store.getFilteredProducts.length > 0) {
            // Xuất các sản phẩm đã lọc
            productIds = store.getFilteredProducts.map(p => p.id_san_pham);
        } else if (exportSelection.value === 'selected' && selectedRows.value.length > 0) {
            // Xuất các sản phẩm đã chọn
            productIds = selectedRows.value.map(p => p.id_san_pham);
        } else {
            message.warning('Vui lòng chọn sản phẩm để xuất');
            exportLoading.value = false;
            return;
        }

        // Gọi hàm xuất Excel
        const result = await store.exportExcel(productIds, selectedFields);

        if (result) {
            message.success('Xuất Excel thành công!');
            exportModalVisible.value = false;
        }
    } catch (error) {
        console.error('Lỗi khi xuất Excel:', error);
        message.error('Có lỗi xảy ra khi xuất Excel');
    } finally {
        exportLoading.value = false;
    }
};

// Phương thức để nhận danh sách sản phẩm được chọn từ component cha
const updateSelectedRows = (rows) => {
    selectedRows.value = rows;
};

// Expose để component cha có thể gọi
defineExpose({
    updateSelectedRows
});
</script>

<style scoped>
.icon-filler {
    color: #fff;
}

.btn-filter {
    color: #fff;
    background-color: #f33b47;
}

.btn-filter:active {
    transition: all 0.6s ease-in-out;
    background-color: #f33b47;
}

.custom-class {
    z-index: 1000;
}

.loading-state {
    padding: 20px;
    text-align: center;
    color: #999;
}

.filter-group {
    margin-bottom: 24px;
}

.filter-title {
    font-weight: 600;
    margin-bottom: 8px;
}

.price-range {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
}

.filter-actions {
    margin-top: 32px;
}

.drawer-content {
    padding: 0 16px;
    height: 100%;
    overflow-y: auto;
}

:deep(.custom-select) {
    .ant-select-selector {
        border-color: #f33b47 !important;
        background-color: #f33b47 !important;
        border-radius: 6px !important;
        color: white !important;
        transition: all 0.3s ease;
    }

    .ant-select-arrow,
    .ant-select-clear,
    .ant-select-selection-search-icon {
        color: #f33b47 !important;
        transition: all 0.3s ease;
        color: white !important;
    }

    &:hover {
        .ant-select-selector {
            border-color: #f33b47 !important;
            background-color: #f33b47 !important;
            color: white !important;
        }

        .ant-select-arrow,
        .ant-select-clear,
        .ant-select-selection-search-icon {
            color: white !important;
        }
    }

    &.ant-select-focused .ant-select-selector,
    &.ant-select-open .ant-select-selector {
        border-color: #f33b47 !important;
        background-color: #f33b47 !important;
        color: white !important;
        box-shadow: 0 0 0 2px rgba(243, 59, 71, 0.2) !important;
    }

    &.ant-select-focused,
    &.ant-select-open {

        .ant-select-arrow,
        .ant-select-clear,
        .ant-select-selection-search-icon {
            color: white !important;
        }
    }

    .ant-select-selection-placeholder,
    .ant-select-selection-item {
        color: inherit;
    }
}

:deep(.ant-select-dropdown) {
    .ant-select-item {
        transition: all 0.3s ease;
    }

    .ant-select-item-option-active {
        background-color: rgba(243, 59, 71, 0.1) !important;
    }

    .ant-select-item-option-selected {
        background-color: #f33b47 !important;
        color: white !important;
    }
}

.button-text {
    margin-left: 4px;
}

@media (max-width: 768px) {
    .button-text {
        display: none;
    }

    .btn-filter,
    .ant-btn {
        padding: 4px 8px;
        min-width: 32px;
        justify-content: center;
    }

    .custom-select {
        width: 100px !important;
    }
}

@media (max-width: 576px) {
    .custom-select {
        width: 80px !important;
    }

    .d-flex.gap-2 {
        gap: 0.25rem !important;
    }
}

.btn-filter,
.ant-btn {
    transition: all 0.3s ease;
}

.icon-filler {
    display: flex;
    align-items: center;
    justify-content: center;
}

.table-container {
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 8px;
    text-align: left;
    white-space: nowrap;
}

.table th {
    position: sticky;
    top: 0;
    background-color: #f5f5f5;
    z-index: 1;
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #dee2e6;
}
</style>