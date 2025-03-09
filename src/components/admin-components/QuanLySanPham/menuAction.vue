<template>
    <div class="mb-4 d-flex justify-content-between">
        <div class=" d-flex gap-2">
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
                <a-slider class="mb-2" v-model:value="value2" range :max="999999999" />
                <p>Trạng thái</p>
                <a-radio-group v-model:value="value" name="radioGroup">
                    <a-radio value="Còn hàng">Còn hàng</a-radio>
                    <a-radio value="Hết hàng">Hết hàng</a-radio>
                </a-radio-group>
                <template #footer>
                    <a-button style="margin-right: 8px" @click="onClose">Đóng</a-button>
                    <a-button type="primary" style="background-color: #f33b47" @click="onClose">Lọc</a-button>
                </template>
            </a-drawer>
            <a-select class="mb-2 ms-2 custom-select" v-model:value="luuBien" show-search placeholder="Sắp xếp"
                style="width: 150px;" :options="listSort" :filter-option="filterOption"></a-select>
        </div>

        <a-button type="primary" style="background-color: #f33b47" class="d-flex align-items-center">
            <PlusOutlined />Thêm sản phẩm
        </a-button>

    </div>
</template>
<script setup>
import { ref } from 'vue';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons-vue';
const open = ref(false);
const value = ref('Còn hàng');
const value2 = ref([0, 999999999]);
const listSort = ref([
    { value: '1', label: 'Sắp xếp theo' },
    { value: '2', label: 'Tên tăng dần' },
    { value: '3', label: 'Tên giảm dần' },
    { value: '4', label: 'Giá tăng dần' },
    { value: '5', label: 'Giá giảm dần' },
    { value: '6', label: 'Mới nhất' },
    { value: '7', label: 'Cũ nhất' },
]);

const luuBien = ref('1');
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
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

/* css sắp xếp */
:deep(.custom-select) {

    /* Style mặc định */
    .ant-select-selector {
        border-color: #f33b47 !important;
        background-color: #f33b47 !important;
        border-radius: 6px !important;
        color: white !important;
        transition: all 0.3s ease;
    }

    /* Style cho arrow và search icon mặc định */
    .ant-select-arrow,
    .ant-select-clear,
    .ant-select-selection-search-icon {
        color: #f33b47 !important;
        transition: all 0.3s ease;
        color: white !important;
    }

    /* Style khi hover */
    &:hover {
        .ant-select-selector {
            border-color: #f33b47 !important;
            background-color: #f33b47 !important;
            color: white !important;
        }

        .ant-select-arrow,
        .ant-select-clear,
        .ant-select-selection-search-icon {
            color: white !important;
        }
    }

    /* Style khi focus/active */
    &.ant-select-focused .ant-select-selector,
    &.ant-select-open .ant-select-selector {
        border-color: #f33b47 !important;
        background-color: #f33b47 !important;
        color: white !important;
        box-shadow: 0 0 0 2px rgba(243, 59, 71, 0.2) !important;
    }

    /* Style cho icons khi focus/active */
    &.ant-select-focused,
    &.ant-select-open {

        .ant-select-arrow,
        .ant-select-clear,
        .ant-select-selection-search-icon {
            color: white !important;
        }
    }

    /* Style cho placeholder và selected item */
    .ant-select-selection-placeholder,
    .ant-select-selection-item {
        color: inherit;
    }
}

/* Style cho dropdown menu */
:deep(.ant-select-dropdown) {
    .ant-select-item {
        transition: all 0.3s ease;
    }

    .ant-select-item-option-active {
        background-color: rgba(243, 59, 71, 0.1) !important;
    }

    .ant-select-item-option-selected {
        background-color: #f33b47 !important;
        color: white !important;
    }
}
</style>