<template>
    <div class="container">
        <div class="d-flex justify-content-start align-items-center pb-2">
            <a-form-item name="range-time-picker" label="Thời gian" class="mb-2 ms-4">
                <a-range-picker v-model:value="formState['range-time-picker']" show-time format="DD-MM-YYYY HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" :placeholder="['Chọn ngày bắt đầu', 'Chọn ngày kết thúc']" />
            </a-form-item>
            <button class="btn btn-outline-primary d-flex align-items-center ms-2 mb-2" style="height: 32px"
                @click="filterData">Lọc</button>
        </div>

        <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
            <h5 class="fw-bold mb-0" style="color: #f33b47;">📋 Danh sách đơn hàng</h5>
            <div class="d-flex align-items-center">
                <label for="limitSelect" class="me-2 fw-medium text-muted mb-0">Hiển thị:</label>
                <select id="limitSelect" class="form-select form-select-sm w-auto" v-model="pageSize"
                    @change="fetchData(0)">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>

        <div class="table-responsive mt-4">
            <!-- Dải trạng thái ngang -->
            <div class="d-flex flex-wrap gap-2 mt-2 status-strip">
                <a-badge :count="totalHoaDonCount" :overflow-count="999">
                    <button class="btn d-flex align-items-center flex-fill" :class="{
                        'btn-primary': valueTrangThaiDonHang === 'Chọn trạng thái đơn hàng',
                        'btn-outline-primary': valueTrangThaiDonHang !== 'Chọn trạng thái đơn hàng',
                    }" @click="handleTrangThaiChange('Chọn trạng thái đơn hàng')">
                        Tất cả
                    </button>
                </a-badge>
                <a-badge v-for="option in trangThaiDonHangOptions" :key="option.value"
                    :count="countByTrangThai[option.value] || 0" :overflow-count="999">
                    <button class="btn d-flex align-items-center flex-fill" :class="{
                        'btn-primary': valueTrangThaiDonHang === option.value,
                        'btn-outline-primary': valueTrangThaiDonHang !== option.value,
                    }" @click="handleTrangThaiChange(option.value)">
                        {{ option.label }}
                    </button>
                </a-badge>
            </div>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Mã hoá đơn</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col">Tổng tiền(VNĐ)</th>
                        <th scope="col">Phương thức thanh toán</th>
                        <th scope="col">Trạng thái hóa đơn</th>
                        <th scope="col">Hình thức nhận hàng</th>
                        <th scope="col">Loại hóa đơn</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(hoaDon, index) in store.getAllHoaDonArr" :key="hoaDon.id_hoa_don">
                        <td>{{ index + 1 }}</td>
                        <td>{{ hoaDon.ma_hoa_don }}</td>
                        <td>
                            {{ hoaDon.ho_ten }} <br>
                            {{ hoaDon.sdt_nguoi_nhan }} <br>
                            {{ hoaDon.dia_chi }}
                        </td>
                        <td>{{ formatCurrency(hoaDon.tong_tien_sau_giam) }}</td>
                        <td>{{ hoaDon.hinh_thuc_thanh_toan }}</td>
                        <td>{{ hoaDon.trang_thai }}</td>
                        <td>{{ hoaDon.phuong_thuc_nhan_hang }}</td>
                        <td>{{ hoaDon.loai_hoa_don }}</td>
                        <td>
                            <button class="btn d-flex align-items-center shadow-sm"
                                @click="router.push(`/admin/hoadon/hdct/${hoaDon.ma_hoa_don}`)">
                                <i class="bi bi-eye" style="color: #f33b47;"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr v-if="!store.getAllHoaDonArr || store.getAllHoaDonArr.length === 0">
                        <td colspan="9" class="text-center">Không tìm thấy hóa đơn</td>
                    </tr>
                    <tr v-else v-for="(hoaDon, index) in store.getAllHoaDonArr" :key="hoaDon.id_hoa_don">
                        <!-- Nội dung hiện tại -->
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-center align-items-center mt-3">
            <button class="btn buttonPT p-0" @click="fetchData(store.currentHoaDon - 1)"
                :disabled="store.currentHoaDon === 0">Previous</button>
            <span class="mx-3">Trang {{ store.currentHoaDon + 1 }} / {{ store.totalHoaDon }}</span>
            <button class="btn buttonPT" @click="fetchData(store.currentHoaDon + 1)"
                :disabled="store.currentHoaDon >= store.totalHoaDon - 1">Next</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { toast } from 'vue3-toastify';

