<template>
    <div class="container-fluid">
        <!-- Phần lọc trạng thái -->
        <div class="d-flex align-items-center justify-content-between">
            <div class="me-3">
                <span class="fw-bold me-2" style="font-size: 16px;">Trạng thái:</span>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="trangThai" id="active" value="Đang hoạt động"
                        v-model="selectedTrangThai">
                    <label class="form-check-label" for="active">Đang hoạt động</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="trangThai" id="inactive" value="Ngừng hoạt động"
                        v-model="selectedTrangThai">
                    <label class="form-check-label" for="inactive">Ngừng hoạt động</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="trangThai" id="all" value=""
                        v-model="selectedTrangThai">
                    <label class="form-check-label" for="all">Tất cả</label>
                </div>
            </div>
        </div>

        <!-- Card chứa tiêu đề và select số lượng hiển thị -->
        <div class="card p-3 border-0">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
                <h5 class="fw-bold mb-0">📋 Danh sách khách hàng</h5>
                <div class="d-flex align-items-center">
                    <label for="limitSelect" class="me-2 fw-medium text-muted mb-0">Hiển thị:</label>
                    <select id="limitSelect" class="form-select form-select-sm w-auto" v-model="pageSize">
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- Hiển thị thông báo khi không có dữ liệu -->
        <div v-if="danhSachKhachHang.length === 0" class="text-center py-4">
                <a-empty :image="simpleImage" />

        </div>
        <div v-else>
            <!-- Bảng danh sách khách hàng -->
            <div class="table-responsive mt-4">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Mã KH</th>
                            <th scope="col">Tên khách hàng</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Email</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(khachHang, index) in danhSachKhachHang" :key="khachHang.idKhachHang">
                            <td>{{ index + 1 }}</td>
                            <td>{{ khachHang.maKhachHang }}</td>
                            <td>{{ khachHang.tenKhachHang }}</td>
                            <td>{{ khachHang.soDienThoai }}</td>
                            <td>{{ khachHang.email }}</td>
                            <td>{{ diaChiMap[khachHang.idKhachHang] }}</td>
                            <td>
                                <a-switch :checked="khachHang.trangThai === 'Đang hoạt động'" :style="{
                                    backgroundColor: khachHang.trangThai === 'Đang hoạt động' ? '#f33b47' : '#ccc'
                                }" @click="chuyenTrangThai(khachHang.idKhachHang)" />
                            </td>
                            <td>
                                <button class="btn btn-outline-primary btn-sm me-2">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Phân trang -->
            <div class="d-flex justify-content-center align-items-center mt-3">
                <button class="btn buttonPT p-0" @click="fetchData(currentPage - 1)" :disabled="currentPage === 0">
                    Previous
                </button>
                <span class="mx-2">Trang {{ currentPage + 1 }} / {{ totalPages }}</span>
                <button class="btn buttonPT" @click="fetchData(currentPage + 1)"
                    :disabled="currentPage >= totalPages - 1">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { toast } from 'vue3-toastify';
import { Empty } from 'ant-design-vue';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
// Khai báo biến
const store = useGbStore();
const pageSize = ref(3);
const selectedTrangThai = ref('');

// Computed properties để lấy dữ liệu từ store
const danhSachKhachHang = computed(() => store.getAllKhachHangArr);
const currentPage = computed(() => store.currentKhachHang);
const totalPages = computed(() => store.totalKhachHang);
const diaChiMap = computed(() => store.diaChiMap);
// Hàm lấy dữ liệu
const fetchData = async (page) => {
    try {
        if (page < 0 || (totalPages.value > 0 && page >= totalPages.value)) return;

        // Chỉ cần gọi một hàm getAllKhachHang
        await store.getAllKhachHang(
            page,
            pageSize.value,
            store.searchs,
            selectedTrangThai.value
        );
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu', {
            autoClose: 3000,
            position: "top-right"
        });
    }
};
// Watch changes
watch(() => store.searchs, (newVal, oldVal) => {
    // Chỉ gọi khi giá trị thực sự thay đổi
    if (newVal !== oldVal) {
        store.currentKhachHang = 0;
        fetchData(0);
    }
});

watch(selectedTrangThai, (newVal, oldVal) => {
    // Chỉ gọi khi giá trị thực sự thay đổi
    if (newVal !== oldVal) {
        store.currentKhachHang = 0;
        fetchData(0);
    }
});

// Bỏ watch pageSize nếu không cần thiết
watch(pageSize, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        store.currentKhachHang = 0;
        fetchData(0);
    }
});

// Mounted
onMounted(() => {
    // Chỉ gọi một lần khi component được mount
    fetchData(0);
});
</script>

<style scoped>
.table {
    --bs-table-hover-bg: rgba(0, 0, 0, 0.05);
}

.badge {
    font-size: 0.85em;
    padding: 0.35em 0.65em;
}

.btn-outline-primary {
    --bs-btn-hover-bg: #0d6efd;
    --bs-btn-hover-color: #fff;
}

/* Ẩn radio mặc định */
.form-check-input {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid #f33b47;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    background-color: white;
}

/* Khi chọn radio thì hiển thị dấu chấm đỏ bên trong */
.form-check-input:checked::before {
    content: "";
    width: 8px;
    height: 8px;
    background-color: #f33b47;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.form-check-input:focus {
    box-shadow: none;
    outline: none;
}

.form-check-input:focus-visible {
    box-shadow: none;
    outline: none;
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
</style>