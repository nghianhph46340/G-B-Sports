<template>
    <div :style="{ display: store.id === 3 ? 'block' : 'none' }" :class="{ show: store.id }"
        @mouseleave="store.hideModalSideBar(0)">
        <h1>silde2</h1>
    </div>
</template>

<script setup>
import { useGbStore } from '../stores/gbStore';
const store = useGbStore()
</script>

<style scoped></style>