<template>
    <div class="container" @mouseout="store.hideModalSideBar(0)">
        <div class="row">
            <div class="col-12 headers d-flex align-items-center">
                <div class="row col-sm-3 d-flex justify-content-center align-items-center">
                    <img src="../images/logo/logo2.png" class="img-fluid ms-2" alt="">
                    <div class="col-sm-3  d-flex justify-content-center align-items-center langueContent">
                        <span class="h-100 langue" @click="store.getLangue(store.check)">
                            {{ !store.changeLanguage.nguoiDung ? 'EN' :
                                store.language }}
                        </span>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class=" d-flex searchForm d-flex align-items-center border border-light-subtle rounded-pill">
                        <Search class="ms-3 iconSearch" />
                        <input type="text" @click="store.showModal(true)" class="form-control d-flex d-flex
                         align-items-center rounded-pill" id="
                            search" :placeholder="!store.changeLanguage.timKiem ? 'Bạn đang muốn tìm kiếm gì?' :
                                store.changeLanguage.timKiem">
                    </div>
                    <TheHeaderSearchModal />
                </div>
                <!-- <div class="col-3 d-block d-sm-none"> -->
                <div class="col-sm-3 d-flex justify-content-evenly align-items-center">
                    <div class="col-sm-3 text-center">
                        <User class="iconHeader" />
                        <span class="textLight"> {{ !store.changeLanguage.nguoiDung ? 'Đăng nhập' :
                            store.changeLanguage.nguoiDung }}</span>
                    </div>
                    <div class="col-sm-3 text-center">
                        <Store class="iconHeader" />
                        <span class="textLight">{{ !store.changeLanguage.cuaHang ? 'Cửa hàng' :
                            store.changeLanguage.cuaHang }}</span>
                    </div>
                    <div class="col-sm-3 text-center">
                        <MessageCircleQuestion class="iconHeader" />
                        <span class="textLight">{{ !store.changeLanguage.hoTro ? 'Hỗ trợ' :
                            store.changeLanguage.hoTro }}</span>
                    </div>
                    <div class="col-sm-3 text-center">
                        <ShoppingCart class="iconHeader" />
                        <span class="textLight">{{ !store.changeLanguage.gioHang ? 'Giỏ hàng' :
                            store.changeLanguage.gioHang }}</span>
                    </div>
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next';
import { User } from 'lucide-vue-next';
import { Store } from 'lucide-vue-next';
import { MessageCircleQuestion } from 'lucide-vue-next';
import { ShoppingCart } from 'lucide-vue-next';
import { useGbStore } from '@/stores/gbStore';
import TheHeaderSearchModal from './TheHeaderSearchModal.vue'
const store = useGbStore()

</script>

<style scoped>
.headers {
    height: 5rem;
    background-color: rgb(255, 255, 255);
}

.iconHeader {
    width: 100%;

}

.langue {
    cursor: pointer;
    font-size: 1.1rem;
    /* font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; */
    font-weight: bold;
}

.langueContent:hover {
    text-shadow: 0px 5px 20px rgb(196, 196, 196);
    background-color: royalblue;
}

/* .langueContent:hover {
    background-color: rgb(241, 241, 241);
} */

.form-control {
    border: none;
    outline: none;
    box-shadow: none;
}

.textLight {
    font-size: 10px;
}

.searchForm {
    height: 3rem;
}

input::placeholder {
    display: flex;
    justify-content: space-around;
}

input {
    height: 100%;
}

.searchForm:focus-within {
    background-color: rgb(241, 241, 241);
}

input:focus {
    background-color: rgb(241, 241, 241);
}

.iconSearch {
    cursor: pointer;
}

#search {
    height: 3rem;

}

img {
    height: 4rem;
    width: auto;

}
</style>