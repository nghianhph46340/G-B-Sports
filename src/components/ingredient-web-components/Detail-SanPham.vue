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
                        <div class="slider-container">
                            <!-- All images in the product gallery are rendered, but only current one is visible -->
                            <div v-for="(image, index) in product.hinh_anh" :key="index" class="slide-image" :class="{
                                'active': index === currentImageIndex,
                                'previous': isPreviousImage(index),
                                'next': isNextImage(index)
                            }" :style="{ 'background-image': `url(${image.url})` }" @mousemove="handleMouseMove"
                                @mouseleave="handleMouseLeave">
                            </div>
                        </div>
                        <div class="zoom-lens" ref="zoomLens" v-show="zoomActive"></div>
                        <div class="zoom-result" ref="zoomResult" v-show="zoomVisible"></div>
                    </div>
                    <div class="image-controls">
                        <button class="control-btn prev-btn" @click="prevImage" :disabled="currentImageIndex === 0">
                            <left-outlined />
                        </button>
                        <button class="control-btn fullscreen-btn" @click="showFullscreen = true">
                            <expand-outlined />
                        </button>
                        <button class="control-btn next-btn" @click="nextImage"
                            :disabled="currentImageIndex === product.hinh_anh.length - 1">
                            <right-outlined />
                        </button>
                    </div>
                </div>
                <div class="thumbnails-container">
                    <div class="thumbnail-wrapper" v-for="(image, index) in product.hinh_anh" :key="index"
                        @click="changeImage(index)" :class="{ active: currentImageIndex === index }">
                        <div class="color-indicator" :style="{ backgroundColor: image.color_code }"
                            :title="image.color_name">
                        </div>
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
                    <span class="current-price" @input="handleGiaBanInput" @blur="handleGiaBanBlur">{{ formatCurrency(product.gia_khuyen_mai) }}</span>
                    <span class="original-price" v-if="product.giam_gia">{{ formatCurrency(product.gia_goc) }}</span>
                    <span class="discount-percent" v-if="product.giam_gia">(-{{ discountPercent }}%)</span>
                </div>

                <div class="product-rating">
                    <div class="stars">
                        <star-filled v-for="i in Math.floor(product.danh_gia)" :key="'star-' + i" />
                        <star-two-tone v-if="product.danh_gia % 1 >= 0.5" twoToneColor="#ffc107" />
                        <star-outlined v-for="i in (5 - Math.ceil(product.danh_gia))" :key="'empty-star-' + i" />
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
                        <button v-for="(size, index) in availableSizes" :key="'size-' + index" class="size-option"
                            :class="{ active: selectedSize === size.ma, disabled: !size.co_san }"
                            @click="selectSize(size)" :disabled="!size.co_san">
                            {{ size.ten }}
                        </button>
                    </div>
                </div>

                <div class="product-quantity">
                    <h3 class="option-title">Số lượng:</h3>
                    <div class="quantity-selector mb-3">
                        <button class="quantity-btn minus" @click="decreaseQuantity" :disabled="quantity <= 1">
                            <minus-outlined />
                        </button>
                        <input type="number" v-model.number="quantity" min="1" max="99" class="quantity-input">
                        <button class="quantity-btn plus" @click="increaseQuantity" :disabled="quantity >= 99">
                            <plus-outlined />
                        </button>
                    </div>
                    <span class="stock-status mt-2" v-if="stockStatus.check">{{ stockStatus.text }}</span>
                    <span class="stock-status low-stock mt-2"
                        v-else-if="stockStatus.text === `Còn ${product.so_luong} sản phẩm`">{{ stockStatus.text
                        }}</span>
                    <span class="stock-status out-of-stock" v-else>{{ stockStatus.text }}</span>
                </div>

                <div class="product-actions">
                    <button class="btn-add-to-cart" @click="addToCartFromDetail">
                        <shopping-cart-outlined />
                        Thêm vào giỏ hàng
                        <span v-if="cartCount > 0" class="cart-count-badge">{{ cartCount }}</span>
                    </button>
                    <button class="btn-buy-now" @click="buyNow">
                        <thunderbolt-outlined />
                        Mua ngay
                    </button>
                    <button class="btn-add-to-wishlist" @click="toggleWishlist">
                        <heart-filled v-if="isInWishlist" class="heart-icon filled" />
                        <heart-outlined v-else class="heart-icon outlined" />
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
                                <star-filled v-for="i in Math.floor(product.danh_gia)" :key="'rev-star-' + i" />
                                <star-two-tone v-if="product.danh_gia % 1 >= 0.5" twoToneColor="#ffc107" />
                                <star-outlined v-for="i in (5 - Math.ceil(product.danh_gia))"
                                    :key="'rev-empty-star-' + i" />
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
                                    <star-filled v-for="i in review.danh_gia" :key="'review-star-' + i" />
                                    <star-outlined v-for="i in (5 - review.danh_gia)" :key="'review-empty-star-' + i" />
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
                    <left-outlined />
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
                                    <button class="overlay-btn cart" @click="addToCart(product)">
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
                    <right-outlined />
                </button>
            </div>
        </div>

        <!-- Modal xem ảnh toàn màn hình -->
        <div class="fullscreen-modal" v-if="showFullscreen" @click="showFullscreen = false">
            <div class="fullscreen-content" @click.stop>
                <button class="close-fullscreen" @click="showFullscreen = false">
                    <close-outlined />
                </button>
                <div class="fullscreen-image-container">
                    <div class="slider-container">
                        <div v-for="(image, index) in product.hinh_anh" :key="index"
                            class="slide-image fullscreen-slide" :class="{
                                'active': index === currentImageIndex,
                                'previous': isPreviousImage(index),
                                'next': isNextImage(index)
                            }" :style="{ 'background-image': `url(${image.url})` }">
                        </div>
                    </div>
                </div>
                <div class="fullscreen-thumbnails">
                    <div class="thumbnail-wrapper" v-for="(image, index) in product.hinh_anh" :key="index"
                        @click="changeImage(index)" :class="{ active: currentImageIndex === index }">
                        <div class="color-indicator" :style="{ backgroundColor: image.color_code }"
                            :title="image.color_name">
                        </div>
                        <img :src="image.url" alt="Thumbnail" class="thumbnail-image">
                    </div>
                </div>
                <div class="fullscreen-controls">
                    <button class="control-btn prev-btn" @click.stop="prevImage" :disabled="currentImageIndex === 0">
                        <left-outlined />
                    </button>
                    <button class="control-btn next-btn" @click.stop="nextImage"
                        :disabled="currentImageIndex === product.hinh_anh.length - 1">
                        <right-outlined />
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal notificación carrito -->
        <a-modal v-model:open="cartNotification" :footer="null" :mask-closable="true" :width="400"
            class="cart-notification-modal">
            <div class="cart-notification">
                <div class="notification-header">
                    <check-circle-outlined class="success-icon" />
                    <h3>Đã thêm vào giỏ hàng!</h3>
                </div>

                <div class="notification-product" v-if="lastAddedProduct">
                    <img :src="lastAddedProduct.image" :alt="lastAddedProduct.name" class="product-thumbnail">
                    <div class="product-info">
                        <h4>{{ lastAddedProduct.name }}</h4>
                        <div class="product-variants" v-if="lastAddedProduct.color || lastAddedProduct.size">
                            <span v-if="lastAddedProduct.color">Màu: {{ lastAddedProduct.color }}</span>
                            <span v-if="lastAddedProduct.size">Size: {{ lastAddedProduct.size }}</span>
                        </div>
                        <div class="product-quantity-price">
                            <span class="quantity">SL: {{ lastAddedProduct.quantity }}</span>
                            <span class="price">{{ formatCurrency(lastAddedProduct.price) }}</span>
                        </div>
                    </div>
                </div>

                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Giỏ hàng của bạn</span>
                        <span>{{ cartItems.length }} sản phẩm</span>
                    </div>
                    <div class="summary-row total">
                        <span>Tổng tiền:</span>
                        <span>{{ formatCurrency(cartTotal) }}</span>
                    </div>
                </div>

                <div class="notification-actions">
                    <a-button @click="cartNotification = false">
                        Tiếp tục mua sắm
                    </a-button>
                    <a-button type="primary" @click="viewCart">
                        Xem giỏ hàng
                    </a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import {
    HeartFilled,
    HeartOutlined,
    LeftOutlined,
    RightOutlined,
    ExpandOutlined,
    CloseOutlined,
    StarFilled,
    StarOutlined,
    ShoppingCartOutlined,
    ThunderboltOutlined,
    PlusOutlined,
    MinusOutlined,
    StarTwoTone,
    EyeOutlined,
    CheckCircleOutlined
} from '@ant-design/icons-vue';
import { useGbStore } from '@/stores/gbStore';
import { notification, message } from 'ant-design-vue';

