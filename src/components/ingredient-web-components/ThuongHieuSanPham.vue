<template>
    <div class="thuong-hieu-container my-4">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Thương hiệu nổi bật</h2>
                <div class="section-divider">
                </div>
                <div class="row g-3 mt-2">
                    <!-- Hàng đầu tiên: 5 thương hiệu -->
                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuNike.jpg" alt="Nike">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuAdidas.jpg" alt="Adidas">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuFila.jpg" alt="Fila">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuSpeedo.jpg" alt="Speedo">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuHoka.jpg" alt="Hoka">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hàng thứ hai: 5 thương hiệu -->
                <div class="row g-3 mt-2">
                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuSkeche.jpg" alt="Skechers">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuColombia.jpg" alt="Colombia">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuAmor.jpg" alt="Amor">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuCross.jpg" alt="Cross">
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="brand-item">
                            <div class="brand-image">
                                <img src="../../images/thuongHieuSanPham/ThuongHieuTeva.jpg" alt="Teva">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.thuong-hieu-container {
    padding: 1rem 0;
}

.section-header {
    margin-bottom: 0.8rem;
    text-align: center;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.4rem;
}

.section-divider {
    width: 50px;
    height: 3px;
    background-color: #3a86ff;
    margin: 0 auto;
}

.brand-item {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
    padding: 0.5rem;
    background-color: #fff;
}

.brand-item:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    transform: scale(0.97);
}

.brand-image {
    overflow: hidden;
    border-radius: 5px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
}

.brand-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.4s ease;
    padding: 0.2rem;
}

.brand-item:hover .brand-image img {
    transform: scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .brand-image {
        height: 90px;
    }
}

@media (max-width: 768px) {
    .brand-image {
        height: 80px;
    }
}

@media (max-width: 576px) {
    .brand-image {
        height: 70px;
    }
}
</style>