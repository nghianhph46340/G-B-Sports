<template>
    <div class="mb-4 d-flex justify-content-between">
        <div class="d-flex gap-2 flex-wrap">
            <template v-if="!store.checkRouter.includes('quanlysanpham/add')">
                <a-button type="" @click="showDrawer" class="d-flex align-items-center btn-filter">
                    <FilterOutlined class="icon-filler" />
                    <span class="button-text">Bộ lọc</span>
                </a-button>
                <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
                    :root-style="{ color: 'black' }" title="Bộ lọc sản phẩm" placement="right"
                    @after-open-change="afterOpenChange" :footer-style="{ textAlign: 'right' }">

                    <p for="name">Danh mục</p>
                    <a-select class="mb-2" v-model:value="valueDanhMuc" show-search placeholder="Danh mục"
                        style="width: 330px" :options="danhMucOptions" :filter-option="filterOption"
                        @focus="handleFocus" @blur="handleBlur" @change="handleChange"></a-select>

                    <p for="name">Thương hiệu</p>
                    <a-select class="mb-2" v-model:value="valueThuongHieu" show-search placeholder="Thương hiệu"
                        style="width: 330px" :options="thuongHieuOptions" :filter-option="filterOption"
                        @focus="handleFocus" @blur="handleBlur" @change="handleChange"></a-select>

                    <p for="name">Chất liệu</p>
                    <a-select class="mb-2" v-model:value="valueChatLieu" show-search placeholder="Chất liệu"
                        style="width: 330px" :options="chatLieuOptions" :filter-option="filterOption"
                        @focus="handleFocus" @blur="handleBlur" @change="handleChange"></a-select>



                    <p for="name">Màu sắc</p>
                    <a-select class="mb-2" v-model:value="valueMauSac" show-search placeholder="Màu sắc"
                        style="width: 330px" :options="mauSacOptions" :filter-option="filterOption" @focus="handleFocus"
                        @blur="handleBlur" @change="handleChange"></a-select>

                    <p for="name">Kích thước</p>
                    <a-select class="mb-2" v-model:value="valueSize" show-search placeholder="Kích thước"
                        style="width: 330px" :options="sizeOptions" :filter-option="filterOption" @focus="handleFocus"
                        @blur="handleBlur" @change="handleChange"></a-select>

                    <p>Giá</p>
                    <a-slider class="mb-2" v-model:value="value2" range :max="999999999" />
                    <p>Trạng thái</p>
                    <a-radio-group :checked="value" v-model:value="value" name="radioGroup">
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
                <a-select class="mb-2 ms-2 custom-select" v-model:value="xemTheo" show-search placeholder="Xem theo"
                    style="width: 150px;" :options="listXemTheo" :filter-option="filterOption"></a-select>

                <a-button type="" class="d-flex align-items-center btn-filter">
                    <ExportOutlined class="icon-filler" />
                    <span class="button-text">Xuất excel</span>
                </a-button>
            </template>
            <a-button type="" class="d-flex align-items-center btn-filter">
                <ImportOutlined class="icon-filler" />
                <span class="button-text">Nhập excel</span>
            </a-button>
        </div>
        <template v-if="!store.checkRouter.includes('quanlysanpham/add')">
            <a-button type="primary" style="background-color: #f33b47" @click="changeRouter('/admin/quanlysanpham/add')"
                class="d-flex align-items-center">
                <PlusOutlined />
                <span class="button-text">Thêm sản phẩm</span>
            </a-button>
        </template>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { FilterOutlined, PlusOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useGbStore } from '@/stores/gbStore';
import { useRoute } from 'vue-router';
const route = useRoute();
const store = useGbStore();
const open = ref(false);
const value = ref('Còn hàng');
const valueDanhMuc = ref('Chọn danh mục');
const valueThuongHieu = ref('Chọn thương hiệu');
const valueChatLieu = ref('Chọn chất liệu');
const valueMauSac = ref('Chọn màu sắc');
const valueSize = ref('Chọn kích thước');
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

