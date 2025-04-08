<template>
    <div class="header-container">
        <!-- Search Combo Box -->
        <div class="search-section">
            <a-dropdown v-model:visible="dropdownVisible" :trigger="['click']" overlayClassName="product-dropdown">
                <a-input-search v-model:value="searchQuery" placeholder="Tìm kiếm sản phẩm theo tên..."
                    @input="handleSearchInput" @search="performSearch" style="width: 300px">
                    <template #enterButton>
                        <search-outlined />
                    </template>
                </a-input-search>

                <template #overlay>
                    <div class="dropdown-content-custom">
                        <div v-if="filteredProducts.length === 0 && searchQuery.length > 0" class="empty-result">
                            Không tìm thấy sản phẩm phù hợp.
                        </div>
                        <div v-else-if="filteredProducts.length > 0">
                            <div v-for="(product, index) in filteredProducts" :key="product.id" class="product-option"
                                @click="handleDropdownClick(product)">

                                <img :src="product.hinh_anh || 'default-product.png'" alt="Product"
                                    class="product-image" />
                                <div class="product-info-split">
                                    <div class="info-left">
                                        <div class="product-name">{{ product.ten_san_pham }}</div>
                                        <div class="product-details">
                                            <span>Kích thước: {{ product.gia_tri }}</span>
                                            <span>Màu sắc: {{ product.ten_mau }}</span>
                                        </div>
                                    </div>
                                    <div class="info-left">
                                        <span class="product-quantity">SL: {{ product.so_luong || 1 }}</span>
                                    </div>
                                    <div class="info-right">
                                        <span class="product-price">{{ formatCurrency(product.gia_ban) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="empty-result">
                            Nhập tên sản phẩm để tìm kiếm.
                        </div>
                    </div>
                </template>
            </a-dropdown>
        </div>

        <!-- Invoice Tabs -->
        <div class="invoice-tabs">
            <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
                <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
                    {{ pane.content }}
                </a-tab-pane>
            </a-tabs>
        </div>


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
                                    <img style="width: 50px; height: 50px;"
                                        :src="item.hinh_anh || 'default-product.png'" alt="Item"
                                        class="invoice-item-image" />
                                </td>
                                <td>
                                    {{ item.ten_san_pham }} <br />
                                    <small>({{ item.ten_mau }} - {{ item.gia_tri }})</small>
                                </td>
                                <td>
                                    <a-space direction="vertical">
                                        <a-input-number v-model:value="item.so_luong" :min="1"
                                            :max="item.so_luong_ton_goc" @change="updateItemTotal(item)"
                                            style="width: 80px;" />
                                    </a-space>
                                </td>
                                <td>{{ formatCurrency(item.gia_ban || item.gia_sau_giam) }}</td>
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
                        <label class="form-label">Mã hóa đơn: {{ activeTabData.hd.ma_hoa_don }}</label>
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
                            <a-modal v-model:open="openKhachLe" title="Thông tin khách lẻ" @ok="handleAddKhachLe">
                                <a-form layout="vertical">
                                    <a-form-item label="Tên khách hàng">
                                        <a-input v-model:value="khachLeForm.tenKhachHang" />
                                    </a-form-item>
                                    <a-form-item label="Số điện thoại">
                                        <a-input v-model:value="khachLeForm.soDienThoai" />
                                    </a-form-item>
                                    <a-form-item label="Địa chỉ">
                                        <a-input v-model:value="khachLeForm.diaChi" />
                                    </a-form-item>
                                </a-form>
                            </a-modal>

                        </div>

                        <div v-else>
                            <a-button type="primary" @click="showModal">Chọn khách hàng</a-button>

                            <a-modal v-model:open="open" title="Danh sách khách hàng" @ok="handleOk" width="1000px">
                                <template #footer>
                                    <a-button key="back" @click="handleCancel">Quay lại</a-button>
                                    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Xác
                                        nhận</a-button>
                                </template>
                                <div v-if="danhSachKhachHang.length === 0" class="text-center py-4">
                                    <a-empty :image="simpleImage" />
                                </div>
                                <div v-else>
                                    <div class="table-responsive mt-4" ref="scrollContainer"
                                        style="max-height: 400px; overflow-y: auto" @scroll="handleScroll">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">STT</th>
                                                    <th scope="col">Tên khách hàng</th>
                                                    <th scope="col">Giới tính</th>
                                                    <th scope="col">Số điện thoại</th>
                                                    <th scope="col">Địa chỉ</th>
                                                    <th scope="col">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(khachHang, index) in danhSachKhachHang"
                                                    :key="khachHang.idKhachHang">
                                                    <td>{{ index + 1 }}</td>

                                                    <td>{{ khachHang.tenKhachHang }}</td>
                                                    <td>{{ khachHang.gioiTinh ? "Nam" : "Nữ" }}</td>
                                                    <td>{{ khachHang.soDienThoai }}</td>
                                                    <td>{{ diaChiMap[khachHang.idKhachHang] || 'Chưa có địa chỉ' }}</td>
                                                    <td>
                                                        <a-button size="small" type="link"
                                                            @click="chonKhachHang(khachHang)">Chọn</a-button>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                                v-model="activeTabData.hd.phuong_thuc_nhan_hang" @change="handlePhuongThucChange" />
                            <label class="form-check-label" :for="'nhanTaiCuahang_' + activeKey">Nhận tại cửa
                                hàng</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" :name="'phuongThucNhanHang_' + activeKey"
                                :id="'giaoHang_' + activeKey" value="Giao hàng"
                                v-model="activeTabData.hd.phuong_thuc_nhan_hang" @change="handlePhuongThucChange" />
                            <label class="form-check-label" :for="'giaoHang_' + activeKey">Giao hàng</label>
                        </div>
                        <div v-if="activeTabData.hd.phuong_thuc_nhan_hang === 'Giao hàng'" class="mt-2">
                            <label class="form-label">Địa chỉ nhận hàng</label>
                            <input type="text" class="form-control mb-2" placeholder="Nhập địa chỉ"
                                v-model="activeTabData.hd.dia_chi">
                            <label class="form-label">Phí vận chuyển (VNĐ)</label>
                            <a-input-number v-model:value="activeTabData.hd.phi_van_chuyen" :min="0"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="Nhập phí vận chuyển"
                                style="width: 100%" />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tổng tiền hàng (VNĐ):</label>
                        <input type="text" class="form-control"
                            :value="formatCurrency(activeTabData.hd.tong_tien_truoc_giam)" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="idVoucher" class="form-label">Voucher</label>
                        <select name="idVoucher" id="idVoucher" class="form-select"
                            v-model="activeTabData.hd.id_voucher" @change="updateVoucher">
                            <option :value="null">-- Chọn voucher --</option>
                            <option v-if="activeTabData.hd.id_voucher" :value="activeTabData.hd.id_voucher">
                                {{ `${activeTabData.hd.ten_voucher}` }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tổng tiền thanh toán (VNĐ):</label>
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
                            <label class="form-label">Tiền khách đưa (VNĐ)</label>
                            <a-input-number v-model:value="tienKhachDua" :min="0"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" placeholder="Nhập số tiền khách đưa"
                                style="width: 100%" />
                            <label class="form-label mt-2">Tiền dư trả khách (VNĐ)</label>
                            <input type="text" class="form-control" :value="formatCurrency(calculatedChange)" disabled>
                        </div>
                    </div>

                    <!-- Nút thanh toán với điều kiện vô hiệu hóa -->
                    <button type="submit" class="btn btn-primary w-100" :disabled="isPaymentDisabled">
                        Tạo đơn hàng & Thanh toán
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
import logo from '../../../images/logo/logo2.png';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const pageSize = ref(5);
const store = useGbStore();
const scrollContainer = ref(null);


const danhSachKhachHang = computed(() => store.getAllKhachHangNoPageList)
const diaChiMap = computed(() => store.diaChiMap);

const chonKhachHang = (khachHang) => {
    activeTabData.value.hd.ten_khach_hang = khachHang.tenKhachHang;
    activeTabData.value.hd.so_dien_thoai = khachHang.soDienThoai;
    activeTabData.value.hd.dia_chi = diaChiMap[khachHang.idKhachHang] || "Chưa có địa chỉ";
    activeTabData.value.hd.id_khach_hang = khachHang.idKhachHang;
    store.addKHHD(activeTabData.value.hd.id_hoa_don, khachHang.idKhachHang, khachHang.diaChi, khachHang.tenKhachHang, khachHang.soDienThoai);
    open.value = false;
};


// --- State cho tìm kiếm và dropdown ---
const dropdownVisible = ref(false);
const searchQuery = ref('');
const allProducts = ref([]); // Danh sách TẤT CẢ sản phẩm chi tiết lấy từ API/store


// --- State cho quản lý Tab hóa đơn ---
const panes = ref([]); // Khởi tạo rỗng, sẽ tạo tab đầu tiên trong onMounted
const activeKey = ref('');
const newTabIndex = ref(0); // Chỉ dùng để tạo key duy nhất nếu cần, không dùng cho tiêu đề

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

const openKhachLe = ref(false);
const khachLeForm = reactive({
    tenKhachHang: "",
    soDienThoai: "",
    diaChi: ""
});

const handleThemDiaChi = () => {
    openKhachLe.value = true;
};

const handleAddKhachLe = () => {
    if (!khachLeForm.tenKhachHang || !khachLeForm.soDienThoai || !khachLeForm.diaChi) {
        return message.warning("Vui lòng nhập đầy đủ thông tin khách lẻ!");
    }

    activeTabData.value.hd.ten_khach_hang = khachLeForm.tenKhachHang;
    activeTabData.value.hd.so_dien_thoai = khachLeForm.soDienThoai;
    activeTabData.value.hd.dia_chi = khachLeForm.diaChi;
    activeTabData.value.hd.id_khach_hang = null;
    store.addKHHD(activeTabData.value.hd.id_hoa_don, null, khachLeForm.diaChi, khachLeForm.tenKhachHang, khachLeForm.soDienThoai);
    openKhachLe.value = false;
};


// --- Computed Properties ---
// Lọc sản phẩm cho dropdown tìm kiếm
const filteredProducts = computed(() => {
    if (!allProducts.value || allProducts.value.length === 0) {
        return [];
    }
    if (!searchQuery.value) {
        return allProducts.value;
    }

    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return allProducts.value.filter(product =>
        product.ten_san_pham.toLowerCase().includes(lowerCaseQuery)
    );
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
// const showDropdown = () => {
//     this.$nextTick(() => {
//         this.dropdownVisible = true;
//     });
// };

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

const refreshHoaDon = async (idHoaDon) => {
    try {
        await store.getHoaDonByIdHoaDon(idHoaDon); // Hoặc API khác nếu bạn có
        const hoaDonInfo = store.getHDBIDHD;
        const currentTab = activeTabData.value;
        if (hoaDonInfo && currentTab && currentTab.hd?.id_hoa_don === idHoaDon) {
            currentTab.hd.tong_tien_truoc_giam = hoaDonInfo.tong_tien_truoc_giam || 0;
            currentTab.hd.tong_tien_sau_giam = hoaDonInfo.tong_tien_sau_giam || 0;
            currentTab.hd.id_voucher = hoaDonInfo.id_voucher || null;
            currentTab.hd.ten_voucher = hoaDonInfo.ten_voucher || '';
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin hóa đơn:', error);
        message.error('Không thể làm mới thông tin hóa đơn.');
    }
};



// Thêm sản phẩm vào hóa đơn chi tiết của tab hiện tại
const handleDropdownClick = (product) => {
    if (!dropdownVisible.value) return; // Ngăn nếu dropdown đang ẩn
    addToBill(product);
};


let isAdding = false;

const addToBill = async (product) => {
    if (isAdding) return;
    isAdding = true;

    const currentTab = activeTabData.value;
    if (!currentTab || !currentTab.hd?.id_hoa_don) {
        message.error('Vui lòng chọn hoặc tạo một hóa đơn hợp lệ trước!');
        isAdding = false;
        return;
    }

    if (product.so_luong_ton <= 0) {
        message.warning(`Sản phẩm "${product.ten_san_pham}" đã hết hàng!`);
        isAdding = false;
        return;
    }

    try {
        const result = await store.themSPHDMoi(
            currentTab.hd.id_hoa_don,
            product.id_chi_tiet_san_pham,
            1,
            product.gia_sau_giam || product.gia_ban
        );
        if (!result) return;

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
        }));

        console.log(currentTab.items.value);
        await refreshHoaDon(currentTab.hd.id_hoa_don);

        dropdownVisible.value = false;
        searchQuery.value = '';
        message.success(`Đã thêm "${product.ten_san_pham}" vào hóa đơn.`);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        message.error('Đã xảy ra lỗi khi thêm sản phẩm!');
    } finally {
        isAdding = false;
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
    const productInfo = allProducts.value.find(p => p.id_chi_tiet_san_pham === item.id_chi_tiet_san_pham);
    // Tìm sản phẩm chính xác bằng id_chi_tiet_san_pham thay vì chỉ id_hoa_don
    const sphd = store.getAllSPHDArr;
    const sphdItem = sphd.find(sp =>
        sp.id_hoa_don === item.id_hoa_don &&
        sp.id_chi_tiet_san_pham === item.id_chi_tiet_san_pham
    );
    // Kiểm tra số lượng tồn
    if (productInfo && item.so_luong > productInfo.so_luong) {
        message.warning(`Số lượng tồn của "${item.ten_san_pham}" không đủ (${productInfo.so_luong_ton}). Đã đặt lại số lượng tối đa.`);
        item.so_luong = productInfo.so_luong;
    }
    if (item.so_luong <= 0) {
        item.so_luong = 1;
    }

    try {
        // Nếu sphd tồn tại (sản phẩm đã có trong hóa đơn)
        if (sphdItem && sphdItem.so_luong > item.so_luong) {
            console.log("vào giảm số lượng")
            await store.giamSPHD(
                item.id_hoa_don,
                item.id_chi_tiet_san_pham,
                sphdItem.so_luong - item.so_luong,
                item.gia_ban
            );
        } else if (sphdItem && sphdItem.so_luong < item.so_luong) {
            console.log("vào tăng số lượng")
            await store.addSPHD(
                item.id_hoa_don,
                item.id_chi_tiet_san_pham,
                item.so_luong - sphdItem.so_luong,
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
                tong_tien: hd.don_gia,
                so_luong_ton_goc: hd.so_luong_ton || 0
            }));
        }
        console.log("id hoá đơn truyền vào ", item.id_hoa_don)
        await refreshHoaDon(item.id_hoa_don);

    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        message.error('Đã xảy ra lỗi khi cập nhật số lượng!');
    }
};

// Xóa sản phẩm khỏi hóa đơn chi tiết của tab hiện tại
const removeFromBill = async (productId) => {
    const currentTab = activeTabData.value;
    if (!currentTab || !currentTab.items) return;

    const itemsArray = currentTab.items.value;
    const itemIndex = itemsArray.findIndex(item => item.id_chi_tiet_san_pham === productId);
    if (itemIndex === -1) return;

    const removedItem = itemsArray[itemIndex];

    try {
        const result = await store.xoaSPHD(currentTab.hd.id_hoa_don, productId);
        if (!result) return;

        // Làm mới danh sách sản phẩm từ server
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
            so_luong_ton_goc: item.so_luong_ton || 0,
        }));

        await refreshHoaDon(currentTab.hd.id_hoa_don);

        message.info(`Đã xóa "${removedItem.ten_san_pham}" khỏi hóa đơn.`);
    } catch (error) {
        console.error('Lỗi không mong đợi:', error);
        message.error('Đã xảy ra lỗi bất ngờ khi xóa sản phẩm!');
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
                id_voucher: null,
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
        if (tabToRemove.hd?.id_hoa_don) {
            const result = await store.deleteHoaDon(tabToRemove.hd.id_hoa_don);
            if (result.error || !result.success) {
                message.error(result.message || 'Xóa hóa đơn thất bại');
                return;
            }

            // Làm mới danh sách sản phẩm để cập nhật số lượng tồn
            await store.getAllCTSPKM();
            allProducts.value = store.getAllCTSPKMList;
        }

        // Cập nhật UI chỉ khi xóa thành công
        panes.value = panes.value.filter(pane => pane.key !== targetKey);

        if (activeKey.value === targetKey) {
            const remainingPanes = panes.value;
            activeKey.value = remainingPanes.length > 0
                ? remainingPanes[remainingPanes.length - 1].key
                : '';
        }

        if (panes.value.length === 0) {
            await add();
        }

        message.success('Đã xóa hóa đơn thành công');
    } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
        message.error('Đã xảy ra lỗi khi xóa hóa đơn!');
    }
};


