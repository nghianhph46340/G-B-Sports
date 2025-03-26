<template>
    <div class="hot-collections">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Bộ sưu tập hot</h2>
                <div class="section-divider"></div>
            </div>
            <div class="d-flex justify-content-around mt-2">
                <a href="nav-link">
                    <img src="../../images/icon-hot/BF_circle_golden_hour.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 17.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 18.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 19.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 22.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 21.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 25.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 27.webp" alt="">
                </a>
                <a href="nav-link">
                    <img src="../../images/icon-hot/Frame 28 (2).webp" alt="">
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.hot-collections {
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

img {
    width: 4rem;
    height: 4rem;
}
</style>