const listXemTheo = ref([
    { value: '0', label: 'Tất cả sản phẩm' },
    { value: '1', label: '5 sản phẩm' },
    { value: '2', label: '10 sản phẩm' },
    { value: '3', label: '15 sản phẩm' },
    { value: '4', label: '20 sản phẩm' },
])
const danhMucOptions = ref([]);
const thuongHieuOptions = ref([]);
const chatLieuOptions = ref([]);
const mauSacOptions = ref([]);
const sizeOptions = ref([]);
const loadingOptions = ref(false);
const xemTheo = ref('0');
const luuBien = ref('1');
//Hàm huyển đổi dữ liệu danh mục
const loadDanhMucOptions = async () => {
    loadingOptions.value = true;
    try {
        await store.getDanhMucList(); // Gọi API lấy danh mục

        // Chuyển đổi dữ liệu từ store sang format options
        danhMucOptions.value = store.danhMucList.map(item => ({
            value: item.id_danh_muc,
            label: item.ten_danh_muc
        }));

    } catch (error) {
        console.error('Lỗi khi load danh mục:', error);
        message.error('Không thể tải danh sách danh mục');
    } finally {
        loadingOptions.value = false;
    }
};
//Hàm huyển đổi dữ liệu thương hiệu
const loadThuongHieuOptions = async () => {
    loadingOptions.value = true;
    try {
        await store.getThuongHieuList(); // Gọi API lấy thương hiệu

        // Chuyển đổi dữ liệu từ store sang format options
        thuongHieuOptions.value = store.thuongHieuList.map(item => ({
            value: item.id_thuong_hieu,
            label: item.ten_thuong_hieu
        }));

    } catch (error) {
        console.error('Lỗi khi load thương hiệu:', error);
        message.error('Không thể tải danh sách thương hiệu');
    } finally {
        loadingOptions.value = false;
    }
};
//Hàm huyển đổi dữ liệu chất liệu
const loadChatLieuOptions = async () => {
    loadingOptions.value = true;
    try {
        await store.getChatLieuList(); // Gọi API lấy chất liệu

        // Chuyển đổi dữ liệu từ store sang format options
        chatLieuOptions.value = store.chatLieuList.map(item => ({
            value: item.id_chat_lieu,
            label: item.ten_chat_lieu
        }));

    } catch (error) {
        console.error('Lỗi khi load chất liệu:', error);
        message.error('Không thể tải danh sách chất liệu');
    } finally {
        loadingOptions.value = false;
    }
};
//Hàm huyển đổi dữ liệu màu sắc
const loadMauSacOptions = async () => {
    loadingOptions.value = true;
    try {
        await store.getMauSacList(); // Gọi API lấy màu sắc

        // Chuyển đổi dữ liệu từ store sang format options
        mauSacOptions.value = store.mauSacList.map(item => ({
            value: item.id_mau_sac,
            label: item.ten_mau_sac
        }));

    } catch (error) {
        console.error('Lỗi khi load màu sắc:', error);
        message.error('Không thể tải danh sách màu sắc');
    } finally {
        loadingOptions.value = false;
    }
};
//Hàm huyển đổi dữ liệu size
const loadSizeOptions = async () => {
    loadingOptions.value = true;
    try {
        await store.getSizeList(); // Gọi API lấy size

        // Chuyển đổi dữ liệu từ store sang format options
        sizeOptions.value = store.sizeList.map(item => ({
            value: item.id_kich_thuoc,
            label: item.gia_tri + ' ' + item.don_vi
        }));

    } catch (error) {
        console.error('Lỗi khi load size:', error);
        message.error('Không thể tải danh sách size');
    } finally {
        loadingOptions.value = false;
    }
};
//Hàm lọc dữ liệu
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
    console.log(open.value);
};
const onClose = () => {
    open.value = false;
};
//Chuyển router
const router = useRouter();
const changeRouter = (routers) => {
    store.getPath(routers);
    store.getRoutePresent(route.path);
    router.push(routers);
    console.log(store.checkRouter);
};
//Lấy router hiện tại
// const danhMucList = ref([]);
// const thuongHieuList = ref([]);
// const chatLieuList = ref([]);

// // Thêm state cho biến thể
// const mauSacList = ref([]); // Danh sách màu sắc từ API
// const sizeList = ref([]); // Danh sách size từ API

onMounted(() => {
    loadDanhMucOptions();
    loadThuongHieuOptions();
    loadChatLieuOptions();
    loadMauSacOptions();
    loadSizeOptions();
});
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

.custom-class {
    z-index: 1000;
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

/* Thêm styles mới cho responsive buttons */
.button-text {
    margin-left: 4px;
}

/* Ẩn text khi màn hình nhỏ hơn 768px */
@media (max-width: 768px) {
    .button-text {
        display: none;
    }

    .btn-filter,
    .ant-btn {
        padding: 4px 8px;
        min-width: 32px;
        justify-content: center;
    }

    /* Điều chỉnh kích thước select boxes */
    .custom-select {
        width: 100px !important;
    }
}

/* Ẩn text khi màn hình nhỏ hơn 576px */
@media (max-width: 576px) {
    .custom-select {
        width: 80px !important;
    }

    .d-flex.gap-2 {
        gap: 0.25rem !important;
    }
}

/* Thêm transition cho smooth effect */
.btn-filter,
.ant-btn {
    transition: all 0.3s ease;
}

/* Đảm bảo icon luôn hiển thị đẹp */
.icon-filler {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>