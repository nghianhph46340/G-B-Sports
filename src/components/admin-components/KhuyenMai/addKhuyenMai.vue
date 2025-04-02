<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3 co p-3">
      <h3 class="m-0 fw-bold" style="color: #f33b47;">Thêm khuyến mãi</h3>
    </div>

    <div class="container mt-4">
      <form @submit.prevent="submitForm" id="addKhuyenMaiForm">
        <div class="row">
          <!-- Form khuyến mãi -->
          <div class="col-lg-4 bg-light p-4 rounded">
            <div class="mb-3">
              <label for="maKhuyenMai" class="form-label">Mã khuyến mãi</label>
              <input type="text" class="form-control" id="maKhuyenMai" v-model="khuyenMai.maKhuyenMai" required
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
              <input type="number" step="1" class="form-control" id="giaTriGiam" v-model="khuyenMai.giaTriGiam" min="0"  required
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
              <button type="submit" class="btn btn-primary" :disabled="hasErrors || selectedChiTietSanPhamIds.length === 0">Lưu</button>
              <button type="button" class="btn btn-secondary" @click="router.push('/admin/quanlykhuyenmai')">Quay lại</button>
            </div>
          </div>

          <!-- Bảng sản phẩm và chi tiết sản phẩm -->
          <div class="col-lg-8 d-flex flex-column gap-3">
            <!-- SanPham Table -->
            <div class="bg-light p-4 rounded">
              <h5 style="color: #f33b47;">Sản phẩm</h5>
              <div class="d-flex gap-3 align-items-center mt-2">
                <input type="text" class="form-control w-75" id="keywordSanPham" v-model="keywordSanPham" placeholder="Nhập mã hoặc tên sản phẩm" @input="fetchSanPham" />
              </div>
              <div class="table-responsive p-2 mt-3">
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
                        <td colspan="5" class="text-center">Không có sản phẩm nào</td>
                      </tr>
                      <tr v-for="(sanPham, index) in sanPhamList" :key="sanPham.id_san_pham">
                        <td>
                          <input class="form-check-input sanPhamCheckbox" type="checkbox" :value="sanPham.id_san_pham" v-model="selectedSanPhamIds" @change="refreshChiTietSanPham" />
                        </td>
                        <td>{{ index + 1 }}</td>
                        <td>{{ sanPham.ma_san_pham }}</td>
                        <td>{{ sanPham.ten_san_pham }}</td>
                        
                      </tr>
                    </tbody>
                </table>
              </div>
              <div class="mt-3" v-if="sanPhamTotalPages > 1">
                <nav aria-label="SanPham navigation">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: sanPhamCurrentPage === 0 }">
                      <a class="page-link" href="#" @click.prevent="fetchSanPham(sanPhamCurrentPage - 1)">Trước</a>
                    </li>
                    <li v-for="page in sanPhamTotalPages" :key="page" class="page-item" :class="{ active: sanPhamCurrentPage === page - 1 }">
                      <a class="page-link" href="#" @click.prevent="fetchSanPham(page - 1)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: sanPhamCurrentPage === sanPhamTotalPages - 1 }">
                      <a class="page-link" href="#" @click.prevent="fetchSanPham(sanPhamCurrentPage + 1)">Sau</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <!-- ChiTietSanPham Table -->
            <div class="bg-light p-4 rounded">
              <h5 style="color: #f33b47;">Chi tiết sản phẩm</h5>
              <div class="table-responsive p-2">
                <table class="table table-bordered">
                  <thead class="co">
                    <tr>
                      <th><input class="form-check-input" type="checkbox" @change="toggleSelectAllChiTietSanPham" /></th>
                      <th>STT</th>
                      <th>Ảnh</th>
                      <th>Mã sản phẩm</th>
                      <th>Tên sản phẩm</th>
                      <th>Giá bán</th>
                      <th>Số lượng</th>
                      <th>Kích thước</th>
                      <th>Màu sắc</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="paginatedChiTietSanPhamList.length === 0">
                      <td colspan="9" class="text-center">Không có chi tiết sản phẩm nào được chọn</td>
                    </tr>
                    <tr v-for="(item, index) in paginatedChiTietSanPhamList" :key="item.id_chi_tiet_san_pham">
                      <td>
                        <input class="form-check-input chiTietSanPhamCheckbox" type="checkbox" :value="item.id_chi_tiet_san_pham" v-model="selectedChiTietSanPhamIds" />
                      </td>
                      <td>{{ index + 1 + (chiTietSanPhamCurrentPage * itemsPerPage) }}</td>
                      <td>
                        <img v-if="item.hinhAnhSanPhams && item.hinhAnhSanPhams.length > 0" :src="getMainImage(item.hinhAnhSanPhams)" style="width: 50px; height: 50px;" alt="Ảnh chính" />
                        <span v-else>N/A</span>
                      </td>
                      <td>{{ item.sanPham.ma_san_pham }}</td>
                      <td>{{ item.sanPham.ten_san_pham }}</td>
                      <td>{{ formatNumber(item.gia_ban) }}</td>
                      <td>{{ item.so_luong }}</td>
                      <td>{{ item.kichThuoc?.gia_tri || 'N/A' }}</td>
                      <td>{{ item.mauSac?.ten_mau_sac || 'N/A' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-3" v-if="chiTietSanPhamTotalPages > 1">
                <nav aria-label="ChiTietSanPham navigation">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: chiTietSanPhamCurrentPage === 0 }">
                      <a class="page-link" href="#" @click.prevent="changeChiTietSanPhamPage(chiTietSanPhamCurrentPage - 1)">Trước</a>
                    </li>
                    <li v-for="page in chiTietSanPhamTotalPages" :key="page" class="page-item" :class="{ active: chiTietSanPhamCurrentPage === page - 1 }">
                      <a class="page-link" href="#" @click.prevent="changeChiTietSanPhamPage(page - 1)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: chiTietSanPhamCurrentPage === chiTietSanPhamTotalPages - 1 }">
                      <a class="page-link" href="#" @click.prevent="changeChiTietSanPhamPage(chiTietSanPhamCurrentPage + 1)">Sau</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGbStore } from '@/stores/gbStore';
