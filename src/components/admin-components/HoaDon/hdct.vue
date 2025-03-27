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
                    <div class="col" v-for="status in computedStatusSteps" :key="status.name">
                        <div class="status-icon" :class="getStatusClass(status.name)">
                            <i :class="status.icon"></i>
                            <p>{{ status.name }}</p>
                            <small v-if="getStatusDate(status.name)">{{ getStatusDate(status.name) }}</small>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="order-status">
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
                            <button class="btn btn-primary" :disabled="cannotEdit" :class="{ 'disabled': cannotEdit }"
                                @click="addProduct">
                                Thêm sản phẩm
                            </button>
                            <table class="table-custom">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
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
                                        <td>{{ formatCurrency(item.don_gia) }} VNĐ</td>
                                        <td>{{ item.so_luong || 0 }}</td>
                                        <td>{{ formatCurrency(item.don_gia * item.so_luong) }} VNĐ</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="total-section">
                                <p>Tổng tạm: {{ formatCurrency(store.hoaDonDetail.tong_tien_truoc_giam) }} VNĐ</p>
                                <!-- <p>Giảm giá: {{ formatCurrency((store.hoaDonDetail.tong_tien_truoc_giam || 0) - (store.hoaDonDetail.tong_tien_sau_giam || 0)) }} VNĐ</p> -->
                                <p>Giảm giá: - 0 VNĐ</p>
                                <p>Phí vận chuyển: +{{ formatCurrency(store.hoaDonDetail.phi_van_chuyen) }} VNĐ</p>
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

const getStatusClass = (status) => {
    const currentStatus = store.hoaDonDetail?.trang_thai;
    if (!currentStatus) return '';

    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        if (currentStatus === 'Đã hủy' && status === 'Đã hủy') {
            return 'text-danger';
        }
        if ((currentStatus === 'Chờ xác nhận' && status === 'Chờ xác nhận') ||
            (currentStatus === 'Hoàn thành' && status === 'Hoàn thành')) {
            return 'text-success';
        }
        return '';
    }

    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Giao hàng') {
        if (currentStatus === 'Đã hủy' && status === 'Đã hủy') {
            return 'text-danger';
        }
        const statusOrder = {
            'Chờ xác nhận': 1,
            'Đã xác nhận': 2,
            'Đã cập nhật': 3,
            'Đang giao': 4,
            'Đã nhận hàng': 5,
            'Hoàn thành': 6
        };
        const currentStep = statusOrder[currentStatus] || 0;
        const thisStep = defaultStatusSteps.findIndex(s => s.name === status) + 1;

        if (currentStatus === 'Hoàn thành' && (status === 'Đã nhận hàng' || status === 'Hoàn thành')) {
            return 'text-success';
        }
        if (currentStatus === 'Đang giao' && status === 'Đã giao cho ĐVVC') {
            return 'text-success';
        }
        if (currentStatus === 'Đã xác nhận' && status === 'Đã xác nhận') {
            return 'text-success';
        }
        if (currentStatus === 'Chờ xác nhận' && status === 'Đơn hàng đã đặt') {
            return 'text-success';
        }
        if (currentStep >= thisStep && currentStatus !== 'Đã hủy' && status !== 'Đã cập nhật') {
            return 'text-success';
        }
        return '';
    }
    return '';
};

const getStatusDate = (status) => {
    // Lấy trạng thái hiện tại của đơn hàng
    const currentStatus = store.hoaDonDetail?.trang_thai;
    if (!currentStatus) return '';
    // Định nghĩa thứ tự trạng thái
    const statusOrder = {
        'Chờ xác nhận': 1,
        'Đã xác nhận': 2,
        'Đã cập nhật': 3,
        'Đang giao': 4,
        'Đã nhận hàng': 5,
        'Hoàn thành': 6,
        'Đã hủy': -1 // Trạng thái hủy không thuộc luồng chính
    };
    // Lấy thứ tự của trạng thái hiện tại
    const currentStep = statusOrder[currentStatus] || 0;
    // Lấy thứ tự của trạng thái đang xét
    const statusIndex = store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng'
        ? storePickupStatusSteps.findIndex(s => s.name === status)
        : defaultStatusSteps.findIndex(s => s.name === status);
    const thisStep = statusIndex + 1;
    // Nếu trạng thái hiện tại chưa đạt đến trạng thái đang xét, không hiển thị thời gian
    if (currentStep < thisStep && currentStatus !== 'Đã hủy') {
        return '';
    }
    // Trường hợp 1: Nếu là "Nhận tại cửa hàng" và trạng thái là "Chờ xác nhận"
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng' && status === 'Chờ xác nhận') {
        return formatDate(store.hoaDonDetail.ngay_tao);
    }
    // Trường hợp 2: Nếu là "Giao hàng" và trạng thái là "Đơn hàng đã đặt"
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Giao hàng' && status === 'Đơn hàng đã đặt') {
        return formatDate(store.hoaDonDetail.ngay_tao);
    }
    // Trường hợp 3: Lấy backendStatus tương ứng với trạng thái
    const backendStatus = (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng'
        ? storePickupStatusSteps.find(s => s.name === status)?.backendStatus
        : defaultStatusSteps.find(s => s.name === status)?.backendStatus);
    // Trường hợp 4: Nếu trạng thái là "Đã nhận hàng" và phương thức là "Giao hàng"
    if (status === 'Đã nhận hàng' && store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Giao hàng') {
        const history = store.trangThaiHistory.find(h => h.trang_thai === 'Hoàn thành');
        return history?.ngay_chuyen_formatted || ''; // Không trả về ngày tạo nếu chưa có lịch sử
    }
    // Trường hợp 5: Tìm trong lịch sử trạng thái
    const history = store.trangThaiHistory.find(h => h.trang_thai === backendStatus);
    return history?.ngay_chuyen_formatted || '';
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

const addProduct = () => {
    if (confirm('Bạn có muốn thêm sản phẩm vào đơn hàng này không?')) {
        // Logic thêm sản phẩm sẽ được thêm sau
        console.log('Thêm sản phẩm vào đơn hàng');
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

const editCustomerInfo = () => {
    startEditingCustomer();
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

// Các hàm khác giữ nguyên...
const editNote = () => {
    startEditingNote();
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
    justify-content: center;
    gap: 20px;
    margin-bottom: 10px;
}

.status-icon {
    text-align: center;
    font-size: 14px;
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

.info-box .btn {
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
</style>