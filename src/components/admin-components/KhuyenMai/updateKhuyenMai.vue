<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3 co p-3">
      <h3 class="m-0 fw-bold" style="color: #f33b47;">Cập nhật khuyến mãi</h3>
    </div>

    <div class="container mt-4">
      <form @submit.prevent="submitForm" id="updateKhuyenMaiForm">
        <div class="row">
          <!-- Form khuyến mãi -->
          <div class="col-lg-4 bg-light p-4 rounded">
            <div class="mb-3">
              <label for="maKhuyenMai" class="form-label">Mã khuyến mãi</label>
              <input type="text" class="form-control" id="maKhuyenMai" v-model="khuyenMai.maKhuyenMai" disabled
                     :class="{ 'is-invalid': errors.maKhuyenMai }" @input="validateMaKhuyenMai" />
              <div class="text-danger" v-if="errors.maKhuyenMai">{{ errors.maKhuyenMai }}</div>
            </div>
            <div class="mb-3">
              <label for="tenKhuyenMai" class="form-label">Tên khuyến mãi</label>
              <input type="text" class="form-control" id="tenKhuyenMai" v-model="khuyenMai.tenKhuyenMai" required
                     :class="{ 'is-invalid': errors.tenKhuyenMai }" @input="validateTenKhuyenMai" />
              <div class="text-danger" v-if="errors.tenKhuyenMai">{{ errors.tenKhuyenMai }}</div>
            </div>
            <div class="mb-3">
              <label for="kieuGiamGia" class="form-label">Kiểu giảm giá</label>
              <select class="form-select" id="kieuGiamGia" v-model="khuyenMai.kieuGiamGia" required
                      :class="{ 'is-invalid': errors.kieuGiamGia }" @change="validateKieuGiamGia">
                <option value="" disabled>Chọn kiểu</option>
                <option value="Phần trăm">Phần trăm</option>
                <option value="Tiền mặt">Tiền mặt</option>
              </select>
              <div class="text-danger" v-if="errors.kieuGiamGia">{{ errors.kieuGiamGia }}</div>
            </div>
            <div class="mb-3">
              <label for="giaTriGiam" class="form-label">Giá trị giảm</label>
              <input type="number" step="1" class="form-control" id="giaTriGiam" v-model="khuyenMai.giaTriGiam" min="0" required
                     :class="{ 'is-invalid': errors.giaTriGiam }" @input="validateGiaTriGiam" />
              <div class="text-danger" v-if="errors.giaTriGiam">{{ errors.giaTriGiam }}</div>
            </div>
            <div class="mb-3">
              <label for="giaTriToiDa" class="form-label">Giá trị tối đa</label>
              <input type="number" step="1" class="form-control" id="giaTriToiDa" v-model="khuyenMai.giaTriToiDa" min="0"
                     :disabled="khuyenMai.kieuGiamGia === 'Tiền mặt'" :class="{ 'is-invalid': errors.giaTriToiDa }" @input="validateGiaTriToiDa" />
              <div class="text-danger" v-if="errors.giaTriToiDa">{{ errors.giaTriToiDa }}</div>
            </div>
            <div class="mb-3">
              <label for="ngayBatDau" class="form-label">Ngày bắt đầu</label>
              <input type="datetime-local" class="form-control" id="ngayBatDau" v-model="khuyenMai.ngayBatDau" required
                     :class="{ 'is-invalid': errors.ngayBatDau }" @input="validateDates" />
              <div class="text-danger" v-if="errors.ngayBatDau">{{ errors.ngayBatDau }}</div>
            </div>
            <div class="mb-3">
              <label for="ngayHetHan" class="form-label">Ngày kết thúc</label>
              <input type="datetime-local" class="form-control" id="ngayHetHan" v-model="khuyenMai.ngayHetHan" required
                     :class="{ 'is-invalid': errors.ngayHetHan }" @input="validateDates" />
              <div class="text-danger" v-if="errors.ngayHetHan">{{ errors.ngayHetHan }}</div>
            </div>
            <div class="mb-3">
              <label for="moTa" class="form-label">Mô tả</label>
              <textarea class="form-control" id="moTa" v-model="khuyenMai.moTa" rows="3"></textarea>
            </div>
            <div class="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" class="btn btn-primary" :disabled="hasErrors || selectedChiTietSanPhamIds.length === 0">Cập nhật</button>
              <button type="button" class="btn btn-secondary" @click="router.push('/admin/quanlykhuyenmai')">Quay lại</button>
            </div>
          </div>

          <!-- Bảng sản phẩm và chi tiết sản phẩm -->
          <div class="col-lg-8 d-flex flex-column gap-3">
            <!-- SanPham Table -->
            <div class="bg-light p-4 rounded">
              <h5 style="color: #f33b47;">Sản phẩm</h5>
              <div class="d-flex gap-3 align-items-center mt-2">
                <input type="text" class="form-control w-75" id="keywordSanPham" v-model="keywordSanPham" placeholder="Nhập mã hoặc tên sản phẩm" @input="debounceFetchSanPham" />
              </div>
              <div class="table-responsive p-2 mt-3 scrollable-table">
                <table class="table table-bordered">
                  <thead class="co">
                    <tr>
                      <th><input class="form-check-input" type="checkbox" @change="toggleSelectAllSanPham" /></th>
                      <th>STT</th>
                      <th>Mã sản phẩm</th>
                      <th>Tên sản phẩm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="sanPhamList.length === 0">
                      <td colspan="4" class="text-center">Không có sản phẩm nào</td>
                    </tr>
                    <tr v-for="(sanPham, index) in sanPhamList" :key="sanPham.idSanPham">
                      <td>
                        <input class="form-check-input sanPhamCheckbox" type="checkbox" :value="sanPham.idSanPham" v-model="selectedSanPhamIds" @change="refreshChiTietSanPham" />
                      </td>
                      <td>{{ index + 1 }}</td>
                      <td>{{ sanPham.maSanPham }}</td>
                      <td>{{ sanPham.tenSanPham }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ChiTietSanPham Table -->
            <div class="bg-light p-4 rounded">
              <h5 style="color: #f33b47;">Chi tiết sản phẩm</h5>
              <div class="table-responsive p-2 scrollable-table">
                <table class="table table-bordered">
                  <thead class="co">
                    <tr>
                      <th><input class="form-check-input" type="checkbox" @change="toggleSelectAllChiTietSanPham" /></th>
                      <th>STT</th>
                      <th>Mã sản phẩm</th>
                      <th>Tên sản phẩm</th>
                      <th>Giá bán</th>
                      <th>Số lượng</th>
                      <th>Kích thước</th>
                      <th>Màu sắc</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="chiTietSanPhamList.length === 0">
                      <td colspan="8" class="text-center">Không có chi tiết sản phẩm nào được chọn</td>
                    </tr>
                    <tr v-for="(item, index) in chiTietSanPhamList" :key="item.idChiTietSanPham">
                      <td>
                        <input class="form-check-input chiTietSanPhamCheckbox" type="checkbox" :value="item.idChiTietSanPham" v-model="selectedChiTietSanPhamIds" />
                      </td>
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.sanPham.maSanPham }}</td>
                      <td>{{ item.sanPham.tenSanPham }}</td>
                      <td>{{ formatNumber(item.giaBan) }}</td>
                      <td>{{ item.soLuong }}</td>
                      <td>{{ item.kichThuoc?.giaTri || 'N/A' }}</td>
                      <td>{{ item.mauSac?.tenMauSac || 'N/A' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import { khuyenMaiService } from '@/services/khuyenMaiService';

const router = useRouter();
const route = useRoute();

const khuyenMai = ref({
  id: null,
  maKhuyenMai: '',
  tenKhuyenMai: '',
  giaTriGiam: null,
  kieuGiamGia: '',
  giaTriToiDa: null,
  ngayBatDau: null,
  ngayHetHan: null,
  moTa: '',
});

const errors = ref({
  maKhuyenMai: '',
  tenKhuyenMai: '',
  giaTriGiam: '',
  kieuGiamGia: '',
  giaTriToiDa: '',
  ngayBatDau: '',
  ngayHetHan: '',
});

const keywordSanPham = ref('');
const sanPhamList = ref([]);
const selectedSanPhamIds = ref([]);
const chiTietSanPhamList = ref([]);
const selectedChiTietSanPhamIds = ref([]);
const initialChiTietSanPhamIds = ref([]);
const initialSanPhamIds = ref([]);

// Validation functions
const validateMaKhuyenMai = () => {
  if (!khuyenMai.value.maKhuyenMai || khuyenMai.value.maKhuyenMai.trim() === '') {
    errors.value.maKhuyenMai = 'Mã khuyến mãi không được để trống!';
  } else {
    errors.value.maKhuyenMai = '';
  }
};

const validateTenKhuyenMai = () => {
  if (!khuyenMai.value.tenKhuyenMai || khuyenMai.value.tenKhuyenMai.trim() === '') {
    errors.value.tenKhuyenMai = 'Tên khuyến mãi không được để trống!';
  } else {
    errors.value.tenKhuyenMai = '';
  }
};

const validateKieuGiamGia = () => {
  if (!khuyenMai.value.kieuGiamGia || khuyenMai.value.kieuGiamGia.trim() === '') {
    errors.value.kieuGiamGia = 'Kiểu giảm giá không được để trống!';
  } else {
    errors.value.kieuGiamGia = '';
    validateGiaTriGiam();
  }
};

const validateGiaTriGiam = () => {
  const giaTri = parseFloat(khuyenMai.value.giaTriGiam);
  if (isNaN(giaTri) || giaTri <= 0) {
    errors.value.giaTriGiam = 'Giá trị giảm phải là số lớn hơn 0!';
  } else if (giaTri > 5000000) {
    errors.value.giaTriGiam = 'Giá trị giảm không được lớn hơn 5,000,000!';
  } else if (khuyenMai.value.kieuGiamGia === 'Phần trăm' && giaTri > 100) {
    errors.value.giaTriGiam = 'Giá trị giảm không được vượt quá 100 khi chọn Phần trăm!';
  } else {
    errors.value.giaTriGiam = '';
  }

  if (khuyenMai.value.kieuGiamGia === 'Tiền mặt') {
    khuyenMai.value.giaTriToiDa = giaTri;
    validateGiaTriToiDa();
  }
};

const validateGiaTriToiDa = () => {
  const giaTriToiDa = parseFloat(khuyenMai.value.giaTriToiDa);
  if (khuyenMai.value.kieuGiamGia === 'Tiền mặt') {
    khuyenMai.value.giaTriToiDa = khuyenMai.value.giaTriGiam;
    errors.value.giaTriToiDa = '';
  } else if (isNaN(giaTriToiDa) || giaTriToiDa <= 0) {
    errors.value.giaTriToiDa = 'Giá trị tối đa phải là số lớn hơn 0!';
  } else if (giaTriToiDa > 5000000) {
    errors.value.giaTriToiDa = 'Giá trị tối đa không được lớn hơn 5,000,000!';
  } else {
    errors.value.giaTriToiDa = '';
  }
};

const validateDates = () => {
  if (!khuyenMai.value.ngayBatDau) {
    errors.value.ngayBatDau = 'Ngày bắt đầu không được để trống!';
  } else {
    errors.value.ngayBatDau = '';
  }

  if (!khuyenMai.value.ngayHetHan) {
    errors.value.ngayHetHan = 'Ngày kết thúc không được để trống!';
  } else if (khuyenMai.value.ngayBatDau && new Date(khuyenMai.value.ngayHetHan) <= new Date(khuyenMai.value.ngayBatDau)) {
    errors.value.ngayHetHan = 'Ngày kết thúc phải sau ngày bắt đầu!';
  } else {
    errors.value.ngayHetHan = '';
  }
};

// Computed to check for errors
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '');
});

