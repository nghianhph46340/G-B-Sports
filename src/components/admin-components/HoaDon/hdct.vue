<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <div class="container-fluid main-content">
        <div v-if="loading" class="text-center">
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="store.hoaDonDetail">
            <div class="order-header">
                <div class="row">
                    <div class="col-md-7">
                        <h2>Thông tin chi tiết đơn hàng {{ store.hoaDonDetail.loai_hoa_don }} #{{
                            store.hoaDonDetail.ma_hoa_don || 'N/A' }}</h2>
                    </div>
                    <div class="col">
                        <button class="btn btn-primary float-end" @click="$router.push('/admin/quanlyhoadon')">Quay
                            lại</button>
                    </div>
                </div>
                <hr>
                <h4 style="text-align: center;">Lịch sử trạng thái</h4><br>
                <div class="status-icons">
                    <div class="col" v-for="history in sortedTrangThaiHistory" :key="history.trang_thai">
                        <div class="status-icon" :class="getStatusClass(history.trang_thai)">
                            <i :class="getIconForStatus(history.trang_thai)"></i>
                            <p>{{ history.trang_thai }}</p>
                            <small>{{ history.ngay_chuyen_formatted }}</small>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="order-status">
                    <!-- Nút Quay lại trạng thái ban đầu -->
                    <form @submit.prevent="revertToInitial" v-if="showRevertButton">
                        <button type="submit" class="btn btn-warning">
                            Quay lại trạng thái ban đầu
                        </button>
                    </form>
                    <form @submit.prevent="changeStatus">
                        <button type="submit" class="btn btn-success" :disabled="isCompletedOrCancelled"
                            :class="{ 'disabled': isCompletedOrCancelled }">
                            {{ nextStatusText }}
                        </button>
                    </form>
                    <form @submit.prevent="cancelOrder">
                        <button type="submit" class="btn btn-danger" :disabled="cannotCancel"
                            :class="{ 'disabled': cannotCancel }">
                            Hủy đơn
                        </button>
                    </form>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="info-box">
                        <h5>Thông tin đơn hàng</h5>
                        <div class="row">
                            <div class="col">
                                <p>Mã hóa đơn: {{ store.hoaDonDetail.ma_hoa_don || 'N/A' }}</p>
                                <p>Trạng thái: {{ store.hoaDonDetail.trang_thai_thanh_toan || 'N/A' }}</p>
                                <p>Phương thức thanh toán: {{ store.hoaDonDetail.hinh_thuc_thanh_toan || 'Chưa xác định'
                                }}</p>
                            </div>
                            <div class="col">
                                <p>Ngày tạo: {{ formatDate(store.hoaDonDetail.ngay_tao) }}</p>
                                <p>Nhân viên tiếp nhận: {{ store.hoaDonDetail.ten_nhan_vien || 'Chưa xác định' }}</p>
                                <p>Hình thức nhận hàng: {{ store.hoaDonDetail.phuong_thuc_nhan_hang || 'Chưa xác định'
                                }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-8">
                        <div class="info-box">
                            <h5>Thông tin sản phẩm</h5>
                            <button class="btn btn-primary" :disabled="cannotEditProduct" :class="{ 'disabled': cannotEditProduct }"
                                @click="showAddProductPopupFn">
                                Thêm sản phẩm
                            </button>
                            <table class="table-custom">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Thao tác</th> <!-- Thêm cột Thao tác -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in store.chiTietHoaDons" :key="index">
                                        <td>
                                            <img :src="item.hinh_anh || '/images/default.jpg'" alt="Product"
                                                class="product-image">
                                            {{ item.ten_san_pham || 'N/A' }} <br>
                                            Mã: {{ item.ma_san_pham || 'N/A' }}, Kích thước: {{ item.kich_thuoc || 'N/A'
                                            }},
                                            Màu: {{ item.ten_mau_sac || 'N/A' }}
                                        </td>
                                        <td>{{ formatCurrency(item.gia_ban) }} VNĐ</td>
                                        <td>
                                            <div class="quantity-display">
                                                <button @click="showIncreasePopup(index)" :disabled="cannotEditProduct"><i
                                                        class="fas fa-minus"></i></button>
                                                <span>{{ item.so_luong }}</span>
                                                <button @click="showDecreasePopup(index)" :disabled="cannotEditProduct"><i
                                                        class="fas fa-plus"></i></button>
                                            </div>
                                        </td>
                                        <td>{{ formatCurrency(item.don_gia) }} VNĐ</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" @click="removeProduct(item, index)"
                                                :disabled="cannotEditProduct">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="total-section">
                                <p>Tổng tạm: {{ formatCurrency(store.hoaDonDetail.tong_tien_truoc_giam) }} VNĐ</p>
                                <p>Phí vận chuyển: +{{ formatCurrency(store.hoaDonDetail.phi_van_chuyen) }} VNĐ</p>
                                <p>{{ store.hoaDonDetail.mo_ta }} Giảm giá: - {{
                                    formatCurrency((store.hoaDonDetail.tong_tien_truoc_giam || 0) +
                                        (store.hoaDonDetail.phi_van_chuyen || 0) - (store.hoaDonDetail.tong_tien_sau_giam ||
                                    0)) }} VNĐ</p>
                                <p>Tổng cuối: {{ formatCurrency(store.hoaDonDetail.tong_tien_sau_giam) }} VNĐ</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="info-box">
                            <h5>Thông tin khách hàng</h5>
                            <!-- Nút Sửa hoặc Lưu/Hủy -->
                            <div v-if="!isEditingCustomer">
                                <button class="btn btn-primary" :disabled="cannotEdit"
                                    :class="{ 'disabled': cannotEdit }" @click="startEditingCustomer">
                                    Sửa
                                </button>
                            </div>
                            <div v-else>
                                <!-- <a-button type="text" @click="saveCustomerInfo">Lưu</a-button>
                                <a-button type="text" @click="cancelEditingCustomer">Hủy</a-button> -->
                                <button class="btn btn-success" @click="saveCustomerInfo">Lưu</button>
                                <button class="btn btn-secondary" @click="cancelEditingCustomer">Hủy</button>
                            </div>

                            <!-- Hiển thị thông tin tĩnh hoặc form nhập liệu -->
                            <div v-if="!isEditingCustomer">
                                <p>Tên: {{ store.hoaDonDetail.ho_ten || 'Chưa xác định' }}</p>
                                <p>Email: {{ store.hoaDonDetail.email || 'Chưa xác định' }}</p>
                                <p>Phone: {{ store.hoaDonDetail.sdt_nguoi_nhan || 'Chưa xác định' }}</p>
                                <p>Địa chỉ: {{ store.hoaDonDetail.dia_chi || 'Chưa xác định' }}</p>
                            </div>
                            <div v-else>
                                <form @submit.prevent="saveCustomerInfo">
                                    <div class="mb-3">
                                        <label for="hoTen" class="form-label">Tên:</label>
                                        <input type="text" class="form-control" id="hoTen"
                                            v-model="editedCustomer.hoTen" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email:</label>
                                        <input type="email" class="form-control" id="email"
                                            v-model="editedCustomer.email" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="sdtNguoiNhan" class="form-label">Phone:</label>
                                        <input type="text" class="form-control" id="sdtNguoiNhan"
                                            v-model="editedCustomer.sdtNguoiNhan" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="diaChi" class="form-label">Địa chỉ:</label>
                                        <input type="text" class="form-control" id="diaChi"
                                            v-model="editedCustomer.diaChi" required />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <!-- Phần Ghi chú -->
                        <div class="info-box">
                            <h5>Ghi chú</h5>
                            <!-- Nút Sửa hoặc Lưu/Hủy -->
                            <div v-if="!isEditingNote">
                                <button class="btn btn-primary" :disabled="cannotEdit"
                                    :class="{ 'disabled': cannotEdit }" @click="startEditingNote">
                                    Sửa
                                </button>
                            </div>
                            <div v-else class="edit-buttons">
                                <button class="btn btn-success" @click="saveNote">Lưu</button>
                                <button class="btn btn-secondary" @click="cancelEditingNote">Hủy</button>
                            </div>

                            <!-- Hiển thị ghi chú tĩnh hoặc form nhập liệu -->
                            <div v-if="!isEditingNote">
                                <textarea class="form-control" rows="2"
                                    readonly>{{ store.hoaDonDetail.ghi_chu || 'Không có ghi chú' }}</textarea>
                            </div>
                            <div v-else>
                                <form @submit.prevent="saveNote">
                                    <div class="mb-3">
                                        <textarea class="form-control" rows="2" v-model="editedNote"
                                            placeholder="Nhập ghi chú..."></textarea>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Popup thêm sản phẩm -->
                <div v-if="showAddProductPopup" class="modal-overlay">
                    <div class="modal-content">
                        <h2>Danh sách sản phẩm</h2>
                        <div class="modal-header">
                            <input type="text" class="form-control search-input" v-model="searchKeyword"
                                @input="searchProducts" placeholder="Tìm kiếm sản phẩm..." />
                            <button class="btn btn-primary" @click="addSelectedProducts">Thêm sản phẩm</button>
                        </div>
                        <table class="table-custom">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Danh mục</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Màu sắc</th>
                                    <th>Kích cỡ</th>
                                    <th>Số lượng</th>
                                    <th>Giá bán(VNĐ)</th>
                                    <th>Trạng thái</th>
                                    <th>Số lượng mua</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in store.listCTSP_HD" :key="item.id_chi_tiet_san_pham">
                                    <td>{{ index + 1 + (store.currentPage * 5) }}</td>
                                    <td>{{ item.ten_danh_muc || 'N/A' }}</td>
                                    <td>{{ item.ten_san_pham || 'N/A' }}</td>
                                    <td>{{ item.ten_mau || 'N/A' }}</td>
                                    <td>{{ item.gia_tri || 'N/A' }}</td>
                                    <td>{{ item.so_luong || 0 }}</td>
                                    <td>{{ formatCurrency(item.gia_ban || 0) }}</td>
                                    <td>{{ item.trang_thai || 'N/A' }}</td>
                                    <td>
                                        <div class="quantity-input">
                                            <button @click="decreaseQuantityPopup(index)"
                                                :disabled="quantities[index] <= 0">-</button>
                                            <input type="number" v-model.number="quantities[index]" min="0"
                                                :max="item.so_luong" @input="validateQuantity(index, item.so_luong)" />
                                            <button @click="increaseQuantityPopup(index)"
                                                :disabled="quantities[index] >= item.so_luong">+</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="pagination">
                            <button @click="changePage(store.currentPage - 1)" :disabled="store.currentPage === 0">
                                Trang trước
                            </button>
                            <span>Trang {{ store.currentPage + 1 }} / {{ store.totalPages
                                }}</span>
                            <button @click="changePage(store.currentPage + 1)"
                                :disabled="store.currentPage >= store.totalPages - 1">
                                Trang sau
                            </button>
                        </div>
                        <button class="btn btn-secondary close-btn" @click="closeAddProductPopup">Đóng</button>
                    </div>
                </div>
            </div>
            <!-- Popup chỉnh sửa số lượng -->
            <div v-if="showQuantityPopup" class="popup-overlay">
                <div class="popup-content">
                    <h3>{{ popupType === 'increase' ? 'Giảm số lượng' : 'Thêm số lượng' }}</h3>
                    <div class="popup-input">
                        <label>Số lượng:</label>
                        <input type="number" v-model.number="quantityChange" min="0" />
                    </div>
                    <div class="popup-actions">
                        <button @click="updateQuantity" class="btn btn-primary">
                            <i :class="popupType === 'increase' ? 'fas fa-minus' : 'fas fa-plus'"></i>
                        </button>
                        <button @click="closeQuantityPopup" class="btn btn-secondary">Hủy</button>
                    </div>
                </div>
            </div>

            <div class="notification">
                {{ store.hoaDonDetail.trang_thai?.toUpperCase() || 'ĐANG XỬ LÝ' }} ĐƠN HÀNG {{
                    formatCurrency(store.hoaDonDetail.tong_tien_sau_giam) }} VNĐ
            </div>
        </div>
        <div v-else class="text-center">
            <p>Không tìm thấy hóa đơn.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const store = useGbStore();
const route = useRoute();
const router = useRouter();
const loading = ref(true);

// Danh sách trạng thái cho hình thức "Giao hàng"
const defaultStatusSteps = [
    { name: 'Đơn hàng đã đặt', backendStatus: 'Chờ xác nhận', icon: 'fas fa-file-alt' },
    { name: 'Đã xác nhận', backendStatus: 'Đã xác nhận', icon: 'fas fa-check' },
    { name: 'Đã cập nhật', backendStatus: 'Đã cập nhật', icon: 'fas fa-edit' },
    { name: 'Đã giao cho ĐVVC', backendStatus: 'Đang giao', icon: 'fas fa-truck' },
    { name: 'Đã nhận hàng', backendStatus: 'Đã nhận hàng', icon: 'fas fa-box' },
    { name: 'Hoàn thành', backendStatus: 'Hoàn thành', icon: 'fas fa-check-circle' },
    { name: 'Đã hủy', backendStatus: 'Đã hủy', icon: 'fas fa-times-circle' }
];

// Danh sách trạng thái cho "Nhận tại cửa hàng"
const storePickupStatusSteps = [
    { name: 'Chờ xác nhận', backendStatus: 'Chờ xác nhận', icon: 'fas fa-hourglass-start' },
    { name: 'Đã cập nhật', backendStatus: 'Đã cập nhật', icon: 'fas fa-edit' },
    { name: 'Hoàn thành', backendStatus: 'Hoàn thành', icon: 'fas fa-check-circle' },
    { name: 'Đã hủy', backendStatus: 'Đã hủy', icon: 'fas fa-times-circle' }
];

// Computed property để quyết định danh sách trạng thái
const computedStatusSteps = computed(() => {
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return storePickupStatusSteps;
    }
    return defaultStatusSteps;
});

