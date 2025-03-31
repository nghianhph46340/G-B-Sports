<template>
    <div class="web p-0 m-0">
        <TheNoitification />
        <TheBaner />
        <BoSuuTapHot />
        <DanhMucSanPham />
        <SanPhamBanChay />
        <MonTheThaoPhoBien />
        <SanPhamMoiChoTatCa />
        <AoTheThaoBanChay />
        <QuanTheThaoBanChay />
        <GiayVaPhuKienBanChay />
        <ThuongHieuSanPham />

    </div>
</template>

<script>
import TheBaner from '@/components/TheBaner.vue';
import SanPhamBanChay from '@/components/ingredient-web-components/SanPhamBanChay.vue';
import MonTheThaoPhoBien from '@/components/ingredient-web-components/MonTheThaoPhoBien.vue';
import BoSuuTapHot from '@/components/ingredient-web-components/BoSuuTapHot.vue';
import SanPhamMoiChoTatCa from '@/components/ingredient-web-components/SanPhamMoiChoTatCa.vue';
import AoTheThaoBanChay from '@/components/ingredient-web-components/AoTheThaoBanChay.vue';
import QuanTheThaoBanChay from '@/components/ingredient-web-components/QuanTheThaoBanChay.vue';
import GiayVaPhuKienBanChay from '@/components/ingredient-web-components/GiayVaPhuKienBanChay.vue';
import DanhMucSanPham from '@/components/ingredient-web-components/DanhMucSanPham.vue';
import ThuongHieuSanPham from '@/components/ingredient-web-components/ThuongHieuSanPham.vue';
import TheNoitification from '@/components/TheNoitification.vue';


export default {
    components: {
        TheBaner,
        AoTheThaoBanChay,
        QuanTheThaoBanChay,
        GiayVaPhuKienBanChay,
        SanPhamBanChay,
        MonTheThaoPhoBien,
        BoSuuTapHot,
        SanPhamMoiChoTatCa,
        DanhMucSanPham,
        ThuongHieuSanPham,
        TheNoitification
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.web {
    font-family: 'Montserrat', sans-serif;
}
</style>