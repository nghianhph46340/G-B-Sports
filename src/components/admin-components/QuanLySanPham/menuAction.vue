<template>
    <div class="mb-4">
        <a-button type="" @click="showDrawer" class="d-flex align-items-center btn-filter">
            <FilterOutlined class="icon-filler" />Bộ lọc
        </a-button>
        <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
            :root-style="{ color: 'black' }" title="Bộ lọc sản phẩm" placement="right"
            @after-open-change="afterOpenChange" :footer-style="{ textAlign: 'right' }">

            <p for="name">Danh mục</p>
            <a-select class="mb-2" v-model:value="value" show-search placeholder="Danh muc" style="width: 330px"
                :options="options" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur"
                @change="handleChange"></a-select>

            <p for="name">Thương hiệu</p>
            <a-select class="mb-2" v-model:value="value" show-search placeholder="Thương hiệu" style="width: 330px"
                :options="options" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur"
                @change="handleChange"></a-select>

            <p for="name">Chất liệu</p>
            <a-select class="mb-2" v-model:value="value" show-search placeholder="Chất liệu" style="width: 330px"
                :options="options" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur"
                @change="handleChange"></a-select>



            <p for="name">Màu sắc</p>
            <a-select class="mb-2" v-model:value="value" show-search placeholder="Màu sắc" style="width: 330px"
                :options="options" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur"
                @change="handleChange"></a-select>

            <p for="name">Kích thước</p>
            <a-select class="mb-2" v-model:value="value" show-search placeholder="Kích thước" style="width: 330px"
                :options="options" :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur"
                @change="handleChange"></a-select>

            <p>Giá</p>
            <a-slider v-model:value="value2" range :max="999999999" />

            <template #footer>
                <a-button style="margin-right: 8px" @click="onClose">Đóng</a-button>
                <a-button type="primary" style="background-color: #f33b47" @click="onClose">Lọc</a-button>
            </template>
        </a-drawer>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { FilterOutlined } from '@ant-design/icons-vue';
const open = ref(false);
const value2 = ref([0, 999999999]);

// Hàm định dạng giá
const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

const afterOpenChange = bool => {
    console.log('open', bool);
};
const showDrawer = () => {
    open.value = true;
};
const onClose = () => {
    open.value = false;
};

</script>
<style scoped>
.icon-filler {
    color: #fff;
}

.btn-filter {
    color: #fff;
    background-color: #f33b47;
}

.btn-filter:active {
    transition: all 0.6s ease-in-out;
    background-color: #f33b47;
}
</style>