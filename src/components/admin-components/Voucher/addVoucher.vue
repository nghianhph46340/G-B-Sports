<!-- src/views/admin/Voucher/AddVoucher.vue -->
<template>
  <div class="container-fluid">
    <h3 class="fw-bold mb-4" style="color: #f33b47;">Thêm Voucher</h3>
    <form @submit.prevent="submitForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label for="maVoucher" class="form-label">Mã Voucher</label>
          <input type="text" class="form-control" id="maVoucher" v-model="voucher.maVoucher" required
                 :class="{ 'is-invalid': errors.maVoucher }" @input="validateMaVoucher">
          <div class="text-danger" v-if="errors.maVoucher">{{ errors.maVoucher }}</div>
        </div>
        <div class="col-md-6">
          <label for="tenVoucher" class="form-label">Tên Voucher</label>
          <input type="text" class="form-control" id="tenVoucher" v-model="voucher.tenVoucher" required
                 :class="{ 'is-invalid': errors.tenVoucher }" @input="validateTenVoucher">
          <div class="text-danger" v-if="errors.tenVoucher">{{ errors.tenVoucher }}</div>
        </div>
        <div class="col-md-6">
          <label for="kieuGiamGia" class="form-label">Kiểu giảm giá</label>
          <select class="form-select" id="kieuGiamGia" v-model="voucher.kieuGiamGia" required
                  :class="{ 'is-invalid': errors.kieuGiamGia }" @change="validateKieuGiamGia">
            <option value="" disabled>Chọn kiểu giảm giá</option>
            <option value="Phần trăm">Phần trăm</option>
            <option value="Tiền mặt">Tiền mặt</option>
          </select>
          <div class="text-danger" v-if="errors.kieuGiamGia">{{ errors.kieuGiamGia }}</div>
        </div>
        <div class="col-md-6">
          <label for="giaTriGiam" class="form-label">Giá trị giảm</label>
          <input type="number" class="form-control" id="giaTriGiam" v-model="voucher.giaTriGiam" min="0" step="1" required
                 :class="{ 'is-invalid': errors.giaTriGiam }" @input="validateGiaTriGiam">
          <div class="text-danger" v-if="errors.giaTriGiam">{{ errors.giaTriGiam }}</div>
        </div>
        <div class="col-md-6">
          <label for="giaTriToiThieu" class="form-label">Giá trị tối thiểu</label>
          <input type="number" class="form-control" id="giaTriToiThieu" v-model="voucher.giaTriToiThieu" min="0" step="1"
                 :class="{ 'is-invalid': errors.giaTriToiThieu }" @input="validateGiaTriToiThieu">
          <div class="text-danger" v-if="errors.giaTriToiThieu">{{ errors.giaTriToiThieu }}</div>
        </div>
        <div class="col-md-6">
          <label for="soLuong" class="form-label">Số lượng</label>
          <input type="number" class="form-control" id="soLuong" v-model="voucher.soLuong" min="0" step="1" required
                 :class="{ 'is-invalid': errors.soLuong }" @input="validateSoLuong">
          <div class="text-danger" v-if="errors.soLuong">{{ errors.soLuong }}</div>
        </div>
        <div class="col-md-6">
          <label for="giaTriToiDa" class="form-label">Giá trị tối đa</label>
          <input type="number" class="form-control" id="giaTriToiDa" v-model="voucher.giaTriToiDa" min="0" step="1" required
                 :disabled="voucher.kieuGiamGia === 'Tiền mặt'" :class="{ 'is-invalid': errors.giaTriToiDa }" @input="validateGiaTriToiDa">
          <div class="text-danger" v-if="errors.giaTriToiDa">{{ errors.giaTriToiDa }}</div>
        </div>
        <div class="col-md-6">
          <label for="ngayBatDau" class="form-label">Ngày bắt đầu</label>
          <input type="datetime-local" class="form-control" id="ngayBatDau" v-model="voucher.ngayBatDau" required
                 :class="{ 'is-invalid': errors.ngayBatDau }" @input="validateDates">
          <div class="text-danger" v-if="errors.ngayBatDau">{{ errors.ngayBatDau }}</div>
        </div>
        <div class="col-md-6">
          <label for="ngayHetHan" class="form-label">Ngày kết thúc</label>
          <input type="datetime-local" class="form-control" id="ngayHetHan" v-model="voucher.ngayHetHan" required
                 :class="{ 'is-invalid': errors.ngayHetHan }" @input="validateDates">
          <div class="text-danger" v-if="errors.ngayHetHan">{{ errors.ngayHetHan }}</div>
        </div>
        <div class="col-md-6">
          <label for="moTa" class="form-label">Mô tả</label>
          <textarea class="form-control" id="moTa" v-model="voucher.moTa" rows="3"></textarea>
        </div>
        <div class="col-12 mt-5">
          <div class="d-flex justify-content-center gap-3">
            <button type="submit" class="btn btn-primary" :disabled="hasErrors">Lưu</button>
            <button type="button" class="btn btn-secondary" @click="router.push('/admin/quanlyvoucher')">Quay lại</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGbStore } from '@/stores/gbStore';
import { toast } from 'vue3-toastify';

const router = useRouter();
const store = useGbStore();

const voucher = ref({
maVoucher: '',
tenVoucher: '',
giaTriGiam: null,
giaTriToiThieu: null,
soLuong: null,
kieuGiamGia: '',
giaTriToiDa: null,
ngayBatDau: null,
ngayHetHan: null,
moTa: '',
});