const sortedTrangThaiHistory = computed(() => {
    return [...store.trangThaiHistory].sort((a, b) => {
        return new Date(a.ngay_chuyen) - new Date(b.ngay_chuyen);
    });
});

const getIconForStatus = (trangThai) => {
    const statusSteps = store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng'
        ? storePickupStatusSteps
        : defaultStatusSteps;
    const status = statusSteps.find(s => s.backendStatus === trangThai);
    return status ? status.icon : 'fas fa-question'; // Icon mặc định nếu không tìm thấy
};

const isCompletedOrCancelled = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    return trangThai === 'Hoàn thành' || trangThai === 'Đã hủy';
});

const cannotCancel = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return ['Hoàn thành', 'Đã hủy'].includes(trangThai);
    }
    return ['Đang giao', 'Đã nhận hàng', 'Hoàn thành', 'Đã hủy'].includes(trangThai);
});

const cannotEditProduct = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return ['Hoàn thành', 'Đã hủy'].includes(trangThai);
    }
    return ["Đã cập nhật", "Đã xác nhận", 'Đang giao', 'Đã nhận hàng', 'Hoàn thành', 'Đã hủy'].includes(trangThai);
});

const cannotEdit = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return ['Hoàn thành', 'Đã hủy'].includes(trangThai);
    }
    return ['Đang giao', 'Đã nhận hàng', 'Hoàn thành', 'Đã hủy'].includes(trangThai);
});

