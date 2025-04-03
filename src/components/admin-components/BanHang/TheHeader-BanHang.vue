<template>
    <div class="header-container">
        <!-- Search Combo Box -->
        <div class="search-section">
            <a-dropdown v-model:visible="dropdownVisible" :trigger="['click']" overlayClassName="product-dropdown">
                <a-input-search v-model:value="searchQuery" placeholder="Tìm kiếm sản phẩm theo tên..."
                    @input="handleSearchInput" @search="performSearch" @focus="showDropdown" style="width: 300px">
                    <template #enterButton>
                        <search-outlined />
                    </template>
                </a-input-search>

                <template #overlay>
                    <div class="dropdown-content">
                        <div v-if="filteredProducts.length === 0 && searchQuery.length > 0"
                            style="padding: 15px; text-align: center;">
                            Không tìm thấy sản phẩm phù hợp.
                        </div>
                        <a-table v-else-if="filteredProducts.length > 0" :dataSource="filteredProducts"
                            style="width: 800px;" :columns="productColumns" :pagination="false" size="small" bordered
                            :scroll="{ y: 300 }" rowKey="id">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'hinh_anh'">
                                    <img :src="record.hinh_anh || 'default-product.png'" alt="Product"
                                        class="product-image" />
                                </template>
                                <template v-else-if="column.key === 'gia_ban'">
                                    {{ formatCurrency(record.gia_ban) }}
                                </template>
                                <template v-else-if="column.key === 'action'">
                                    <a-button type="primary" size="small" @click="addToBill(record)"
                                        :disabled="record.so_luong_ton <= 0">
                                        Thêm
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                        <div v-else style="padding: 15px; text-align: center;">
                            Nhập tên sản phẩm để tìm kiếm.
                        </div>
                    </div>
                </template>
            </a-dropdown>
        </div>



        <!-- Invoice Tabs -->
        <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
            <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
                {{ pane.content }}
            </a-tab-pane>
        </a-tabs>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <a-tooltip title="Tra cứu đơn hàng">
                <a-button type="primary" shape="circle" class="action-btn">
                    <template #icon><file-search-outlined /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip title="Trả hàng">
                <a-button type="primary" shape="circle" class="action-btn">
                    <template #icon><rollback-outlined /></template>
                </a-button>
            </a-tooltip>
            <a-tooltip title="Báo cáo thống kê">
                <a-button type="primary" shape="circle" class="action-btn">
                    <template #icon><bar-chart-outlined /></template>
                </a-button>
            </a-tooltip>
        </div>

    </div>
    <div class="text">
        <div class="row ">
            <div class="col-8 text-center">
                <div class="table-responsive mt-4">
                    <table class="table table-hover">
                        <thead>
                            <tr class="">
                                <th scope="col">#</th>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Giá bán</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!activeTabData || currentInvoiceItems.length === 0">
                                <td colspan="7" class="text-center" style="padding: 20px;">
                                    {{ !activeTabData ? 'Vui lòng chọn hoặc tạo hóa đơn.' : 'Chưa có sản phẩm nào.' }}
                                </td>
                            </tr>
                            <tr v-for="(item, index) in currentInvoiceItems" :key="item.id_chi_tiet_san_pham">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <img :src="item.hinh_anh || 'default-product.png'" alt="Item"
                                        class="invoice-item-image" />
                                </td>
                                <td>
                                    {{ item.ten_san_pham }} <br />
                                    <small>({{ item.mau_sac }} - {{ item.kich_thuoc }})</small>
                                </td>
                                <td>
                                    <a-space direction="vertical">
                                        <a-input-number v-model:value="item.so_luong" :min="1"
                                            :max="item.so_luong_ton_goc" @change="updateItemTotal(item)"
                                            style="width: 80px;" />
                                    </a-space>
                                </td>
                                <td>{{ formatCurrency(item.gia_ban) }}</td>
                                <td>{{ formatCurrency(item.tong_tien) }}</td>
                                <td>
                                    <a-button type="danger" shape="circle" size="small"
                                        @click="removeFromBill(item.id_chi_tiet_san_pham)">
                                        <template #icon><delete-outlined /></template>
                                    </a-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-4">
                <form v-if="activeTabData && activeTabData.hd" @submit.prevent="handlePayment">
                    <input type="hidden" v-model="activeTabData.hd.id_hoa_don">
                    <div class="mb-3">
                        <label class="form-label">Mã hoá đơn: {{ activeTabData.hd.ma_hoa_don }}</label>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tên nhân viên: {{ activeTabData.hd.ten_nhan_vien }}</label>
                    </div>
                    <div class="mb-3">
                        <label for="idKhachHang" class="form-label">
                            Tên khách hàng: {{ activeTabData.hd.ten_khach_hang || 'Khách lẻ' }}
                        </label>
                        <div class="mb-3">
                            <a-switch v-model:checked="activeTabData.hd.isKhachLe" @change="handleKhachLeChange" />
                        </div>

                        <div v-if="activeTabData.hd.isKhachLe">
                            <a-button type="primary" @click="handleThemDiaChi">
                                Thêm địa chỉ khách hàng
                            </a-button>
                        </div>

                        <div v-else>
                            <a-button type="primary" @click="showModal">Chọn khách hàng</a-button>

                            <a-modal v-model:open="open" title="Danh sách khách hàng" @ok="handleOk" width="1000px">
                                <template #footer>
                                    <a-button key="back" @click="handleCancel">Return</a-button>
                                    <a-button key="submit" type="primary" :loading="loading"
                                        @click="handleOk">Submit</a-button>
                                </template>
                                <div v-if="dataNhanVien.length === 0" class="text-center py-4">
                                    <a-empty :image="simpleImage" />
                                </div>
                                <div v-else>
                                    <div class="table-responsive mt-4">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr class="">
                                                    <th scope="col">#</th>
                                                    <th scope="col">Ảnh</th>
                                                    <th scope="col">Tên nhân viên </th>
                                                    <th scope="col">Giới tính</th>
                                                    <th scope="col">SĐT</th>
                                                    <th scope="col">Địa chỉ</th>
                                                    <th scope="col">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(nhanVien, index) in dataNhanVien"
                                                    :key="nhanVien.idNhanVien">
                                                    <td>{{ index + 1 }}</td>
                                                    <td>
                                                        <a-image :width="50" :src="nhanVien.anhNhanVien" />

                                                    </td>
                                                    <td>{{ nhanVien.tenNhanVien }}</td>
                                                    <td>{{ nhanVien.gioiTinh ? "Nam" : "Nữ" }}</td>
                                                    <td>{{ nhanVien.soDienThoai }}</td>
                                                    <td>{{ nhanVien.diaChiLienHe }}</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="d-flex justify-content-center align-items-center mt-3">
                                        <button class="btn buttonPT p-0" @click="fetchData(store.currentPage - 1)"
                                            :disabled="store.currentPage === 0">Previous</button>
                                        <span class="mx-3">Trang {{ store.currentPage + 1 }} / {{ store.totalPages
                                        }}</span>
                                        <button class="btn buttonPT" @click="fetchData(store.currentPage + 1)"
                                            :disabled="store.currentPage >= store.totalPages - 1">Next</button>
                                    </div>
                                </div>
                            </a-modal>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label d-block mb-2">Phương thức nhận hàng</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'phuongThucNhanHang_' + activeKey"
                                :id="'nhanTaiCuahang_' + activeKey" value="Nhận tại cửa hàng"
                                v-model="activeTabData.hd.phuong_thuc_nhan_hang">
                            <label class="form-check-label" :for="'nhanTaiCuahang_' + activeKey">Tại cửa hàng</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'phuongThucNhanHang_' + activeKey"
                                :id="'giaoHang_' + activeKey" value="Giao hàng"
                                v-model="activeTabData.hd.phuong_thuc_nhan_hang">
                            <label class="form-check-label" :for="'giaoHang_' + activeKey">Giao hàng</label>
                        </div>
                        <div v-if="activeTabData.hd.phuong_thuc_nhan_hang === 'Giao hàng'" class="mt-2">
                            <label class="form-label">Địa chỉ nhận hàng</label>
                            <input type="text" class="form-control mb-2" placeholder="Nhập địa chỉ"
                                v-model="activeTabData.hd.dia_chi_nhan_hang">
                            <label class="form-label">Phí vận chuyển</label>
                            <a-input-number v-model:value="activeTabData.hd.phi_van_chuyen" :min="0"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="Nhập phí vận chuyển"
                                style="width: 100%" />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tổng tiền hàng:</label>
                        <input type="text" class="form-control"
                            :value="formatCurrency(activeTabData.hd.tong_tien_truoc_giam)" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="idVoucher " class="form-label">Voucher</label>
                        <select name="idVoucher" id="idVoucher" class="form-select"
                            v-model="activeTabData.hd.id_voucher" @change="updateVoucher">
                            <option :value="null">-- Chọn voucher --</option>
                            <option v-if="activeTabData.hd.id_voucher" :value="activeTabData.hd.id_voucher">
                                {{ selectedVoucher ? `${selectedVoucher.ma_voucher} - ${selectedVoucher.ten_voucher}` :
                                'Voucher đã chọn' }}
                            </option>
                            <option v-for="voucher in applicableVouchers" :key="voucher.id_voucher"
                                :value="voucher.id_voucher" v-else>
                                {{ voucher.ma_voucher }} - {{ voucher.ten_voucher }} (Giảm: {{ formatGiaTriGiam(voucher)
                                }})
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tổng tiền thanh toán:</label>
                        <input type="text" class="form-control"
                            :value="formatCurrency(activeTabData.hd.tong_tien_sau_giam)" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label d-block mb-2">Hình thức thanh toán</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'hinhThucThanhToan_' + activeKey"
                                :id="'tienMat_' + activeKey" value="Tiền mặt"
                                v-model="activeTabData.hd.hinh_thuc_thanh_toan">
                            <label class="form-check-label" :for="'tienMat_' + activeKey">Tiền mặt</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'hinhThucThanhToan_' + activeKey"
                                :id="'chuyenKhoan_' + activeKey" value="Chuyển khoản"
                                v-model="activeTabData.hd.hinh_thuc_thanh_toan">
                            <label class="form-check-label" :for="'chuyenKhoan_' + activeKey">Chuyển khoản</label>
                        </div>
                        <div v-if="activeTabData.hd.hinh_thuc_thanh_toan === 'Tiền mặt'" class="mt-2">
                            <label class="form-label">Tiền khách đưa</label>
                            <a-input-number v-model:value="tienKhachDua" :min="0"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="Nhập số tiền khách đưa"
                                style="width: 100%" />
                            <label class="form-label mt-2">Tiền thừa trả khách</label>
                            <input type="text" class="form-control" :value="formatCurrency(calculatedChange)" disabled>
                        </div>
                    </div>
                    <div class="mb-3">
                        <a-switch v-model:checked="activeTabData.hd.in_hoa_don" checked-children="In hoá đơn"
                            un-checked-children="Không in hoá đơn" />
                    </div>

                    <!-- Nút thanh toán với điều kiện vô hiệu hóa -->
                    <button type="submit" class="btn btn-primary w-100" :disabled="isPaymentDisabled">
                        Tạo Đơn Hàng & Thanh Toán
                    </button>
                    <a-modal v-model:open="showPrintConfirm" title="Xác nhận in hóa đơn" @ok="confirmPrint(true)"
                        @cancel="confirmPrint(false)">
                        <p>Bạn có muốn in hóa đơn không?</p>
                        <template #footer>
                            <a-button key="cancel" @click="confirmPrint(false)">Không</a-button>
                            <a-button key="ok" type="primary" @click="confirmPrint(true)">Có</a-button>
                        </template>
                    </a-modal>
                </form>
                <div v-else class="text-center text-muted mt-5">
                    Vui lòng chọn hoặc tạo một hóa đơn.
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import {
    SearchOutlined,
    FileSearchOutlined,
    RollbackOutlined,
    BarChartOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useGbStore } from '@/stores/gbStore';
