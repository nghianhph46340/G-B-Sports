<template>
    <div class="web">
        <TheBaner />
        <BoSuuTapHot />
        <SanPhamBanChay />
        <MonTheThaoPhoBien />
        <SanPhamMoiChoTatCa />
        <AoTheThaoBanChay />
    </div>
</template>

<script>
import TheBaner from '@/components/TheBaner.vue';
import SanPhamBanChay from '@/components/ingredient-web-components/SanPhamBanChay.vue';
import MonTheThaoPhoBien from '@/components/ingredient-web-components/MonTheThaoPhoBien.vue';
import BoSuuTapHot from '@/components/ingredient-web-components/BoSuuTapHot.vue';
import SanPhamMoiChoTatCa from '@/components/ingredient-web-components/SanPhamMoiChoTatCa.vue';
import AoTheThaoBanChay from '@/components/ingredient-web-components/AoTheThaoBanChay.vue';
export default {
    components: {
        TheBaner,
        AoTheThaoBanChay,
        SanPhamBanChay,
        MonTheThaoPhoBien,
        BoSuuTapHot,
        SanPhamMoiChoTatCa
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.web {
    font-family: 'Montserrat', sans-serif;
}
</style>