<template>
    <div class="popular-sports">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Môn thể thao phổ biến</h2>
                <div class="section-divider"></div>
            </div>

            <div class="sports-slider-container">
                <div class="sports-slider d-flex justify-content-around" ref="sliderRef">
                    <div v-for="(sport, index) in displaySports" :key="index" class="sport-item ">
                        <div class="sport-image-container">
                            <img :src="sport.image" :alt="sport.name" class="sport-image">
                        </div>
                        <h3 class="sport-name">{{ sport.name }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

// Dữ liệu các môn thể thao phổ biến
const sportsData = ref([
    {
        id: 1,
        name: 'Bóng đá',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 2,
        name: 'Bóng rổ',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 3,
        name: 'Cầu lông',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 4,
        name: 'Tennis',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 5,
        name: 'Bơi lội',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 6,
        name: 'Chạy bộ',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 7,
        name: 'Đạp xe',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 8,
        name: 'Yoga',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 9,
        name: 'Võ thuật',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    },
    {
        id: 10,
        name: 'Golf',
        image: 'http://res.cloudinary.com/dtwsqkqpc/image/upload/v1742823877/oionww3qsqhfwvuvxeko.jpg'
    }
]);

// Tạo danh sách hiển thị với các phần tử trùng lặp để tạo hiệu ứng vòng tròn liên tục
const displaySports = ref([...sportsData.value]);

// Tham chiếu đến slider
const sliderRef = ref(null);
let animationId = null;
let position = 0;
const speed = 1.5; // Tốc độ chạy

// Hàm để tạo hiệu ứng chạy tự động
const animateSlider = () => {
    if (!sliderRef.value) return;

    position -= speed;
    const containerWidth = sliderRef.value.parentElement.offsetWidth;
    const sliderWidth = sliderRef.value.scrollWidth;

    // Khi đã chạy đến cuối
    if (Math.abs(position) >= sliderWidth - containerWidth) {
        // Reset về đầu
        position = 0;
    }

    sliderRef.value.style.transform = `translateX(${position}px)`;
    animationId = requestAnimationFrame(animateSlider);
};

// Khởi động animation khi component được mount
onMounted(() => {
    // Đợi một chút để DOM được render đầy đủ
    setTimeout(() => {
        animationId = requestAnimationFrame(animateSlider);
    }, 100);
});

// Dừng animation khi component bị unmount
onBeforeUnmount(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
</script>

<style scoped>
.popular-sports {
    /* padding: 2rem 0; */
    background-color: #f8f9fa;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 15px;
}

.section-header {
    margin-bottom: 1.5rem;
    text-align: center;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    position: relative;
    display: inline-block;
}

.section-divider {
    height: 3px;
    width: 100px;
    background-color: #3a86ff;
    margin: 0 auto;
}

.sports-slider-container {
    overflow: hidden;
    position: relative;
    margin: 1.5rem 0;
}

.sports-slider {
    display: flex;
    transition: transform 0.1s linear;
    will-change: transform;
}

.sport-item {
    flex: 0 0 6rem;
    padding: 0 1rem;
    text-align: center;
    transition: transform 0.3s ease;
    margin: 0 0.8rem;
}

.sport-item:hover {
    transform: translateY(-5px);
}

.sport-image-container {
    width: 100%;
    height: 6rem;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sport-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.sport-item:hover .sport-image {
    transform: scale(1.1);
}

.sport-name {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin: 0.5rem 0;
}

/* Responsive */
@media (max-width: 992px) {
    .sport-item {
        flex: 0 0 5.5rem;
        padding: 0 0.8rem;
        margin: 0 0.6rem;
    }

    .sport-image-container {
        height: 5.5rem;
    }
}

@media (max-width: 768px) {
    .sport-item {
        flex: 0 0 5rem;
        padding: 0 0.6rem;
        margin: 0 0.5rem;
    }

    .sport-image-container {
        height: 5rem;
    }
}

@media (max-width: 576px) {
    .sport-item {
        flex: 0 0 4rem;
        padding: 0 0.5rem;
        margin: 0 0.4rem;
    }

    .sport-image-container {
        height: 4rem;
    }

    .sport-name {
        font-size: 0.8rem;
    }
}
</style>