import { Empty } from 'ant-design-vue';
import jsPDF from 'jspdf';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const pageSize = ref(5);
const selectedTrangThai = ref('');
const store = useGbStore();
const fetchData = (page = 0) => {
    if (page < 0) return;

    store.currentPage = page;

    if (store.searchs && store.searchs.trim() !== '') {
        store.searchNhanVien(store.searchs, page, pageSize.value);
    } else if (selectedTrangThai.value) {
        store.getNhanVienLocTrangThai(page, pageSize.value, selectedTrangThai.value);
    } else {
        store.getAllNhanVien(page, pageSize.value);
    }
};

const dataNhanVien = computed(() => {
    if (store.searchs && store.searchs.trim() !== '' && store.nhanVienSearch && store.nhanVienSearch.length > 0) {
        console.log('Hiển thị kết quả tìm kiếm:', store.nhanVienSearch);
        return store.nhanVienSearch.map((item, index) => ({
            stt: index + 1,
            key: item.idNhanVien,
            anhNhanVien: item.anhNhanVien,
            idNhanVien: item.idNhanVien,
            maNhanVien: item.maNhanVien,
            tenNhanVien: item.tenNhanVien,
            gioiTinh: item.gioiTinh ? "Nam" : "Nữ",
            ngaySinh: item.ngaySinh,
            soDienThoai: item.soDienThoai,
            diaChiLienHe: item.diaChiLienHe,
            email: item.email,
            trangThai: item.trangThai,
        }));
    }
    if (store.searchs) {
        return [];
    }
    // Nếu không có từ khóa tìm kiếm hoặc không có kết quả tìm kiếm, hiển thị tất cả sản phẩm
    return store.getAllNhanVienArr;
});

