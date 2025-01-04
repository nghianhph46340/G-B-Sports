<template>
    <div class="container">
        <div class="modal fade searchModal" id="staticBackdrop" :style="{ display: store.status ? 'block' : 'none' }"
            :class="{ show: store.status }" @click.self="store.showModal(false)" tabindex="-1" role="dialog">
            <div class="container">
                <div class="bg-light text-dark">
                    <div class="modal-header">
                        <h1 class="fs-5 ">Danh sách hiển thị</h1>
                        <button type="button" @click="store.showModal(false)" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body row">
                        <div class="col-sm-4 border-end">
                            <h5>Top tìm kiếm</h5>
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <Search /> Tivi
                                </li>
                                <li class="list-group-item">
                                    <Search /> Laptop
                                </li>
                                <li class="list-group-item">
                                    <Search /> Tivi
                                </li>
                                <li class="list-group-item">
                                    <Search />Laptop
                                </li>
                                <li class="list-group-item">
                                    <Search />Tivi
                                </li>
                                <li class="list-group-item">
                                    <Search /> Laptop
                                </li>
                                <li class="list-group-item">
                                    <Search /> Tivi
                                </li>
                                <li class="list-group-item">
                                    <Search /> Laptop
                                </li>
                                <li class="list-group-item">
                                    <Search /> Tivi
                                </li>
                            </ul>
                        </div>
                        <div class="col-sm-8">
                            <h5>Gợi ý cho bạn</h5>
                            <div class="row d-flex justify-content-evenly">

                                <!-- Sản phẩm -->
                                <div class="col-sm-3 p-0">
                                    <div class="img">
                                        <img class="imgProduct" src="../images/product/shoe/anhGiayTheThao.webp"
                                            :style="{ width: '100%', height: 'auto' }" alt="">
                                        <div class="content row mt-2 ">
                                            <div class="col-sm-4 d-flex align-items-center">
                                                <span
                                                    style="font-family: Arial, Helvetica, sans-serif">999.000&#273;</span>
                                            </div>
                                            <div class="col-sm-4 d-flex align-items-center">
                                                <span style="text-decoration: line-through; color: rgb(37, 37, 41);
                                                font-size: 12px;
                                                ">2.000.000&#273;</span>
                                            </div>
                                            <div class="col-sm-3 rounded-pill bg-warning d-flex align-items-center">
                                                <span style="font-size: 13px;">-50%</span>
                                            </div>
                                        </div>

                                        <div class="productName mt-3">
                                            <span
                                                style="font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Áo
                                                khoác nỉ leo núi nam giữ
                                                ấm - MH100 xanh
                                                lá</span>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="brandName mt-3">
                                                    <span>ADIDAS</span>
                                                </div>

                                                <div class="star mt-2">
                                                    <i class="bi bi-star-fill" style="font-size: 12px;"></i>
                                                    <span style="font-size: 12px;"> 4.9 (1.2k)</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 d-flex align-items-end justify-content-end p-2">
                                                <div class="boxShoping">
                                                    <i class="bi bi-cart-fill  iconShopingCart"
                                                        style="font-size: 19px;"></i>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Kết thúc sản phẩm -->
                                <div class="col-sm-3 p-0">
                                    <div class="img">
                                        <img class="imgProduct" src="../images/product/shoe/anhGiayTheThao.webp"
                                            :style="{ width: '100%', height: 'auto' }" alt="">
                                        <div class="content row mt-2 ">
                                            <div class="col-sm-4 d-flex align-items-center">
                                                <span
                                                    style="font-family: Arial, Helvetica, sans-serif">999.000&#273;</span>
                                            </div>
                                            <div class="col-sm-4 d-flex align-items-center">
                                                <span style="text-decoration: line-through; color: rgb(37, 37, 41);
                                                font-size: 12px;
                                                ">2.000.000&#273;</span>
                                            </div>
                                            <div class="col-sm-3 rounded-pill bg-warning d-flex align-items-center">
                                                <span style="font-size: 13px;">-50%</span>
                                            </div>
                                        </div>

                                        <div class="productName mt-3">
                                            <span
                                                style="font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Áo
                                                khoác nỉ leo núi nam giữ
                                                ấm - MH100 xanh
                                                lá</span>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="brandName mt-3">
                                                    <span>ADIDAS</span>
                                                </div>

                                                <div class="star mt-2">
                                                    <i class="bi bi-star-fill" style="font-size: 12px;"></i>
                                                    <span style="font-size: 12px;"> 4.9 (1.2k)</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 d-flex align-items-end justify-content-end p-2">
                                                <div class="boxShoping">
                                                    <i class="bi bi-cart-fill  iconShopingCart"
                                                        style="font-size: 19px;"></i>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-3 p-0">
                                    <div class="img">
                                        <img class="imgProduct" src="../images/product/shoe/anhGiayTheThao.webp"
                                            :style="{ width: '100%', height: 'auto' }" alt="">
                                        <div class="content row mt-2 ">
                                            <div class="col-sm-4 d-flex align-items-center">
                                                <span
                                                    style="font-family: Arial, Helvetica, sans-serif">999.000&#273;</span>
                                            </div>
                                            <div class="col-sm-4 d-flex align-items-center">
                                                <span style="text-decoration: line-through; color: rgb(37, 37, 41);
                                                font-size: 12px;
                                                ">2.000.000&#273;</span>
                                            </div>
                                            <div class="col-sm-3 rounded-pill bg-warning d-flex align-items-center">
                                                <span style="font-size: 13px;">-50%</span>
                                            </div>
                                        </div>

                                        <div class="productName mt-3">
                                            <span
                                                style="font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Áo
                                                khoác nỉ leo núi nam giữ
                                                ấm - MH100 xanh
                                                lá</span>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div class="brandName mt-3">
                                                    <span>ADIDAS</span>
                                                </div>

                                                <div class="star mt-2">
                                                    <i class="bi bi-star-fill" style="font-size: 12px;"></i>
                                                    <span style="font-size: 12px;"> 4.9 (1.2k)</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 d-flex align-items-end justify-content-end p-2">
                                                <div class="boxShoping">
                                                    <i class="bi bi-cart-fill  iconShopingCart"
                                                        style="font-size: 19px;"></i>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
import { useGbStore } from '../stores/gbStore';
import { Search } from 'lucide-vue-next';
import { ShoppingCart } from 'lucide-vue-next';
const store = useGbStore()
</script>
<style scoped>
.searchModal {
    margin-top: 5rem;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        transform: translateY(0.1);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.img {
    overflow: hidden;
}

.imgProduct {
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
}

.imgProduct:hover {
    /* transform: scale(1.05); */
    transform: scale3d(1.05, 1.05, 1.05);
}

.iconShopingCart {
    cursor: pointer;
    transition: transform 0.1s ease-in-out;
}

.boxShoping:hover {
    border-radius: 50%;
    background-color: rgb(138, 138, 138);
    cursor: pointer;
}

.boxShoping {
    padding: 11px 15px;
    transition: transform 0.2s ease-in-out;
}

.iconShopingCart,
.boxShoping:hover {
    transform: scale3d(1.1, 1.1, 1.1)
}
</style>