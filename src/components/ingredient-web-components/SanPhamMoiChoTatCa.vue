<template>
    <div class="new-products">
        <div class="container">
            <div class="section-header">
                <h4 class="section-title text-center">[New] Sản phẩm mới cho tất cả</h4>
                <div class="section-divider"></div>
                <div class="banner-row row mt-4">
                    <div class="col-md-4 banner-col">
                        <img src="../../images/banerSale/saleNam.webp" alt="Sale Nam" class="banner-image">
                    </div>
                    <div class="col-md-4 banner-col">
                        <img src="../../images/banerSale/saleNu.webp" alt="Sale Nữ" class="banner-image">
                    </div>
                    <div class="col-md-4 banner-col">
                        <img src="../../images/banerSale/saleTreEm.webp" alt="Sale Trẻ Em" class="banner-image">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.new-products {
    font-family: 'Montserrat', sans-serif;
    background-color: #f8f9fa;
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
}

.section-divider {
    height: 3px;
    width: 100px;
    background-color: #3a86ff;
    margin: 0 auto;
}

.banner-row {
    margin-top: 1.5rem;
}

.banner-col {
    padding: 0 15px;
    margin-bottom: 20px;
}

.banner-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.banner-image:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
    .banner-col {
        margin-bottom: 15px;
    }

    .banner-image {
        height: 150px;
    }
}
</style>