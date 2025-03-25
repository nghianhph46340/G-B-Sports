<template>
    <TheNoitification />
    <TheHeader />
    <TheSidebar />
    <!-- <TheHeaderSearchModal /> -->
    <router-view></router-view>
    <TheFooter />

</template>
<script>
import TheHeader from '@/components/TheHeader.vue';
// import TheHeaderSearchModal from '@/components/TheHeaderSearchModal.vue';
import TheSidebar from '@/components/TheSidebar.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheNoitification from '@/components/TheNoitification.vue';
export default {
    components: {
        TheHeader,
        // TheHeaderSearchModal
        TheSidebar,
        TheFooter,
        TheNoitification
    }
}
</script>