// Lấy ID sản phẩm từ tham số URL
const route = useRoute();
const productId = computed(() => route.params.id);
const store = useGbStore();
const router = useRouter();

// Dữ liệu chi tiết sản phẩm
const productDetails = ref([]);
const selectedVariant = ref(null);

// Dữ liệu sản phẩm
const product = ref({
    ma_san_pham: '',
    ten_san_pham: '',
    thuong_hieu: '',
    danh_muc: '',
    chat_lieu: '',
    gia_goc: 0,
    gia_khuyen_mai: 0,
    giam_gia: false,
    phan_tram_giam_gia: 0,
    moi: false,
    danh_gia: 0,
    so_luot_danh_gia: 0,
    so_luong: 0,
    ngay_tao: '',
    mau_sac: [],
    kich_thuoc: [],
    mo_ta: '',
    thong_so_ky_thuat: [],
    hinh_anh: [],
    danh_gia_chi_tiet: {
        trung_binh: 0,
        tong_so: 0,
        chi_tiet: [],
        binh_luan: []
    },
    san_pham_lien_quan: []
});

// Thêm vào script setup
// Thêm ref để lưu trữ hình ảnh theo màu sắc
const imagesByColor = ref(new Map());
const allImages = ref([]);

// Cập nhật hàm fetchProductDetail để tạo map hình ảnh theo màu
const fetchProductDetail = async (id) => {
    try {
        // Gọi API để lấy chi tiết sản phẩm từ store
        await store.getCTSPBySanPhamFull(id);

        // Cập nhật dữ liệu chi tiết sản phẩm
        if (store.cTSPBySanPhamFull && store.cTSPBySanPhamFull.length > 0) {
            productDetails.value = store.cTSPBySanPhamFull;

            // Lấy chi tiết sản phẩm đầu tiên làm mặc định
            selectedVariant.value = productDetails.value[0];

            // Gộp tất cả hình ảnh và tổ chức theo màu sắc
            organizeImagesByColor();

            // Cập nhật thông tin sản phẩm từ variant đầu tiên
            updateProductFromVariant(selectedVariant.value);

            // Khởi tạo danh sách màu sắc và kích thước
            initializeColorAndSizeOptions();

            console.log('Đã load chi tiết sản phẩm:', productDetails.value);
        } else {
            message.error('Không tìm thấy thông tin sản phẩm');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        message.error('Đã xảy ra lỗi khi tải thông tin sản phẩm');
    }
};

// Sửa hàm initializeColorAndSizeOptions để không tự động chọn màu và size đầu tiên
const initializeColorAndSizeOptions = () => {
    // Tạo danh sách màu sắc duy nhất
    const uniqueColors = new Map();
    const uniqueSizes = new Map();

    productDetails.value.forEach(variant => {
        // Thêm màu sắc
        if (variant.id_mau_sac && !uniqueColors.has(variant.id_mau_sac)) {
            uniqueColors.set(variant.id_mau_sac, {
                ma: variant.id_mau_sac,
                ten: variant.ten_mau_sac || `Màu ${variant.id_mau_sac}`,
                ma_mau: getColorCode(variant.id_mau_sac)
            });
        }

        // Thêm kích thước
        if (variant.id_kich_thuoc && !uniqueSizes.has(variant.id_kich_thuoc)) {
            uniqueSizes.set(variant.id_kich_thuoc, {
                ma: variant.id_kich_thuoc,
                ten: variant.gia_tri || `Size ${variant.id_kich_thuoc}`,
                co_san: variant.trang_thai === 'Hoạt động'
            });
        }
    });

    // Cập nhật danh sách màu sắc và kích thước
    product.value.mau_sac = Array.from(uniqueColors.values());
    product.value.kich_thuoc = Array.from(uniqueSizes.values());

    console.log('Màu sắc:', product.value.mau_sac);
    console.log('Kích thước:', product.value.kich_thuoc);

    // Không tự động chọn màu và kích thước đầu tiên làm mặc định
    selectedColor.value = null;
    selectedColorName.value = '';
    selectedSize.value = null;
    selectedSizeName.value = '';
};

// Thêm lại hàm lấy mã màu
const getColorCode = (colorId) => {
    const colorMap = {
        4: '#000000', // Đen
        5: '#FFFFFF', // Trắng
        1: '#FF0000', // Đỏ
        2: '#0000FF', // Xanh dương
        3: '#FFFF00', // Vàng
        6: '#FF66FF', // Xanh lá
        8: '#FFA500', // Cam
        7: '#800080', // Tím
        9: '#A52A2A', // Nâu
        10: '#808080', // Xám
        // Thêm các màu khác nếu cần
    };

    return colorMap[colorId] || '#CCCCCC';
};

// Cập nhật organizeImagesByColor để gộp tất cả ảnh vào một danh sách chung
const organizeImagesByColor = () => {
    // Khởi tạo map mới
    imagesByColor.value = new Map();
    allImages.value = [];

    // Duyệt qua tất cả variants để lấy hình ảnh
    productDetails.value.forEach(variant => {
        if (variant.hinh_anh) {
            let variantImages = [];

            // Xử lý hình ảnh dựa trên loại dữ liệu
            if (Array.isArray(variant.hinh_anh)) {
                variantImages = variant.hinh_anh.map((url, index) => ({
                    id: `${variant.id_mau_sac}_${index}`,
                    url: url,
                    alt: `${variant.ten_san_pham} - ${variant.gia_tri || 'Kích thước'} - ${variant.ten_mau_sac || 'Màu'} - Hình ${index + 1}`,
                    color_id: variant.id_mau_sac,
                    color_name: variant.ten_mau_sac || `Màu ${variant.id_mau_sac}`,
                    color_code: getColorCode(variant.id_mau_sac)
                }));
            } else if (typeof variant.hinh_anh === 'string') {
                if (variant.hinh_anh.includes(',')) {
                    // Nếu là chuỗi URL phân tách bằng dấu phẩy, tách thành mảng
                    const imageUrls = variant.hinh_anh.split(',').map(url => url.trim()).filter(url => url);
                    variantImages = imageUrls.map((url, index) => ({
                        id: `${variant.id_mau_sac}_${index}`,
                        url: url,
                        alt: `${variant.ten_san_pham} - ${variant.gia_tri || 'Kích thước'} - ${variant.ten_mau || 'Màu'} - Hình ${index + 1}`,
                        color_id: variant.id_mau_sac,
                        color_name: variant.ten_mau_sac || `Màu ${variant.id_mau_sac}`,
                        color_code: getColorCode(variant.id_mau_sac)
                    }));
                } else {
                    // Nếu chỉ là một URL đơn
                    variantImages = [{
                        id: `${variant.id_mau_sac}_0`,
                        url: variant.hinh_anh,
                        alt: `${variant.ten_san_pham} - ${variant.gia_tri || 'Kích thước'} - ${variant.ten_mau_sac || 'Màu'}`,
                        color_id: variant.id_mau_sac,
                        color_name: variant.ten_mau_sac || `Màu ${variant.id_mau_sac}`,
                        color_code: getColorCode(variant.id_mau_sac)
                    }];
                }
            }

            // Thêm vào map theo màu sắc
            if (variant.id_mau_sac && variantImages.length > 0) {
                if (!imagesByColor.value.has(variant.id_mau_sac)) {
                    imagesByColor.value.set(variant.id_mau_sac, []);
                }

                // Chỉ thêm ảnh mới chưa có trong danh sách
                variantImages.forEach(img => {
                    const existingImages = imagesByColor.value.get(variant.id_mau_sac);
                    const hasImage = existingImages.some(existing => existing.url === img.url);
                    if (!hasImage) {
                        existingImages.push(img);
                    }
                });

                // Thêm vào danh sách tất cả ảnh
                variantImages.forEach(img => {
                    const hasImage = allImages.value.some(existing => existing.url === img.url);
                    if (!hasImage) {
                        allImages.value.push(img);
                    }
                });
            }
        }
    });

    // Cập nhật hình ảnh cho sản phẩm - sử dụng tất cả hình ảnh
    product.value.hinh_anh = allImages.value;

    console.log('Hình ảnh theo màu sắc:', imagesByColor.value);
    console.log('Tất cả hình ảnh:', allImages.value);
};

// Sửa lại hàm cập nhật thông tin sản phẩm từ variant để KHÔNG thay đổi danh sách hình ảnh
const updateProductFromVariant = (variant) => {
    if (!variant) return;

    // Cập nhật thông tin cơ bản
    product.value.ma_san_pham = variant.ma_san_pham;
    product.value.ten_san_pham = variant.ten_san_pham;
    product.value.thuong_hieu = variant.ten_thuong_hieu;
    product.value.danh_muc = variant.ten_danh_muc;
    product.value.chat_lieu = variant.ten_chat_lieu;

    // Cập nhật giá
    product.value.gia_goc = variant.giaGoc;
    product.value.gia_khuyen_mai = variant.giaHienTai;

    // Kiểm tra nếu có khuyến mãi
    if (variant.kieuKhuyenMai && variant.giaTriKhuyenMai) {
        product.value.giam_gia = true;
        product.value.phan_tram_giam_gia = variant.giaTriKhuyenMai;
    } else {
        product.value.giam_gia = false;
        product.value.phan_tram_giam_gia = 0;
    }

    // Cập nhật đánh giá
    product.value.danh_gia = variant.danh_gia_trung_binh || 0;
    product.value.so_luot_danh_gia = variant.so_luong_danh_gia || 0;

    // Cập nhật số lượng
    product.value.so_luong = variant.so_luong || 0;

    // Cập nhật ngày tạo và tính toán trường moi
    if (variant.ngay_tao) {
        product.value.ngay_tao = variant.ngay_tao;

        // Tính khoảng cách giữa ngày hiện tại và ngày tạo (múi giờ +7 Việt Nam)
        const ngayTao = new Date(variant.ngay_tao);

        // Tạo ngày hiện tại theo múi giờ +7 (Việt Nam)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ngayHienTai = new Date(utc + (7 * 60 * 60 * 1000));

        const soNgayChenhLech = Math.floor((ngayHienTai - ngayTao) / (1000 * 60 * 60 * 24));

        // Nếu < 10 ngày thì sản phẩm là mới
        product.value.moi = soNgayChenhLech < 10;

        console.log('Ngày tạo:', variant.ngay_tao);
        console.log('Ngày hiện tại (múi giờ +7):', ngayHienTai.toISOString());
        console.log('Số ngày chênh lệch:', soNgayChenhLech, 'Là sản phẩm mới:', product.value.moi);
    } else {
        product.value.moi = false;
    }

    // Cập nhật trạng thái
    product.value.trang_thai = variant.trang_thai;

    // KHÔNG cập nhật danh sách hình ảnh, chỉ thay đổi hình ảnh hiện tại
    findAndShowFirstImageOfColor(variant.id_mau_sac);

    console.log('Đã cập nhật sản phẩm:', product.value);
};

// Hàm mới để tìm và hiển thị ảnh đầu tiên của màu được chọn
const findAndShowFirstImageOfColor = (colorId) => {
    // Tìm ảnh đầu tiên của màu được chọn
    const firstImageIndex = product.value.hinh_anh.findIndex(img => img.color_id === colorId);

    // Nếu tìm thấy và khác với ảnh hiện tại, chuyển đến ảnh đó với animation
    if (firstImageIndex !== -1 && firstImageIndex !== currentImageIndex.value) {
        // Thêm một trì hoãn nhỏ để tạo hiệu ứng mượt hơn
        setTimeout(() => {
            currentImageIndex.value = firstImageIndex;
        }, 100);
        console.log('Đã chuyển đến ảnh đầu tiên của màu có ID:', colorId, 'tại vị trí:', firstImageIndex);
    }
};

// Cập nhật hàm chọn màu sắc để lưu cả id và tên
const selectColor = (color) => {
    selectedColor.value = color.ma;
    selectedColorName.value = color.ten;

    // Tìm và hiển thị ảnh đầu tiên của màu được chọn
    findAndShowFirstImageOfColor(color.ma);

    // Luôn reset size selection khi chọn màu mới
    selectedSize.value = null;
    selectedSizeName.value = '';

    // Tìm variant phù hợp với màu đã chọn (không dùng kích thước vì đã reset)
    const variantWithColor = productDetails.value.find(variant => variant.id_mau_sac === color.ma);
    if (variantWithColor) {
        selectedVariant.value = variantWithColor;
        updateProductFromVariant(variantWithColor);
        console.log('Đã tìm variant với màu:', variantWithColor);
    }
};

// Xử lý chọn kích thước
const selectSize = (size) => {
    if (size.co_san) {
        selectedSize.value = size.ma;
        selectedSizeName.value = size.ten;

        // Tìm variant phù hợp với kích thước đã chọn và màu hiện tại (nếu có)
        updateSelectedVariant();
    }
};

// Cập nhật hàm updateSelectedVariant để xử lý tốt hơn
const updateSelectedVariant = () => {
    // Tìm variant phù hợp với màu và kích thước đã chọn
    const matchedVariant = productDetails.value.find(variant =>
        variant.id_mau_sac === selectedColor.value &&
        variant.id_kich_thuoc === selectedSize.value
    );

    if (matchedVariant) {
        selectedVariant.value = matchedVariant;
        updateProductFromVariant(matchedVariant);
        console.log('Đã tìm thấy variant phù hợp:', matchedVariant);
    } else {
        console.log('Không tìm thấy variant phù hợp với màu:', selectedColor.value, 'và kích thước:', selectedSize.value);
        // Tìm variant chỉ với màu đã chọn
        const variantWithColor = productDetails.value.find(variant => variant.id_mau_sac === selectedColor.value);
        if (variantWithColor) {
            selectedVariant.value = variantWithColor;
            updateProductFromVariant(variantWithColor);
            console.log('Đã tìm variant với màu:', variantWithColor);
        }
    }
};

// Cập nhật canAddToCart để không kiểm tra số lượng tồn kho
const canAddToCart = computed(() => {
    if (!selectedColor.value || !selectedSize.value) {
        return false;
    }

    // Kiểm tra có biến thể phù hợp không
    const matchedVariant = productDetails.value.find(variant =>
        variant.id_mau_sac === selectedColor.value &&
        variant.id_kich_thuoc === selectedSize.value
    );

    // Chỉ kiểm tra trạng thái và tồn tại, không kiểm tra số lượng
    return matchedVariant &&
        matchedVariant.trang_thai === 'Hoạt động' &&
        matchedVariant.so_luong > 0; // Chỉ cần có ít nhất 1 sản phẩm
});

// Thêm hàm để lấy số lượng còn lại của variant hiện tại
const getCurrentVariantStock = () => {
    const matchedVariant = productDetails.value.find(variant =>
        variant.id_mau_sac === selectedColor.value &&
        variant.id_kich_thuoc === selectedSize.value
    );

    return matchedVariant ? matchedVariant.so_luong : 0;
};

// Giới hạn số lượng tối đa có thể chọn
const maxAvailableQuantity = computed(() => {
    return getCurrentVariantStock();
});

// Cập nhật hàm tăng số lượng để kiểm tra số lượng tồn kho
const increaseQuantity = () => {
    // Kiểm tra đã chọn màu và kích thước chưa
    if (!selectedColor.value && !selectedSize.value) {
        notification.warning({
            message: 'Thông tin sản phẩm chưa đầy đủ',
            description: 'Vui lòng chọn màu sắc và kích thước trước khi thay đổi số lượng',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    if (!selectedColor.value) {
        notification.warning({
            message: 'Chưa chọn màu sắc',
            description: 'Vui lòng chọn màu sắc trước khi thay đổi số lượng',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    if (!selectedSize.value) {
        notification.warning({
            message: 'Chưa chọn kích thước',
            description: 'Vui lòng chọn kích thước trước khi thay đổi số lượng',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Tìm variant phù hợp để lấy số lượng tối đa
    const matchedVariant = productDetails.value.find(variant =>
        variant.id_mau_sac === selectedColor.value &&
        variant.id_kich_thuoc === selectedSize.value
    );

    if (!matchedVariant) {
        notification.warning({
            message: 'Không có sản phẩm phù hợp',
            description: 'Sản phẩm với màu sắc và kích thước này không có sẵn',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra số lượng tồn kho
    if (quantity.value < matchedVariant.so_luong) {
        quantity.value++;
    } else {
        notification.warning({
            message: 'Giới hạn số lượng',
            description: `Chỉ còn ${matchedVariant.so_luong} sản phẩm trong kho`,
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
    }
};

// Theo dõi thay đổi của ID sản phẩm
watch(productId, (newId) => {
    if (newId) {
        fetchProductDetail(newId);
    }
}, { immediate: true });

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
const selectedColorName = ref(null);
const selectedSize = ref(null);
const selectedSizeName = ref(null);
const quantity = ref(1);
const isInWishlist = ref(false);

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
    if (product.value.so_luong <= 0) {
        return { text: 'Hết hàng', class: 'out-of-stock' };
    } else if (product.value.so_luong < 10) {
        return { text: `Còn ${product.value.so_luong} sản phẩm`, class: 'low-stock' };
    } else {
        return { text: `Có ${product.value.so_luong} sản phẩm có sẵn`, class: '', check: true };
    }
});

// Xử lý chuyển ảnh
const changeImage = (index) => {
    // If clicking the same image, do nothing
    if (currentImageIndex.value === index) return;

    // Set slide direction based on index comparison
    slideDirection.value = index > currentImageIndex.value ? 'slide-right' : 'slide-left';

    // Delay the actual transition for smoother effect
    setTimeout(() => {
        currentImageIndex.value = index;
    }, 80);
};

const nextImage = () => {
    if (product.value.hinh_anh && product.value.hinh_anh.length > 0) {
        slideDirection.value = 'slide-right';
        // Update all slide classes before changing index
        setTimeout(() => {
            currentImageIndex.value = (currentImageIndex.value + 1) % product.value.hinh_anh.length;
        }, 50);
    }
};

const prevImage = () => {
    if (product.value.hinh_anh && product.value.hinh_anh.length > 0) {
        slideDirection.value = 'slide-left';
        // Update all slide classes before changing index
        setTimeout(() => {
            currentImageIndex.value = (currentImageIndex.value - 1 + product.value.hinh_anh.length) % product.value.hinh_anh.length;
        }, 50);
    }
};

// Xử lý zoom ảnh
const handleMouseMove = (event) => {
    if (!zoomActive.value) return;

    // Dừng slideshow khi đang zoom
    stopSlideshow();

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
    // Dừng slideshow khi hover lên ảnh
    stopSlideshow();
};

const handleMouseLeave = () => {
    zoomActive.value = false;
    zoomVisible.value = false;
    // Bắt đầu lại slideshow khi di chuột ra khỏi ảnh
    startSlideshow();
};

// Xử lý số lượng
const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

// Xử lý thêm vào giỏ hàng
const addToCart = (product) => {
    // Tạo đối tượng sản phẩm để thêm vào giỏ hàng
    const cartItem = {
        id: product.id_chi_tiet_san_pham || product.id_san_pham,
        name: product.ten_san_pham || product.ten,
        image: product.hinh_anh,
        price: product.gia_khuyen_mai || product.gia_ban,
        originalPrice: product.gia_goc,
        quantity: 1,
        maxQuantity: product.so_luong || 10, // Số lượng tối đa có thể mua
        color: product.ten_mau_sac || '',
        size: product.gia_tri || ''
    };

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cartItems.value.findIndex(item => item.id === cartItem.id);

    if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        if (cartItems.value[existingItemIndex].quantity < cartItems.value[existingItemIndex].maxQuantity) {
            cartItems.value[existingItemIndex].quantity += 1;
            showSuccessMessage('Đã tăng số lượng sản phẩm trong giỏ hàng!');

            // Gán sản phẩm vừa thêm
            lastAddedProduct.value = { ...cartItems.value[existingItemIndex] };
        } else {
            showWarningMessage('Số lượng sản phẩm đã đạt mức tối đa!');
            return;
        }
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cartItems.value.push(cartItem);
        showSuccessMessage('Đã thêm sản phẩm vào giỏ hàng!');

        // Gán sản phẩm vừa thêm
        lastAddedProduct.value = { ...cartItem };
    }

    // Lưu giỏ hàng vào localStorage
    saveCartToLocalStorage();

    // Hiển thị modal thông báo
    cartNotification.value = true;

    // Tự động đóng modal sau 5 giây
    setTimeout(() => {
        cartNotification.value = false;
    }, 5000);
};

// Xử lý thêm vào giỏ hàng từ trang chi tiết sản phẩm
const addToCartFromDetail = () => {
    // Kiểm tra đã chọn màu và kích thước chưa
    if (!selectedColor.value && !selectedSize.value) {
        notification.warning({
            message: 'Thông tin sản phẩm chưa đầy đủ',
            description: 'Vui lòng chọn màu sắc và kích thước',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    if (!selectedColor.value) {
        notification.warning({
            message: 'Chưa chọn màu sắc',
            description: 'Vui lòng chọn màu sắc cho sản phẩm',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    if (!selectedSize.value) {
        notification.warning({
            message: 'Chưa chọn kích thước',
            description: 'Vui lòng chọn kích thước cho sản phẩm',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Tìm variant phù hợp
    const matchedVariant = productDetails.value.find(variant =>
        variant.id_mau_sac === selectedColor.value &&
        variant.id_kich_thuoc === selectedSize.value
    );

    if (!matchedVariant) {
        notification.warning({
            message: 'Không có sản phẩm phù hợp',
            description: 'Sản phẩm với màu sắc và kích thước này không có sẵn',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra trạng thái của sản phẩm
    if (matchedVariant.trang_thai !== 'Hoạt động') {
        notification.warning({
            message: 'Sản phẩm không khả dụng',
            description: 'Sản phẩm này hiện không có sẵn để bán',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra số lượng
    if (matchedVariant.so_luong <= 0) {
        notification.warning({
            message: 'Hết hàng',
            description: 'Sản phẩm này hiện đã hết hàng',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra số lượng còn lại
    if (quantity.value > matchedVariant.so_luong) {
        notification.warning({
            message: 'Vượt quá số lượng trong kho',
            description: `Chỉ còn ${matchedVariant.so_luong} sản phẩm trong kho`,
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Nếu đã qua hết các kiểm tra, tiếp tục với variant đã tìm thấy
    selectedVariant.value = matchedVariant;

    // Tạo đối tượng sản phẩm để thêm vào giỏ hàng
    const cartItem = {
        id: selectedVariant.value.id_chi_tiet_san_pham,
        name: product.value.ten_san_pham,
        image: product.value.hinh_anh[0]?.url || '',
        price: product.value.gia_khuyen_mai || product.value.gia_ban_hien_tai,
        originalPrice: product.value.gia_goc,
        quantity: quantity.value,
        maxQuantity: selectedVariant.value.so_luong,
        color: selectedColorName.value,
        size: selectedSizeName.value
    };

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cartItems.value.findIndex(item => item.id === cartItem.id);

    if (existingItemIndex >= 0) {
        // Kiểm tra nếu thêm vào sẽ vượt quá số lượng tối đa
        const newQuantity = cartItems.value[existingItemIndex].quantity + cartItem.quantity;

        if (newQuantity <= cartItems.value[existingItemIndex].maxQuantity) {
            cartItems.value[existingItemIndex].quantity = newQuantity;
            notification.success({
                message: 'Thêm vào giỏ hàng',
                description: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng',
                placement: 'topRight',
                duration: 3,
                style: {
                    zIndex: 1500
                }
            });

            // Gán sản phẩm vừa thêm
            lastAddedProduct.value = { ...cartItems.value[existingItemIndex] };
        } else {
            notification.warning({
                message: 'Vượt quá số lượng trong kho',
                description: `Chỉ có thể thêm tối đa ${cartItems.value[existingItemIndex].maxQuantity} sản phẩm`,
                placement: 'topRight',
                duration: 3,
                style: {
                    zIndex: 1500
                }
            });
            return;
        }
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cartItems.value.push(cartItem);
        notification.success({
            message: 'Thêm vào giỏ hàng',
            description: 'Đã thêm sản phẩm vào giỏ hàng',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });

        // Gán sản phẩm vừa thêm
        lastAddedProduct.value = { ...cartItem };
    }

    // Lưu giỏ hàng vào localStorage
    saveCartToLocalStorage();

    // Hiển thị popup hoặc thực hiện các tác vụ khác sau khi thêm vào giỏ
    showAddedToCartModal.value = true;
    setTimeout(() => {
        showAddedToCartModal.value = false;
    }, 3000);
};

// Sửa lại hàm mua ngay để hiển thị thông báo cụ thể
const buyNow = () => {
    // Kiểm tra đã chọn màu và kích thước chưa
    if (!selectedColor.value && !selectedSize.value) {
        notification.warning({
            message: 'Thông tin sản phẩm chưa đầy đủ',
            description: 'Vui lòng chọn màu sắc và kích thước',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    if (!selectedColor.value) {
        notification.warning({
            message: 'Chưa chọn màu sắc',
            description: 'Vui lòng chọn màu sắc cho sản phẩm',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    if (!selectedSize.value) {
        notification.warning({
            message: 'Chưa chọn kích thước',
            description: 'Vui lòng chọn kích thước cho sản phẩm',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Tìm variant phù hợp
    const matchedVariant = productDetails.value.find(variant =>
        variant.id_mau_sac === selectedColor.value &&
        variant.id_kich_thuoc === selectedSize.value
    );

    if (!matchedVariant) {
        notification.warning({
            message: 'Không có sản phẩm phù hợp',
            description: 'Sản phẩm với màu sắc và kích thước này không có sẵn',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra trạng thái của sản phẩm
    if (matchedVariant.trang_thai !== 'Hoạt động') {
        notification.warning({
            message: 'Sản phẩm không khả dụng',
            description: 'Sản phẩm này hiện không có sẵn để bán',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra số lượng
    if (matchedVariant.so_luong <= 0) {
        notification.warning({
            message: 'Hết hàng',
            description: 'Sản phẩm này hiện đã hết hàng',
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Kiểm tra số lượng còn lại
    if (quantity.value > matchedVariant.so_luong) {
        notification.warning({
            message: 'Vượt quá số lượng trong kho',
            description: `Chỉ còn ${matchedVariant.so_luong} sản phẩm trong kho`,
            placement: 'topRight',
            duration: 3,
            style: {
                zIndex: 1500
            }
        });
        return;
    }

    // Nếu đã qua hết các kiểm tra, tiếp tục với variant đã tìm thấy
    selectedVariant.value = matchedVariant;

    // Xử lý mua ngay
    console.log('Mua ngay:', {
        product_id: productId.value,
        variant_id: selectedVariant.value.id_chi_tiet_san_pham,
        color: selectedColorName.value,
        size: selectedSizeName.value,
        quantity: quantity.value,
        price: product.value.gia_khuyen_mai || product.value.gia_ban_hien_tai,
        originalPrice: product.value.gia_goc
    });

    // Lấy URL hình ảnh an toàn
    let imageUrl = '';
    if (product.value.hinh_anh && product.value.hinh_anh.length > 0) {
        if (product.value.hinh_anh[currentImageIndex.value] && product.value.hinh_anh[currentImageIndex.value].url) {
            imageUrl = product.value.hinh_anh[currentImageIndex.value].url;
        } else {
            // Nếu không có URL, lấy hình ảnh đầu tiên
            imageUrl = product.value.hinh_anh[0]?.url || '';
        }
    }

    const checkoutItem = {
        id: selectedVariant.value.id_chi_tiet_san_pham,
        product_id: productId.value,
        ten_san_pham: product.value.ten_san_pham,
        hinh_anh: imageUrl,
        ten_mau_sac: selectedColorName.value,
        ten_kich_thuoc: selectedSizeName.value,
        gia: product.value.gia_khuyen_mai || product.value.gia_ban_hien_tai,
        so_luong: quantity.value,
        original_price: product.value.gia_goc
    };

    // Lưu vào store để trang thanh toán có thể sử dụng
    store.setCheckoutItems([checkoutItem]);

    // Chuyển hướng đến trang thanh toán
    router.push('/thanhtoan-banhang');
};

// Hiển thị thông báo thành công
const showSuccessMessage = (message) => {
    if (window.antd && window.antd.message) {
        window.antd.message.success(message);
    } else {
        alert(message);
    }
};

// Hiển thị thông báo cảnh báo
const showWarningMessage = (message) => {
    if (window.antd && window.antd.message) {
        window.antd.message.warning(message);
    } else {
        alert(message);
    }
};

// Tải giỏ hàng từ localStorage
const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('gb-sport-cart');
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            console.log('Đã tải giỏ hàng từ localStorage:', parsedCart);

            // Đảm bảo các giá trị số là số
            cartItems.value = parsedCart.map(item => ({
                ...item,
                price: Number(item.price || 0),
                quantity: Number(item.quantity || 1),
                maxQuantity: Number(item.maxQuantity || 10),
                originalPrice: Number(item.originalPrice || 0)
            }));
        } catch (error) {
            console.error('Lỗi khi tải giỏ hàng:', error);
            cartItems.value = [];
        }
    }
};

// Lưu giỏ hàng vào localStorage
const saveCartToLocalStorage = () => {
    // Đảm bảo tất cả các giá trị số được lưu dưới dạng số
    const cartToSave = cartItems.value.map(item => ({
        ...item,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        maxQuantity: Number(item.maxQuantity || 10),
        originalPrice: Number(item.originalPrice || 0)
    }));

    console.log('Lưu giỏ hàng vào localStorage:', cartToSave);
    localStorage.setItem('gb-sport-cart', JSON.stringify(cartToSave));

    // Phát ra sự kiện custom để cập nhật giỏ hàng
    window.dispatchEvent(new CustomEvent('cart-updated'));
};

// Tải giỏ hàng khi component được tạo
onMounted(() => {
    loadCartFromLocalStorage();

    // Cấu hình thông báo để nổi bật hơn
    message.config({
        top: '80px',
        duration: 3,
        maxCount: 3,
        rtl: false,
    });

    // Khởi tạo slideshow khi component mounted
    startSlideshow();
});

// Xử lý thêm vào danh sách yêu thích
const toggleWishlist = () => {
    isInWishlist.value = !isInWishlist.value;

    if (isInWishlist.value) {
        message.success('Đã thêm vào danh sách yêu thích');
    } else {
        message.info('Đã xóa khỏi danh sách yêu thích');
    }
};

// Xử lý chuyển tab
const changeTab = (tab) => {
    activeTab.value = tab;
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

onMounted(() => {
    // Lấy thông tin sản phẩm khi component được mount
    if (productId.value) {
        fetchProductDetail(productId.value);
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

// Add new ref for tracking slide direction in the script section
const slideDirection = ref('slide-right');

// Add the preload function in the script section
// Helper function to preload next and previous images
const getPreloadImages = () => {
    if (!product.value.hinh_anh || product.value.hinh_anh.length <= 1) return [];

    const preloadUrls = [];
    const currentIdx = currentImageIndex.value;
    const totalImages = product.value.hinh_anh.length;

    // Add next image
    const nextIdx = (currentIdx + 1) % totalImages;
    preloadUrls.push(product.value.hinh_anh[nextIdx].url);

    // Add previous image
    const prevIdx = (currentIdx - 1 + totalImages) % totalImages;
    preloadUrls.push(product.value.hinh_anh[prevIdx].url);

    return preloadUrls;
};

// Add helper functions in the script section to determine previous and next images
// Helper functions to determine previous and next images
const isPreviousImage = (index) => {
    if (slideDirection.value === 'slide-right') {
        return index === ((currentImageIndex.value - 1 + product.value.hinh_anh.length) % product.value.hinh_anh.length);
    }
    return false;
};

const isNextImage = (index) => {
    if (slideDirection.value === 'slide-left') {
        return index === ((currentImageIndex.value + 1) % product.value.hinh_anh.length);
    }
    return false;
};

// Giỏ hàng
const cartItems = ref([]);
const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// Modal notificación carrito
const cartNotification = ref(false);
const lastAddedProduct = ref(null);

// Tính tổng tiền của giỏ hàng
const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Chuyển đến trang giỏ hàng
const viewCart = () => {
    router.push('/giohang-banhang');
};

// Thêm computed property để lọc size dựa trên màu sắc đã chọn
const availableSizes = computed(() => {
    // Nếu chưa chọn màu, hiển thị tất cả size
    if (!selectedColor.value) {
        return product.value.kich_thuoc;
    }

    // Nếu đã chọn màu, lọc các size có trong màu đó
    const sizesForSelectedColor = [];
    const sizeMap = new Map(); // Map để đảm bảo không có size trùng lặp

    productDetails.value.forEach(variant => {
        if (variant.id_mau_sac === selectedColor.value) {
            // Nếu size này chưa được thêm vào danh sách
            if (!sizeMap.has(variant.id_kich_thuoc)) {
                // Tìm thông tin đầy đủ của size từ danh sách gốc
                const sizeInfo = product.value.kich_thuoc.find(size => size.ma === variant.id_kich_thuoc);
                if (sizeInfo) {
                    sizeMap.set(variant.id_kich_thuoc, true);
                    // Kiểm tra trạng thái của variant để cập nhật co_san
                    const isAvailable = variant.trang_thai === 'Hoạt động' && variant.so_luong > 0;
                    sizesForSelectedColor.push({
                        ...sizeInfo,
                        co_san: isAvailable
                    });
                }
            }
        }
    });

    console.log('Các size có sẵn cho màu', selectedColorName.value, ':', sizesForSelectedColor);
    return sizesForSelectedColor;
});

// Biến lưu trữ interval cho slideshow
const slideshowInterval = ref(null);
const slideshowDelay = 3000; // 3 giây cho mỗi slide

// Bắt đầu slideshow
const startSlideshow = () => {
    // Chỉ chạy slideshow khi có nhiều hơn 1 ảnh
    if (!product.value.hinh_anh || product.value.hinh_anh.length <= 1) return;

    // Xóa interval cũ nếu có
    stopSlideshow();

    // Tạo interval mới
    slideshowInterval.value = setInterval(() => {
        // Tăng chỉ số ảnh hiện tại, quay lại 0 nếu đã đến ảnh cuối
        if (currentImageIndex.value < product.value.hinh_anh.length - 1) {
            currentImageIndex.value++;
        } else {
            currentImageIndex.value = 0;
        }
    }, slideshowDelay);
};

// Dừng slideshow
const stopSlideshow = () => {
    if (slideshowInterval.value) {
        clearInterval(slideshowInterval.value);
        slideshowInterval.value = null;
    }
};

// Dọn dẹp khi component unmounted
onBeforeUnmount(() => {
    stopSlideshow();
});

// Thêm hàm validate giá bán
const validateGiaBan = (value) => {
    const numValue = parseFloat(String(value).replace(/,/g, ''));

    if (isNaN(numValue) || numValue === null) {
        return false;
    }

    if (numValue < 1000) {
        return false;
    }

    if (numValue > 100000000) {
        return false;
    }

    return true;
};

const handleGiaBanInput = (value) => {
    // Convert value to number for validation
    const numValue = parseFloat(String(value).replace(/,/g, ''));
    
    if (!isNaN(numValue)) {
        if (validateGiaBan(numValue)) {
            product.value.gia_goc = numValue;
            product.value.gia_khuyen_mai = numValue;
        } else {
            // If invalid, reset to minimum valid price
            product.value.gia_goc = 1000;
            product.value.gia_khuyen_mai = 1000;
        }
    }
};

// Add event handler for blur event
const handleGiaBanBlur = (e) => {
    const inputValue = e.target.value;
    if (!inputValue) {
        product.value.gia_goc = 1000;
        product.value.gia_khuyen_mai = 1000;
        return;
    }

    const numValue = parseFloat(String(inputValue).replace(/,/g, ''));
    if (!validateGiaBan(numValue)) {
        product.value.gia_goc = 1000;
        product.value.gia_khuyen_mai = 1000;
    }
};
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
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    background-color: #f8f8f8;
    /* Add background color as fallback */
}

.main-product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: center center;
    transition: transform 0.5s ease;
    backface-visibility: hidden;
    /* Prevent flickering */
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
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.thumbnail-wrapper.active {
    border-color: #007bff;
    transform: scale(1.08);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    z-index: 1;
}

.thumbnail-wrapper:hover:not(.active) {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.color-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    z-index: 5;
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
    animation: fadeIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fullscreen-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    animation: zoomIn 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        backdrop-filter: blur(0);
    }

    to {
        opacity: 1;
        backdrop-filter: blur(5px);
    }
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

/* Nâng cao hiệu ứng khi hover lên hình ảnh chính */
.image-zoom-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.image-zoom-container:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.main-product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.image-zoom-container:hover .main-product-image:not(:active) {
    transform: scale(1.03);
}

/* Animation cho color indicator */
.color-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    z-index: 5;
    transition: all 0.3s ease;
}

.thumbnail-wrapper:hover .color-indicator {
    transform: scale(1.2);
}

.thumbnail-wrapper.active .color-indicator {
    transform: scale(1.3);
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}

/* Animation cho color selection */
.color-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 2px solid transparent;
}

.color-option.active {
    border-color: #007bff;
    background-color: rgba(0, 123, 255, 0.05);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.color-option:hover:not(.active) {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-swatch {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.color-option:hover .color-swatch {
    transform: scale(1.1);
}

.color-option.active .color-swatch {
    transform: scale(1.15);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
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
    position: relative;
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
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.btn-add-to-wishlist:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 77, 79, 0.3);
    border-color: #ff4d4f;
}

.btn-add-to-wishlist:active {
    transform: translateY(0);
}

.heart-icon {
    font-size: 22px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.heart-icon.filled {
    color: #ff4d4f;
    animation: heartBeat 0.3s ease-in-out;
}

.heart-icon.outlined {
    color: #777;
}

.btn-add-to-wishlist:hover .heart-icon.outlined {
    color: #ff4d4f;
}

@keyframes heartBeat {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
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

/* Animation cho chuyển đổi hình ảnh */
.fade-slide-enter-active {
    transition: all 0.4s ease;
}

.fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.fade-slide-enter-from {
    transform: translateX(10px);
    opacity: 0;
}

.fade-slide-leave-to {
    transform: translateX(-10px);
    opacity: 0;
}

/* Add directional slide transitions at the end of the CSS section */
/* Right to left transition */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    /* Prevent flickering */
    will-change: transform, opacity;
    /* Performance optimization */
}

/* Adjust the enter/leave positions to ensure overlap */
.slide-right-enter-from {
    transform: translateX(100%);
    opacity: 1;
    /* Start fully visible */
}

.slide-right-leave-to {
    transform: translateX(-100%);
    opacity: 1;
    /* End fully visible */
}

.slide-left-enter-from {
    transform: translateX(-100%);
    opacity: 1;
    /* Start fully visible */
}

.slide-left-leave-to {
    transform: translateX(100%);
    opacity: 1;
    /* End fully visible */
}

/* Left to right transition */
.slide-left-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

/* Add the new slider styles at the end of the CSS section */
.slider-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.slide-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    pointer-events: none;
}

.slide-image.active {
    opacity: 1;
    transform: translateX(0);
    z-index: 2;
    pointer-events: auto;
}

.slide-image.previous {
    opacity: 1;
    transform: translateX(-100%);
    z-index: 1;
}

.slide-image.next {
    opacity: 1;
    transform: translateX(100%);
    z-index: 1;
}

/* Add styles for fullscreen slider */
.fullscreen-image-container {
    position: relative;
    width: 100%;
    height: 80vh;
    margin-bottom: 20px;
    overflow: hidden;
}

.fullscreen-slide {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.cart-count-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff3a3a;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}

/* Cart notification modal */
:deep(.cart-notification-modal .ant-modal-content) {
    border-radius: 10px;
    overflow: hidden;
}

:deep(.cart-notification-modal .ant-modal-body) {
    padding: 0;
}

.cart-notification {
    padding: 0;
}

.notification-header {
    background-color: #f6ffed;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.notification-header h3 {
    margin: 0;
    color: #52c41a;
    font-size: 18px;
}

.success-icon {
    color: #52c41a;
    font-size: 24px;
}

.notification-product {
    display: flex;
    padding: 0 20px 15px;
    border-bottom: 1px solid #eee;
}

.product-thumbnail {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #eee;
    margin-right: 15px;
}

.product-info {
    flex: 1;
}

.product-info h4 {
    margin: 0 0 5px;
    font-size: 14px;
    font-weight: 500;
}

.product-variants {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
}

.product-variants span {
    margin-right: 10px;
}

.product-quantity-price {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.price {
    font-weight: 600;
    color: #ff4d4f;
}

.cart-summary {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
}

.summary-row.total {
    font-weight: 600;
    font-size: 16px;
}

.notification-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 15px 20px 20px;
}

.notification-actions button {
    flex: 1;
}
</style>