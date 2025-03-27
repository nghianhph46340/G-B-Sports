<template>
    <div class="best-selling-products">
        <div class="container p-0">
            <div class="section-header">
                <h4 class="section-title">Quần thể thao bán chạy</h4>
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
                                            <button class="overlay-btn view-btn">
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
import { ref, computed } from 'vue';
import {
    EyeOutlined,
    ShoppingCartOutlined,
    StarFilled,
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons-vue';

// Tham chiếu đến carousel
const carousel = ref(null);
const showArrows = ref(false);

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
const bestSellingProducts = ref([
    {
        id: 1,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '999.000₫',
        oldPrice: '2.000.000₫',
        discount: '-50%',
        discountPercent: 50,
        name: 'Áo khoác nỉ leo núi nam giữ ấm - MH100 xanh lá',
        brand: 'ADIDAS',
        rating: '4.9',
        reviews: '1.2k'
    },
    {
        id: 2,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '850.000₫',
        oldPrice: '1.700.000₫',
        discount: '-50%',
        discountPercent: 50,
        name: 'Giày chạy bộ nam Ultra Boost 21',
        brand: 'NIKE',
        rating: '4.8',
        reviews: '956'
    },
    {
        id: 3,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '450.000₫',
        oldPrice: '600.000₫',
        discount: '-25%',
        discountPercent: 25,
        name: 'Quần short thể thao nam dáng regular',
        brand: 'PUMA',
        rating: '4.7',
        reviews: '723'
    },
    {
        id: 4,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '399.000₫',
        oldPrice: '599.000₫',
        discount: '-33%',
        discountPercent: 33,
        name: 'Áo thun thể thao nữ thoáng khí',
        brand: 'UNDER ARMOUR',
        rating: '4.6',
        reviews: '512'
    },
    {
        id: 5,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '1.200.000₫',
        oldPrice: '1.500.000₫',
        discount: '-20%',
        discountPercent: 20,
        name: 'Giày bóng đá sân cỏ nhân tạo Predator',
        brand: 'ADIDAS',
        rating: '4.9',
        reviews: '1.5k'
    },
    {
        id: 6,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '750.000₫',
        oldPrice: '1.500.000₫',
        discount: '-50%',
        discountPercent: 50,
        name: 'Áo khoác gió chống nước unisex',
        brand: 'THE NORTH FACE',
        rating: '4.8',
        reviews: '876'
    },
    {
        id: 7,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '299.000₫',
        oldPrice: '399.000₫',
        discount: '-25%',
        discountPercent: 25,
        name: 'Áo thun thể thao nam thoáng khí',
        brand: 'NIKE',
        rating: '4.7',
        reviews: '632'
    },
    {
        id: 8,
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg',
        price: '550.000₫',
        oldPrice: '750.000₫',
        discount: '-27%',
        discountPercent: 27,
        name: 'Quần legging tập gym nữ co giãn cao cấp',
        brand: 'UNDER ARMOUR',
        rating: '4.9',
        reviews: '1.1k'
    }
]);

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
    font-family: 'Montserrat', sans-serif;
    background-color: #f8f9fa;
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
    flex: 0 0 20%;
    max-width: 20%;
    padding: 15px;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin-bottom: 20px;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
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
</style>