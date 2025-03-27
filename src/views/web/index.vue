<template>
    <div class="web">
        <TheBaner />
        <BoSuuTapHot />
        <DanhMucSanPham />
        <SanPhamBanChay />
        <MonTheThaoPhoBien />
        <SanPhamMoiChoTatCa />
        <AoTheThaoBanChay />
        <QuanTheThaoBanChay />
        <GiayVaPhuKienBanChay />
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
        DanhMucSanPham
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.web {
    font-family: 'Montserrat', sans-serif;
}
</style>