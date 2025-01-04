<template>
    <TheHeader />
    <TheSidebar />
    <TheBaner />
    <!-- <TheHeaderSearchModal /> -->
    <router-view></router-view>
</template>
<script>
import TheHeader from '@/components/TheHeader.vue';
// import TheHeaderSearchModal from '@/components/TheHeaderSearchModal.vue';
import TheSidebar from '@/components/TheSidebar.vue';
import TheBaner from '@/components/TheBaner.vue';
export default {
    components: {
        TheHeader,
        // TheHeaderSearchModal
        TheSidebar,
        TheBaner
    }
}
</script>