// --- State cho tìm kiếm và dropdown ---
const dropdownVisible = ref(false);
const searchQuery = ref('');
const allProducts = ref([]); // Danh sách TẤT CẢ sản phẩm chi tiết lấy từ API/store


// --- State cho quản lý Tab hóa đơn ---
const panes = ref([]); // Khởi tạo rỗng, sẽ tạo tab đầu tiên trong onMounted
const activeKey = ref('');
const newTabIndex = ref(0); // Chỉ dùng để tạo key duy nhất nếu cần, không dùng cho tiêu đề

// --- Định nghĩa cột cho bảng dropdown sản phẩm ---
const productColumns = [
    { title: 'Ảnh', dataIndex: 'hinh_anh', key: 'hinh_anh', width: 60 },
    { title: 'Tên sản phẩm', dataIndex: 'ten_san_pham', key: 'ten_san_pham', width: 200 },
    { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong', width: 60 },
    { title: 'Màu', dataIndex: 'ten_mau', key: 'ten_mau', width: 80 },
    { title: 'Size', dataIndex: 'gia_tri', key: 'gia_tri', width: 60 },
    { title: 'Giá bán', dataIndex: 'gia_sau_giam', key: 'gia_sau_giam', width: 100 },
    { title: 'Thêm', key: 'action', width: 70, align: 'center' },
];

const loading = ref(false);
const open = ref(false);
const showModal = () => {
    open.value = true;
};
const handleOk = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        open.value = false;
    }, 2000);
};
const handleCancel = () => {
    open.value = false;
};