import { toast } from 'vue3-toastify';
import { khuyenMaiService } from '@/services/khuyenMaiService';

const router = useRouter();
const store = useGbStore();

const khuyenMai = ref({
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
const sanPhamCurrentPage = ref(0);
const sanPhamTotalPages = ref(0);
const selectedSanPhamIds = ref([]);
const chiTietSanPhamList = ref([]);
const selectedChiTietSanPhamIds = ref([]);
const chiTietSanPhamCurrentPage = ref(0);
const chiTietSanPhamTotalPages = ref(0);
const itemsPerPage = 10;

// Validation functions (giữ nguyên)
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
  } else if (khuyenMai.value.kieuGiamGia === 'Phần trăm' && giaTri > 100) {
    errors.value.giaTriGiam = 'Giá trị giảm không được vượt quá 100 khi chọn Phần trăm!';
  } else {
    errors.value.giaTriGiam = '';
  }
};

const validateGiaTriToiDa = () => {
  const giaTriToiDa = parseFloat(khuyenMai.value.giaTriToiDa);
  if (khuyenMai.value.kieuGiamGia === 'Tiền mặt') {
    khuyenMai.value.giaTriToiDa = khuyenMai.value.giaTriGiam;
    errors.value.giaTriToiDa = '';
  } else if (isNaN(giaTriToiDa) || giaTriToiDa <= 0) {
    errors.value.giaTriToiDa = 'Giá trị tối đa phải là số lớn hơn 0!';
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

// Computed để kiểm tra lỗi
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '');
});

// Watch kieuGiamGia và giaTriGiam (giữ nguyên)
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