// Watch kieuGiamGia and giaTriGiam
watch(() => khuyenMai.value.kieuGiamGia, () => {
  if (khuyenMai.value.kieuGiamGia === 'Tiền mặt') {
    khuyenMai.value.giaTriToiDa = khuyenMai.value.giaTriGiam;
  }
  validateKieuGiamGia();
});

watch(() => khuyenMai.value.giaTriGiam, () => {
  if (khuyenMai.value.kieuGiamGia === 'Tiền mặt') {
    khuyenMai.value.giaTriToiDa = khuyenMai.value.giaTriGiam;
  }
  validateGiaTriGiam();
});

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Fetch SanPham with search (no pagination)
const fetchSanPham = async () => {
  try {
    const response = await khuyenMaiService.searchSanPhamKM(keywordSanPham.value);
    if (!response.error && Array.isArray(response.content)) {
      sanPhamList.value = response.content.map(sp => ({
        idSanPham: sp.idSanPham || sp.id_san_pham,
        maSanPham: sp.maSanPham || sp.ma_san_pham,
        tenSanPham: sp.tenSanPham || sp.ten_san_pham
      }));
    } else {
      sanPhamList.value = [];
      toast.error('Không tìm thấy sản phẩm', { autoClose: 1000 });
    }
  } catch (error) {
    console.error('Error fetching SanPham:', error);
    sanPhamList.value = [];
    toast.error('Không thể tải danh sách sản phẩm', { autoClose: 1000 });
  }
};

