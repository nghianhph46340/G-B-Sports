<template class="sticky-top w-100">
    <div class="sidebar-fixed">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse d-flex justify-content-center" id="navbarScroll">
                    <ul class="navbar-nav my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 70px;">
                        <li class="nav-item me-5">
                            <a class="nav-link" @mouseenter="store.showModalSideBar(1)" aria-current="page" href="#">Môn
                                thể thao
                                <ChevronDown />

                            </a>
                        </li>
                        <li class="nav-item me-5">
                            <a class="nav-link" @mouseenter="store.showModalSideBar(2)" aria-current="page" href="#">Nam
                                <ChevronDown />
                            </a>
                        </li>
                        <li class="nav-item me-5">
                            <a class="nav-link" @mouseenter="store.showModalSideBar(3)" aria-current="page" href="#">Nữ
                                <ChevronDown />
                            </a>
                        </li>
                        <li class="nav-item me-5">
                            <a class="nav-link" @mouseenter="store.showModalSideBar(4)" aria-current="page" href="#">Phụ
                                kiện
                                <ChevronDown />
                            </a>
                        </li>
                        <li class="nav-item me-5">
                            <a class="nav-link" @mouseenter="store.showModalSideBar(5)" aria-current="page"
                                href="#">Siêu sale sập sàn
                                <ChevronDown />
                            </a>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
        <TheSidebarChill1 />
        <TheSidebarChill2 />
        <TheSidebarChill3 />
        <TheSidebarChill4 />
    </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next';
import { useGbStore } from '../stores/gbStore';
import TheSidebarChill1 from './TheSidebarChill1.vue';
import TheSidebarChill2 from './TheSidebarChill2.vue';
import TheSidebarChill3 from './TheSidebarChill3.vue';
import TheSidebarChill4 from './TheSidebarChill4.vue';
const store = useGbStore()
</script>

<style scoped>
.sidebar-fixed {
    position: fixed;
    top: 5rem;
    /* Chiều cao của header */
    left: 0;
    right: 0;
    z-index: 1020;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item>a {
    position: relative;
    /* Đặt vị trí tương đối để pseudo-element hoạt động */
    color: rgb(58, 43, 82);
    /* Màu chữ */
    text-decoration: none;
    /* Xóa gạch chân mặc định */
    transition: color 0.3s ease-in-out;
    /* Hiệu ứng chuyển màu */
}

.nav-item>a::before {
    content: '';
    /* Bắt buộc để hiển thị pseudo-element */
    position: absolute;
    bottom: 0;
    /* Đặt pseudo-element ở dưới cùng */
    left: 0;
    /* Bắt đầu từ bên trái */
    width: 0%;
    /* Bắt đầu với chiều rộng bằng 0 */
    height: 3px;
    /* Độ dày của border */
    background-color: rgb(47, 47, 47);
    /* Màu của border */
    transition: width 0.3s ease-in-out;
    /* Hiệu ứng mở rộng từ trái sang phải */
}

.nav-item>a:hover::before {
    width: 100%;
    /* Khi hover, border mở rộng toàn bộ chiều rộng */
}
</style>