// Debounce để tránh gọi API quá nhiều (giữ nguyên)
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Fetch SanPham với tìm kiếm và phân trang, chỉ lấy sản phẩm "Hoạt động"
const fetchSanPham = async (page = 0) => {
  try {
    const response = await khuyenMaiService.searchSanPhamKM(keywordSanPham.value, page, itemsPerPage);
    if (!response.error && Array.isArray(response.content)) {
      sanPhamList.value = response.content.filter(sp => sp.trang_thai === 'Hoạt động');
      sanPhamTotalPages.value = response.totalPages || 0;
      sanPhamCurrentPage.value = Number(page);
    } else {
      sanPhamList.value = [];
      sanPhamTotalPages.value = 0;
      sanPhamCurrentPage.value = 0;
      toast.error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    console.error('Error fetching SanPham:', error);
    sanPhamList.value = [];
    sanPhamTotalPages.value = 0;
    sanPhamCurrentPage.value = 0;
    toast.error('Không thể tải danh sách sản phẩm');
  }
};

const debounceFetchSanPham = debounce(() => fetchSanPham(0), 300);

// Refresh ChiTietSanPham, chỉ lấy chi tiết sản phẩm "Hoạt động"
const refreshChiTietSanPham = async () => {
  chiTietSanPhamList.value = [];
  if (selectedSanPhamIds.value.length === 0) return;

  for (const sanPhamId of selectedSanPhamIds.value) {
    try {
      const response = await khuyenMaiService.getChiTietSanPhamBySanPham(sanPhamId);
      const filteredChiTiet = (response || []).filter(ctsp => ctsp.trang_thai === 'Hoạt động');
      chiTietSanPhamList.value = [...chiTietSanPhamList.value, ...filteredChiTiet];
    } catch (error) {
      console.error(`Error fetching ChiTietSanPham for SanPham ID ${sanPhamId}:`, error);
      toast.error(`Không thể tải chi tiết sản phẩm cho ID ${sanPhamId}`);
    }
  }

  chiTietSanPhamTotalPages.value = Math.ceil(chiTietSanPhamList.value.length / itemsPerPage);
  chiTietSanPhamCurrentPage.value = 0;
};

// Computed và các hàm khác (giữ nguyên)
const paginatedChiTietSanPhamList = computed(() => {
  const start = chiTietSanPhamCurrentPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  return chiTietSanPhamList.value.slice(start, end);
});

const changeChiTietSanPhamPage = (page) => {
  if (page >= 0 && page < chiTietSanPhamTotalPages.value) {
    chiTietSanPhamCurrentPage.value = page;
  }
};

const toggleSelectAllSanPham = (event) => {
  if (event.target.checked) {
    selectedSanPhamIds.value = sanPhamList.value.map(sp => sp.id_san_pham);
  } else {
    selectedSanPhamIds.value = [];
  }
  refreshChiTietSanPham();
};

const toggleSelectAllChiTietSanPham = (event) => {
  if (event.target.checked) {
    selectedChiTietSanPhamIds.value = paginatedChiTietSanPhamList.value.map(ctsp => ctsp.id_chi_tiet_san_pham);
  } else {
    selectedChiTietSanPhamIds.value = [];
  }
};

const getMainImage = (hinhAnhSanPhams) => {
  const mainImage = hinhAnhSanPhams?.find(img => img.anh_chinh);
  return mainImage ? mainImage.hinh_anh : '';
};

const formatNumber = (number) => {
  if (!number) return '0';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(number);
};

// Submit form với validate frontend và backend (giữ nguyên)
const submitForm = async () => {
  validateMaKhuyenMai();
  validateTenKhuyenMai();
  validateKieuGiamGia();
  validateGiaTriGiam();
  validateGiaTriToiDa();
  validateDates();

  if (hasErrors.value) {
    const errorMessages = Object.values(errors.value).filter(error => error !== '').join(' ');
    console.log('Frontend Validation Errors:', errors.value);
    toast.error(errorMessages || 'Vui lòng sửa các lỗi trước khi lưu!');
    return;
  }

  if (selectedChiTietSanPhamIds.value.length === 0) {
    console.log('No ChiTietSanPham selected');
    toast.error('Vui lòng chọn ít nhất một chi tiết sản phẩm!');
    return;
  }

  const khuyenMaiData = {
    maKhuyenMai: khuyenMai.value.maKhuyenMai,
    tenKhuyenMai: khuyenMai.value.tenKhuyenMai,
    giaTriGiam: parseFloat(khuyenMai.value.giaTriGiam),
    kieuGiamGia: khuyenMai.value.kieuGiamGia,
    giaTriToiDa: parseFloat(khuyenMai.value.giaTriToiDa),
    ngayBatDau: khuyenMai.value.ngayBatDau ? new Date(khuyenMai.value.ngayBatDau).toISOString() : null,
    ngayHetHan: khuyenMai.value.ngayHetHan ? new Date(khuyenMai.value.ngayHetHan).toISOString() : null,
    moTa: khuyenMai.value.moTa || '',
  };

  console.log('Submitting Data:', khuyenMaiData, 'Selected ChiTietSanPhamIds:', selectedChiTietSanPhamIds.value);

  try {
    const response = await khuyenMaiService.addKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds.value);
    console.log('Add KhuyenMai Response:', response);

    if (response === 'Thêm khuyến mãi thành công!') {
      toast.success(response);
      router.push('/admin/quanlykhuyenmai');
    } else {
      if (typeof response === 'string') {
        toast.error(response);
      } else if (response && response.message) {
        toast.error(response.message);
      } else {
        toast.error('Thêm khuyến mãi thất bại!');
      }
    }
  } catch (error) {
    console.error('Error adding KhuyenMai:', error);
    if (error.response && error.response.data) {
      const backendError = error.response.data.message || error.response.data.error || 'Có lỗi xảy ra khi thêm khuyến mãi';
      toast.error(backendError);
    } else {
      toast.error('Không thể kết nối đến server!');
    }
  }
};

// Initial fetch
fetchSanPham();
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
</style>