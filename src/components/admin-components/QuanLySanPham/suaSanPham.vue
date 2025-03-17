<template>
    <div class="row">
        <div class="col-md-6 border-end">
            <h5>Sửa sản phẩm</h5>
            <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal"
                @finish="onFinish">
                <a-form-item label="Tên sản phẩm" name="ten_san_pham"
                    :rules="[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]">
                    <a-input v-model:value="formState.ten_san_pham" />
                </a-form-item>



                <a-form-item label="Giới tính" name="gioi_tinh"
                    :rules="[{ required: true, message: 'Vui lòng chọn giới tính!' }]">
                    <a-radio-group v-model:value="formState.gioi_tinh">
                        <a-radio :value="true">Nam</a-radio>
                        <a-radio :value="false">Nữ</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="Danh mục" name="danh_muc_id"
                    :rules="[{ required: true, message: 'Vui lòng chọn danh mục!' }]">
                    <a-select v-model:value="formState.danh_muc_id" placeholder="Chọn danh mục">
                        <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc" :value="item.id_danh_muc">
                            {{ item.ten_danh_muc }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Thương hiệu" name="thuong_hieu_id"
                    :rules="[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]">
                    <a-select v-model:value="formState.thuong_hieu_id" placeholder="Chọn thương hiệu">
                        <a-select-option v-for="item in thuongHieuList" :key="item.id_thuong_hieu"
                            :value="item.id_thuong_hieu">
                            {{ item.ten_thuong_hieu }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Chất liệu" name="chat_lieu_id"
                    :rules="[{ required: true, message: 'Vui lòng chọn chất liệu!' }]">
                    <a-select v-model:value="formState.chat_lieu_id" placeholder="Chọn chất liệu">
                        <a-select-option v-for="item in chatLieuList" :key="item.id_chat_lieu"
                            :value="item.id_chat_lieu">
                            {{ item.ten_chat_lieu }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item hidden label="Trạng thái" name="trang_thai">
                    <a-switch v-model:checked="formState.trang_thai" :checked-children="'Hoạt động'"
                        :un-checked-children="'Không hoạt động'" />
                </a-form-item>

                <a-form-item label="Mô tả" name="mo_ta">
                    <a-textarea v-model:value="formState.mo_ta" :rows="4" placeholder="Nhập mô tả sản phẩm" />
                </a-form-item>

                <a-form-item label="Hình ảnh" name="hinh_anh"
                    :rules="[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]">
                    <a-upload v-model:file-list="fileList" list-type="picture-card" :max-count="1"
                        :before-upload="beforeUpload" @change="handleImageChange">
                        <div v-if="fileList.length < 1">
                            <plus-outlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                    <a-button type="primary" html-type="submit" :loading="loading">
                        Cập nhật sản phẩm
                    </a-button>
                    <a-button style="margin-left: 10px" @click="goBack">
                        Quay lại
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="col-md-6">
            <!-- Phần biến thể sản phẩm -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Biến thể sản phẩm</h5>
                <a-button type="primary" @click="addVariant" class="d-flex align-items-center">
                    <plus-outlined />Thêm biến thể
                </a-button>
            </div>

            <div v-for="(variant, index) in variants" :key="index" class="variant-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6>Biến thể #{{ index + 1 }}</h6>
                    <a-button type="text" danger @click="removeVariant(index)">
                        <delete-outlined />
                    </a-button>
                </div>

                <a-form layout="vertical">
                    <div class="row">
                        <div class="col-md-6">
                            <a-form-item label="Màu sắc"
                                :rules="[{ required: true, message: 'Vui lòng chọn màu sắc!' }]">
                                <a-select v-model:value="variant.mau_sac_id" placeholder="Chọn màu sắc">
                                    <a-select-option v-for="color in mauSacList" :key="color.id_mau_sac"
                                        :value="color.id_mau_sac">
                                        {{ color.ma_mau_sac + ' ' + color.ten_mau_sac }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div class="col-md-6">
                            <a-form-item label="Kích thước"
                                :rules="[{ required: true, message: 'Vui lòng chọn size!' }]">
                                <a-select v-model:value="variant.size_id" placeholder="Chọn size">
                                    <a-select-option v-for="size in sizeList" :key="size.id_kich_thuoc"
                                        :value="size.id_kich_thuoc">
                                        {{ size.gia_tri }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <a-form-item label="Số lượng"
                                :rules="[{ required: true, message: 'Vui lòng nhập số lượng!' }]">
                                <a-input-number v-model:value="variant.so_luong" :min="0" style="width: 100%" />
                            </a-form-item>
                        </div>
                        <div class="col-md-6">
                            <a-form-item label="Giá bán"
                                :rules="[{ required: true, message: 'Vui lòng nhập giá bán!' }]">
                                <a-input-number v-model:value="variant.gia_ban" :min="0"
                                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                    :parser="value => value.replace(/\$\s?|(,*)/g, '')" style="width: 100%" />
                            </a-form-item>
                        </div>
                    </div>

                    <a-form-item label="Trạng thái">
                        <a-switch v-model:checked="variant.trang_thai" :checked-children="'Còn hàng'"
                            :un-checked-children="'Hết hàng'" />
                    </a-form-item>

                    <a-form-item label="Hình ảnh biến thể">
                        <div class="d-flex align-items-center gap-2">
                            <a-upload v-model:file-list="variant.fileList" list-type="picture-card" :max-count="3"
                                :multiple="true" :before-upload="(file) => beforeUpload(file, variant.fileList.length)"
                                @change="(info) => handleVariantImageChange(info, index)" @preview="handlePreview">
                                <div v-if="variant.fileList.length < 3">
                                    <plus-outlined />
                                    <div style="margin-top: 8px">Upload (Tối đa 3)</div>
                                </div>
                            </a-upload>
                            <span class="text-muted">
                                {{ variant.fileList.length }}/3 ảnh
                            </span>
                        </div>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>

    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useGbStore } from '@/stores/gbStore';
import { useRoute, useRouter } from 'vue-router';

const store = useGbStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const fileList = ref([]);

// Form layout
const labelCol = {
    style: {
        width: '120px',
    },
};
const wrapperCol = {
    span: 14,
};

// Form state
const formState = reactive({
    ten_san_pham: '',
    mo_ta: '',
    gioi_tinh: undefined,
    hinh_anh: '',
    danh_muc_id: undefined,
    thuong_hieu_id: undefined,
    chat_lieu_id: undefined,
    trang_thai: true
});

// Lists for selects
const danhMucList = ref([]);
const thuongHieuList = ref([]);
const chatLieuList = ref([]);
const variants = ref([]);
const mauSacList = ref([]);
const sizeList = ref([]);

// Load sản phẩm và biến thể
const loadProductData = async (productId) => {
    try {
        const product = await store.getProductById(productId);

        // Cập nhật formState
        Object.assign(formState, {
            ten_san_pham: product.ten_san_pham,
            mo_ta: product.mo_ta,
            gioi_tinh: product.gioi_tinh,
            hinh_anh: product.hinh_anh,
            danh_muc_id: product.danh_muc_id,
            thuong_hieu_id: product.thuong_hieu_id,
            chat_lieu_id: product.chat_lieu_id,
            trang_thai: product.trang_thai
        });

        // Cập nhật fileList cho hình ảnh sản phẩm
        if (product.hinh_anh) {
            fileList.value = [{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: product.hinh_anh,
            }];
        }

        // Load biến thể
        const ctspList = await store.getCTSPByProductId(productId);
        variants.value = ctspList.map(ctsp => ({
            id: ctsp.id_ctsp,
            mau_sac_id: ctsp.mau_sac_id,
            size_id: ctsp.size_id,
            so_luong: ctsp.so_luong,
            gia_ban: ctsp.gia_ban,
            trang_thai: ctsp.trang_thai,
            fileList: ctsp.hinh_anh.map((url, index) => ({
                uid: `-${index}`,
                name: `image-${index}.png`,
                status: 'done',
                url: url,
            })),
            hinh_anh: ctsp.hinh_anh
        }));

    } catch (error) {
        message.error('Có lỗi khi tải thông tin sản phẩm!');
        console.error(error);
    }
};

// Methods
const onFinish = async (values) => {
    loading.value = true;
    try {
        // Cập nhật sản phẩm chính
        await store.updateProduct(route.params.id, formState);

        // Cập nhật các biến thể
        for (const variant of variants.value) {
            if (variant.id) {
                // Cập nhật biến thể đã tồn tại
                await store.updateCTSP(variant.id, {
                    ...variant,
                    id_san_pham: route.params.id,
                    hinh_anh: variant.hinh_anh
                });
            } else {
                // Tạo biến thể mới
                await store.createCTSP({
                    ...variant,
                    id_san_pham: route.params.id,
                    hinh_anh: variant.hinh_anh
                });
            }
        }

        message.success('Cập nhật sản phẩm thành công!');
        router.push('/admin/quanlysanpham');
    } catch (error) {
        message.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    router.push('/admin/quanlysanpham');
};

// Thêm các methods xử lý ảnh
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file ảnh!');
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return false;
    }
    return true;
};

const handleImageChange = (info) => {
    fileList.value = info.fileList;
    if (info.file.status === 'done') {
        formState.hinh_anh = info.file.response.url;
        message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại`);
    }
};

const addVariant = () => {
    // ... giống như trong themSanPham.vue
};

const removeVariant = (index) => {
    // ... giống như trong themSanPham.vue
};

// Mounted
onMounted(async () => {
    try {
        // Load danh sách các options
        await Promise.all([
            store.getDanhMucList(),
            store.getThuongHieuList(),
            store.getChatLieuList(),
            store.getMauSacList(),
            store.getSizeList()
        ]);

        danhMucList.value = store.danhMucList;
        thuongHieuList.value = store.thuongHieuList;
        chatLieuList.value = store.chatLieuList;
        mauSacList.value = store.mauSacList;
        sizeList.value = store.sizeList;

        // Load thông tin sản phẩm nếu có id
        if (route.params.id) {
            await loadProductData(route.params.id);
        }
    } catch (error) {
        message.error('Có lỗi khi tải dữ liệu!');
        console.error(error);
    }
});
</script>

<style scoped>
/* Giữ nguyên CSS từ themSanPham.vue */
.form-bien-the {
    z-index: 1200;
}

.ant-upload-picture-card-wrapper {
    width: 100%;
}

/* ... các styles khác ... */
</style>