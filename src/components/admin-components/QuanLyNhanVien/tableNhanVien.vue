<template>
  <div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between">
    <div class="me-3">
        <span class="fw-bold me-2">Trạng thái:</span>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="status" id="active" value="active">
            <label class="form-check-label" for="active">Đang hoạt động</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="status" id="inactive" value="inactive">
            <label class="form-check-label" for="inactive">Đã nghỉ việc</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="status" id="refresh" value="refresh">
            <label class="form-check-label" for="refresh">Làm mới</label>
        </div>
    </div>
    <button class="btn btn-primary" @click="router.push('/admin/quanlynhanvien/add')">Tạo tài khoản</button>
</div>


    <div class="card p-3 border-0" >
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
            <h5 class="fw-bold text-primary mb-0">📋 Danh sách nhân viên</h5>
            <div class="d-flex align-items-center">
                <label for="limitSelect" class="me-2 fw-medium text-muted mb-0">Hiển thị:</label>
                <select id="limitSelect" class="form-select form-select-sm w-auto">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    </div>


<div class="table-responsive mt-4">
    <table class="table table-bordered table-hover">
      <thead>
        <tr class="table-secondary">
          <th scope="col">#</th>
          <th scope="col">Mã nhân viên</th>
          <th scope="col">Tên nhân viên </th>
          <th scope="col">Giới tính</th>
          <th scope="col">Ngày sinh</th>
          <th scope="col">Số điện thoại</th>
          <th scope="col">Địa chỉ</th>
          <th scope="col">Email</th>
          <th scope="col">Trạng thái</th>
          <th scope="col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nhanVien, index) in store.getAllNhanVienArr" :key="nhanVien.idNhanVien">
          <td>{{ index + 1 }}</td>
          <td>{{ nhanVien.maNhanVien }}</td>
          <td>{{ nhanVien.tenNhanVien }}</td>
          <td>{{ nhanVien.gioiTinh }}</td>
          <td>{{ nhanVien.ngaySinh }}</td>
          <td>{{ nhanVien.soDienThoai }}</td>
          <td>{{ nhanVien.diaChiLienHe }}</td>
          <td>{{ nhanVien.email }}</td>
          <td>
      <a-switch :checked="nhanVien.trangThai == 'Đang hoạt động'? true : false" />
          </td>
          <td>
            <button class="btn btn-outline-danger btn-sm">
                    <i class="fas fa-edit me-1"></i>Sửa
                  </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup>
 import { ref, onMounted } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useGbStore();
// Mounted hook
onMounted(() => {
  store.getAllNhanVien();

});
</script>
<style scoped></style>