const debounceFetchSanPham = debounce(() => fetchSanPham(), 300);

// Refresh ChiTietSanPham with deduplication (no pagination)
const refreshChiTietSanPham = async () => {
  chiTietSanPhamList.value = [];
  if (selectedSanPhamIds.value.length === 0) {
    selectedChiTietSanPhamIds.value = [];
    return;
  }

  try {
    const uniqueChiTietSanPhamMap = new Map();
    for (const sanPhamId of selectedSanPhamIds.value) {
      const response = await khuyenMaiService.getChiTietSanPhamBySanPham(sanPhamId);
      if (!Array.isArray(response)) {
        console.error(`Invalid response for sanPhamId ${sanPhamId}:`, response);
        continue;
      }

      response.forEach(ctsp => {
        const mappedCtsp = {
          idChiTietSanPham: ctsp.idChiTietSanPham || ctsp.id_chi_tiet_san_pham,
          sanPham: {
            idSanPham: ctsp.sanPham?.idSanPham || ctsp.sanPham?.id_san_pham,
            maSanPham: ctsp.sanPham?.maSanPham || ctsp.sanPham?.ma_san_pham,
            tenSanPham: ctsp.sanPham?.tenSanPham || ctsp.sanPham?.ten_san_pham
          },
          giaBan: ctsp.giaBan || ctsp.gia_ban,
          soLuong: ctsp.soLuong || ctsp.so_luong,
          hinhAnhSanPhams: ctsp.hinhAnhSanPhams || [],
          kichThuoc: ctsp.kichThuoc ? { giaTri: ctsp.kichThuoc.giaTri || ctsp.kichThuoc.gia_tri } : null,
          mauSac: ctsp.mauSac ? { tenMauSac: ctsp.mauSac.tenMauSac || ctsp.mauSac.ten_mau_sac } : null
        };
        uniqueChiTietSanPhamMap.set(mappedCtsp.idChiTietSanPham, mappedCtsp);
      });
    }

    chiTietSanPhamList.value = Array.from(uniqueChiTietSanPhamMap.values());
    selectedChiTietSanPhamIds.value = chiTietSanPhamList.value
      .filter(ctsp => initialChiTietSanPhamIds.value.includes(ctsp.idChiTietSanPham))
      .map(ctsp => ctsp.idChiTietSanPham);
  } catch (error) {
    console.error('Error refreshing ChiTietSanPham:', error);
    toast.error('Không thể tải chi tiết sản phẩm', { autoClose: 1000 });
  }
};

