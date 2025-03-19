<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between">
      <div class="me-3">
        <span class="fw-bold me-2" style="font-size: 16px;">Trạng thái:</span>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="trangThai" id="active" value="Đang hoạt động"
            v-model="selectedTrangThai" @change="fetchData(0)">
          <label class="form-check-label" for="active">Đang hoạt động</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="trangThai" id="inactive" value="Đã nghỉ việc"
            v-model="selectedTrangThai" @change="fetchData(0)">
          <label class="form-check-label" for="inactive">Đã nghỉ việc</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="trangThai" id="refresh" value=""
            v-model="selectedTrangThai" @change="fetchData(0)">
          <label class="form-check-label" for="refresh">Tất cả</label>
        </div>
      </div>
      <button class="btn buttonADD" @click="router.push('/admin/quanlynhanvien/add')">+ Tạo tài khoản</button>
    </div>


    <div class="card p-3 border-0">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h5 class="fw-bold mb-0" style="color: #f33b47;">📋 Danh sách nhân viên</h5>
        <div class="d-flex align-items-center">
          <label for="limitSelect" class="me-2 fw-medium text-muted mb-0">Hiển thị:</label>
          <select id="limitSelect" class="form-select form-select-sm w-auto" v-model="pageSize">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </div>


    <div class="table-responsive mt-4">
      <table class="table table-hover">
        <thead>
          <tr class="">
            <th scope="col">#</th>
            <th scope="col">Ảnh</th>
            <th scope="col">Mã nhân viên</th>
            <th scope="col">Tên nhân viên </th>
            <th scope="col">Giới tính</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col">SĐT</th>
            <th scope="col">Địa chỉ</th>
            <th scope="col">Email</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(nhanVien, index) in store.getAllNhanVienArr" :key="nhanVien.idNhanVien">
            <td>{{ index + 1 }}</td>
            <td>
              <a-image :width="75"
                :src="nhanVien.anhNhanVien" />

            </td>
            <td>{{ nhanVien.maNhanVien }}</td>
            <td>{{ nhanVien.tenNhanVien }}</td>
            <td>{{ nhanVien.gioiTinh ? "Nam" : "Nữ" }}</td>
            <td>{{ nhanVien.ngaySinh }}</td>
            <td>{{ nhanVien.soDienThoai }}</td>
            <td>{{ nhanVien.diaChiLienHe }}</td>
            <td>{{ nhanVien.email }}</td>
            <td>
              <a-switch :checked="nhanVien.trangThai == 'Đang hoạt động' ? true : false"
                :style="{ backgroundColor: nhanVien.trangThai === 'Đang hoạt động' ? '#f33b47' : '#ccc' }"
                @click="chuyenTrangThai(nhanVien.idNhanVien)" />
            </td>
            <td>
              <button class="btn btn-outline-danger btn-sm" @click="router.push(`/admin/quanlynhanvien/update/${nhanVien.idNhanVien}`)">
                <i class="fas fa-edit me-1"></i>Sửa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="btn buttonPT p-0" @click="fetchData(store.currentPage - 1)"
      :disabled="store.currentPage === 0">Previous</button>
    <span class="mx-3">Trang {{ store.currentPage + 1 }} / {{ store.totalPages }}</span>
    <button class="btn buttonPT" @click="fetchData(store.currentPage + 1)"
      :disabled="store.currentPage >= store.totalPages - 1">Next</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { useRouter } from 'vue-router';
// Khởi tạo router và store
const router = useRouter();
const store = useGbStore();
const pageSize = ref(5);
const selectedTrangThai = ref('');

// const fetchData = (page) => {
//   if (page >= 0 && page < store.totalPages) {
//     store.getAllNhanVien(page, pageSize.value);
//   }
// };
const fetchData = (page = 0) => {
  if (page < 0 || page >= store.totalPages) return;

  store.currentPage = page; // Cập nhật trang hiện tại

  if (selectedTrangThai.value) {
    store.getNhanVienLocTrangThai(page, pageSize.value, selectedTrangThai.value);
  } else {
    store.getAllNhanVien(page, pageSize.value);
  }
};
//Lọc theo trạng thái
// Hàm gọi API lấy dữ liệu nhân viên theo trạng thái
const fetchNhanVien = (page) => {
  if (page >= 0 && page < store.totalPages) {
    store.getNhanVienLocTrangThai(page, pageSize.value, selectedTrangThai.value);
  }
};
//Chuyểnn trạng thái
// const checked = ref(false);
const chuyenTrangThai = (id) => {
  store.changeTrangThai(id)
  console.log(id);
}

// Mounted hook
onMounted(() => {
  store.getAllNhanVien(0, pageSize.value);
  fetchNhanVien();

});
watch(pageSize, (newSize) => {
  //   store.currentPage = 0; // Reset về trang đầu tiên

  // if (selectedTrangThai.value) {
  //   store.getNhanVienLocTrangThai(0, newSize, selectedTrangThai.value);
  // } else {
  //   store.getAllNhanVien(0, newSize);
  // }
  fetchData(0);
});

// Theo dõi thay đổi của selectedStatus để lọc danh sách theo trạng thái
watch([selectedTrangThai, pageSize], () => {
  fetchNhanVien(0);
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

.buttonADD {
  background-color: #d02c39;
  color: white;
  font-weight: bold;
}

.buttonADD:hover {
  background-color: #f33b47;
  color: white;
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
</style>