// --- Computed Properties ---
// Lọc sản phẩm cho dropdown tìm kiếm
const filteredProducts = computed(() => {
    // Nếu chưa có danh sách sản phẩm gốc thì trả về mảng rỗng
    if (!allProducts.value || allProducts.value.length === 0) {
        return [];
    }

    // Nếu ô tìm kiếm trống, hiển thị 5 sản phẩm đầu tiên
    if (!searchQuery.value) {
        return allProducts.value;
    }

    // Nếu có từ khóa tìm kiếm, lọc và hiển thị tối đa 5 sản phẩm phù hợp
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return allProducts.value.filter(product =>
        product.ten_san_pham.toLowerCase().includes(lowerCaseQuery)
        // Có thể thêm điều kiện lọc theo mã SKU, màu sắc,...
        // && product.so_luong_ton > 0 // Chỉ hiện sản phẩm còn hàng khi lọc
    ); // Giới hạn 5 kết quả khi lọc
});

// Lấy dữ liệu của tab đang active
const activeTabData = computed(() => {
    return panes.value.find(pane => pane.key === activeKey.value);
});

const currentInvoiceItems = computed(() => {
    return activeTabData.value?.items?.value || [];
});

// --- Methods ---
// Định dạng tiền tệ
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hiển thị dropdown khi focus vào input
const showDropdown = () => {
    if (!dropdownVisible.value) {
        dropdownVisible.value = true;
    }
};