const nextStatusText = computed(() => {
    const phuongThucNhanHang = store.hoaDonDetail?.phuong_thuc_nhan_hang;
    const trangThai = store.hoaDonDetail?.trang_thai;

    if (!phuongThucNhanHang || !trangThai) return 'Chuyển trạng thái';

    if (phuongThucNhanHang === 'Nhận tại cửa hàng') {
        return trangThai === 'Chờ xác nhận' ? 'Hoàn thành' : 'Hoàn thành';
    }
    switch (trangThai) {
        case 'Chờ xác nhận':
            return 'Xác nhận đơn hàng';
        case 'Đã xác nhận':
            return 'Giao cho ĐVVC';
        case 'Đã cập nhật':
            return 'Giao cho ĐVVC';
        case 'Đang giao':
            return 'Hoàn thành';
        case 'Đã nhận hàng':
            return 'Hoàn thành';
        default:
            return 'Hoàn thành';
    }
});

const nextStatusValue = computed(() => {
    const phuongThucNhanHang = store.hoaDonDetail?.phuong_thuc_nhan_hang;
    const trangThai = store.hoaDonDetail?.trang_thai;

    if (!phuongThucNhanHang || !trangThai) return '';

    if (phuongThucNhanHang === 'Nhận tại cửa hàng') {
        return trangThai === 'Chờ xác nhận' ? 'Hoàn thành' : 'Hoàn thành';
    }
    switch (trangThai) {
        case 'Chờ xác nhận':
            return 'Đã xác nhận';
        case 'Đã xác nhận':
            return 'Đang giao';
        case 'Đã cập nhật':
            return 'Đang giao';
        case 'Đang giao':
            return 'Hoàn thành';
        case 'Đã nhận hàng':
            return 'Hoàn thành';
        default:
            return 'Hoàn thành';
    }
});

