<template>
    <TheNoitification />
    <TheHeader />
    <TheSidebar />
    <!-- <TheHeaderSearchModal /> -->
    <div class="main-content">
        <router-view></router-view>
    </div>
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

<style>
.main-content {
    padding-top: 9rem;
    /* Chiều cao của header (5rem) + sidebar (~4rem) */
    min-height: calc(100vh - 9rem - 340px);
    /* 100vh - header+sidebar - footer */
}
</style>