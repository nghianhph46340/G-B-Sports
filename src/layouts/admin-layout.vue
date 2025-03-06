<template>
    <TheHeaderAdmin />
    <router-view></router-view>
</template>

<script>
import TheHeaderAdmin from '@/components/TheHeader-Admin.vue';


export default {
    components: {
        TheHeaderAdmin
    }
}
</script>