const formatCurrency = (value) => {
    return value ? new Intl.NumberFormat('vi-VN').format(value) : '0';
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusClass = (trangThai) => {
    // Vì trạng thái này đã có trong lịch sử, nên luôn là text-success
    if (trangThai === 'Đã hủy') {
        return 'text-danger';
    }
    return 'text-success';
};

const changeStatus = () => {
    if (confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng thành "${nextStatusValue.value}" không?`)) {
        const newTrangThai = nextStatusValue.value;
        if (newTrangThai) {
            store.changeTrangThaiHoaDon(store.hoaDonDetail.ma_hoa_don, newTrangThai);
        }
    }
};

const cancelOrder = () => {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.')) {
        store.cancelHoaDon(store.hoaDonDetail.ma_hoa_don);
    }
};

// Trạng thái chỉnh sửa thông tin khách hàng
const isEditingCustomer = ref(false);
const editedCustomer = ref({
    hoTen: '',
    email: '',
    sdtNguoiNhan: '',
    diaChi: ''
});

// Bắt đầu chỉnh sửa thông tin khách hàng
const startEditingCustomer = () => {
    // Lưu dữ liệu ban đầu vào editedCustomer
    editedCustomer.value = {
        hoTen: store.hoaDonDetail.ho_ten || '',
        email: store.hoaDonDetail.email || '',
        sdtNguoiNhan: store.hoaDonDetail.sdt_nguoi_nhan || '',
        diaChi: store.hoaDonDetail.dia_chi || ''
    };
    isEditingCustomer.value = true;
};

// Lưu thông tin khách hàng
const saveCustomerInfo = () => {
    if (confirm('Bạn có đồng ý sửa thông tin khách hàng không?')) {
        store.updateCustomerInfo(store.hoaDonDetail.ma_hoa_don, editedCustomer.value);
        isEditingCustomer.value = false; // Thoát chế độ chỉnh sửa
    }
};

// Hủy chỉnh sửa
const cancelEditingCustomer = () => {
    isEditingCustomer.value = false; // Thoát chế độ chỉnh sửa mà không lưu
};

// Trạng thái chỉnh sửa ghi chú
const isEditingNote = ref(false);
const editedNote = ref('');

// Bắt đầu chỉnh sửa ghi chú
const startEditingNote = () => {
    editedNote.value = store.hoaDonDetail.ghi_chu || '';
    isEditingNote.value = true;
};

// Lưu ghi chú
const saveNote = () => {
    if (confirm('Bạn có đồng ý sửa ghi chú không?')) {
        store.updateNote(store.hoaDonDetail.ma_hoa_don, editedNote.value);
        isEditingNote.value = false;
    }
};

// Hủy chỉnh sửa ghi chú
const cancelEditingNote = () => {
    isEditingNote.value = false;
};


// Trạng thái popup thêm sản phẩm
const showAddProductPopup = ref(false);
const searchKeyword = ref('');
const quantities = ref([]);

// Hiển thị popup thêm sản phẩm
const showAddProductPopupFn = async () => {
    await store.getAllCTSP_HD(0, 5, '');
    quantities.value = new Array(store.listCTSP_HD.length).fill(0);
    showAddProductPopup.value = true;
};

// Đóng popup thêm sản phẩm
const closeAddProductPopup = () => {
    showAddProductPopup.value = false;
    searchKeyword.value = '';
    quantities.value = new Array(store.listCTSP_HD.length).fill(0);
};

// Tìm kiếm sản phẩm
const searchProducts = async () => {
    await store.getAllCTSP_HD(0, 5, searchKeyword.value);
    quantities.value = new Array(store.listCTSP_HD.length).fill(0);
};

// Thay đổi trang
const changePage = async (page) => {
    if (page >= 0 && page < store.totalPages) {
        await store.getAllCTSP_HD(page, 5, searchKeyword.value);
        quantities.value = new Array(store.listCTSP_HD.length).fill(0);
    }
};

// Tăng số lượng trong Popup
const increaseQuantityPopup = (index) => {
    if (quantities.value[index] < store.listCTSP_HD[index].so_luong) {
        quantities.value[index]++;
    }
};

// Giảm số lượng trong Popup
const decreaseQuantityPopup = (index) => {
    if (quantities.value[index] > 0) {
        quantities.value[index]--;
    }
};

// Validate số lượng
const validateQuantity = (index, max) => {
    if (quantities.value[index] < 0) {
        quantities.value[index] = 0;
    }
    if (quantities.value[index] > max) {
        quantities.value[index] = max;
        toast.error(`Số lượng mua không được vượt quá ${max}`);
    }
};

// Thêm sản phẩm vào hóa đơn
const addSelectedProducts = () => {
    const selectedProducts = store.listCTSP_HD
        .map((item, index) => ({
            idCTSP: item.id_chi_tiet_san_pham,
            soLuongMua: quantities.value[index]
        }))
        .filter(product => product.soLuongMua > 0);

    if (selectedProducts.length === 0) {
        toast.error('Vui lòng chọn ít nhất một sản phẩm để thêm!');
        return;
    }

    store.addProductsToInvoice(store.hoaDonDetail.ma_hoa_don, selectedProducts);
    closeAddProductPopup();
};
// Xóa sản phẩm khỏi hóa đơn
const removeProduct = async (item, index) => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${item.ten_san_pham}" khỏi hóa đơn không?`)) {
        try {
            // Gọi API để xóa sản phẩm
            const response = await store.removeProductFromInvoice(
                store.hoaDonDetail.ma_hoa_don,
                item.id_chi_tiet_san_pham,
                item.so_luong
            );

            if (response.error) {
                toast.error('Xóa sản phẩm khỏi hóa đơn thất bại');
                return;
            }

            // Xóa sản phẩm khỏi danh sách hiển thị
            store.chiTietHoaDons.splice(index, 1);

            // Cập nhật lại tổng tiền của hóa đơn
            await store.getHoaDonDetail(store.hoaDonDetail.ma_hoa_don);

            toast.success('Xóa sản phẩm khỏi hóa đơn thành công');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
        }
    }
};

