<template>
    <div>
        <TheBaner />
        <BoSuuTapHot />
        <SanPhamBanChay />
        <MonTheThaoPhoBien />
    </div>
</template>

<script>
import TheBaner from '@/components/TheBaner.vue';
import SanPhamBanChay from '@/components/ingredient-web-components/SanPhamBanChay.vue';
import MonTheThaoPhoBien from '@/components/ingredient-web-components/MonTheThaoPhoBien.vue';
import BoSuuTapHot from '@/components/ingredient-web-components/BoSuuTapHot.vue';
export default {
    components: {
        TheBaner,
        SanPhamBanChay,
        MonTheThaoPhoBien,
        BoSuuTapHot
    }
}
</script>

<style scoped></style>