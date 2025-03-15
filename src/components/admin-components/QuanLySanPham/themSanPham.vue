<template>
    <div class="row">
        <div class="col-md-6 border-end">
            <h5>Thêm sản phẩm</h5>
            <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal"
                @finish="onFinish">
                <a-form-item label="Mã sản phẩm" name="ma_san_pham"
                    :rules="[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]">
                    <a-input v-model:value="formState.ma_san_pham" />
                </a-form-item>
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

                <a-form-item label="Hình ảnh" name="hinh_anh"
                    :rules="[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]">
                    <a-upload v-model:file-list="fileList" list-type="picture-card" :max-count="1"
                        @change="handleImageChange">
                        <div v-if="fileList.length < 1">
                            <plus-outlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                    <a-button type="primary" html-type="submit" :loading="loading">
                        Thêm sản phẩm
                    </a-button>
                    <a-button style="margin-left: 10px" @click="resetForm">
                        Làm mới
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="col-md-6">
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

                    <a-form-item label="Hình ảnh biến thể"
                        :rules="[{ required: true, message: 'Vui lòng chọn ít nhất 1 hình ảnh!' }]">
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

const store = useGbStore();
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
    ma_san_pham: '',
    gioi_tinh: undefined,
    hinh_anh: '',
    danh_muc_id: undefined,
    thuong_hieu_id: undefined,
    chat_lieu_id: undefined,
});

// Lists for selects
const danhMucList = ref([]);
const thuongHieuList = ref([]);
const chatLieuList = ref([]);

// Thêm state cho biến thể
const variants = ref([]);
const mauSacList = ref([]); // Danh sách màu sắc từ API
const sizeList = ref([]); // Danh sách size từ API

// Thêm state cho preview ảnh
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

// Methods
const handleImageChange = (info) => {
    fileList.value = info.fileList;
    if (info.file.status === 'done') {
        formState.hinh_anh = info.file.response.url;
        message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại`);
    }
};

const resetForm = () => {
    Object.keys(formState).forEach(key => {
        formState[key] = '';
    });
    fileList.value = [];
    variants.value = [];
    variants.value = variants.value.map(variant => ({
        ...variant,
        fileList: [],
        hinh_anh: []
    }));
};

const addVariant = () => {
    variants.value.push({
        mau_sac_id: undefined,
        size_id: undefined,
        so_luong: 0,
        gia_ban: 0,
        trang_thai: true,
        fileList: [],
        hinh_anh: []
    });
};

const removeVariant = (index) => {
    variants.value.splice(index, 1);
};

const beforeUpload = (file, currentFileCount) => {
    // Kiểm tra số lượng file hiện tại
    if (currentFileCount >= 3) {
        message.error('Chỉ được upload tối đa 3 ảnh!');
        return false;
    }

    // Kiểm tra định dạng file
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('Chỉ được upload file ảnh!');
        return false;
    }

    // Kiểm tra kích thước file (ví dụ: tối đa 2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return false;
    }

    return true;
};

const handleVariantImageChange = async (info, variantIndex) => {
    const { fileList } = info;

    // Giới hạn số lượng file
    const limitedFileList = fileList.slice(0, 3);

    // Cập nhật fileList cho biến thể
    variants.value[variantIndex].fileList = limitedFileList;

    // Xử lý các file đã upload thành công
    const successFiles = limitedFileList.filter(file => file.status === 'done');
    variants.value[variantIndex].hinh_anh = successFiles.map(file => file.response.url);

    // Thông báo kết quả
    const lastFile = info.file;
    if (lastFile.status === 'done') {
        message.success(`${lastFile.name} đã được tải lên thành công`);
    } else if (lastFile.status === 'error') {
        message.error(`${lastFile.name} tải lên thất bại`);
    }
};

const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleCancel = () => {
    previewVisible.value = false;
};

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const onFinish = async (values) => {
    loading.value = true;
    try {
        // Tạo sản phẩm chính
        const response = await store.createProduct(formState);
        const productId = response.id_san_pham;

        // Tạo các biến thể CTSP với hình ảnh
        if (variants.value.length > 0) {
            const ctspPromises = variants.value.map(variant => {
                return store.createCTSP({
                    ...variant,
                    id_san_pham: productId,
                    hinh_anh: variant.hinh_anh
                });
            });

            await Promise.all(ctspPromises);
        }

        message.success('Thêm sản phẩm và biến thể thành công!');
        resetForm();
    } catch (error) {
        message.error('Có lỗi xảy ra khi thêm sản phẩm!');
        console.error(error);
    } finally {
        loading.value = false;
    }
};

// Fetch initial data
onMounted(async () => {
    try {
        // Thay thế bằng các actions thực tế từ store của bạn
        await store.getDanhMucList();
        await store.getThuongHieuList();
        await store.getChatLieuList();

        danhMucList.value = store.danhMucList;
        thuongHieuList.value = store.thuongHieuList;
        chatLieuList.value = store.chatLieuList;

        // Thêm các API calls để lấy danh sách màu sắc và size
        await store.getMauSacList();
        await store.getSizeList();
        mauSacList.value = store.mauSacList;
        sizeList.value = store.sizeList;
    } catch (error) {
        message.error('Có lỗi khi tải dữ liệu!');
        console.error(error);
    }
});
</script>

<style scoped>
.ant-upload-picture-card-wrapper {
    width: 100%;
}

:deep(.ant-form-item) {
    margin-bottom: 16px;
}

:deep(.ant-form-item-label) {
    text-align: left;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 100px;
    height: 100px;
}

.variant-item {
    background-color: #fafafa;
    transition: all 0.3s ease;
}

.variant-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

:deep(.ant-form-item) {
    margin-bottom: 12px;
}

:deep(.ant-input-number) {
    width: 100%;
}

:deep(.ant-upload-list-picture-card) {
    display: flex;
    gap: 8px;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 100px;
    height: 100px;
    margin: 0 !important;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
    width: 100px;
    height: 100px;
    margin: 0;
}
</style>