// Trạng thái popup chỉnh sửa số lượng
const showQuantityPopup = ref(false);
const popupType = ref('');
const currentIndex = ref(null);
const quantityChange = ref(0);

const showIncreasePopup = (index) => {
    currentIndex.value = index;
    popupType.value = 'increase';
    quantityChange.value = 0;
    showQuantityPopup.value = true;
};

const showDecreasePopup = (index) => {
    currentIndex.value = index;
    popupType.value = 'decrease';
    quantityChange.value = 0;
    showQuantityPopup.value = true;
};

const closeQuantityPopup = () => {
    showQuantityPopup.value = false;
    currentIndex.value = null;
    popupType.value = '';
    quantityChange.value = 0;
};
const updateQuantity = async () => {
    const index = currentIndex.value;
    const item = store.chiTietHoaDons[index];
    const change = quantityChange.value;

    // Validate số lượng nhập vào
    if (change <= 0) {
        toast.error('Số lượng phải lớn hơn 0');
        return;
    }

    if (popupType.value === 'decrease') {
        // Kiểm tra số lượng còn lại
        if (change > item.so_luong_con_lai) {
            toast.error(`Số lượng thêm không được vượt quá ${item.so_luong_con_lai}`);
            return;
        }

        try {
            const response = await store.updateProductQuantity(
                store.hoaDonDetail.ma_hoa_don,
                item.id_chi_tiet_san_pham,
                change // Số lượng thêm
            );

            if (response.error) {
                toast.error('Cập nhật số lượng thất bại');
                return;
            }

            // Cập nhật lại dữ liệu
            await store.getHoaDonDetail(store.hoaDonDetail.ma_hoa_don);
            toast.success(`Đã thêm ${change} sản phẩm thành công`);
        } catch (error) {
            console.error('Lỗi khi thêm số lượng:', error);
            toast.error('Có lỗi xảy ra khi thêm số lượng');
        }
    } else if (popupType.value === 'increase') {
        // Kiểm tra số lượng hiện tại
        if (change >= item.so_luong) {
            toast.error(`Số lượng giảm không được vượt quá ${item.so_luong}`);
            return;
        }

        try {
            const response = await store.updateProductQuantity(
                store.hoaDonDetail.ma_hoa_don,
                item.id_chi_tiet_san_pham,
                -change // Số lượng giảm
            );

            if (response.error) {
                toast.error('Cập nhật số lượng thất bại');
                return;
            }

            // Cập nhật lại dữ liệu
            await store.getHoaDonDetail(store.hoaDonDetail.ma_hoa_don);
            toast.success(`Đã giảm ${change} sản phẩm thành công`);
        } catch (error) {
            console.error('Lỗi khi giảm số lượng:', error);
            toast.error('Có lỗi xảy ra khi giảm số lượng');
        }
    }

    // Đóng popup sau khi xử lý
    closeQuantityPopup();
};

