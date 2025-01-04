<template>
    <div :style="{ display: store.id === 2 ? 'block' : 'none' }" :class="{ show: store.id }"
        @mouseleave="store.hideModalSideBar(0)">
        <h1>silde2</h1>
    </div>
</template>

<script setup>
import { useGbStore } from '../stores/gbStore';
const store = useGbStore()
</script>

<style scoped></style>