// Xử lý khi người dùng gõ vào ô tìm kiếm
const handleSearchInput = () => {
    if (!searchQuery.value.trim()) {
        filteredProducts.value = [];
        return;
    }

    filteredProducts.value = allProducts.value.filter(product =>
        product.ten_san_pham.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    console.log("Kết quả tìm kiếm:", filteredProducts.value);
};


// Xử lý khi nhấn Enter hoặc nút Search (có thể dùng để tìm kiếm chính xác hơn)
const performSearch = () => {
    if (!dropdownVisible.value && searchQuery.value) {
        dropdownVisible.value = true;
    }
    console.log('Performing search for:', searchQuery.value);
};

// Thêm sản phẩm vào hóa đơn chi tiết của tab hiện tại
const addToBill = async (product) => {
    const currentTab = activeTabData.value;
    console.log("product", product);

    if (!currentTab || !currentTab.items || !currentTab.hd?.id_hoa_don) {
        message.error('Vui lòng chọn hoặc tạo một hóa đơn hợp lệ trước!');
        return;
    }

    if (product.so_luong_ton <= 0) {
        message.warning(`Sản phẩm "${product.ten_san_pham}" đã hết hàng!`);
        return;
    }

    const itemsArray = currentTab.items.value;
    const existingItem = itemsArray.find(item => item.id_chi_tiet_san_pham === product.id);

    try {
        if (existingItem) {
            // Trường hợp sản phẩm đã tồn tại: Tăng số lượng
            if (existingItem.so_luong + 1 > product.so_luong_ton) {
                message.warning(`Số lượng tồn của "${product.ten_san_pham}" không đủ (${product.so_luong_ton})!`);
                return;
            }
            await store.addSPHD(
                currentTab.hd.id_hoa_don,
                product.id_chi_tiet_san_pham,
                1, // Chỉ tăng thêm 1 đơn vị
                product.gia_sau_giam
            );
        } else {
            // Trường hợp thêm mới
            await store.themSPHDMoi(
                currentTab.hd.id_hoa_don,
                product.id_chi_tiet_san_pham,
                1,
                product.gia_sau_giam
            );
        }

        // Load lại danh sách sản phẩm từ backend
        await store.getAllSPHD(currentTab.hd.id_hoa_don);
        currentTab.items.value = store.getAllSPHDArr.map(item => ({
            id_hoa_don: item.id_hoa_don,
            id_chi_tiet_san_pham: item.id_chi_tiet_san_pham,
            hinh_anh: item.hinh_anh,
            ten_san_pham: item.ten_san_pham,
            mau_sac: item.ten_mau_sac || item.mau_sac || null,
            kich_thuoc: item.kich_thuoc || null,
            so_luong: item.so_luong,
            gia_ban: item.gia_ban || item.gia_sau_giam,
            tong_tien: item.don_gia * item.so_luong, // Tính lại tổng tiền từ backend
            so_luong_ton_goc: item.so_luong_ton || 0
        }));

        // Đóng dropdown và reset tìm kiếm
        dropdownVisible.value = false;
        searchQuery.value = '';
        message.success(`Đã thêm "${product.ten_san_pham}" vào hóa đơn.`);
        window.location.href = 'http://localhost:5173/admin';
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        message.error('Đã xảy ra lỗi khi thêm sản phẩm!');
    }
};

const tienKhachDua = ref(0);

// Tính toán tiền thừa trả khách (calculatedChange) dựa trên tong_tien_sau_giam
const calculatedChange = computed(() => {
    const total = activeTabData.value?.hd?.tong_tien_sau_giam || 0;
    const cash = tienKhachDua.value || 0;
    return cash >= total ? cash - total : 0;
});

const isPaymentDisabled = computed(() => {
    if (activeTabData.value?.hd?.hinh_thuc_thanh_toan === 'Tiền mặt') {
        const total = activeTabData.value.hd.tong_tien_sau_giam || 0;
        const cash = tienKhachDua.value || 0;
        return cash < total;
    }
    return false;
});

// Cập nhật tổng tiền khi số lượng thay đổi trong bảng hóa đơn
const updateItemTotal = async (item) => {
    const productInfo = allProducts.value.find(p => p.id === item.id_chi_tiet_san_pham);
    const hoadon = store.getAllSPHDArr;
    // Tìm sản phẩm chính xác bằng id_chi_tiet_san_pham thay vì chỉ id_hoa_don
    const sphd = hoadon.find(hd => hd.id_chi_tiet_san_pham === item.id_chi_tiet_san_pham);

    // Kiểm tra số lượng tồn
    if (productInfo && item.so_luong > productInfo.so_luong_ton) {
        message.warning(`Số lượng tồn của "${item.ten_san_pham}" không đủ (${productInfo.so_luong_ton}). Đã đặt lại số lượng tối đa.`);
        item.so_luong = productInfo.so_luong_ton;
    }
    if (item.so_luong <= 0) {
        item.so_luong = 1;
    }

    try {
        // Nếu sphd tồn tại (sản phẩm đã có trong hóa đơn)
        if (sphd) {
            if (sphd.so_luong > item.so_luong) {
                // Giảm số lượng
                await store.giamSPHD(
                    item.id_hoa_don,
                    item.id_chi_tiet_san_pham,
                    sphd.so_luong - item.so_luong,
                    item.gia_ban
                );
            } else if (sphd.so_luong < item.so_luong) {
                // Tăng số lượng
                await store.addSPHD(
                    item.id_hoa_don,
                    item.id_chi_tiet_san_pham,
                    item.so_luong - sphd.so_luong,
                    item.gia_ban
                );
            }
        } else {
            // Nếu sản phẩm chưa có trong hóa đơn (trường hợp bất ngờ), thêm mới
            await store.addSPHD(
                item.id_hoa_don,
                item.id_chi_tiet_san_pham,
                item.so_luong,
                item.gia_ban
            );
        }

        // Tải lại danh sách sản phẩm từ backend để đồng bộ
        await store.getAllSPHD(item.id_hoa_don);
        const currentTab = activeTabData.value;
        if (currentTab) {
            currentTab.items.value = store.getAllSPHDArr.map(hd => ({
                id_hoa_don: hd.id_hoa_don,
                id_chi_tiet_san_pham: hd.id_chi_tiet_san_pham,
                hinh_anh: hd.hinh_anh,
                ten_san_pham: hd.ten_san_pham,
                mau_sac: hd.ten_mau_sac || hd.mau_sac || null,
                kich_thuoc: hd.gia_tri || null,
                so_luong: hd.so_luong,
                gia_ban: hd.gia_ban,
                tong_tien: hd.don_gia, // Tính lại tổng tiền từ backend
                so_luong_ton_goc: hd.so_luong_ton || 0
            }));
        }

        // Cập nhật tổng tiền trên UI
        item.tong_tien = item.so_luong * item.gia_ban;
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        message.error('Đã xảy ra lỗi khi cập nhật số lượng!');
    }
};

// Xóa sản phẩm khỏi hóa đơn chi tiết của tab hiện tại
const removeFromBill = (productId) => {
    const currentTab = activeTabData.value;
    if (!currentTab || !currentTab.items) return; // Kiểm tra cả items

    const itemsArray = currentTab.items.value; // Truy cập qua .value
    const itemIndex = itemsArray.findIndex(item => item.id_chi_tiet_san_pham === productId);
    if (itemIndex !== -1) {
        const removedItem = itemsArray.splice(itemIndex, 1);
        message.info(`Đã xóa "${removedItem[0].ten_san_pham}" khỏi hóa đơn.`);
    }
};

// Hàm tạo mới một tab hóa đơn (Đã sửa)
const add = async () => {
    try {
        const response = await store.createHoaDon(1); // ID nhân viên
        if (!response || response.error) {
            throw new Error(response?.message || 'Không thể tạo hóa đơn');
        }

        newTabIndex.value++;
        const newKey = `invoiceTab_${Date.now()}_${newTabIndex.value}`;

        panes.value.push({
            title: `Đơn ${panes.value.length + 1}`,
            key: newKey,
            closable: true,
            items: ref([]),
            hd: reactive({
                id_hoa_don: response.id_hoa_don,
                ma_hoa_don: response.ma_hoa_don,
                ngay_tao: response.ngay_tao,
                trang_thai: response.trang_thai,
                id_nhan_vien: response.id_nhan_vien,
                ten_nhan_vien: response.ten_nhan_vien,
                // Các trường mặc định
                id_khach_hang: null,
                hinh_thuc_thanh_toan: 'Tiền mặt',
                phuong_thuc_nhan_hang: 'Nhận tại cửa hàng',
                isKhachLe: true,
                phi_van_chuyen: 0,
                tong_tien_truoc_giam: 0,
                tong_tien_sau_giam: 0
            })
        });

        activeKey.value = newKey;
    } catch (error) {
        console.error("Lỗi khi tạo hóa đơn:", error);
    }
};
// Hàm đóng tab hóa đơn (Đã sửa)
const remove = async (targetKey) => {
    const tabToRemove = panes.value.find(p => p.key === targetKey);
    if (!tabToRemove) return;

    // Kiểm tra và xác nhận nếu có sản phẩm
    if (tabToRemove.items?.value?.length > 0) {
        Modal.confirm({
            title: `Xác nhận hủy hóa đơn "${tabToRemove.title}"`,
            content: `Hóa đơn có ${tabToRemove.items.value.length} sản phẩm. Bạn chắc chắn muốn hủy?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                await performRemove(tabToRemove, targetKey);
            }
        });
    } else {
        await performRemove(tabToRemove, targetKey);
    }
};

const performRemove = async (tabToRemove, targetKey) => {
    try {
        // Gọi API xóa nếu có ID hóa đơn
        if (tabToRemove.hd?.id_hoa_don) {
            await store.deleteHoaDon(tabToRemove.hd.id_hoa_don);
        }

        // Cập nhật UI
        panes.value = panes.value.filter(pane => pane.key !== targetKey);

        // Chọn tab khác nếu đang xóa tab active
        if (activeKey.value === targetKey) {
            const remainingPanes = panes.value;
            activeKey.value = remainingPanes.length > 0
                ? remainingPanes[remainingPanes.length - 1].key
                : '';
        }

        // Tạo tab mới nếu không còn tab nào
        if (panes.value.length === 0) {
            await add();
        }
    } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
    }
};

const printInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('HÓA ĐƠN THANH TOÁN', 20, 20);

    doc.setFontSize(12);
    doc.text(`Mã hóa đơn: ${activeTabData.value.hd.ma_hoa_don}`, 20, 40);
    doc.text(`Nhân viên: ${activeTabData.value.hd.ten_nhan_vien}`, 20, 50);
    doc.text(`Khách hàng: ${activeTabData.value.hd.ten_khach_hang || 'Khách lẻ'}`, 20, 60);
    doc.text(`Hình thức thanh toán: ${activeTabData.value.hd.hinh_thuc_thanh_toan}`, 20, 70);

    // Thêm danh sách sản phẩm
    let y = 80;
    doc.text('Danh sách sản phẩm:', 20, y);
    y += 10;
    currentInvoiceItems.value.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.ten_san_pham} (${item.mau_sac} - ${item.kich_thuoc})`, 20, y);
        doc.text(`Số lượng: ${item.so_luong} - Giá: ${formatCurrency(item.gia_ban)}`, 40, y + 5);
        y += 15;
    });

    doc.text(`Tổng tiền: ${formatCurrency(activeTabData.value.hd.tong_tien_sau_giam)}`, 20, y);
    y += 10;

    if (activeTabData.value.hd.hinh_thuc_thanh_toan === 'Tiền mặt') {
        doc.text(`Tiền khách đưa: ${formatCurrency(tienKhachDua.value)}`, 20, y);
        doc.text(`Tiền thừa: ${formatCurrency(calculatedChange.value)}`, 20, y + 10);
    }

    doc.save(`HoaDon_${activeTabData.value.hd.ma_hoa_don}.pdf`);
};

// Xử lý sự kiện edit tab (add hoặc remove) (Đã sửa)
const onEdit = (targetKeyOrAction, action) => {
    if (action === 'add') {
        add();
    } else {
        remove(targetKeyOrAction);
    }
};

const showPrintConfirm = ref(false);

// Hàm xử lý thanh toán (submit form)
const handlePayment = async () => { // Thêm async nếu gọi API
    const currentTab = activeTabData.value;
    if (!currentTab) {
        message.error("Không có hóa đơn nào đang được chọn.");
        return;
    }

    // Truy cập items qua .value
    if (!currentTab.items || currentTab.items.value.length === 0) {
        message.warning("Hóa đơn chưa có sản phẩm nào.");
        return;
    }

    // Validate các trường thông tin... (Giữ nguyên logic validate cũ)
    if (currentTab.hd.phuong_thuc_nhan_hang === 'Giao hàng') {
        if (!currentTab.hd.id_khach_hang && (!currentTab.hd.ho_ten_nguoi_nhan || !currentTab.hd.sdt_nguoi_nhan || !currentTab.hd.dia_chi_nhan_hang)) {
            message.error("Vui lòng nhập đầy đủ thông tin giao hàng (Tên, SĐT, Địa chỉ) hoặc chọn khách hàng.");
            return;
        }
        if (currentTab.hd.phi_van_chuyen <= 0) {
            message.warning("Vui lòng nhập phí vận chuyển cho đơn hàng giao.");
            // return;
        }
    }
    if (currentTab.hd.hinh_thuc_thanh_toan === 'Tiền mặt') {
        // Validate tiền khách đưa (nếu cần thiết)
        // if(currentTab.hd.tien_khach_dua === null || currentTab.hd.tien_khach_dua < currentTab.hd.tong_tien_sau_giam){
        //     message.error("Vui lòng nhập đủ tiền khách đưa.");
        //     return;
        // }
        // currentTab.hd.tien_du = currentTab.hd.tien_khach_dua - currentTab.hd.tong_tien_sau_giam;
    }


    console.log("Submitting Invoice Data for Tab:", currentTab.key);
    // Cần dùng JSON.parse(JSON.stringify(...)) để log giá trị thực sự của reactive object
    console.log("Invoice Header (hd):", JSON.parse(JSON.stringify(currentTab.hd)));
    // Items là ref, cần .value
    console.log("Invoice Items (items):", JSON.parse(JSON.stringify(currentTab.items.value)));

    const total = activeTabData.value.hd.tong_tien_sau_giam || 0;
    const cash = tienKhachDua.value || 0;

    // Kiểm tra tiền khách đưa nếu là "Tiền mặt"
    if (activeTabData.value.hd.hinh_thuc_thanh_toan === 'Tiền mặt' && cash < total) {
        message.error('Tiền khách đưa không đủ để thanh toán!');
        return;
    }

    // Hiển thị modal xác nhận in hóa đơn
    showPrintConfirm.value = true;

};

const confirmPrint = async (shouldPrint) => {
    showPrintConfirm.value = false; // Đóng modal

    try {

        // Gọi API thanh toán (ví dụ)
        await store.trangThaiDonHang(activeTabData.value.hd.id_hoa_don);

        // Nếu chọn in hóa đơn
        if (shouldPrint) {
            printInvoice();
        }

        message.success('Thanh toán thành công!');
        // Có thể chuyển hướng hoặc reset form sau khi thanh toán
    } catch (error) {
        console.error('Lỗi khi thanh toán:', error);
        message.error('Đã xảy ra lỗi khi thanh toán!');
    }

    window.location.href = 'http://localhost:5173/admin';
};

const da = ref([]);
const handleKhachLeChange = (value) => {

}

// --- Lifecycle Hooks ---
onMounted(async () => {
    try {
        // Load dữ liệu từ store
        await store.getAllHoaDonCTT();
        await store.getAllCTSPKM();
        await store.getAllNhanVien(0, pageSize.value);
        await store.getAllSPHD(1);
        const listSPHD = store.getAllSPHDArr;
        console.log("listSPHD", listSPHD);
        // Gán dữ liệu hóa đơn
        da.value = store.getAllHoaDonCTTArr;

        // Khởi tạo panes từ dữ liệu backend
        panes.value = da.value.map((hd, index) => ({
            key: `invoiceTab_${index}_${Date.now()}`, // Tạo key duy nhất
            title: `Đơn ${index + 1}`,
            closable: true,
            items: ref([]),
            hd: reactive({
                ...hd,
                // Đảm bảo các trường quan trọng có giá trị mặc định
                hinh_thuc_thanh_toan: hd.hinh_thuc_thanh_toan || 'Tiền mặt',
                phuong_thuc_nhan_hang: hd.phuong_thuc_nhan_hang || 'Nhận tại cửa hàng',
                isKhachLe: !hd.id_khach_hang // Tự động xác định khách lẻ
            })
        }));

        // Nếu có hóa đơn, chọn tab đầu tiên
        if (panes.value.length > 0) {
            activeKey.value = panes.value[0].key;
        } else {
            // Nếu không có hóa đơn nào, tạo mới
            await add();
        }

        // Load danh sách sản phẩm
        allProducts.value = store.getAllCTSPKMList;

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
});

watch(() => activeKey.value, async (newKey) => {
    const currentTab = panes.value.find(p => p.key === newKey);
    if (currentTab && currentTab.hd.id_hoa_don) {
        await store.getAllSPHD(currentTab.hd.id_hoa_don);
        currentTab.items.value = store.getAllSPHDArr.map(item => ({
            id_hoa_don: item.id_hoa_don,
            id_chi_tiet_san_pham: item.id_chi_tiet_san_pham,
            hinh_anh: item.hinh_anh,
            ten_san_pham: item.ten_san_pham,
            mau_sac: item.ten_mau_sac || item.mau_sac || null,
            kich_thuoc: item.gia_tri || null,
            so_luong: item.so_luong,
            gia_ban: item.gia_ban,
            tong_tien: item.don_gia,
            so_luong_ton_goc: item.so_luong_ton || 0
        })) || [];
    }
}, { immediate: true });



</script>

<style scoped>
.header-container {
    height: 60px;
    background-color: #343434;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.search-section {
    position: relative;
}

/* Style cho dropdown */
:deep(.product-dropdown) {
    width: 800px !important;
    /* Điều chỉnh độ rộng theo nhu cầu */
    max-height: 500px;
    overflow: hidden;
}

:deep(.product-dropdown .ant-dropdown-menu) {
    padding: 0;
}

/* Style cho dropdown */
:deep(.product-dropdown) {
    width: 600px !important;
    max-height: 400px;
    /* Hoặc chiều cao phù hợp */
    overflow: hidden;
}

/* --- CSS làm nhỏ bảng bên trong dropdown --- */

/* Giảm padding và font-size cho header của bảng */
:deep(.product-dropdown .ant-table-thead > tr > th) {
    padding: 6px 8px !important;
    /* Giảm padding top/bottom và left/right */
    font-size: 13px !important;
    /* Giảm kích thước font */
    /* background: #fafafa; /* Giữ lại style cũ nếu cần */
    /* position: sticky; */
    /* top: 0; */
    /* z-index: 1; */
}

/* Giảm padding và font-size cho các ô dữ liệu (cell) của bảng */
:deep(.product-dropdown .ant-table-tbody > tr > td) {
    padding: 4px 8px !important;
    /* Giảm padding top/bottom và left/right */
    font-size: 13px !important;
    /* Giảm kích thước font */
    vertical-align: middle;
    /* Căn giữa nội dung theo chiều dọc */
}

/* Điều chỉnh kích thước ảnh sản phẩm trong bảng nhỏ này nếu cần */
:deep(.product-dropdown .product-image) {
    width: 35px !important;
    /* Làm ảnh nhỏ hơn */
    height: 35px !important;
    /* object-fit: cover; */
    /* border-radius: 4px; */
}

/* Bỏ margin âm mặc định có thể gây thừa khoảng trắng */
:deep(.product-dropdown .ant-table) {
    margin: 0 !important;
}

/* Đảm bảo container không có border thừa nếu có */
:deep(.product-dropdown .ant-table-container) {
    border: none !important;
}

/* Có thể cần thêm !important để ghi đè mạnh hơn style mặc định */

.dropdown-content {
    padding: 10px;
    background: white;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
        0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

/* Điều chỉnh style cho bảng trong dropdown */
:deep(.product-dropdown .ant-table) {
    margin: -8px -8px -8px -8px;
}

:deep(.product-dropdown .ant-table-container) {
    border: none !important;
}

:deep(.product-dropdown .ant-table-thead > tr > th) {
    background: #fafafa;
    position: sticky;
    top: 0;
    z-index: 1;
}

.search-section {
    margin-right: 20px;
}

.invoice-tabs {
    flex: 1;
    max-width: 600px;
}

.tabs-container {
    display: flex;
    align-items: center;
}

.tabs-container .ant-tabs {
    flex: 1;
}

.add-invoice-btn {
    margin-left: 5px;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}

.custom-tab {
    position: relative;
    padding-right: 4px;
    display: flex;
    align-items: center;
    color: white;
}

.close-icon {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 0px;
    opacity: 0;
    transition: opacity 0.3s;
    color: rgba(255, 255, 255, 0.65);
}

.close-icon:hover {
    color: white;
}

.custom-tab:hover .close-icon {
    opacity: 1;
}

/* Overriding Ant Design styles for dark theme */
:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab),
:deep(.ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab) {
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active),
:deep(.ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab-active) {
    background-color: #1890ff;
    color: white;
}

:deep(.ant-tabs-nav) {
    margin-bottom: 0;
}

:deep(.ant-select-selector) {
    background-color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.ant-tabs-content) {
    display: none;
}
</style>