// Computed property để kiểm tra điều kiện hiển thị nút "Quay lại"
const showRevertButton = computed(() => {
    if (store.trangThaiHistory.length === 0) {
        console.log('trangThaiHistory rỗng');
        return false;
    }
    const firstStatus = store.trangThaiHistory[0].trang_thai;
    const currentStatus = store.hoaDonDetail.trang_thai;
    console.log('First Status:', firstStatus);
    console.log('Current Status:', currentStatus);
    console.log('Show Revert Button:', firstStatus === 'Chờ xác nhận' && currentStatus === 'Đã xác nhận');
    return firstStatus === 'Chờ xác nhận' && currentStatus === 'Đã xác nhận';
});

// Hàm xử lý sự kiện "Quay lại trạng thái ban đầu"
const revertToInitial = () => {
    if (confirm('Bạn có chắc muốn quay lại trạng thái "Chờ xác nhận" không?')) {
        store.revertToInitialStatus(store.hoaDonDetail.ma_hoa_don);
    }
};
onMounted(async () => {
    const maHoaDon = route.params.maHoaDon;
    if (maHoaDon) {
        loading.value = true;
        await store.getHoaDonDetail(maHoaDon);
        loading.value = false;
        console.log('trang_thai:', store.hoaDonDetail?.trang_thai);
        console.log('phuong_thuc_nhan_hang:', store.hoaDonDetail?.phuong_thuc_nhan_hang);
        console.log('nextStatusText:', nextStatusText.value);
        console.log('Danh sách chi tiết hóa đơn:', store.chiTietHoaDons);
        console.log('Mô tả: ', store.chiTietHoaDons?.moTa);
    }
});
</script>

