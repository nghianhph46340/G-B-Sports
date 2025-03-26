<template>
    <div class="mt-3">
        <div class="scoll d-flex align-items-center">
            <marquee class="d-flex align-items-center" width="100%" height="100%"
                style="background-color: rgb(130, 181, 202); height: 50px; color: white; font-size: 18px; "
                behavior="scroll" direction="">Chào mừng
                đã đến với
                gian hàng của
                chúng tôi, chúng tôi đang deal
                rất
                nhiều sản phẩm</marquee>
        </div>
        <div class="carousel-wrapper" @mouseenter="showArrows = true" @mouseleave="showArrows = false">
            <a-carousel arrows autoplay class="carousel" ref="carousel">
                <template #prevArrow>
                    <div class="custom-slick-arrow" :class="{ 'visible': showArrows }" style="left: 10px; z-index: 1">
                        <left-circle-outlined />
                    </div>
                </template>
                <template #nextArrow>
                    <div class="custom-slick-arrow" :class="{ 'visible': showArrows }" style="right: 10px">
                        <right-circle-outlined />
                    </div>
                </template>
                <div class="borderImage">
                    <img src="../images/banner/Banner-PC-3.png" alt="">
                </div>
                <div class="borderImage">
                    <img src="../images/banner/Banner-PC-4.png" alt="">
                </div>
                <div class="borderImage">
                    <img src="../images/banner/Banner-PC-5.png" alt="">
                </div>
            </a-carousel>
        </div>
    </div>
</template>

<script>
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { ref } from 'vue';

export default {
    components: {
        LeftCircleOutlined,
        RightCircleOutlined,
    },
    setup() {
        const carousel = ref(null);
        const showArrows = ref(false);

        return {
            carousel,
            showArrows
        };
    }
};
</script>

<style scoped>
.carousel-wrapper {
    position: relative;
    width: 100%;
}

.borderImage {
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.borderImage>img,
div>img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

:deep(.slick-slide) {
    text-align: center;
    height: 450px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
    width: 40px;
    height: 40px;
    font-size: 40px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 10;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
    color: #fff;
    background-color: rgba(31, 45, 61, 0.5);
}

:deep(.slick-arrow.custom-slick-arrow.visible) {
    opacity: 0.8;
    visibility: visible;
}

:deep(.slick-slide h3) {
    color: #fff;
}
</style>