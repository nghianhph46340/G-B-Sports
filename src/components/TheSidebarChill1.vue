<template>
    <div class="container" style="max-height: 200px;">

        <div class="modal fade searchModal" id="staticBackdrop" tabindex="-1" role="dialog"
            :style="{ display: store.id === 1 ? 'block' : 'none' }" :class="{ show: store.id }">
            <div class="container" @mouseleave="store.hideModalSideBar(0)">
                <div class="bg-light text-dark row d-flex justify-content-evenly  m-0">
                    <!-- Menu -->
                    <div class="col-sm-2">
                        <div class="modal-header row d-flex justify-content-between ps-0 pe-0">
                            <div class="col-sm-8 ">
                                <span style="font-size: 15px;">Bóng đá</span>
                            </div>
                            <div class="col-sm-4">
                                <span style=" font-size: 8px;"><a href="" class="nav-link">XEM TẤT CẢ</a></span>
                            </div>
                        </div>
                        <div class="modal-body p-0 m-0 mt-2">
                            <p style="font-size: 13px;"><a href="" class="nav-link">Áo thun</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Quần short</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Áo dài tay</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Giày thể thao</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Mũ thể thao</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Tất thể thao</a></p>
                        </div>
                    </div>
                    <!-- End Menu -->
                    <!-- Menu -->
                    <div class="col-sm-2">
                        <div class="modal-header row d-flex justify-content-between ps-0 pe-0">
                            <div class="col-sm-8 ">
                                <span style="font-size: 15px;">Bóng đá</span>
                            </div>
                            <div class="col-sm-4">
                                <span style=" font-size: 8px;"><a href="" class="nav-link">XEM TẤT CẢ</a></span>
                            </div>
                        </div>
                        <div class="modal-body p-0 m-0 mt-2">
                            <p style="font-size: 13px;"><a href="" class="nav-link">Áo thun</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Quần short</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Áo dài tay</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Giày thể thao</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Mũ thể thao</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Tất thể thao</a></p>
                        </div>
                    </div>
                    <!-- End Menu -->
                    <!-- Menu -->
                    <div class="col-sm-2">
                        <div class="modal-header row d-flex justify-content-between ps-0 pe-0">
                            <div class="col-sm-8 ">
                                <span style="font-size: 15px;">Bóng đá</span>
                            </div>
                            <div class="col-sm-4">
                                <span style=" font-size: 8px;"><a href="" class="nav-link">XEM TẤT CẢ</a></span>
                            </div>
                        </div>
                        <div class="modal-body p-0 m-0 mt-2">
                            <p style="font-size: 13px;"><a href="" class="nav-link">Áo thun</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Quần short</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Áo dài tay</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Giày thể thao</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Mũ thể thao</a></p>
                            <p style="font-size: 13px;"><a href="" class="nav-link">Tất thể thao</a></p>
                        </div>
                    </div>
                    <!-- End Menu -->
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import { useGbStore } from '../stores/gbStore';
const store = useGbStore()
</script>

<style scoped>
.searchModal {
    margin-top: 8.5rem;
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

.nav-link {
    transition: transform 0.2s ease-in-out;
}

.nav-link:hover {
    text-decoration: underline;
    transform: matrix(1.1, 0, 0, 1.1, 0, 0);
}
</style>