const errors = ref({
maVoucher: '',
tenVoucher: '',
giaTriGiam: '',
giaTriToiThieu: '',
soLuong: '',
kieuGiamGia: '',
giaTriToiDa: '',
ngayBatDau: '',
ngayHetHan: '',
});

const validateMaVoucher = () => {
if (!voucher.value.maVoucher || voucher.value.maVoucher.trim() === '') {
  errors.value.maVoucher = 'Mã voucher không được để trống!';
} else {
  errors.value.maVoucher = '';
}
};

const validateTenVoucher = () => {
if (!voucher.value.tenVoucher || voucher.value.tenVoucher.trim() === '') {
  errors.value.tenVoucher = 'Tên voucher không được để trống!';
} else {
  errors.value.tenVoucher = '';
}
};

const validateGiaTriGiam = () => {
const giaTri = parseFloat(voucher.value.giaTriGiam) || 0;
if (!voucher.value.giaTriGiam || giaTri <= 0) {
  errors.value.giaTriGiam = 'Giá trị giảm phải lớn hơn 0!';
} else if (giaTri > 5000000) {
  errors.value.giaTriGiam = 'Giá trị giảm không được lớn hơn 5,000,000!';
} else if (voucher.value.kieuGiamGia === 'Phần trăm' && giaTri > 100) {
  errors.value.giaTriGiam = 'Giá trị giảm không được vượt quá 100 khi chọn Phần trăm!';
} else {
  errors.value.giaTriGiam = '';
}

if (voucher.value.kieuGiamGia === 'Tiền mặt') {
  voucher.value.giaTriToiDa = giaTri;
  validateGiaTriToiDa();
}
};

const validateGiaTriToiThieu = () => {
const giaTri = parseFloat(voucher.value.giaTriToiThieu) || 0;
if (giaTri < 0) {
  errors.value.giaTriToiThieu = 'Giá trị tối thiểu không được nhỏ hơn 0!';
} else if (giaTri > 5000000) {
  errors.value.giaTriToiThieu = 'Giá trị tối thiểu không được lớn hơn 5,000,000!';
} else {
  errors.value.giaTriToiThieu = '';
}
};

const validateSoLuong = () => {
const soLuong = parseInt(voucher.value.soLuong) || 0;
if (!voucher.value.soLuong || soLuong < 0) {
  errors.value.soLuong = 'Số lượng không được nhỏ hơn 0!';
} else if (soLuong > 5000000) {
  errors.value.soLuong = 'Số lượng không được lớn hơn 5,000,000!';
} else {
  errors.value.soLuong = '';
}
};

const validateGiaTriToiDa = () => {
const giaTri = parseFloat(voucher.value.giaTriToiDa) || 0;
if (giaTri < 0) {
  errors.value.giaTriToiDa = 'Giá trị tối đa không được nhỏ hơn 0!';
} else if (giaTri > 5000000) {
  errors.value.giaTriToiDa = 'Giá trị tối đa không được lớn hơn 5,000,000!';
} else {
  errors.value.giaTriToiDa = '';
}
};

const validateKieuGiamGia = () => {
if (!voucher.value.kieuGiamGia || voucher.value.kieuGiamGia.trim() === '') {
  errors.value.kieuGiamGia = 'Kiểu giảm giá không được để trống!';
} else {
  errors.value.kieuGiamGia = '';
  validateGiaTriGiam();
}
};

const validateDates = () => {
if (!voucher.value.ngayBatDau) {
  errors.value.ngayBatDau = 'Ngày bắt đầu không được để trống!';
} else {
  errors.value.ngayBatDau = '';
}

if (!voucher.value.ngayHetHan) {
  errors.value.ngayHetHan = 'Ngày kết thúc không được để trống!';
} else if (voucher.value.ngayBatDau && new Date(voucher.value.ngayHetHan) < new Date(voucher.value.ngayBatDau)) {
  errors.value.ngayHetHan = 'Ngày kết thúc phải sau ngày bắt đầu!';
} else {
  errors.value.ngayHetHan = '';
}
};

const hasErrors = computed(() => {
return Object.values(errors.value).some(error => error !== '');
});

const submitForm = async () => {
validateMaVoucher();
validateTenVoucher();
validateGiaTriGiam();
validateGiaTriToiThieu();
validateSoLuong();
validateKieuGiamGia();
validateGiaTriToiDa();
validateDates();

if (hasErrors.value) {
  toast.error('Vui lòng sửa các lỗi trước khi lưu!', { autoClose: 1000 });
  return;
}

try {
  const response = await store.addVoucher(voucher.value);
  if (response === 'Thêm voucher thành công!') {
    toast.success(response, {
      autoClose: 1000,
      onClose: () => router.push('/admin/quanlyvoucher'),
    });
  } else {
    toast.error(response, { autoClose: 1000 });
  }
} catch (error) {
  console.error('Lỗi khi thêm voucher:', error);
  toast.error('Có lỗi xảy ra khi thêm voucher', { autoClose: 1000 });
}
};
</script>

<style scoped>
.btn-primary {
background-color: #d02c39;
border-color: #d02c39;
font-weight: bold;
}

.btn-primary:hover {
background-color: #f33b47;
border-color: #f33b47;
}

.is-invalid {
border-color: #dc3545;
}

.text-danger {
font-size: 0.875em;
margin-top: 0.25rem;
}
</style>