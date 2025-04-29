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
            v-for="product in sortedAndFilteredProducts"
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
        <div v-if="sortedAndFilteredProducts.length === 0" class="empty-state">
          <a-empty description="Không có sản phẩm nào phù hợp" />
        </div>
      </section>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { FilterOutlined, EyeOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons-vue';
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
  // Nếu không có filter hoặc filter là mảng rỗng hoặc filter là [''] thì trả về tất cả sản phẩm
  if (
    !filterKeywords.value.length ||
    (filterKeywords.value.length === 1 && !filterKeywords.value[0])
  ) {
    return store.listSanPhamBanHang;
  }
  // Lọc theo filter
  return store.listSanPhamBanHang.filter(p =>
    filterKeywords.value.some(kw =>
      (p.type && p.type.toLowerCase().includes(kw.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(kw.toLowerCase()))
    )
  );
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
    keywords: ['Quần'],
    label: 'Quần'
  },
  {
    keywords: ['Áo'],
    label: 'Áo'
  },
  {
    keywords: ['Giày'],
    label: 'Giày'
  },
  {
    keywords: ['Tất'],
    label: 'Tất'
  }
  // Thêm các nhóm khác nếu cần
];

function getBreadcrumbLabel(filterKeywords) {
  if (!filterKeywords || filterKeywords.length === 0 || (filterKeywords.length === 1 && !filterKeywords[0])) {
    return 'Tất cả sản phẩm';
  }
  for (const group of breadcrumbMap) {
    // Nếu tất cả keyword đều nằm trong group này
    if (
      group.keywords.length &&
      filterKeywords.every(kw => group.keywords.includes(kw))
    ) {
      return group.label;
    }
    // Nếu chỉ có 1 keyword và nó nằm trong group
    if (
      group.keywords.length &&
      filterKeywords.length === 1 &&
      group.keywords.includes(filterKeywords[0])
    ) {
      return group.label;
    }
  }
  // Nếu không khớp group nào, trả về keyword đầu tiên hoặc ghép chuỗi
  onMounted(async () => {
    if (!store.listSanPhamBanHang || store.listSanPhamBanHang.length === 0) {
      const filter = route.query.filter;
      if (filter) {
        await store.getSanPhamByTenDM(filter);
        await store.getSanPhamByTenSP(filter);
      }
    }
  });
  return filterKeywords[0] || 'Tất cả sản phẩm';
}

onMounted(async () => {
  // Luôn gọi lại API khi vào trang, kể cả khi filter là rỗng
  await store.getSanPhamByTenDM(route.query.filter || '');
  await store.getSanPhamByTenSP(route.query.filter || '');
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
</style>
