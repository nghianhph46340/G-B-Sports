<template>
    <div class="container mt-3">
        <!-- Breadcrumb -->
        <div class="breadcrumb-container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
                    <li class="breadcrumb-item"><a href="#">Sản phẩm</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Chi tiết sản phẩm</li>
                </ol>
            </nav>
        </div>

        <div class="product-main-content">
            <!-- Phần gallery hình ảnh -->
            <div class="product-gallery" ref="productGalleryRef">
                <div class="main-image-container">
                    <div class="image-zoom-container" ref="zoomContainer">
                        <img :src="currentImage" alt="Sản phẩm" class="main-product-image" ref="mainImage"
                            @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
                        <div class="zoom-lens" ref="zoomLens" v-show="zoomActive"></div>
                        <div class="zoom-result" ref="zoomResult" v-show="zoomVisible"></div>
                    </div>
                    <div class="image-controls">
                        <button class="control-btn prev-btn" @click="prevImage" :disabled="currentImageIndex === 0">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="control-btn fullscreen-btn" @click="showFullscreen = true">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="control-btn next-btn" @click="nextImage"
                            :disabled="currentImageIndex === product.hinh_anh.length - 1">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="thumbnails-container">
                    <div class="thumbnail-wrapper" v-for="(image, index) in product.hinh_anh" :key="index"
                        @click="changeImage(index)" :class="{ active: currentImageIndex === index }">
                        <img :src="image.url" alt="Thumbnail" class="thumbnail-image">
                    </div>
                </div>
            </div>

            <!-- Phần thông tin sản phẩm -->
            <div class="product-info" ref="productInfoRef">
                <div class="product-badges">
                    <span class="badge badge-sale" v-if="product.giam_gia">-{{ discountPercent }}%</span>
                    <span class="badge badge-new" v-if="product.moi">Mới</span>
                </div>

                <h1 class="product-title">{{ product.ten_san_pham }}</h1>

                <div class="product-meta">
                    <div class="meta-item">
                        <span class="meta-label">Mã sản phẩm:</span>
                        <span class="meta-value">{{ product.ma_san_pham }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Thương hiệu:</span>
                        <span class="meta-value">{{ product.thuong_hieu }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Danh mục:</span>
                        <span class="meta-value">{{ product.danh_muc }}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Chất liệu:</span>
                        <span class="meta-value">{{ product.chat_lieu }}</span>
                    </div>
                </div>

                <div class="product-price">
                    <span class="current-price">{{ formatCurrency(product.gia_khuyen_mai) }}</span>
                    <span class="original-price" v-if="product.giam_gia">{{ formatCurrency(product.gia_goc) }}</span>
                    <span class="discount-percent" v-if="product.giam_gia">(-{{ discountPercent }}%)</span>
                </div>

                <div class="product-rating">
                    <div class="stars">
                        <i class="fas fa-star" v-for="i in Math.floor(product.danh_gia)" :key="'star-' + i"></i>
                        <i class="fas fa-star-half-alt" v-if="product.danh_gia % 1 >= 0.5"></i>
                        <i class="far fa-star" v-for="i in (5 - Math.ceil(product.danh_gia))"
                            :key="'empty-star-' + i"></i>
                    </div>
                    <span class="rating-count">({{ product.so_luot_danh_gia }} đánh giá)</span>
                </div>

                <div class="product-colors">
                    <h3 class="option-title">Màu sắc:</h3>
                    <div class="color-options">
                        <div v-for="(color, index) in product.mau_sac" :key="'color-' + index" class="color-option"
                            :class="{ active: selectedColor === color.ma }" @click="selectColor(color)">
                            <div class="color-swatch" :style="{ backgroundColor: color.ma_mau }"></div>
                            <span class="color-name">{{ color.ten }}</span>
                        </div>
                    </div>
                </div>

                <div class="product-sizes">
                    <h3 class="option-title">Kích thước:</h3>
                    <div class="size-options">
                        <button v-for="(size, index) in product.kich_thuoc" :key="'size-' + index" class="size-option"
                            :class="{ active: selectedSize === size.ma, disabled: !size.co_san }"
                            @click="selectSize(size)" :disabled="!size.co_san">
                            {{ size.ten }}
                        </button>
                    </div>
                </div>

                <div class="product-quantity">
                    <h3 class="option-title">Số lượng:</h3>
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" @click="decreaseQuantity" :disabled="quantity <= 1">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" v-model.number="quantity" min="1" max="99" class="quantity-input">
                        <button class="quantity-btn plus" @click="increaseQuantity" :disabled="quantity >= 99">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <span class="stock-status" v-if="stockStatus.text === 'Còn hàng'">{{ stockStatus.text }}</span>
                    <span class="stock-status low-stock"
                        v-else-if="stockStatus.text === `Còn ${product.so_luong_ton} sản phẩm`">{{ stockStatus.text
                        }}</span>
                    <span class="stock-status out-of-stock" v-else>{{ stockStatus.text }}</span>
                </div>

                <div class="product-actions">
                    <button class="btn-add-to-cart" @click="addToCart" :disabled="!canAddToCart">
                        <i class="fas fa-shopping-cart"></i>
                        Thêm vào giỏ hàng
                    </button>
                    <button class="btn-buy-now" @click="buyNow" :disabled="!canAddToCart">
                        <i class="fas fa-bolt"></i>
                        Mua ngay
                    </button>
                    <button class="btn-add-to-wishlist" @click="toggleWishlist">
                        <i class="fas" :class="isInWishlist ? 'fa-heart' : 'fa-heart-o'"></i>
                    </button>
                </div>

                <div class="product-delivery-info">
                    <div class="delivery-item">
                        <i class="fas fa-truck"></i>
                        <span>Giao hàng miễn phí cho đơn hàng từ 500.000đ</span>
                    </div>
                    <div class="delivery-item">
                        <i class="fas fa-undo"></i>
                        <span>Đổi trả trong vòng 30 ngày</span>
                    </div>
                    <div class="delivery-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Bảo hành chính hãng 12 tháng</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Phần mô tả và tab -->
        <div class="product-details-tabs" ref="productTabsRef">
            <div class="tabs-header">
                <button class="tab-btn" :class="{ active: activeTab === 'description' }"
                    @click="changeTab('description')">
                    Mô tả sản phẩm
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'specifications' }"
                    @click="changeTab('specifications')">
                    Thông số kỹ thuật
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'reviews' }" @click="changeTab('reviews')">
                    Đánh giá ({{ product.so_luot_danh_gia }})
                </button>
            </div>

            <div class="tabs-content">
                <div class="tab-pane" v-show="activeTab === 'description'">
                    <div class="product-description" v-html="product.mo_ta"></div>
                </div>

                <div class="tab-pane" v-show="activeTab === 'specifications'">
                    <table class="specifications-table">
                        <tbody>
                            <tr v-for="(spec, index) in product.thong_so_ky_thuat" :key="'spec-' + index">
                                <td class="spec-name">{{ spec.ten }}</td>
                                <td class="spec-value">{{ spec.gia_tri }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="tab-pane" v-show="activeTab === 'reviews'">
                    <div class="reviews-summary">
                        <div class="average-rating">
                            <div class="rating-number">{{ product.danh_gia.toFixed(1) }}</div>
                            <div class="rating-stars">
                                <i class="fas fa-star" v-for="i in Math.floor(product.danh_gia)"
                                    :key="'rev-star-' + i"></i>
                                <i class="fas fa-star-half-alt" v-if="product.danh_gia % 1 >= 0.5"></i>
                                <i class="far fa-star" v-for="i in (5 - Math.ceil(product.danh_gia))"
                                    :key="'rev-empty-star-' + i"></i>
                            </div>
                            <div class="rating-count">{{ product.so_luot_danh_gia }} đánh giá</div>
                        </div>

                        <div class="rating-bars">
                            <div class="rating-bar-item" v-for="i in 5" :key="'bar-' + i">
                                <div class="rating-label">{{ 6 - i }} sao</div>
                                <div class="rating-bar">
                                    <div class="rating-bar-fill"
                                        :style="{ width: (product.danh_gia_chi_tiet.chi_tiet[6 - i] ? product.danh_gia_chi_tiet.chi_tiet[6 - i].phan_tram : 0) + '%' }">
                                    </div>
                                </div>
                                <div class="rating-percent">{{ product.danh_gia_chi_tiet.chi_tiet[6 - i] ?
                                    product.danh_gia_chi_tiet.chi_tiet[6 - i].phan_tram : 0 }}%</div>
                            </div>
                        </div>
                    </div>

                    <div class="reviews-list">
                        <div class="review-item" v-for="(review, index) in product.danh_gia_chi_tiet.binh_luan"
                            :key="'review-' + index">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-avatar">
                                        <img :src="review.avatar" alt="Avatar">
                                    </div>
                                    <div class="reviewer-name">{{ review.ten_nguoi_dung }}</div>
                                </div>
                                <div class="review-rating">
                                    <i class="fas fa-star" v-for="i in review.danh_gia" :key="'review-star-' + i"></i>
                                    <i class="far fa-star" v-for="i in (5 - review.danh_gia)"
                                        :key="'review-empty-star-' + i"></i>
                                </div>
                            </div>
                            <div class="review-date">{{ review.ngay }}</div>
                            <div class="review-content">{{ review.noi_dung }}</div>
                            <div class="review-images" v-if="review.hinh_anh && review.hinh_anh.length">
                                <div class="review-image" v-for="(image, imgIndex) in review.hinh_anh"
                                    :key="'review-img-' + imgIndex">
                                    <img :src="image" alt="Review image">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="no-reviews"
                        v-if="!product.danh_gia_chi_tiet.binh_luan || !product.danh_gia_chi_tiet.binh_luan.length">
                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Phần sản phẩm đề xuất -->
        <div class="recommended-products" ref="recommendedProductsRef">
            <h2 class="section-title">Sản phẩm tương tự</h2>

            <div class="products-carousel">
                <button class="carousel-control prev" @click="prevSlide" :disabled="currentSlide === 0">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <div class="carousel-container">
                    <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 20}%)` }">
                        <div class="product-card" v-for="(product, index) in visibleProducts" :key="'rec-' + index">
                            <div class="product-card-image">
                                <img :src="product.hinh_anh" alt="Sản phẩm">
                                <div class="product-card-overlay">
                                    <button class="overlay-btn view">
                                        <i class="fas fa-eye"></i>
                                        Xem
                                    </button>
                                    <button class="overlay-btn cart">
                                        <i class="fas fa-shopping-cart"></i>
                                        Thêm vào giỏ
                                    </button>
                                </div>
                                <div class="product-card-badge" v-if="product.giam_gia">-{{ product.phan_tram_giam_gia
                                    }}%
                                </div>
                            </div>
                            <div class="product-card-info">
                                <h3 class="product-card-title">{{ product.ten }}</h3>
                                <div class="product-card-price">
                                    <span class="current-price">{{ formatCurrency(product.gia_khuyen_mai) }}</span>
                                    <span class="original-price" v-if="product.giam_gia">{{
                                        formatCurrency(product.gia_goc)
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="carousel-control next" @click="nextSlide" :disabled="currentSlide >= totalSlides - 1">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- Modal xem ảnh toàn màn hình -->
        <div class="fullscreen-modal" v-if="showFullscreen" @click="showFullscreen = false">
            <div class="fullscreen-content" @click.stop>
                <button class="close-fullscreen" @click="showFullscreen = false">
                    <i class="fas fa-times"></i>
                </button>
                <div class="fullscreen-image-container">
                    <img :src="currentImage" alt="Sản phẩm" class="fullscreen-image">
                </div>
                <div class="fullscreen-thumbnails">
                    <div class="thumbnail-wrapper" v-for="(image, index) in product.hinh_anh" :key="index"
                        @click="changeImage(index)" :class="{ active: currentImageIndex === index }">
                        <img :src="image.url" alt="Thumbnail" class="thumbnail-image">
                    </div>
                </div>
                <div class="fullscreen-controls">
                    <button class="control-btn prev-btn" @click.stop="prevImage" :disabled="currentImageIndex === 0">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="control-btn next-btn" @click.stop="nextImage"
                        :disabled="currentImageIndex === product.hinh_anh.length - 1">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useRoute } from 'vue-router';

// Lấy ID sản phẩm từ tham số URL
const route = useRoute();
const productId = computed(() => route.params.id);

// Dữ liệu sản phẩm
const product = ref({
    ma_san_pham: 'SP001',
    ten_san_pham: 'Áo thể thao nam ProSport',
    thuong_hieu: 'ProSport',
    danh_muc: 'Áo thể thao nam',
    chat_lieu: '85% Polyester, 15% Spandex',
    gia_goc: 450000,
    gia_khuyen_mai: 350000,
    giam_gia: true,
    phan_tram_giam_gia: 22,
    moi: true,
    danh_gia: 4.5,
    so_luot_danh_gia: 120,
    so_luong_ton: 25,
    mau_sac: [
        { ma: 'den', ten: 'Đen', ma_mau: '#000000' },
        { ma: 'trang', ten: 'Trắng', ma_mau: '#FFFFFF' },
        { ma: 'xanh-duong', ten: 'Xanh dương', ma_mau: '#0066CC' },
        { ma: 'do', ten: 'Đỏ', ma_mau: '#FF0000' },
    ],
    kich_thuoc: [
        { ma: 'S', ten: 'S', co_san: true },
        { ma: 'M', ten: 'M', co_san: true },
        { ma: 'L', ten: 'L', co_san: true },
        { ma: 'XL', ten: 'XL', co_san: true },
        { ma: 'XXL', ten: 'XXL', co_san: false },
    ],
    mo_ta: `
    <h3>Áo thể thao nam ProSport - Sự lựa chọn hoàn hảo cho người yêu thể thao</h3>
    <p>Áo thể thao nam ProSport được thiết kế đặc biệt cho các hoạt động thể thao và tập luyện. Với chất liệu cao cấp và công nghệ tiên tiến, sản phẩm mang đến sự thoải mái tối đa và hiệu suất cao cho người mặc.</p>
    
    <h4>Đặc điểm nổi bật:</h4>
    <ul>
      <li>Chất liệu: 85% Polyester, 15% Spandex - mềm mại, co giãn 4 chiều</li>
      <li>Công nghệ DryFit - thấm hút mồ hôi nhanh, khô thoáng</li>
      <li>Thiết kế khí động học - tối ưu hóa chuyển động</li>
      <li>Đường may chắc chắn, tinh tế</li>
      <li>Họa tiết in cao cấp, không bong tróc</li>
    </ul>
    
    <h4>Hướng dẫn sử dụng:</h4>
    <p>Giặt máy ở nhiệt độ thấp, không sử dụng chất tẩy, không ủi trực tiếp lên hình in, phơi trong bóng râm.</p>
  `,
    thong_so_ky_thuat: [
        { ten: 'Thương hiệu', gia_tri: 'ProSport' },
        { ten: 'Xuất xứ', gia_tri: 'Việt Nam' },
        { ten: 'Chất liệu', gia_tri: '85% Polyester, 15% Spandex' },
        { ten: 'Công nghệ', gia_tri: 'DryFit, UV Protection' },
        { ten: 'Kiểu dáng', gia_tri: 'Regular fit' },
        { ten: 'Bảo hành', gia_tri: '30 ngày' },
        { ten: 'Đối tượng', gia_tri: 'Nam' },
    ],
    hinh_anh: [
        { id: 1, url: 'https://example.com/anh1.jpg', alt: 'Áo thể thao nam ProSport - Mặt trước' },
        { id: 2, url: 'https://example.com/anh2.jpg', alt: 'Áo thể thao nam ProSport - Mặt sau' },
        { id: 3, url: 'https://example.com/anh3.jpg', alt: 'Áo thể thao nam ProSport - Chi tiết cổ áo' },
        { id: 4, url: 'https://example.com/anh4.jpg', alt: 'Áo thể thao nam ProSport - Chi tiết tay áo' },
        { id: 5, url: 'https://example.com/anh5.jpg', alt: 'Áo thể thao nam ProSport - Họa tiết' },
    ],
    danh_gia_chi_tiet: {
        trung_binh: 4.5,
        tong_so: 120,
        chi_tiet: [
            { sao: 5, so_luong: 80, phan_tram: 67 },
            { sao: 4, so_luong: 25, phan_tram: 21 },
            { sao: 3, so_luong: 10, phan_tram: 8 },
            { sao: 2, so_luong: 3, phan_tram: 2 },
            { sao: 1, so_luong: 2, phan_tram: 2 },
        ],
        binh_luan: [
            {
                id: 1,
                ten_nguoi_dung: 'Nguyễn Văn A',
                avatar: 'https://example.com/avatar1.jpg',
                danh_gia: 5,
                ngay: '15/04/2023',
                noi_dung: 'Áo rất thoải mái, thấm hút mồ hôi tốt. Tôi đã mặc nó khi chạy marathon và cảm thấy rất dễ chịu.',
                hinh_anh: [
                    'https://example.com/review1-1.jpg',
                    'https://example.com/review1-2.jpg',
                ],
            },
            {
                id: 2,
                ten_nguoi_dung: 'Trần Thị B',
                avatar: 'https://example.com/avatar2.jpg',
                danh_gia: 4,
                ngay: '02/05/2023',
                noi_dung: 'Chất liệu tốt, form áo đẹp. Tôi chỉ trừ 1 sao vì màu sắc hơi khác so với hình.',
                hinh_anh: [],
            },
        ],
    },
    san_pham_lien_quan: [
        {
            id: 'SP002',
            ten: 'Áo thể thao nam UltraSport',
            hinh_anh: 'https://example.com/sp2.jpg',
            gia_goc: 500000,
            gia_khuyen_mai: 400000,
            giam_gia: true,
            phan_tram_giam_gia: 20,
        },
        {
            id: 'SP003',
            ten: 'Áo thể thao nam SportElite',
            hinh_anh: 'https://example.com/sp3.jpg',
            gia_goc: 450000,
            gia_khuyen_mai: 450000,
            giam_gia: false,
            phan_tram_giam_gia: 0,
        },
        {
            id: 'SP004',
            ten: 'Áo thể thao nam ProRunner',
            hinh_anh: 'https://example.com/sp4.jpg',
            gia_goc: 550000,
            gia_khuyen_mai: 385000,
            giam_gia: true,
            phan_tram_giam_gia: 30,
        },
        {
            id: 'SP005',
            ten: 'Áo thể thao nam GymMaster',
            hinh_anh: 'https://example.com/sp5.jpg',
            gia_goc: 480000,
            gia_khuyen_mai: 384000,
            giam_gia: true,
            phan_tram_giam_gia: 20,
        },
        {
            id: 'SP006',
            ten: 'Áo thể thao nam FitPro',
            hinh_anh: 'https://example.com/sp6.jpg',
            gia_goc: 420000,
            gia_khuyen_mai: 420000,
            giam_gia: false,
            phan_tram_giam_gia: 0,
        },
        {
            id: 'SP007',
            ten: 'Áo thể thao nam SpeedRun',
            hinh_anh: 'https://example.com/sp7.jpg',
            gia_goc: 490000,
            gia_khuyen_mai: 343000,
            giam_gia: true,
            phan_tram_giam_gia: 30,
        },
    ],
});

// Hàm lấy thông tin sản phẩm từ API
const fetchProductDetail = async (id) => {
    try {
        // Ở đây sẽ gọi API để lấy thông tin sản phẩm dựa vào ID
        // Ví dụ: const response = await axios.get(`/api/products/${id}`);
        // Sau đó cập nhật dữ liệu sản phẩm
        // product.value = response.data;

        // Hiện tại chỉ log ra ID để kiểm tra
        console.log('Đang lấy thông tin sản phẩm có ID:', id);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    }
};

// State cho gallery
const currentImageIndex = ref(0);
const showFullscreen = ref(false);
const zoomActive = ref(false);
const zoomPosition = ref({ x: 0, y: 0 });
const zoomVisible = ref(false);

// Tính toán hình ảnh hiện tại
const currentImage = computed(() => {
    if (product.value.hinh_anh && product.value.hinh_anh.length > 0) {
        return product.value.hinh_anh[currentImageIndex.value].url;
    }
    return '';
});

// State cho thông tin sản phẩm
const selectedColor = ref(null);
const selectedSize = ref(null);
const quantity = ref(1);

// State cho tabs
const activeTab = ref('description');

// Tính toán phần trăm giảm giá
const discountPercent = computed(() => {
    if (product.value.giam_gia && product.value.gia_goc > 0 && product.value.gia_khuyen_mai > 0) {
        return Math.round(((product.value.gia_goc - product.value.gia_khuyen_mai) / product.value.gia_goc) * 100);
    }
    return 0;
});

// Tính toán trạng thái tồn kho
const stockStatus = computed(() => {
    if (product.value.so_luong_ton <= 0) {
        return { text: 'Hết hàng', class: 'out-of-stock' };
    } else if (product.value.so_luong_ton < 10) {
        return { text: `Còn ${product.value.so_luong_ton} sản phẩm`, class: 'low-stock' };
    } else {
        return { text: 'Còn hàng', class: '' };
    }
});

// Xử lý chuyển ảnh
const changeImage = (index) => {
    currentImageIndex.value = index;
};

const nextImage = () => {
    if (product.value.hinh_anh && product.value.hinh_anh.length > 0) {
        currentImageIndex.value = (currentImageIndex.value + 1) % product.value.hinh_anh.length;
    }
};

const prevImage = () => {
    if (product.value.hinh_anh && product.value.hinh_anh.length > 0) {
        currentImageIndex.value = (currentImageIndex.value - 1 + product.value.hinh_anh.length) % product.value.hinh_anh.length;
    }
};

// Xử lý zoom ảnh
const handleMouseMove = (event) => {
    if (!zoomActive.value) return;

    const imageContainer = event.currentTarget;
    const { left, top, width, height } = imageContainer.getBoundingClientRect();

    const x = (event.clientX - left) / width;
    const y = (event.clientY - top) / height;

    zoomPosition.value = { x, y };

    // Hiển thị kết quả zoom
    const zoomResult = document.querySelector('.zoom-result');
    if (zoomResult && currentImage.value) {
        zoomResult.style.backgroundImage = `url(${currentImage.value})`;
        zoomResult.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
        zoomResult.style.backgroundSize = '300%';
    }
};

const handleMouseEnter = () => {
    zoomActive.value = true;
    zoomVisible.value = true;
};

const handleMouseLeave = () => {
    zoomActive.value = false;
    zoomVisible.value = false;
};

// Xử lý chọn màu sắc và kích thước
const selectColor = (color) => {
    selectedColor.value = color;
};

const selectSize = (size) => {
    if (size.co_san) {
        selectedSize.value = size;
    }
};

// Xử lý số lượng
const increaseQuantity = () => {
    if (quantity.value < product.value.so_luong_ton) {
        quantity.value++;
    }
};

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

// Xử lý chuyển tab
const changeTab = (tab) => {
    activeTab.value = tab;
};

// Xử lý thêm vào giỏ hàng
const addToCart = () => {
    // Xử lý thêm vào giỏ hàng
    console.log('Thêm vào giỏ hàng:', {
        product: product.value.ma_san_pham,
        color: selectedColor.value?.ma,
        size: selectedSize.value?.ma,
        quantity: quantity.value
    });
};

// Xử lý mua ngay
const buyNow = () => {
    // Xử lý mua ngay
    console.log('Mua ngay:', {
        product: product.value.ma_san_pham,
        color: selectedColor.value?.ma,
        size: selectedSize.value?.ma,
        quantity: quantity.value
    });
};

// State cho carousel sản phẩm đề xuất
const currentSlide = ref(0);
const itemsPerSlide = ref(5);
const totalSlides = computed(() => {
    if (product.value.san_pham_lien_quan && product.value.san_pham_lien_quan.length > 0) {
        return Math.ceil(product.value.san_pham_lien_quan.length / itemsPerSlide.value);
    }
    return 0;
});

// Xử lý chuyển slide
const nextSlide = () => {
    if (currentSlide.value < totalSlides.value - 1) {
        currentSlide.value++;
    } else {
        currentSlide.value = 0;
    }
};

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--;
    } else {
        currentSlide.value = totalSlides.value - 1;
    }
};

// Tính toán các sản phẩm hiển thị trong slide hiện tại
const visibleProducts = computed(() => {
    if (product.value.san_pham_lien_quan && product.value.san_pham_lien_quan.length > 0) {
        const start = currentSlide.value * itemsPerSlide.value;
        const end = start + itemsPerSlide.value;
        return product.value.san_pham_lien_quan.slice(start, end);
    }
    return [];
});

// Định dạng tiền tệ
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hiệu ứng scroll animation
const productGalleryRef = ref(null);
const productInfoRef = ref(null);
const productTabsRef = ref(null);
const recommendedProductsRef = ref(null);

const setupScrollAnimation = (target, delay = 0) => {
    const { stop } = useIntersectionObserver(
        target,
        ([{ isIntersecting }]) => {
            if (isIntersecting) {
                if (target.value) {
                    target.value.style.opacity = '1';
                    target.value.style.transform = 'translateY(0)';
                }
                stop();
            }
        },
        { threshold: 0.1 }
    );
};

// Theo dõi thay đổi của ID sản phẩm
watch(productId, (newId) => {
    if (newId) {
        fetchProductDetail(newId);
    }
}, { immediate: true });

onMounted(() => {
    // Lấy thông tin sản phẩm khi component được mount
    if (productId.value) {
        fetchProductDetail(productId.value);
    }

    // Khởi tạo màu sắc và kích thước mặc định
    if (product.value.mau_sac && product.value.mau_sac.length > 0) {
        selectedColor.value = product.value.mau_sac[0];
    }

    if (product.value.kich_thuoc && product.value.kich_thuoc.length > 0) {
        selectedSize.value = product.value.kich_thuoc[0];
    }

    // Thiết lập hiệu ứng scroll animation
    setupScrollAnimation(productGalleryRef);
    setupScrollAnimation(productInfoRef, 100);
    setupScrollAnimation(productTabsRef, 200);
    setupScrollAnimation(recommendedProductsRef, 300);

    // Cập nhật itemsPerSlide dựa trên kích thước màn hình
    const updateItemsPerSlide = () => {
        if (window.innerWidth <= 576) {
            itemsPerSlide.value = 1;
        } else if (window.innerWidth <= 768) {
            itemsPerSlide.value = 2;
        } else if (window.innerWidth <= 992) {
            itemsPerSlide.value = 3;
        } else if (window.innerWidth <= 1200) {
            itemsPerSlide.value = 4;
        } else {
            itemsPerSlide.value = 5;
        }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
});
</script>

<style scoped>
/* Kiểu dáng chung */
.product-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
}

.breadcrumb-container {
    margin-bottom: 20px;
}

.breadcrumb {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

.breadcrumb-item {
    display: inline-block;
    font-size: 14px;
}

.breadcrumb-item+.breadcrumb-item::before {
    content: '/';
    padding: 0 8px;
    color: #6c757d;
}

.breadcrumb-item a {
    color: #007bff;
    text-decoration: none;
}

.breadcrumb-item.active {
    color: #6c757d;
}

.product-main-content {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 30px;
}

/* Kiểu dáng gallery */
.product-gallery {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.main-image-container {
    position: relative;
    margin-bottom: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-zoom-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    /* Tỷ lệ khung hình 1:1 */
    overflow: hidden;
}

.main-product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.zoom-lens {
    position: absolute;
    border: 2px solid #fff;
    width: 100px;
    height: 100px;
    cursor: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    pointer-events: none;
}

.zoom-result {
    position: absolute;
    top: 0;
    right: -320px;
    width: 300px;
    height: 300px;
    border: 1px solid #ddd;
    background-repeat: no-repeat;
    z-index: 100;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    pointer-events: none;
}

@media (max-width: 992px) {
    .zoom-result {
        display: none !important;
    }
}

.image-controls {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 15px;
}

.control-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.thumbnails-container {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #007bff #f0f0f0;
}

.thumbnails-container::-webkit-scrollbar {
    height: 6px;
}

.thumbnails-container::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
}

.thumbnails-container::-webkit-scrollbar-thumb {
    background-color: #007bff;
    border-radius: 10px;
}

.thumbnail-wrapper {
    width: 80px;
    height: 80px;
    border: 2px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.thumbnail-wrapper.active {
    border-color: #007bff;
}

.thumbnail-wrapper:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Kiểu dáng modal xem toàn màn hình */
.fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.fullscreen-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    height: 90vh;
    display: flex;
    flex-direction: column;
}

.close-fullscreen {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
}

.close-fullscreen:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: rotate(90deg);
}

.fullscreen-image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.fullscreen-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.fullscreen-thumbnails {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 15px 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #ffffff #333333;
}

.fullscreen-thumbnails::-webkit-scrollbar {
    height: 6px;
}

.fullscreen-thumbnails::-webkit-scrollbar-track {
    background: #333333;
    border-radius: 10px;
}

.fullscreen-thumbnails::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 10px;
}

.fullscreen-controls {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
}

.fullscreen-controls .control-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.fullscreen-controls .control-btn:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

/* Kiểu dáng phần thông tin sản phẩm */
.product-info {
    flex: 1;
    min-width: 300px;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.product-badges {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.badge {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge-sale {
    background-color: #ff69b4;
    color: #fff;
}

.badge-new {
    background-color: #4CAF50;
    color: #fff;
}

.product-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    position: relative;
    padding-bottom: 10px;
}

.product-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: #007bff;
}

.product-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.meta-label {
    font-weight: bold;
    color: #6c757d;
}

.meta-value {
    color: #333;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.current-price {
    font-size: 28px;
    font-weight: bold;
    color: #ff5722;
}

.original-price {
    font-size: 18px;
    color: #6c757d;
    text-decoration: line-through;
}

.discount-percent {
    font-size: 18px;
    color: #ff69b4;
    font-weight: bold;
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.stars {
    display: flex;
    gap: 5px;
    color: #ffc107;
}

.rating-count {
    font-size: 14px;
    color: #6c757d;
}

.product-colors {
    margin-bottom: 20px;
}

.option-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.color-options {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.color-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.color-option.active {
    border: 2px solid #007bff;
    background-color: rgba(0, 123, 255, 0.05);
}

.color-option:hover:not(.active) {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-swatch {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-name {
    font-size: 14px;
    color: #333;
}

.product-sizes {
    margin-bottom: 20px;
}

.size-options {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.size-option {
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.2s ease;
    font-weight: bold;
}

.size-option.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
}

.size-option:hover:not(.active):not(.disabled) {
    border-color: #007bff;
    color: #007bff;
}

.size-option.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
}

.product-quantity {
    margin-bottom: 20px;
}

.quantity-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
}

.quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-input {
    width: 60px;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 16px;
    text-align: center;
}

.stock-status {
    margin-left: 15px;
    font-size: 14px;
    color: #28a745;
}

.stock-status.low-stock {
    color: #ff9800;
}

.stock-status.out-of-stock {
    color: #f44336;
}

.product-actions {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.btn-add-to-cart,
.btn-buy-now {
    padding: 12px 25px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.btn-add-to-cart {
    background-color: #007bff;
    color: #fff;
}

.btn-add-to-cart:hover:not(:disabled) {
    background-color: #0056b3;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-buy-now {
    background-color: #ff5722;
    color: #fff;
}

.btn-buy-now:hover:not(:disabled) {
    background-color: #e64a19;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 87, 34, 0.3);
}

.btn-add-to-cart:disabled,
.btn-buy-now:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.btn-add-to-wishlist {
    width: 45px;
    height: 45px;
    border: 1px solid #ddd;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 18px;
    color: #6c757d;
}

.btn-add-to-wishlist:hover {
    background-color: #f8f9fa;
    transform: scale(1.1);
}

.btn-add-to-wishlist .fa-heart {
    color: #ff5252;
}

.product-delivery-info {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.delivery-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.delivery-item:last-child {
    margin-bottom: 0;
}

.delivery-item i {
    font-size: 18px;
    color: #007bff;
    width: 24px;
    text-align: center;
}

.delivery-item span {
    font-size: 14px;
    color: #333;
}

/* Hiệu ứng animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 992px) {
    .product-actions {
        flex-wrap: wrap;
    }

    .btn-add-to-cart,
    .btn-buy-now {
        flex: 1;
    }
}

@media (max-width: 576px) {
    .product-title {
        font-size: 24px;
    }

    .current-price {
        font-size: 24px;
    }

    .product-actions {
        flex-direction: column;
    }

    .btn-add-to-cart,
    .btn-buy-now {
        width: 100%;
        padding: 10px 15px;
        font-size: 14px;
    }
}

/* Kiểu dáng phần mô tả và tab */
.product-details-tabs {
    margin-top: 40px;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.tabs-header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #007bff #f0f0f0;
}

.tabs-header::-webkit-scrollbar {
    height: 6px;
}

.tabs-header::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
}

.tabs-header::-webkit-scrollbar-thumb {
    background-color: #007bff;
    border-radius: 10px;
}

.tab-btn {
    padding: 12px 25px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    color: #6c757d;
    position: relative;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.tab-btn::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 3px;
    background-color: #007bff;
    transition: width 0.3s ease;
}

.tab-btn:hover {
    color: #007bff;
}

.tab-btn:hover::after {
    width: 100%;
}

.tab-btn.active {
    color: #007bff;
}

.tab-btn.active::after {
    width: 100%;
}

.tabs-content {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-pane {
    padding: 25px;
    animation: fadeIn 0.3s ease;
}

.product-description {
    font-size: 16px;
    line-height: 1.6;
    color: #333;
}

.product-description h3 {
    font-size: 22px;
    margin-bottom: 15px;
    color: #333;
}

.product-description h4 {
    font-size: 18px;
    margin-bottom: 10px;
    margin-top: 20px;
    color: #333;
}

.product-description p {
    margin-bottom: 15px;
}

.product-description ul {
    margin-bottom: 15px;
    padding-left: 20px;
}

.product-description li {
    margin-bottom: 8px;
}

.specifications-table {
    width: 100%;
    border-collapse: collapse;
}

.specifications-table tr:nth-child(odd) {
    background-color: #f9f9f9;
}

.specifications-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
}

.spec-name {
    font-weight: bold;
    width: 30%;
    color: #555;
}

.spec-value {
    color: #333;
}

.reviews-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.average-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    min-width: 150px;
}

.rating-number {
    font-size: 48px;
    font-weight: bold;
    color: #333;
    line-height: 1;
}

.rating-stars {
    display: flex;
    gap: 5px;
    color: #ffc107;
    font-size: 20px;
}

.rating-count {
    font-size: 16px;
    color: #6c757d;
}

.rating-bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 250px;
}

.rating-bar-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.rating-label {
    font-size: 14px;
    color: #333;
    width: 50px;
}

.rating-bar {
    flex: 1;
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;
}

.rating-bar-fill {
    height: 100%;
    background-color: #ffc107;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.rating-percent {
    font-size: 14px;
    color: #6c757d;
    width: 40px;
    text-align: right;
}

.reviews-list {
    margin-bottom: 20px;
}

.review-item {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    animation: fadeIn 0.3s ease;
}

.review-item:last-child {
    border-bottom: none;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.reviewer-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
}

.reviewer-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.reviewer-name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.review-rating {
    display: flex;
    gap: 3px;
    color: #ffc107;
}

.review-date {
    font-size: 14px;
    color: #6c757d;
    margin-bottom: 10px;
}

.review-content {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 15px;
}

.review-images {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.review-image {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
}

.review-image:hover {
    transform: scale(1.05);
}

.review-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-reviews {
    padding: 30px;
    text-align: center;
    color: #6c757d;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Responsive cho phần tab */
@media (max-width: 992px) {
    .reviews-summary {
        flex-direction: column;
        gap: 20px;
    }

    .average-rating {
        align-items: flex-start;
    }
}

@media (max-width: 768px) {
    .tab-btn {
        padding: 10px 15px;
        font-size: 14px;
    }

    .review-image {
        width: 80px;
        height: 80px;
    }

    .fullscreen-thumbnails .thumbnail-wrapper {
        width: 60px;
        height: 60px;
    }
}

@media (max-width: 576px) {
    .tab-pane {
        padding: 15px;
    }

    .product-description {
        font-size: 14px;
    }

    .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}

/* Kiểu dáng phần sản phẩm đề xuất */
.recommended-products {
    margin-top: 40px;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.section-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
    color: #333;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: #007bff;
}

.products-carousel {
    position: relative;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    border: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
}

.carousel-control:hover:not(:disabled) {
    background-color: #007bff;
    color: #fff;
    transform: translateY(-50%) scale(1.1);
}

.carousel-control:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.carousel-control.prev {
    left: 10px;
}

.carousel-control.next {
    right: 10px;
}

.carousel-container {
    overflow: hidden;
}

.carousel-track {
    display: flex;
    gap: 20px;
    transition: transform 0.5s ease;
}

.product-card {
    flex: 0 0 20%;
    max-width: 20%;
    animation: fadeIn 0.3s ease;
}

.product-card-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-card-image img {
    transform: scale(1.05);
}

.product-card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-card-overlay {
    opacity: 1;
}

.overlay-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 5px;
    transition: all 0.2s ease;
}

.overlay-btn.view {
    background-color: #fff;
    color: #333;
}

.overlay-btn.view:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
}

.overlay-btn.cart {
    background-color: #007bff;
    color: #fff;
}

.overlay-btn.cart:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

.product-card-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #ff69b4;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    z-index: 1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-card-info {
    padding: 15px 10px;
}

.product-card-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    height: 40px;
}

.product-card-price {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.product-card-price .current-price {
    font-size: 18px;
    font-weight: bold;
    color: #ff5722;
}

.product-card-price .original-price {
    font-size: 14px;
    color: #6c757d;
    text-decoration: line-through;
}

/* Responsive cho phần sản phẩm đề xuất */
@media (max-width: 1200px) {
    .product-card {
        flex: 0 0 25%;
        max-width: 25%;
    }
}

@media (max-width: 992px) {
    .product-card {
        flex: 0 0 33.333%;
        max-width: 33.333%;
    }
}

@media (max-width: 768px) {
    .product-card {
        flex: 0 0 50%;
        max-width: 50%;
    }
}

@media (max-width: 576px) {
    .product-card {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
</style>