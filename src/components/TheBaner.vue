<template>
    <div class="container mt-3">
        <div class="scoll d-flex align-items-center">
            <marquee class="d-flex align-items-center" width="100%" height="100%"
                style="background-color: red; height: 50px; color: white; font-size: 18px; " behavior="scroll"
                direction="">Chào mừng
                đã đến với
                gian hàng của
                chúng tôi, chúng tôi đang deal
                rất
                nhiều sản phẩm</marquee>
        </div>
        <a-carousel arrows autoplay>

            <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                    <left-circle-outlined />
                </div>
            </template>
            <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                    <right-circle-outlined />
                </div>
            </template>
            <div class="borderImage">
                <img src="../images/banner/Banner-PC-3.png" alt="">
            </div class="borderImage">
            <div>
                <img src="../images/banner/Banner-PC-4.png" alt="">
            </div>
            <div class="borderImage">
                <img src="../images/banner/Banner-PC-5.png" alt="">
            </div>
        </a-carousel>
    </div>
</template>

<script setup>

</script>

<style scoped>
.borderImage {
    overflow: hidden;
}

.borderImage>img {
    object-fit: cover;
}

:deep(.slick-slide) {
    text-align: center;
    height: 350px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    transition: ease all 0.3s;
    opacity: 0.3;
    z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
    color: #fff;
    opacity: 0.5;
}

:deep(.slick-slide h3) {
    color: #fff;
}
</style>