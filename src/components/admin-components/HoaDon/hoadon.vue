<template>
    <div class="container">
        <div class="d-flex justify-content-start align-items-center pb-2">
            <a-select class="mb-2" v-model:value="valueTrangThaiDonHang" show-search
                placeholder="Chọn trạng thái đơn hàng" style="width: 210px" :options="trangThaiDonHangOptions"
                :filter-option="filterOption" @change="handleTrangThaiChange"></a-select>
            <button class="btn btn-outline-danger d-flex align-items-center ms-2 mb-2" style="height: 32px"
                @click="resetFilters">Làm mới</button>
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
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Mã hoá đơn</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col">Tổng tiền(VNĐ)</th>
                        <th scope="col">Phương thức thanh toán</th>
                        <th scope="col">Trạng thái thanh toán</th>
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
                        <td>{{ hoaDon.trang_thai_thanh_toan }}</td>
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
            </table>
        </div>

        <button class="btn buttonPT p-0" @click="fetchData(store.currentHoaDon - 1)"
            :disabled="store.currentHoaDon === 0">Previous</button>
        <span class="mx-3">Trang {{ store.currentHoaDon + 1 }} / {{ store.totalHoaDon }}</span>
        <button class="btn buttonPT" @click="fetchData(store.currentHoaDon + 1)"
            :disabled="store.currentHoaDon >= store.totalHoaDon - 1">Next</button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
    { label: 'Đã xác nhận', value: 'Đã xác nhận' },
    { label: 'Đã cập nhật', value: 'Đã cập nhật' },
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
const fetchData = (page) => {
    store.getAllHoaDon(page, pageSize.value);
};
const handleTrangThaiChange = (value) => {
    if (value === 'Chọn trạng thái đơn hàng') {
        fetchData(0);
    } else {
        store.filterByTrangThai(value, 0, pageSize.value);
    }
};

const filterData = () => {
    const [tuNgay, denNgay] = formState['range-time-picker'] || [];
    if (!tuNgay || !denNgay) {
        toast.warning('Vui lòng chọn đầy đủ khoảng thời gian!')
        return; // Không gọi filter nếu thiếu ngày
    }
    store.filterByDate(tuNgay, denNgay, 0, pageSize.value);
};

const resetFilters = () => {
    valueTrangThaiDonHang.value = 'Chọn trạng thái đơn hàng';
    formState['range-time-picker'] = [];
    fetchData(0);
};
onMounted(() => {
    fetchData(0);
})
</script>

<style scoped>
.table {
    --bs-table-hover-bg: rgb(183 183 183 / 8%);
}
</style>