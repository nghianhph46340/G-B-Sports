<template>
    <div class="container-fluid" style="width: 85%;">
        <form class="d-flex align-items-center justify-content-start" role="search">
            <SearchOutlined class="icon-search" />
            <input class="form-control me-2" v-model="search" type="search" placeholder="Bạn muốn tìm gì?"
                aria-label="Search">
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { SearchOutlined } from '@ant-design/icons-vue';
const store = useGbStore();
const search = computed({
    get: () => store.searchs,
    set: (value) => store.searchs = value
});

</script>

<style scoped>
.form-control {
    border: none;
    outline: none;
}

.icon-search {
    font-size: 16px;
    color: #565656;
    cursor: pointer;
}

.form-control:focus {
    box-shadow: none;
    border: none;
    outline: none;

}

.form-control:focus+.icon-search {
    color: #1890ff;
    transform: scale(1.1);
    transition: all 0.3s ease;
}
</style>