// Toggle select all functions
const toggleSelectAllSanPham = (event) => {
  if (event.target.checked) {
    selectedSanPhamIds.value = sanPhamList.value.map(sp => sp.idSanPham);
  } else {
    selectedSanPhamIds.value = [];
  }
  refreshChiTietSanPham();
};

const toggleSelectAllChiTietSanPham = (event) => {
  if (event.target.checked) {
    selectedChiTietSanPhamIds.value = chiTietSanPhamList.value.map(ctsp => ctsp.idChiTietSanPham);
  } else {
    selectedChiTietSanPhamIds.value = [];
  }
};

const formatNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(number);
};

// Load promotion data on mount
onMounted(async () => {
  const id = route.params.id;
  if (!id) {
    toast.error('Không tìm thấy ID khuyến mãi!', { autoClose: 1000 });
    router.push('/admin/quanlykhuyenmai');
    return;
  }

  try {
    const response = await khuyenMaiService.getKhuyenMaiById(id);
    if (response && !response.error) {
      const adjustToLocalTime = (dateStr) => {
        const date = new Date(dateStr);
        const offset = 7 * 60; // Vietnam UTC+7 in minutes
        const localDate = new Date(date.getTime() + offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
      };

      khuyenMai.value = {
        id: response.id,
        maKhuyenMai: response.maKhuyenMai,
        tenKhuyenMai: response.tenKhuyenMai,
        giaTriGiam: response.giaTriGiam,
        kieuGiamGia: response.kieuGiamGia,
        giaTriToiDa: response.giaTriToiDa,
        ngayBatDau: adjustToLocalTime(response.ngayBatDau),
        ngayHetHan: adjustToLocalTime(response.ngayHetHan),
        moTa: response.moTa || '',
      };

      initialChiTietSanPhamIds.value = response.chiTietSanPhams?.map(ctsp => ctsp.idChiTietSanPham || ctsp.id_chi_tiet_san_pham) || [];
      initialSanPhamIds.value = [...new Set(response.chiTietSanPhams?.map(ctsp => ctsp.sanPham?.idSanPham || ctsp.sanPham?.id_san_pham))] || [];
      selectedSanPhamIds.value = [...initialSanPhamIds.value];
      selectedChiTietSanPhamIds.value = [...initialChiTietSanPhamIds.value];

      await refreshChiTietSanPham();
      await fetchSanPham();
    } else {
      throw new Error('Không lấy được dữ liệu khuyến mãi');
    }
  } catch (error) {
    console.error('Error fetching KhuyenMai:', error);
    toast.error('Không thể tải thông tin khuyến mãi', { autoClose: 1000 });
    router.push('/admin/quanlykhuyenmai');
  }
});

// Submit form
const submitForm = async () => {
  validateMaKhuyenMai();
  validateTenKhuyenMai();
  validateKieuGiamGia();
  validateGiaTriGiam();
  validateGiaTriToiDa();
  validateDates();

  if (hasErrors.value) {
    toast.error('Vui lòng sửa các lỗi trước khi cập nhật!', { autoClose: 1000 });
    return;
  }

  if (selectedChiTietSanPhamIds.value.length === 0) {
    toast.error('Vui lòng chọn ít nhất một chi tiết sản phẩm!', { autoClose: 1000 });
    return;
  }

  const khuyenMaiData = {
    id: khuyenMai.value.id,
    maKhuyenMai: khuyenMai.value.maKhuyenMai,
    tenKhuyenMai: khuyenMai.value.tenKhuyenMai,
    giaTriGiam: parseFloat(khuyenMai.value.giaTriGiam),
    kieuGiamGia: khuyenMai.value.kieuGiamGia,
    giaTriToiDa: parseFloat(khuyenMai.value.giaTriToiDa),
    ngayBatDau: khuyenMai.value.ngayBatDau ? new Date(khuyenMai.value.ngayBatDau).toISOString() : null,
    ngayHetHan: khuyenMai.value.ngayHetHan ? new Date(khuyenMai.value.ngayHetHan).toISOString() : null,
    moTa: khuyenMai.value.moTa || '',
  };

  try {
    const response = await khuyenMaiService.updateKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds.value);
    if (response === 'Cập nhật khuyến mãi thành công!') {
      toast.success(response, {
        autoClose: 3000,
        onClose: () => router.push('/admin/quanlykhuyenmai'),
      });
    } else {
      toast.error(response, { autoClose: 1000 });
    }
  } catch (error) {
    console.error('Error updating KhuyenMai:', error);
    toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khuyến mãi', { autoClose: 1000 });
  }
};
</script>

<style scoped>
.co {
  background-color: #f8f9fa;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.btn-primary {
  background-color: #d02c39;
  border-color: #d02c39;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #f33b47;
  border-color: #f33b47;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.is-invalid {
  border-color: #dc3545;
}

.text-danger {
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.table {
  --bs-table-hover-bg: rgb(183 183 183 / 8%);
}

.scrollable-table {
  max-height: 300px; /* Giới hạn chiều cao để hiển thị thanh cuộn */
  overflow-y: auto; /* Thêm thanh cuộn dọc */
}
</style>