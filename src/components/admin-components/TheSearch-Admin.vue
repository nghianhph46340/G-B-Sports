<template>
    <div class="container-fluid w-75">
        <form class="d-flex" role="search">
            <input class="form-control me-2" v-model="search" type="search" placeholder="Search" aria-label="Search">
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useGbStore } from '@/stores/gbStore';
const store = useGbStore();
const search = computed({
    get: () => store.searchs,
    set: (value) => store.searchs = value
});

</script>

<style scoped></style>