const router = useRouter();
const store = useGbStore();
const pageSize = ref(5);
const valueTrangThaiDonHang = ref('Chọn trạng thái đơn hàng');
const trangThaiDonHangOptions = ref([
    { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
    { label: 'Đã cập nhật', value: 'Đã cập nhật' },
    { label: 'Đã xác nhận', value: 'Đã xác nhận' },
    { label: 'Chờ đóng gói', value: 'Chờ đóng gói' },
    { label: 'Đang giao', value: 'Đang giao' },
    { label: 'Hoàn thành', value: 'Hoàn thành' },
    { label: 'Đã hủy', value: 'Đã hủy' }
]);
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const formState = reactive({
    'range-time-picker': []
});
const onFinish = values => {
    console.log('Success:', values, formState);
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm ' VNĐ' nếu cần
};

const countByTrangThai = ref({});

const totalHoaDonCount = computed(() => {
    return Object.values(countByTrangThai.value).reduce((sum, count) => sum + count, 0);
});

const calculateCounts = async () => {
    try {
        const countsFromServer = await store.getHoaDonCountsByStatus();
        countByTrangThai.value = countsFromServer;
        console.log('Số lượng theo trạng thái:', countByTrangThai.value);
    } catch (error) {
        console.error('Lỗi khi tính số lượng:', error);
        trangThaiDonHangOptions.value.forEach(option => {
            countByTrangThai.value[option.value] = 0;
        });
    }
};

const fetchData = async (page) => {
    await store.getAllHoaDon(page, pageSize.value);
    await calculateCounts();
};

const handleTrangThaiChange = async (value) => {
    console.log(`Trạng thái đã chọn: ${value}, Số lượng: ${countByTrangThai.value[value] || 0}`);
    valueTrangThaiDonHang.value = value;
    if (value === 'Chọn trạng thái đơn hàng') {
        await fetchData(0);
    } else {
        await store.filterByTrangThai(value, 0, pageSize.value);
        await calculateCounts();
    }
};

const filterData = async () => {
    const [tuNgay, denNgay] = formState['range-time-picker'] || [];
    if (!tuNgay || !denNgay) {
        toast.warning('Vui lòng chọn đầy đủ khoảng thời gian!');
        return;
    }
    await store.filterByDate(tuNgay, denNgay, 0, pageSize.value);
    await calculateCounts();
};

const resetFilters = async () => {
    valueTrangThaiDonHang.value = 'Chọn trạng thái đơn hàng';
    formState['range-time-picker'] = [];
    await fetchData(0);
};

onMounted(async () => {
    await fetchData(0);
});
</script>

<style scoped>
.table {
    --bs-table-hover-bg: rgb(183 183 183 / 8%);
}

.buttonPT {
    background-color: transparent;
    text-align: center;
    color: #d02c39;
    border: 2px solid #f33b47;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    width: 70px;
    height: 40px;
    font-size: 14px;
    font-weight: bold;
}

.buttonPT:hover {
    background-color: #f33b47;
    color: white;
}

/* Style cho dải trạng thái */
.status-strip {
    width: 100%;
    /* Chiều rộng bằng với bảng */
    display: flex;
    flex-wrap: nowrap;
    /* Không xuống dòng, tất cả trạng thái nằm trên 1 hàng */
    gap: 8px;
    /* Khoảng cách giữa các nút */
    overflow-x: auto;
    /* Nếu có quá nhiều trạng thái, cho phép cuộn ngang */
}

/* Style cho các nút trạng thái */
.status-strip .btn {
    flex: 1;
    /* Chia đều chiều rộng */
    min-width: 145px;
    /* Đảm bảo nút không quá nhỏ */
    height: 32px;
    font-size: 14px;
    white-space: nowrap;
    /* Không xuống dòng trong nút */
    justify-content: center;
    /* Căn giữa nội dung trong nút */
}

/* Tùy chỉnh a-badge */
.ant-badge {
    display: flex;
    align-items: center;
}

.ant-badge-count {
    font-size: 12px;
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    background-color: #f33b47;
    /* Đảm bảo màu đỏ */
    color: white;
}
</style>