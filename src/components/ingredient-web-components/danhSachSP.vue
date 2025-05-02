<template>
  <div class="product-list-page">
    <!-- Breadcrumb + Ảnh + Tiêu đề -->
    <div class="header mt-4">
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item @click="goHome" style="cursor:pointer">Trang chủ</a-breadcrumb-item>
        <a-breadcrumb-item>
          {{ getBreadcrumbLabel(filterKeywords) }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="main-content">
      <!-- Sidebar: Bộ lọc -->
      <aside class="sidebar">
        <h3><filter-outlined /> BỘ LỌC</h3>
        <!-- Loại sản phẩm -->
        <div class="filter-group">
          <h4>Loại sản phẩm</h4>
          <a-checkbox-group v-model:value="selectedTypes">
            <a-checkbox v-for="type in productTypes" :key="type.value" :value="type.value">
              {{ type.label }} ({{ type.count }})
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <!-- Giới tính -->
        <div class="filter-group">
          <h4>Giới tính</h4>
          <a-radio-group v-model:value="selectedGender" button-style="solid">
            <a-radio-button v-for="gender in genders" :key="gender.value" :value="gender.value">
              {{ gender.label }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <!-- Thương hiệu -->
        <div class="filter-group">
          <h4>Thương hiệu</h4>
          <a-checkbox-group v-model:value="selectedBrands">
            <a-checkbox v-for="brand in brands" :key="brand" :value="brand">
              {{ brand }}
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <!-- Giá -->
        <div class="filter-group">
          <h4>Khoảng giá</h4>
          <a-slider
            v-model:value="selectedPrice"
            :min="minPrice"
            :max="maxPrice"
            range
            :tip-formatter="formatCurrency"
          />
          <div class="price-range">
            <span>{{ formatCurrency(selectedPrice[0]) }}</span>
            <span>-</span>
            <span>{{ formatCurrency(selectedPrice[1]) }}</span>
          </div>
        </div>
        <!-- Màu sắc -->
        <div class="filter-group">
          <h4>Màu sắc</h4>
          <div class="color-options">
            <span
              v-for="color in colors"
              :key="color"
              :style="{ background: color }"
              class="color-dot"
              :class="{ active: selectedColors.includes(color) }"
              @click="toggleColor(color)"
            ></span>
          </div>
        </div>
      </aside>

      <!-- Danh sách sản phẩm -->
      <section class="product-list">
        <div class="list-header">
          <span>{{ filteredProducts.length }} Sản phẩm</span>
          <a-select v-model:value="sortBy" style="width: 160px">
            <a-select-option value="default">Sắp xếp theo</a-select-option>
            <a-select-option value="price-asc">Giá tăng dần</a-select-option>
            <a-select-option value="price-desc">Giá giảm dần</a-select-option>
          </a-select>
        </div>
        <a-row :gutter="[24, 24]">
          <a-col
            v-for="product in displayedProducts"
            :key="product.id"
            :xs="24" :sm="12" :md="8" :lg="6"
          >
            <div class="product-card" @mouseenter="activeProduct = product.id" @mouseleave="activeProduct = null">
              <div class="product-image-container">
                <img class="product-image" :src="product.image" alt="Product image">
                <div class="discount-badge" v-if="product.oldPrice">
                  -{{ Math.round(100 * (1 - product.price / product.oldPrice)) }}%
                </div>
                <div class="product-overlay" :class="{ 'active': activeProduct === product.id }">
                  <div class="overlay-buttons">
                    <button class="overlay-btn view-btn" @click="router.push('/sanphamdetail/'+product.id)">
                      <eye-outlined />
                      <span>Xem</span>
                    </button>
                    <button class="overlay-btn cart-btn">
                      <shopping-cart-outlined />
                      <span>Thêm</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="product-info">
                <div class="product-price-row">
                  <span class="product-price">{{ formatCurrency(product.price) }}</span>
                  <span class="product-old-price" v-if="product.oldPrice">{{ formatCurrency(product.oldPrice) }}</span>
                  <span class="product-discount" v-if="product.oldPrice">
                    -{{ Math.round(100 * (1 - product.price / product.oldPrice)) }}%
                  </span>
                </div>
                <h6 class="product-name">{{ product.name }}</h6>
                <div class="product-meta">
                  <span class="product-brand">{{ product.brand }}</span>
                  <div class="product-rating">
                    <star-filled />
                    <span>{{ product.rating || 0 }} ({{ product.reviews || 0 }})</span>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- Thay thế phần nút Xem thêm cũ bằng đoạn code này -->
        <div v-if="hasMoreProducts" class="load-more-section">
          <!-- Phần preview sản phẩm tiếp theo -->
          <div class="next-products-preview">
            <a-row :gutter="[24, 24]">
              <a-col v-for="product in nextProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
                <div class="product-card preview-card">
                  <div class="product-image-container">
                    <img class="product-image" :src="product.image" alt="Product preview">
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
          
          <!-- Nút xem thêm dạng text -->
          <button class="text-load-more" @click="loadMore">
            Xem thêm
            <down-outlined class="down-icon" />
          </button>
        </div>

        <!-- Thông báo không có sản phẩm -->
        <div v-if="displayedProducts.length === 0" class="empty-state">
          <a-empty description="Không có sản phẩm nào phù hợp" />
        </div>
      </section>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { FilterOutlined, EyeOutlined, ShoppingCartOutlined, StarFilled, DownOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { useGbStore } from '@/stores/gbStore';

const store = useGbStore();
const route = useRoute();
const router = useRouter();

const categoryImage = 'https://contents.mediadecathlon.com/p2159822/k$e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2/ao-khong-tay.jpg?format=auto&quality=70&f=650x0';

const productTypes = [
  { value: 'tank', label: 'Áo Không Tay', count: 43 }
];
const genders = [
  { value: 'nam', label: 'NAM', count: 43 },
  { value: 'be-trai', label: 'BÉ TRAI', count: 3 },
  { value: 'em-be-trai', label: 'EM BÉ TRAI', count: 3 }
];
const brands = ['Nike', 'Adidas', 'Puma', 'Decathlon', 'Khác'];
const colors = ['#000', '#fff', '#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

const minPrice = 0;
const maxPrice = 1000000;

const selectedTypes = ref([]);
const selectedGender = ref(null);
const selectedBrands = ref([]);
const selectedPrice = ref([minPrice, maxPrice]);
const selectedColors = ref([]);
const sortBy = ref('default');

// Lấy keyword từ query (có thể là string hoặc mảng)
const filterKeywords = ref(
  Array.isArray(route.query.filter)
    ? route.query.filter
    : route.query.filter
      ? [route.query.filter]
      : []
);

// Theo dõi khi route thay đổi (user click sidebar)
watch(() => route.query.filter, (newVal) => {
  filterKeywords.value = Array.isArray(newVal)
    ? newVal
    : newVal
      ? [newVal]
      : [];
});


// Toggle color chọn
function toggleColor(color) {
  if (selectedColors.value.includes(color)) {
    selectedColors.value = selectedColors.value.filter(c => c !== color);
  } else {
    selectedColors.value.push(color);
  }
}

// Lọc sản phẩm từ store theo nhiều keyword
const filteredProducts = computed(() => {
  if (!store.listSanPhamBanHang) return [];
  
  console.log('Filter keywords:', filterKeywords.value);
  
  // Nếu không có filter thì trả về tất cả sản phẩm
  if (!filterKeywords.value.length || (filterKeywords.value.length === 1 && !filterKeywords.value[0])) {
    return store.listSanPhamBanHang;
  }

  // Định nghĩa các danh mục
  const categoryKeywords = ['Bóng đá', 'Bóng rổ', 'Cầu lông', 'Đạp xe', 'Chạy bộ', 'Yoga', 'Nam', 'Nữ'];
  
  // Định nghĩa các loại sản phẩm
  const productTypeKeywords = ['Quần', 'Áo', 'Váy','Tank top'];

  // Tách filter thành 2 loại
  const categoryFilters = filterKeywords.value.filter(kw => categoryKeywords.includes(kw));
  const productTypeFilters = filterKeywords.value.filter(kw => productTypeKeywords.includes(kw));

  return store.listSanPhamBanHang.filter(product => {
    // Kiểm tra theo danh mục (type)
    const matchCategory = categoryFilters.length === 0 || 
      categoryFilters.some(kw => product.type && product.type.toLowerCase().includes(kw.toLowerCase()));

    // Kiểm tra theo tên sản phẩm
    const matchProductType = productTypeFilters.length === 0 ||
      productTypeFilters.some(kw => product.name && product.name.toLowerCase().includes(kw.toLowerCase()));

    // Phải thỏa mãn cả 2 điều kiện
    return matchCategory && matchProductType;
  });
});

const sortedAndFilteredProducts = computed(() => {
  let arr = [...filteredProducts.value];
  if (sortBy.value === 'price-asc') arr.sort((a, b) => a.price - b.price);
  else if (sortBy.value === 'price-desc') arr.sort((a, b) => b.price - a.price);
  else if (sortBy.value === 'new') arr.sort((a, b) => b.isNew - a.isNew);
  return arr;
});

function goHome() {
  router.push('/home');
}
function formatCurrency(val) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

const activeProduct = ref(null);

const breadcrumbMap = [
  {
    keywords: ['Bóng đá', 'Bóng rổ', 'Cầu lông', 'Đạp xe', 'Chạy bộ', 'Yoga'],
    label: 'Môn thể thao'
  },
  {
    keywords: ['Nam'],
    label: 'Nam'
  },
  {
    keywords: ['Nữ'],
    label: 'Nữ'
  },
  {
    keywords: [],
    label: 'Tất cả sản phẩm'
  },
  {
    keywords: ['Quần','Váy'],
    label: 'Quần'
  },
  {
    keywords: ['Áo', 'Tank top'],
    label: 'Áo'
  }
  // Thêm các nhóm khác nếu cần
];

function getBreadcrumbLabel(filterKeywords) {
  if (!filterKeywords || filterKeywords.length === 0 || (filterKeywords.length === 1 && !filterKeywords[0])) {
    return 'Tất cả sản phẩm';
  }

  // Danh sách từ khóa của môn thể thao
  const sportsKeywords = ['Bóng đá', 'Bóng rổ', 'Cầu lông', 'Đạp xe', 'Chạy bộ', 'Yoga'];

  // Kiểm tra nếu filter chứa bất kỳ từ khóa môn thể thao nào
  if (filterKeywords.some(kw => sportsKeywords.includes(kw))) {
    return 'Môn thể thao';
  }

  // Kiểm tra các trường hợp còn lại
  for (const group of breadcrumbMap) {
    if (group.keywords.length && filterKeywords.length === 1 && group.keywords.includes(filterKeywords[0])) {
      return group.label;
    }
  }

  return filterKeywords[0] || 'Tất cả sản phẩm';
}

onMounted(async () => {
  try {
    const filter = route.query.filter;
    console.log('Filter từ route:', filter);

    // Danh sách các danh mục
    const categories = ['Bóng đá', 'Bóng rổ', 'Cầu lông', 'Đạp xe', 'Chạy bộ', 'Yoga', 'Nam', 'Nữ'];
    
    // Danh sách các loại sản phẩm
    const productTypes = ['Quần', 'Áo', 'Váy', 'Tank top'];

    if (categories.includes(filter)) {
      // Nếu filter là danh mục thì gọi API lấy theo danh mục
      await store.getSanPhamByTenDM(filter);
      console.log('Lấy sản phẩm theo danh mục:', filter);
    } else if (productTypes.includes(filter)) {
      // Nếu filter là loại sản phẩm thì gọi API lấy theo tên
      await store.getSanPhamByTenSP(filter);
      console.log('Lấy sản phẩm theo tên:', filter);
    } else {
      // Nếu không có filter hoặc filter không thuộc 2 nhóm trên
      await store.getSanPhamByTenDM('');
      console.log('Lấy tất cả sản phẩm');
    }

    console.log('Số sản phẩm:', store.listSanPhamBanHang?.length);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
});

// Thêm vào phần khai báo biến trong script setup
const itemsPerPage = 20; // Số sản phẩm mỗi trang
const currentPage = ref(1); // Trang hiện tại
const showLoadMore = ref(true); // Hiển thị nút "Xem thêm"

const displayedProducts = computed(() => {
  const endIndex = Math.min(currentPage.value * itemsPerPage, sortedAndFilteredProducts.value.length);
  return sortedAndFilteredProducts.value.slice(0, endIndex);
});

// Kiểm tra còn sản phẩm để hiển thị không
const hasMoreProducts = computed(() => {
  return displayedProducts.value.length < sortedAndFilteredProducts.value.length;
});

const loadMore = () => {
  const totalProducts = sortedAndFilteredProducts.value.length;
  const currentlyShowing = currentPage.value * itemsPerPage;
  
  if (currentlyShowing < totalProducts) {
    currentPage.value++;
  }
};

// Thêm watch để reset currentPage khi filter hoặc route thay đổi
watch([
  () => route.query.filter,
  selectedTypes,
  selectedGender,
  selectedBrands,
  selectedPrice,
  selectedColors,
  sortBy
], () => {
  currentPage.value = 1;
});

// Thêm computed property này
const nextProducts = computed(() => {
  const startIndex = currentPage.value * itemsPerPage;
  const endIndex = startIndex + 4; // Chỉ lấy 4 sản phẩm để preview
  return sortedAndFilteredProducts.value.slice(startIndex, endIndex);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
.breadcrumb {
  color: #f80f0fe5;
  font-family: Montserrat, sans-serif  !important;
}
.product-list-page {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 16px;
}
.header {
  margin-bottom: 24px;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 12px;
}
.category-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}
.main-content {
  display: flex;
  gap: 32px;
}
.sidebar {
  width: 260px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px #f0f1f2;
}
.filter-group {
  margin-bottom: 24px;
}
.filter-group h4 {
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 600;
}
.product-list {
  flex: 1;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.product-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 16px;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s;
  margin-bottom: 20px;
}
.product-card:hover {
  box-shadow: 0 4px 16px #e6e6e6;
}
.product-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 12px;
}
.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.5s ease;
}
.product-card:hover .product-image {
  transform: scale(1.05);
}
.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff3a3a;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  z-index: 2;
}
.product-overlay {
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 15px;
  transition: all 0.3s ease;
  opacity: 0;
}
.product-overlay.active {
  bottom: 0;
  opacity: 1;
}
.overlay-buttons {
  display: flex;
  justify-content: space-around;
}
.overlay-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}
.overlay-btn span {
  margin-left: 5px;
}
.overlay-btn:hover {
  background: #3a86ff;
  color: white;
}
.product-info {
  padding: 0 5px;
}
.product-price-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.product-price {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-right: 8px;
}
.product-old-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-right: 8px;
}
.product-discount {
  font-size: 11px;
  font-weight: 600;
  color: white;
  background-color: #ff3a3a;
  padding: 2px 6px;
  border-radius: 10px;
}
.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-brand {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}
.product-rating {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}
.product-rating :deep(svg) {
  color: #ffc107;
  margin-right: 3px;
  font-size: 14px;
}
.empty-state {
  margin-top: 48px;
  text-align: center;
}
.color-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #eee;
  cursor: pointer;
  transition: border 0.2s;
}
.color-dot.active {
  border: 2px solid #3a86ff;
  box-shadow: 0 0 0 2px #3a86ff33;
}
.price-range {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}
.load-more-section {
  position: relative;
  margin: 32px 0;
  text-align: center;
}

.next-products-preview {
  position: relative;
  height: 100px;
  overflow: hidden;
  margin-bottom: 20px;
}

.next-products-preview::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 30%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 1) 100%
  );
  pointer-events: none;
}

.preview-card {
  opacity: 0.5;
  transform: scale(0.95);
  pointer-events: none;
}

.text-load-more {
  background: none;
  border: none;
  color: #f33b47;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.text-load-more:hover {
  color: #ff5060;
  transform: translateY(-2px);
}

.text-load-more .down-icon {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.text-load-more:hover .down-icon {
  transform: translateY(2px);
}

/* Điều chỉnh lại style cho product-card trong preview */
.preview-card .product-image-container {
  height: 80px;
}

.preview-card .product-image {
  height: 100%;
}
</style>
