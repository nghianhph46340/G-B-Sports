<template>
    <TheNoitification />
    <TheHeader />
    <TheSidebar />
    <TheBaner />
    <!-- <TheHeaderSearchModal /> -->
    <TheFooter />
    <router-view></router-view>
</template>
<script>
import TheHeader from '@/components/TheHeader.vue';
// import TheHeaderSearchModal from '@/components/TheHeaderSearchModal.vue';
import TheSidebar from '@/components/TheSidebar.vue';
import TheBaner from '@/components/TheBaner.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheNoitification from '@/components/TheNoitification.vue';
export default {
    components: {
        TheHeader,
        // TheHeaderSearchModal
        TheSidebar,
        TheBaner,
        TheFooter,
        TheNoitification
    }
}
</script>