<style scoped>
.main-content {
    padding: 20px;
}

.order-header {
    background-color: #f8f9fa;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
}

.status-icons {
    display: flex;
    justify-content: flex-start;
    /* Bắt đầu từ bên trái */
    gap: 40px;
    /* Tăng khoảng cách giữa các trạng thái để dễ nhìn */
    margin-bottom: 20px;
    position: relative;
    flex-wrap: nowrap;
    /* Đảm bảo không xuống dòng */
    overflow-x: auto;
    /* Nếu danh sách quá dài, cho phép cuộn ngang */
    padding: 10px 0;
}

.status-icon {
    text-align: center;
    font-size: 14px;
    position: relative;
    z-index: 1;
    min-width: 100px;
    /* Đảm bảo mỗi trạng thái có chiều rộng tối thiểu */
}

/* Đường thẳng nối giữa các trạng thái */
.status-icon:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 12px;
    /* Đặt đường thẳng ở giữa icon */
    left: 100%;
    /* Bắt đầu từ bên phải của trạng thái hiện tại */
    width: 40px;
    /* Chiều dài đường thẳng, khớp với gap */
    height: 2px;
    /* Độ dày của đường thẳng */
    background-color: #007bff;
    /* Màu xanh cho đường thẳng */
    z-index: 0;
}

