<template>
    <div class="best-selling-products" ref="sectionRef" :class="{ 'visible': isVisible }">
        <div class="container p-0">
            <div class="section-header">
                <h4 class="section-title">Giày và phụ kiện bán chạy</h4>
                <div class="section-divider"></div>
            </div>

            <div class="carousel-container" @mouseenter="showArrows = true" @mouseleave="showArrows = false">
                <button class="custom-arrow prev-arrow" @click="prevSlide" :class="{ 'visible': showArrows }">
                    <left-outlined />
                </button>
                <button class="custom-arrow next-arrow" @click="nextSlide" :class="{ 'visible': showArrows }">
                    <right-outlined />
                </button>

                <a-carousel ref="carousel" autoplay dots-class="custom-dots">
                    <div v-for="(slideGroup, groupIndex) in productSlides" :key="groupIndex">
                        <div class="row products-grid">
                            <div class="col product-card" v-for="(product, index) in slideGroup" :key="index"
                                @mouseenter="activeProduct = product.id" @mouseleave="activeProduct = null">
                                <div class="product-image-container">
                                    <img class="product-image" :src="product.image" alt="Product image">
                                    <div class="discount-badge" v-if="product.discountPercent">
                                        -{{ product.discountPercent }}%
                                    </div>
                                    <div class="product-overlay" :class="{ 'active': activeProduct === product.id }">
                                        <div class="overlay-buttons">
                                            <router-link
                                                :to="{ name: 'sanPhamDetail-BanHang', params: { id: product.id } }"
                                                class="overlay-btn view-btn">
                                                <eye-outlined />
                                                <span>Xem</span>
                                            </router-link>
                                            <button class="overlay-btn cart-btn">
                                                <shopping-cart-outlined />
                                                <span>Thêm</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-info">
                                    <div class="product-price-row">
                                        <span class="product-price">{{ product.price }}</span>
                                        <span class="product-old-price" v-if="product.oldPrice">{{ product.oldPrice
                                        }}</span>
                                        <span class="product-discount" v-if="product.discount">{{ product.discount
                                        }}</span>
                                    </div>
                                    <h6 class="product-name">{{ product.name }}</h6>
                                    <div class="product-meta">
                                        <span class="product-brand">{{ product.brand }}</span>
                                        <div class="product-rating">
                                            <star-filled />
                                            <span>{{ product.rating }} ({{ product.reviews }})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-carousel>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import {
    EyeOutlined,
    ShoppingCartOutlined,
    StarFilled,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons-vue';
import { useGbStore } from '@/stores/gbStore';

// Tham chiếu đến carousel
const store = useGbStore();
const carousel = ref(null);
const sectionRef = ref(null);
const isVisible = ref(false);
const showArrows = ref(false);

// Sử dụng Intersection Observer để theo dõi khi phần tử xuất hiện trong viewport
onMounted(async () => {
    await store.getSanPhamBySP('giày');
    // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với template
    if (store.listSanPhamBanHang && store.listSanPhamBanHang.length > 0) {
        bestSellingProducts.value = store.listSanPhamBanHang.map(item => ({
            id: item.id_san_pham || item.id,
            image: item.hinh_anh || 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
            price: `${item.gia_khuyen_mai_cao_nhat?.toLocaleString()}₫` || '0₫',
            oldPrice: item.gia_max > item.gia_khuyen_mai_cao_nhat ? `${item.gia_max.toLocaleString()}₫` : null,
            discountPercent: item.gia_max && item.gia_khuyen_mai_cao_nhat ?
                Math.round(((item.gia_max - item.gia_khuyen_mai_cao_nhat) / item.gia_max) * 100) : 0,
            discount: item.gia_max && item.gia_khuyen_mai_cao_nhat ?
                `-${Math.round(((item.gia_max - item.gia_khuyen_mai_cao_nhat) / item.gia_max) * 100)}%` : null,
            name: item.ten_san_pham || 'Sản phẩm không tên',
            brand: item.ten_thuong_hieu || 'Chưa có thương hiệu',
            rating: item.danh_gia || 0,
            reviews: item.so_luong_danh_gia || 0
        }));
        console.log('Dữ liệu phụ kiện đã chuyển đổi:', bestSellingProducts.value);
    } else {
        console.log('Không có dữ liệu phụ kiện từ API');
    }
});

onMounted(() => {
    const { stop } = useIntersectionObserver(
        sectionRef,
        ([{ isIntersecting }]) => {
            if (isIntersecting) {
                isVisible.value = true;
                stop(); // Dừng quan sát sau khi đã hiển thị
            }
        },
        { threshold: 0.2 } // Hiển thị khi ít nhất 20% phần tử xuất hiện trong viewport
    );
});

// Hàm điều khiển carousel
const nextSlide = () => {
    if (carousel.value) {
        carousel.value.next();
    }
};

const prevSlide = () => {
    if (carousel.value) {
        carousel.value.prev();
    }
};

// Sản phẩm mẫu
const bestSellingProducts = ref([]);

// Chia sản phẩm thành các slide, mỗi slide 5 sản phẩm
// Nếu slide cuối không đủ 5 sản phẩm, lấy thêm từ đầu danh sách
const productSlides = computed(() => {
    const slides = [];
    const productsPerSlide = 5;
    const products = [...bestSellingProducts.value];

    // Nếu slide cuối không đủ 5 sản phẩm, lấy thêm từ đầu danh sách
    const totalNeeded = Math.ceil(products.length / productsPerSlide) * productsPerSlide;
    if (totalNeeded > products.length) {
        const extraNeeded = totalNeeded - products.length;
        // Lấy thêm sản phẩm từ đầu danh sách
        const extraProducts = products.slice(0, extraNeeded).map(product => ({
            ...product,
            id: product.id + 1000 // Thêm id mới để tránh trùng lặp
        }));
        products.push(...extraProducts);
    }

    // Chia thành các slide
    for (let i = 0; i < products.length; i += productsPerSlide) {
        slides.push(products.slice(i, i + productsPerSlide));
    }

    return slides;
});

const activeProduct = ref(null);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.best-selling-products {
    padding: 2rem 0;
    font-family: 'Montserrat', sans-serif;
    background-color: #f8f9fa;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.best-selling-products.visible {
    opacity: 1;
    transform: translateY(0);
}

.container {
    max-width: 1280px;
    margin: 0 auto;

}

.section-header {
    /* margin-bottom: 2rem; */
    text-align: center;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    /* margin-bottom: 0.5rem; */
    position: relative;
    display: inline-block;
}

.section-divider {
    height: 3px;
    width: 100px;
    background-color: #3a86ff;
    margin: 0 auto;
}

.products-grid {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
}

.product-card {
    position: relative;
    flex: 0 0 20%;
    max-width: 20%;
    padding: 15px;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin-bottom: 20px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
    cursor: pointer;
    background-color: #fff;
}

.visible .product-card {
    opacity: 1;
    transform: translateY(0);
}

.visible .product-card:nth-child(1) {
    transition-delay: 0.1s;
}

.visible .product-card:nth-child(2) {
    transition-delay: 0.2s;
}

.visible .product-card:nth-child(3) {
    transition-delay: 0.3s;
}

.visible .product-card:nth-child(4) {
    transition-delay: 0.4s;
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    z-index: 5;
}

.product-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 12px;
}

.product-image {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
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
    text-decoration: none;
}

.overlay-btn:hover {
    background: #3a86ff;
    color: white;
}

.overlay-btn span {
    margin-left: 5px;
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

.carousel-container {
    position: relative;
    padding: 0 50px;
    margin-bottom: 30px;
}

.custom-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    border: none;
    font-size: 18px;
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
}

.custom-arrow:hover {
    background: rgba(0, 0, 0, 0.7);
}

.custom-arrow.visible {
    opacity: 1;
    visibility: visible;
}

.prev-arrow {
    left: 10px;
}

.next-arrow {
    right: 10px;
}

:deep(.ant-carousel) {
    width: 100%;
}

:deep(.ant-carousel .slick-dots-bottom) {
    bottom: -25px;
}

:deep(.ant-carousel .slick-dots li button) {
    background: #d9d9d9;
    opacity: 0.4;
}

:deep(.ant-carousel .slick-dots li.slick-active button) {
    background: #3a86ff;
    opacity: 1;
}

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