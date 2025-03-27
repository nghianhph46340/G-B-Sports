<template>
    <div class="danh-muc-container my-4">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Danh mục sản phẩm</h2>
                <div class="section-divider">
                </div>
                <div class="row g-3 mt-2">
                    <!-- Hàng đầu tiên: 5 danh mục -->
                    <div class="col-6 col-md-4 col-lg">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucAoNganTay.png" alt="Áo ngắn tay">
                                </div>
                                <div class="category-name">
                                    <span>Áo ngắn tay</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucAo.png" alt="Áo dài tay">
                                </div>
                                <div class="category-name">
                                    <span>Áo dài tay</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucQuan.png" alt="Quần dài">
                                </div>
                                <div class="category-name">
                                    <span>Quần dài</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucQuanNgan.png" alt="Quần ngắn">
                                </div>
                                <div class="category-name">
                                    <span>Quần ngắn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucDoBoi.png" alt="Đồ bơi">
                                </div>
                                <div class="category-name">
                                    <span>Đồ bơi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hàng thứ hai: 2 danh mục căn giữa -->
                <div class="row g-3 mt-2 justify-content-center">
                    <div class="col-6 col-md-4 col-lg-2">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucGiay.png" alt="Giày thể thao">
                                </div>
                                <div class="category-name">
                                    <span>Giày thể thao</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg-2">
                        <div class="category-item">
                            <div class="category-content">
                                <div class="category-image">
                                    <img src="../../images/danhMucSanPham/DanhMucAoNganTay.png" alt="Phụ kiện thể thao">
                                </div>
                                <div class="category-name">
                                    <span>Phụ kiện</span>
                                </div>
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
.danh-muc-container {
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

.category-item {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
    padding: 0.4rem;
    background-color: #fff;
}

.category-item:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    transform: scale(0.97);
}

.category-content {
    display: flex;
    align-items: center;
    height: 100%;
}

.category-image {
    flex: 5;
    overflow: hidden;
    border-radius: 5px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
}

.category-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.4s ease;
    padding: 0.2rem;
}

.category-item:hover .category-image img {
    transform: scale(0.95);
}

.category-name {
    flex: 2;
    padding: 0 0.5rem;
    text-align: left;
    font-weight: 500;
    color: #333;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    font-size: 0.85rem;
}

.category-item:hover .category-name {
    color: #3a86ff;
    transform: scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .category-image {
        height: 70px;
    }

    .category-name {
        font-size: 0.8rem;
    }
}

@media (max-width: 768px) {
    .category-image {
        height: 65px;
    }
}

@media (max-width: 576px) {
    .category-content {
        flex-direction: column;
    }

    .category-image {
        flex: none;
        width: 100%;
        height: 100px;
    }

    .category-name {
        flex: none;
        width: 100%;
        padding: 0.4rem 0;
        text-align: center;
        justify-content: center;
    }
}
</style>