.status-icon i {
    font-size: 24px;
    margin-bottom: 5px;
}

.status-icon small {
    display: block;
    font-size: 12px;
    color: #666;
}

.order-status {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.info-box {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
    /* margin-right: 10px; */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
}

.info-box .btn.btn-primary,
.info-box .btn.btn-secondary,
.info-box .btn.btn-success {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    font-size: 12px;
}

.info-box h5 {
    margin-top: 0;
    color: #343a40;
    font-weight: 500;
}

.table-custom {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.table-custom th,
.table-custom td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    vertical-align: middle;
}

.table-custom th {
    background-color: #f8f9fa;
    font-weight: 500;
}

.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.total-section {
    margin-top: 10px;
    text-align: right;
}

.notification {
    background-color: #ffebee;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-top: 20px;
    color: #721c24;
    font-weight: 500;
}

textarea.form-control[readonly] {
    background-color: #fff;
    border: 1px solid #ddd;
    resize: none;
}

.text-danger {
    color: #dc3545;
}

.text-success {
    color: #28a745;
}

.mb-3 {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-control {
    border-radius: 5px;
    border: 1px solid #ddd;
    padding: 8px;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.btn-success {
    margin-right: 55px;
    padding: 5px 15px;
}

.btn-secondary {
    margin-right: 5px;
    padding: 5px 15px;
}

/* Popup */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}

.modal-content h2 {
    text-align: center;
    margin-bottom: 20px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-input {
    width: 300px;
}

.close-btn {
    display: block;
    margin: 20px auto 0;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 5px;
}

.quantity-input button {
    padding: 5px 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.quantity-input button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.quantity-input input {
    width: 60px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 5px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.pagination button {
    padding: 5px 15px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.pagination button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 5px;
}

.quantity-input button {
    padding: 5px 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.quantity-input button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.quantity-input input {
    width: 60px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 5px;
}

.btn-danger.btn-sm {
    padding: 5px 10px;
    font-size: 12px;
    visibility: visible;
}

.quantity-display {
    display: flex;
    align-items: center;
    gap: 5px;
}

.quantity-display span {
    min-width: 30px;
    text-align: center;
}

.quantity-display button {
    padding: 5px 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.quantity-display button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    text-align: center;
}

.popup-input {
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.popup-input input {
    width: 100px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 3px;
}

.popup-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.btn-primary {
    padding: 5px 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.btn-secondary {
    padding: 5px 10px;
    background: #6c757d;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
</style>