// Thêm font Arial tiếng Việt (cần tải file font .ttf và chuyển thành base64)
const callAddFont = function () {
    this.addFileToVFS('Arial-normal.ttf', 'base64-encoded-font-here');
    this.addFont('Arial-normal.ttf', 'Arial', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont]);

const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Phương thức in hóa đơn
const printInvoice = () => {
    const doc = new jsPDF();
    // Thiết lập font chữ (mặc định của jsPDF là Helvetica)
    doc.setFont("Roboto");
    // Thêm logo
    const logoWidth = 30; // Chiều rộng logo (mm)
    const logoHeight = 20; // Chiều cao logo (mm)
    const pageWidth = doc.internal.pageSize.getWidth(); // Chiều rộng trang A4 (210mm)
    const logoX = (pageWidth - logoWidth) / 2; // Căn giữa logo theo chiều ngang
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight); // Thêm logo vào PDF
    // Tiêu đề "HÓA ĐƠN BÁN HÀNG"
    doc.setFontSize(18);
    doc.setFont("Roboto", "bold");
    doc.text("HÓA ĐƠN BÁN HÀNG", 105, 50, { align: "center" });
    // Thông tin cửa hàng
    doc.setFontSize(16);
    doc.setFont("Roboto", "bold");
    doc.text("G&B SPORTS", 105, 60, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text("Địa chỉ: Phương Canh, Nam Từ Liêm, Hà Nội", 105, 68, { align: "center" });
    doc.text("Điện thoại: 0123456789", 105, 74, { align: "center" });
    // Vẽ đường kẻ ngang
    doc.setLineWidth(0.5);
    doc.line(20, 78, 190, 78);
    // Thông tin hóa đơn
    doc.setFontSize(12);
    doc.setFont("Roboto", "normal");
    doc.text(`Mã hóa đơn: ${store.hoaDonDetail.ma_hoa_don || 'N/A'}`, 20, 86);
    doc.text(`Ngày: ${formatDate(store.hoaDonDetail.ngay_tao)}`, 20, 94);
    doc.text(`Tên khách hàng: ${store.hoaDonDetail.ho_ten || 'Khách lẻ'}`, 20, 102);
    // Danh sách sản phẩm
    let y = 110;
    doc.setFontSize(12);
    doc.setFont("Roboto", "bold");
    doc.text("Sản phẩm", 20, y);
    // Tiêu đề bảng
    y += 10;
    doc.setFontSize(10);
    doc.setFont("Roboto", "bold");
    doc.text("Số lượng", 100, y, { align: "center" });
    doc.text("Đơn giá", 130, y, { align: "center" });
    doc.text("Thành tiền", 170, y, { align: "center" });
    // Vẽ đường kẻ ngang dưới tiêu đề bảng
    y += 2;
    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    // Danh sách sản phẩm
    y += 6;
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    store.chiTietHoaDons.forEach((item, index) => {
        // Tên sản phẩm
        const productName = `${index + 1}. ${item.ten_san_pham} (${item.ten_mau_sac} - ${item.kich_thuoc})`;
        const productLines = doc.splitTextToSize(productName, 80); // Chia nhỏ nếu tên quá dài
        doc.text(productLines, 20, y);

        // Số lượng
        doc.text(`${item.so_luong}`, 100, y, { align: "center" });

        // Đơn giá
        doc.text(`${formatCurrency(item.gia_ban)} VNĐ`, 130, y, { align: "center" });

        // Thành tiền
        const thanhTien = item.so_luong * item.gia_ban;
        doc.text(`${formatCurrency(thanhTien)} VNĐ`, 170, y, { align: "center" });

        // Tăng y dựa trên số dòng của tên sản phẩm
        y += productLines.length * 6 + 4;
    });
    // Vẽ đường kẻ ngang sau danh sách sản phẩm
    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    // Tổng tiền
    y += 10;
    doc.setFontSize(12);
    doc.setFont("Roboto", "normal");
    doc.text(`Tổng tiền hàng: ${formatCurrency(store.hoaDonDetail.tong_tien_truoc_giam)} VNĐ`, 20, y);
    y += 6;
    const giamGia = (store.hoaDonDetail.tong_tien_truoc_giam || 0) +
        (store.hoaDonDetail.phi_van_chuyen || 0) -
        (store.hoaDonDetail.tong_tien_sau_giam || 0);
    doc.text(`Giảm giá: ${formatCurrency(giamGia)} VNĐ`, 20, y);
    y += 6;
    doc.text(`Phí vận chuyển: ${formatCurrency(store.hoaDonDetail.phi_van_chuyen || 0)} VNĐ`, 20, y);
    y += 6;
    doc.setFont("Roboto", "bold");
    doc.text(`Thành tiền: ${formatCurrency(store.hoaDonDetail.tong_tien_sau_giam)} VNĐ`, 20, y);
    // Chân trang
    y += 10;
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text("Cảm ơn Quý Khách, hẹn gặp lại!", 105, y, { align: "center" });
    // Lưu file PDF
    doc.save(`HoaDon_${store.hoaDonDetail.ma_hoa_don}.pdf`);
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

// --- Lifecycle Hooks ---
onMounted(async () => {
    try {
        // Load dữ liệu từ store
        await store.getAllHoaDonCTT();
        await store.getAllCTSPKM();
        await store.getAllNhanVien(0, pageSize.value);
        await store.getAllKhachHangNoPage();
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

watch(() => searchQuery, (newVal) => {
    if (newVal.length > 0) {
        dropdownVisible.value = true
    } else {
        dropdownVisible.value = false
    }
})

const handlePhuongThucChange = async () => {
  const idHD = activeTabData.value.hd.id_hoa_don;

  if (activeTabData.value.hd.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
    activeTabData.value.hd.phi_van_chuyen = 0;
    await store.setTrangThaiNhanHang(idHD, 'Nhận tại cửa hàng');
  } else {
    activeTabData.value.hd.phi_van_chuyen = 30000;
    await store.setTrangThaiNhanHang(idHD, 'Giao hàng');
  }

  // 🔄 Gọi API lấy lại hóa đơn để cập nhật tiền
  const updatedHD = await store.getHoaDonByIdHoaDon(idHD); // phương thức này cần tồn tại trong store
  activeTabData.value.hd = {
    ...activeTabData.value.hd,
    ...updatedHD, // Gộp thông tin cập nhật mới (tiền, phí, ...)
  };
};



// watch(
//   () => activeTabData.value.hd.phuong_thuc_nhan_hang,
//   (newVal) => {
//     if (newVal === 'Nhận tại cửa hàng') {
//       activeTabData.value.hd.phi_van_chuyen = 0;
//       store.setTrangThaiNhanHang(activeTabData.value.hd.id_hoa_don, 'Nhận tại cửa hàng');
//     } else if (newVal === 'Giao hàng') {
//       activeTabData.value.hd.phi_van_chuyen = 30000;
//       store.setTrangThaiNhanHang(activeTabData.value.hd.id_hoa_don, 'Giao hàng');
//     }
//   }
// );




</script>

<style scoped>
.header-container {
    height: 70px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #eee;
}

.search-section {
    flex-shrink: 0;
    margin-right: 20px;
}

.dropdown-content-custom {
    width: 600px;
    max-height: 400px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    z-index: 1000;
}

.product-option {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
}

.product-option:hover {
    background-color: #f0f0f0;
}

.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 12px;
}

.product-info {
    display: flex;
    flex-direction: column;
}

.product-name {
    font-weight: 600;
}

.product-details span {
    display: block;
    font-size: 12px;
    color: #555;
}

.empty-result {
    padding: 10px;
    color: #999;
    text-align: center;
}


.search-section {
    position: relative;
}

.product-info-split {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 12px;
}

.info-left {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.info-center {
    width: 70px;
    text-align: center;
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

.info-right {
    min-width: 90px;
    text-align: right;
    font-weight: bold;
    color: #d4380d;
}

.product-price {
    font-size: 14px;
}

.product-name {
    font-weight: 600;
    margin-bottom: 4px;
}

.product-details span {
    font-size: 12px;
    color: #555;
    display: block;
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
    margin-left: 8px;
}

.action-buttons {
    display: flex;
    gap: 10px;
    align-items: center;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1890ff;
    border-color: #1890ff;
    color: white;
}

.action-btn:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
    color: white;
}

.custom-tab {
    position: relative;
    padding-right: 4px;
    display: flex;
    align-items: center;
    color: black;
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
    background-color: rgb(235, 235, 235);
    border: none;
    color: black !important;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active),
:deep(.ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab-active) {
    background-color: #1890ff;
    color: white !important;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn),
:deep(.ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: white !important;
    text-shadow: none !important;
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