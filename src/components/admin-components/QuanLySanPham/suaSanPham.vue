<template>
    <div class="row">
        <div class="col-md-6 border-end">
            <h5>Thêm sản phẩm</h5>
            <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" ref="formRef"
                :rules="rules">
                <a-form-item label="Mã sản phẩm" name="ma_san_pham"
                    :rules="[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]">
                    <a-input v-model:value="formState.ma_san_pham" readonly disabled />
                </a-form-item>
                <a-form-item label="Tên sản phẩm" name="ten_san_pham" :rules="[
                    { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                    { validator: validateProductName }
                ]">
                    <a-input v-model:value="formState.ten_san_pham" />
                </a-form-item>

                <a-form-item label="Danh mục" name="id_danh_muc"
                    :rules="[{ required: true, message: 'Vui lòng chọn danh mục!' }]">
                    <a-select :disabled="true" v-model:value="formState.id_danh_muc" placeholder="Chọn danh mục">
                        <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc" :value="item.id_danh_muc">
                            {{ item.ten_danh_muc }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Thương hiệu" name="id_thuong_hieu"
                    :rules="[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]">
                    <a-select :disabled="true" v-model:value="formState.id_thuong_hieu" placeholder="Chọn thương hiệu">
                        <a-select-option v-for="item in thuongHieuList" :key="item.id_thuong_hieu"
                            :value="item.id_thuong_hieu">
                            {{ item.ten_thuong_hieu }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Chất liệu" name="id_chat_lieu"
                    :rules="[{ required: true, message: 'Vui lòng chọn chất liệu!' }]">
                    <a-select :disabled="true" v-model:value="formState.id_chat_lieu" placeholder="Chọn chất liệu">
                        <a-select-option v-for="item in chatLieuList" :key="item.id_chat_lieu"
                            :value="item.id_chat_lieu">
                            {{ item.ten_chat_lieu }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Mô tả" name="mo_ta">
                    <a-textarea v-model:value="formState.mo_ta" :rows="4" placeholder="Nhập mô tả sản phẩm"
                        :maxLength="500" show-count />
                </a-form-item>

                <a-form-item label="Hình ảnh" name="hinh_anh">
                    <a-upload v-model:file-list="fileList" list-type="picture-card" :max-count="1"
                        @change="handleImageChange" :before-upload="beforeUpload">
                        <div v-if="fileList.length < 1">
                            <plus-outlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <!-- <a-form-item label="Giá chung" name="gia_chung">
                    <div class="d-flex align-items-center gap-2">
                        <a-switch v-model:checked="useCommonPrice" :checked-children="'Dùng giá chung'"
                            :un-checked-children="'Giá riêng'" @change="handlePriceChange" />
                        <div v-if="useCommonPrice" class="d-flex gap-2 w-100">
                            <a-input-number v-model:value="formState.gia_ban_chung" class="w-full" :controls="false"
                                :formatter="(value) => value === null || value === undefined ? '' : `${value}`"
                                :parser="(value) => value.replace(/,/g, '')"
                                placeholder="Nhập giá bán chung cho các biến thể" :disabled="!useCommonPrice"
                                @blur="formatCommonPriceOnBlur" />
                        </div>
                    </div>
                </a-form-item> -->

                <!-- <a-form-item label="Trạng thái" name="trang_thai">
                    <a-switch v-model:checked="formState.trang_thai" />
                </a-form-item> -->

                <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                    <a-button type="primary" html-type="submit" :loading="loading" @click="validateForm">
                        Xác nhận thông tin
                    </a-button>
                    <a-button style="margin-left: 10px" @click="resetForm()">
                        Làm mới
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="col-md-6">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Biến thể sản phẩm</h5>
                <a-button v-if="isProductValidated" type="primary" @click="addVariant"
                    class="d-flex align-items-center">
                    <plus-outlined />Thêm biến thể
                </a-button>
                <span v-else class="text-muted">
                    Vui lòng xác nhận thông tin sản phẩm trước khi thêm biến thể
                </span>
            </div>

            <template v-if="isProductValidated">
                <div v-for="(variant, index) in variants" :key="index" class="variant-item mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6>Biến thể #{{ index + 1 }} <span v-if="variant.isExisting" class="badge badge-info">Đã tồn
                                tại</span></h6>
                        <a-button type="text" danger @click="removeVariant(index)" v-if="!variant.isExisting">
                            <delete-outlined />
                        </a-button>
                    </div>

                    <a-form class="form-bien-the" layout="vertical">
                        <div class="row">
                            <div class="col-md-6">
                                <a-form-item label="Màu sắc"
                                    :rules="[{ required: true, message: 'Vui lòng chọn màu sắc!' }]">
                                    <a-select :disabled="variant.isExisting" v-model:value="variant.id_mau_sac"
                                        placeholder="Chọn màu sắc">
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
                                    <a-select :disabled="variant.isExisting" v-model:value="variant.id_kich_thuoc"
                                        placeholder="Chọn size">
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
                                <a-form-item label="Số lượng" :rules="[
                                    { required: true, message: 'Vui lòng nhập số lượng!' },
                                    {
                                        validator: (_, value) => {
                                            if (value < 1) {
                                                return Promise.reject('Số lượng phải lớn hơn 0!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]">
                                    <a-input-number v-model:value="variant.so_luong" class="w-full" :controls="false"
                                        :formatter="(value) => value === null || value === undefined ? '' : `${value}`"
                                        :parser="(value) => value.replace(/,/g, '')"
                                        placeholder="Nhập số lượng sản phẩm" />
                                </a-form-item>
                            </div>

                            <div class="col-md-6">
                                <a-form-item label="Giá" :rules="[
                                    { required: true, message: 'Vui lòng nhập giá bán!' },
                                    {
                                        validator: (_, value) => {
                                            if (value === undefined || value === null || value === '') {
                                                return Promise.reject('Vui lòng nhập giá bán!');
                                            }
                                            if (value < 1000) {
                                                return Promise.reject('Giá bán phải lớn hơn 1000!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]">
                                    <a-input-number :readonly="variant.isExisting" v-model:value="variant.gia_ban"
                                        class="w-full" :controls="false"
                                        :formatter="(value) => value === null || value === undefined ? '' : `${value}`"
                                        :parser="(value) => value.replace(/,/g, '')" placeholder="Nhập giá bán sản phẩm"
                                        :disabled="useCommonPrice || variant.isExisting"
                                        @blur="formatPriceOnBlur($event, index)" />
                                </a-form-item>
                            </div>
                        </div>

                        <a-form-item hidden label="Trạng thái">
                            <a-switch v-model:checked="variant.trang_thai" :checked-children="'Hoạt động'"
                                :un-checked-children="'Không hoạt động'" />
                        </a-form-item>

                        <a-form-item label="Hình ảnh biến thể"
                            :rules="[{ required: true, message: 'Vui lòng chọn ít nhất 1 hình ảnh!' }]">
                            <div class="d-flex align-items-center gap-2">
                                <a-upload v-model:file-list="variant.fileList"
                                    :customRequest="(options) => handleUpload(options, variant)"
                                    :remove="(file) => handleRemoveImage(file, variant)" :itemRender="uploadItemRender"
                                    :preview="(file) => showPreviewImage(file, variant)" list-type="picture-card"
                                    :multiple="true" :disabled="loading">
                                    <div v-if="!loading">
                                        <plus-outlined></plus-outlined>
                                        <div style="margin-top: 8px">Tải lên</div>
                                    </div>
                                </a-upload>
                                <span class="text-muted">
                                    {{ variant.fileList && variant.fileList.length ? variant.fileList.length : 0 }}/3
                                    ảnh
                                </span>
                            </div>
                        </a-form-item>
                    </a-form>
                </div>

                <div class="mt-3" v-if="variants.length > 0">
                    <a-button type="primary" html-type="submit" :loading="loading" @click="onFinish">
                        Lưu tất cả
                    </a-button>
                </div>
            </template>

            <div v-else class="text-center p-4 border rounded">
                <a-empty description="Vui lòng xác nhận thông tin sản phẩm trước khi thêm biến thể">
                    <template #image>
                        <ExclamationCircleOutlined style="font-size: 48px; color: #faad14;" />
                    </template>
                </a-empty>
            </div>
        </div>
    </div>

    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted, watch, h } from 'vue';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, Button } from 'ant-design-vue';
import { useGbStore } from '@/stores/gbStore';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosConfig';

const store = useGbStore();
const router = useRouter();
const route = useRoute();
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
const useCommonPrice = ref(false);
const formState = reactive({
    id_san_pham: route.params.id,
    ma_san_pham: '',
    ten_san_pham: '',
    mo_ta: '',
    hinh_anh: '',
    id_danh_muc: undefined,
    id_thuong_hieu: undefined,
    id_chat_lieu: undefined,
    trang_thai: 'Hoạt động',
    gia_nhap_chung: 0,
    gia_ban_chung: 0,
    ngay_tao: '',
    ngay_cap_nhat: new Date().toISOString()
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

const formRef = ref(null);
const isProductValidated = ref(false);

// Định nghĩa rules cho form
const rules = {
    ten_san_pham: [
        { required: true, message: 'Vui lòng nhập tên sản phẩm!' }
    ],
    id_danh_muc: [
        { required: true, message: 'Vui lòng chọn danh mục!' }
    ],
    id_thuong_hieu: [
        { required: true, message: 'Vui lòng chọn thương hiệu!' }
    ],
    id_chat_lieu: [
        { required: true, message: 'Vui lòng chọn chất liệu!' }
    ],
    gia_ban_chung: [
        {
            validator: (_, value) => {
                if (useCommonPrice.value && (!value || value < 1000)) {
                    return Promise.reject('Giá bán phải lớn hơn 1000!');
                }
                if (useCommonPrice.value && (!value || value > 999999999)) {
                    return Promise.reject('Giá bán phải nhỏ hơn 999.999.999!');
                }
                return Promise.resolve();
            }
        }
    ],
    gia_chung: [
        {
            validator: (_, value) => {
                if (useCommonPrice.value) {

                    if (!formState.gia_ban_chung || formState.gia_ban_chung < 1000) {
                        return Promise.reject('Giá bán phải lớn hơn 1000!');
                    }

                    if (!formState.gia_ban_chung || formState.gia_ban_chung > 999999999) {
                        return Promise.reject('Giá bán phải nhỏ hơn 999.999.999')
                    }
                    // Kiểm tra giá nhập phải nhỏ hơn giá bán ít nhất 10%
                }
                return Promise.resolve();
            }
        }
    ]
};

// Hàm validate tên sản phẩm không được trùng (trừ sản phẩm hiện tại)
const validateProductName = async (_, value) => {
    if (!value) return Promise.reject('Tên sản phẩm không được để trống');

    // Kiểm tra nếu tên sản phẩm chỉ chứa số
    if (/^\d+$/.test(value)) {
        return Promise.reject('Tên sản phẩm không được chỉ chứa số');
    }

    // Kiểm tra nếu tên sản phẩm chứa ký tự đặc biệt (chỉ cho phép chữ cái, số, dấu cách, và dấu gạch ngang)
    if (!/^[a-zA-Z0-9À-ỹ\s\-]+$/.test(value)) {
        return Promise.reject('Tên sản phẩm không được chứa ký tự đặc biệt');
    }

    // Lấy ID sản phẩm hiện tại từ route
    const currentProductId = route.params.id;

    // Kiểm tra tên sản phẩm đã tồn tại trong danh sách sản phẩm (trừ sản phẩm hiện tại)
    const existingProduct = store.getAllSanPham.find(p =>
        p.ten_san_pham === value && p.id_san_pham.toString() !== currentProductId
    );

    if (existingProduct) {
        return Promise.reject('Tên sản phẩm đã tồn tại trong danh sách sản phẩm');
    }

    return Promise.resolve();
};

// Hàm validate form
const validateForm = async () => {
    try {
        // Validate form using formRef
        await formRef.value.validate();
        console.log('Form validated successfully');
        isProductValidated.value = true;
        message.success('Thông tin sản phẩm hợp lệ, bạn có thể thêm biến thể');
    } catch (errorInfo) {
        console.log('Validation failed:', errorInfo);
        isProductValidated.value = false;
        message.error('Vui lòng điền đầy đủ thông tin sản phẩm');
    }
};

// Thêm biến thể
const addVariant = async () => {
    // Validate lại form trước khi thêm biến thể
    try {
        await formRef.value.validate();
        isProductValidated.value = true;
    } catch (errorInfo) {
        isProductValidated.value = false;
        message.error('Vui lòng điền đầy đủ thông tin sản phẩm');
        return;
    }

    // Xác định giá bán cho biến thể mới
    let giaBan = 1100;
    if (useCommonPrice.value && formState.gia_ban_chung && formState.gia_ban_chung >= 1000) {
        giaBan = Number(formState.gia_ban_chung);
        console.log('Thêm biến thể mới với giá chung:', giaBan);
    }

    // Thêm biến thể mới với isExisting = false để cho phép chỉnh sửa
    variants.value.push({
        id_chi_tiet_san_pham: null,
        id_mau_sac: undefined,
        id_kich_thuoc: undefined,
        so_luong: 1,
        gia_ban: giaBan,
        trang_thai: 'Hoạt động',
        fileList: [],
        hinh_anh: [],
        ngay_sua: new Date().toISOString(),
        ngay_tao: new Date().toISOString(),
        isExisting: false // Đánh dấu đây là biến thể mới
    });
};

const removeVariant = (index) => {
    const variant = variants.value[index];
    if (variant.isExisting) {
        message.warning('Không thể xóa biến thể đã tồn tại. Bạn có thể vô hiệu hóa nó trong màn hình quản lý.');
        return;
    }
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

    // Xử lý khi có file được xóa
    if (info.file.status === 'removed') {
        const removedFile = info.file;
        console.log('File bị xóa:', removedFile);

        // Nếu file có URL (đã được tải lên cloud trước đó)
        if (removedFile.url) {
            try {
                // Lấy tên file từ URL
                const urlParts = removedFile.url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const publicId = fileName.split('.')[0]; // Lấy phần trước .jpg hoặc .png

                console.log('Public ID cần xóa:', publicId);

                // Gọi API xóa ảnh
                await axiosInstance.delete("testDeleteImage?publicId=" + publicId);

                // Cập nhật mảng hinh_anh của biến thể
                variants.value[variantIndex].hinh_anh = variants.value[variantIndex].hinh_anh.filter(
                    url => url !== removedFile.url
                );

                message.success(`Đã xóa ảnh khỏi cloud storage`);
            } catch (error) {
                console.error('Lỗi khi xóa ảnh:', error);
                message.error('Không thể xóa ảnh: ' + (error.response?.data || error.message));
            }
        }
    }

    // Xử lý các file đã upload thành công
    if (info.file.status === 'done') {
        // Thông báo kết quả
        message.success(`${info.file.name} đã được tải lên thành công`);

        // Nếu là file mới và có originFileObj, chuẩn bị cho việc upload
        if (info.file.originFileObj) {
            // Đánh dấu file này cần được upload khi lưu
            info.file.needUpload = true;
        }
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại`);
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

// Thêm hàm chuyển đổi giá từ chuỗi có dấu phẩy sang số
const convertPriceToNumber = (price) => {
    if (typeof price === 'string') {
        // Loại bỏ tất cả dấu phẩy và khoảng trắng
        return Number(price.replace(/,|\s/g, ''));
    }
    return Number(price);
};

// Thêm hàm kiểm tra dữ liệu
const onFinish = async () => {
    if (!isProductValidated.value) {
        message.error('Vui lòng xác nhận thông tin sản phẩm trước');
        return;
    }

    loading.value = true;
    try {
        // Validate variants
        if (variants.value.length === 0) {
            throw new Error('Vui lòng thêm ít nhất một biến thể');
        }

        // Tách biến thể thành 2 loại: đã tồn tại và mới 
        const existingVariants = variants.value.filter(v => v.isExisting);
        const newVariants = variants.value.filter(v => !v.isExisting);

        // Validate từng biến thể mới
        for (const variant of newVariants) {
            if (!variant.id_mau_sac || !variant.id_kich_thuoc) {
                throw new Error('Vui lòng điền đầy đủ thông tin cho tất cả biến thể mới');
            }
            // Validate giá của biến thể
            if (!useCommonPrice.value) {
                if (!variant.gia_ban || convertPriceToNumber(variant.gia_ban) < 1000) {
                    throw new Error(`Giá bán của biến thể phải lớn hơn 1000!`);
                }
            }

            // Chuyển đổi giá bán từ chuỗi có dấu phẩy sang số
            variant.gia_ban = convertPriceToNumber(variant.gia_ban);

            // Chuyển đổi số lượng thành số
            variant.so_luong = convertPriceToNumber(variant.so_luong);
        }

        // Validate giá chung
        if (useCommonPrice.value) {
            if (!formState.gia_ban_chung || convertPriceToNumber(formState.gia_ban_chung) < 1000) {
                throw new Error('Giá bán phải lớn hơn 1000!');
            }

            // Chuyển đổi giá bán chung từ chuỗi có dấu phẩy sang số
            formState.gia_ban_chung = convertPriceToNumber(formState.gia_ban_chung);
        }

        // Đảm bảo các giá khác cũng là số
        if (formState.gia_nhap_chung) {
            formState.gia_nhap_chung = convertPriceToNumber(formState.gia_nhap_chung);
        }

        let imageUrl = null;
        if (fileList.value.length > 0) {
            const file = fileList.value[0].originFileObj;
            imageUrl = await uploadImage(file);
            if (imageUrl) {
                formState.hinh_anh = imageUrl;
            }
        }

        // Upload ảnh mới cho từng biến thể mới nếu có
        for (const variant of newVariants) {
            if (variant.fileList && variant.fileList.length > 0) {
                // Tìm các file mới cần upload
                const newFiles = variant.fileList.filter(file => file.originFileObj && file.needUpload);

                // Upload các file mới
                for (const file of newFiles) {
                    try {
                        const imageUrl = await uploadImage(file.originFileObj);
                        if (imageUrl) {
                            console.log('Đã upload ảnh mới, URL trả về:', imageUrl);

                            // Đảm bảo hinh_anh là một mảng
                            if (!Array.isArray(variant.hinh_anh)) {
                                variant.hinh_anh = [];
                            }

                            // Thêm URL mới vào mảng hinh_anh
                            variant.hinh_anh.push(imageUrl);

                            // Cập nhật file.url để hiển thị ảnh
                            file.url = imageUrl;
                            file.status = 'done';

                            console.log('Mảng hinh_anh sau khi thêm:', variant.hinh_anh);
                        }
                    } catch (error) {
                        console.error('Lỗi khi upload ảnh:', error);
                        message.error(`Không thể upload ảnh ${file.name}`);
                    }
                }
            }
        }

        // Cập nhật sản phẩm
        console.log('FormState trước khi gửi:', formState);
        formState.id_san_pham = route.params.id;

        try {
            // Sử dụng axiosInstance để gọi trực tiếp API cập nhật sản phẩm
            const response = await store.createSanPham(formState);
            console.log('Response nhận được:', response);

            if (!response || !response.success) {
                throw new Error(response?.message || 'Không nhận được dữ liệu phản hồi hợp lệ từ server');
            }

            // Cập nhật chỉ các biến thể mới
            for (const variant of newVariants) {
                // Đảm bảo variant có id_san_pham
                variant.id_san_pham = formState.id_san_pham;

                // Log để debug
                console.log('Gửi biến thể mới với giá:', variant.gia_ban, 'và số lượng:', variant.so_luong);

                // Gọi API lưu chi tiết sản phẩm
                await store.createCTSP({
                    ...variant,
                    hinh_anh: variant.hinh_anh
                });
            }

            message.success(response.data.message || 'Cập nhật sản phẩm và biến thể thành công!');
            await store.getAllSanPhamNgaySua();

            // Đánh dấu vừa thêm sản phẩm mới
            store.justAddedProduct = true;
            router.push('/admin/quanlysanpham');
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            if (error.response?.data) {
                // Xử lý lỗi từ server
                const errorMessage = error.response.data.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
                message.error(errorMessage);
            } else {
                // Xử lý lỗi khác
                message.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
            }
        } finally {
            loading.value = false;
        }
    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        if (error.response?.data) {
            // Xử lý lỗi từ server
            const errorMessage = error.response.data.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
            message.error(errorMessage);
        } else {
            // Xử lý lỗi khác
            message.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
        }
    } finally {
        loading.value = false;
        await store.getAllCTSP();
        await store.getAllSanPhamNgaySua();
    }
};

// Hàm upload ảnh lên server
const uploadImage = async (file) => {
    if (!file) {
        console.warn('No file provided for upload');
        return null;
    }

    console.log('Uploading file:', file);
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Sử dụng endpoint API giống như trong themSanPham.vue
        const response = await axiosInstance.post('testImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Upload image response:', response.data);

        // Kiểm tra response và trả về URL
        if (response.data) {
            // Nếu response.data là string (URL trực tiếp)
            if (typeof response.data === 'string') {
                return response.data;
            }
            // Nếu response.data là object có thuộc tính url
            else if (response.data.url) {
                return response.data.url;
            }
            // Trường hợp khác, trả về toàn bộ response.data
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        message.error('Không thể upload ảnh: ' + error.message);
        return null;
    }
};

// Thêm hàm xử lý khi giá thay đổi
const handlePriceChange = async () => {
    if (formRef.value) {
        try {
            await formRef.value.validateFields(['gia_chung']);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    }
};

// Cập nhật watch cho giá chung
watch([() => formState.gia_nhap_chung, () => formState.gia_ban_chung, () => useCommonPrice.value],
    async ([newGiaNhap, newGiaBan, newUseCommon]) => {
        console.log('Watch triggered - giá bán chung:', newGiaBan, typeof newGiaBan);

        if (newUseCommon) {
            // Đảm bảo giá bán chung là số hợp lệ
            let giaBan = newGiaBan;

            // Nếu là chuỗi, cần xử lý đặc biệt với parseNumber
            if (typeof giaBan === 'string') {
                giaBan = parseNumber(giaBan);
            }

            // Nếu giá trị không hợp lệ hoặc < 1000, đặt giá mặc định
            if (giaBan === undefined || giaBan === null || giaBan === '' || giaBan < 1000) {
                giaBan = 1000;
                formState.gia_ban_chung = 1000;
            }

            console.log('Giá bán chung xử lý xong:', giaBan);

            // Cập nhật giá cho tất cả biến thể
            variants.value.forEach(variant => {
                // Cập nhật giá nhập nếu cần
                if (newGiaNhap) {
                    variant.gia_nhap = newGiaNhap;
                }

                // Cập nhật giá bán
                console.log(`Cập nhật giá biến thể thành: ${giaBan}`);
                variant.gia_ban = giaBan;
            });

            // Validate khi giá thay đổi
            await handlePriceChange();
        }
    }
);

// Hàm xử lý khi giá biến thể thay đổi
const handleVariantPriceChange = (value, variant, field) => {
    if (field === 'gia_nhap') {
        // Khi giá nhập thay đổi, kiểm tra lại giá bán
        if (value < 1000) {
            message.error('Giá nhập phải lớn hơn 1000!');
            variant.gia_nhap = 1000; // Reset về giá trị tối thiểu
            return;
        }
        const minGiaBan = value * 1.1;
        if (variant.gia_ban < minGiaBan) {
            message.warning(`Giá bán phải lớn hơn giá nhập ít nhất 10% (Tối thiểu: ${minGiaBan.toLocaleString()}đ)`);
        }
    } else if (field === 'gia_ban') {
        // Khi giá bán thay đổi, kiểm tra xem có đủ 10% không
        if (value < 1000) {
            message.error('Giá bán phải lớn hơn 1000!');
            variant.gia_ban = 1000; // Reset về giá trị tối thiểu
            return;
        }
        const minGiaBan = variant.gia_nhap * 1.1;
        if (value < minGiaBan) {
            message.warning(`Giá bán phải lớn hơn giá nhập ít nhất 10% (Tối thiểu: ${minGiaBan.toLocaleString()}đ)`);
        }
    }
};

// Thêm watch cho formState để kiểm tra validation
watch(() => formState, async (newVal) => {
    try {
        await formRef.value.validate();
        isProductValidated.value = true;
    } catch (error) {
        isProductValidated.value = false;
    }
}, { deep: true });

// Hàm xử lý upload ảnh
const handleImageChange = async (info) => {
    console.log('handleImageChange được gọi với:', info);

    // Cập nhật fileList
    fileList.value = info.fileList;

    // Xử lý khi ảnh bị xóa (status = 'removed')
    if (info.file.status === 'removed') {
        console.log('Ảnh bị xóa:', info.file);

        // Nếu ảnh đã được upload lên cloud (có url)
        if (info.file.url) {
            try {
                // Trích xuất publicId từ URL
                const urlParts = info.file.url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const publicId = fileName.split('.')[0]; // Lấy phần trước .jpg hoặc .png

                console.log('Public ID cần xóa:', publicId);

                // Gọi API xóa ảnh
                await axiosInstance.delete("testDeleteImage?publicId=" + publicId);

                // Xóa URL ảnh khỏi formState
                formState.hinh_anh = '';

                message.success('Đã xóa ảnh thành công');
            } catch (error) {
                console.error('Lỗi khi xóa ảnh:', error);
                message.error('Không thể xóa ảnh: ' + error.message);
            }
        }
    }
};

let previewVariant = ref(null);
let previewFile = ref(null);

// Xử lý khi người dùng chọn ảnh chính
const setMainImage = (variant, file) => {
    if (!variant || !variant.fileList || variant.fileList.length === 0) return;

    console.log('Đặt ảnh chính cho variant:', variant);
    console.log('File đặt làm ảnh chính:', file);

    // Đặt tất cả ảnh không phải ảnh chính trước
    variant.fileList.forEach(item => {
        if (item && item.uid === file.uid) {
            item.anh_chinh = "1";
            console.log('Đã đặt ảnh', item.name, 'làm ảnh chính');
        } else if (item) {
            item.anh_chinh = "0";
        }
    });

    // Force cập nhật UI 
    variant.fileList = [...variant.fileList];

    console.log('FileList sau khi đặt ảnh chính:', variant.fileList);
};

const showPreviewImage = (file, variant) => {
    if (!file || !file.url) {
        console.log('Không thể xem trước ảnh:', file);
        return;
    }

    previewVisible.value = true;
    previewImage.value = file.url;
    previewTitle.value = file.name || (file.url && file.url.substring(file.url.lastIndexOf('/') + 1)) || 'Hình ảnh';
};

onMounted(async () => {
    try {
        // Lấy thông tin sản phẩm theo ID
        await store.getSanPhamById(route.params.id);

        // Kiểm tra xem có dữ liệu sản phẩm không
        if (!store.sanPhamById || !store.sanPhamById.id_san_pham) {
            throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        console.log('Dữ liệu sản phẩm:', store.sanPhamById);

        // Lấy dữ liệu danh mục, thương hiệu, chất liệu trước khi cập nhật form
        await store.getDanhMucList();
        await store.getThuongHieuList();
        await store.getChatLieuList();

        // Lấy danh sách màu sắc và size
        await store.getMauSacList();
        await store.getSizeList();

        console.log('Danh mục:', store.danhMucList);
        console.log('Thương hiệu:', store.thuongHieuList);
        console.log('Chất liệu:', store.chatLieuList);
        console.log('Màu sắc:', store.mauSacList);
        console.log('Size:', store.sizeList);

        danhMucList.value = store.danhMucList;
        thuongHieuList.value = store.thuongHieuList;
        chatLieuList.value = store.chatLieuList;
        mauSacList.value = store.mauSacList;
        sizeList.value = store.sizeList;
        console.log('Màu sắc:', mauSacList.value);
        console.log('Size:', sizeList.value);


        // Cập nhật formState với dữ liệu sản phẩm
        formState.id_san_pham = store.sanPhamById.id_san_pham;
        formState.ma_san_pham = store.sanPhamById.ma_san_pham;
        formState.ten_san_pham = store.sanPhamById.ten_san_pham;
        formState.mo_ta = store.sanPhamById.mo_ta;
        formState.hinh_anh = store.sanPhamById.hinh_anh;

        // Kiểm tra dữ liệu danh mục, thương hiệu, chất liệu
        if (store.sanPhamById.danhMuc) {
            formState.id_danh_muc = store.sanPhamById.danhMuc.id_danh_muc;
        }

        if (store.sanPhamById.thuongHieu) {
            formState.id_thuong_hieu = store.sanPhamById.thuongHieu.id_thuong_hieu;
        }

        if (store.sanPhamById.chatLieu) {
            formState.id_chat_lieu = store.sanPhamById.chatLieu.id_chat_lieu;
        }

        formState.trang_thai = store.sanPhamById.trang_thai;

        // Nếu có hình ảnh sản phẩm, cập nhật fileList
        if (store.sanPhamById.hinh_anh) {
            fileList.value = [{
                uid: '-1',
                name: 'product-image.jpg',
                status: 'done',
                url: store.sanPhamById.hinh_anh
            }];
        }

        // Lấy danh sách các biến thể của sản phẩm
        await store.getCTSPBySanPham(store.sanPhamById.id_san_pham);
        console.log('Chi tiết sản phẩm:', store.getCTSPBySanPhams);

        // Xử lý dữ liệu biến thể
        if (store.getCTSPBySanPhams && store.getCTSPBySanPhams.length > 0) {
            // Tạo mảng biến thể trước
            variants.value = store.getCTSPBySanPhams.map(ctsp => {
                console.log('Đang xử lý biến thể:', ctsp);

                // Kiểm tra và log thông tin về màu sắc và kích thước
                const mauSac = mauSacList.value.find(ms => ms.id_mau_sac === ctsp.id_mau_sac);
                const kichThuoc = sizeList.value.find(size => size.id_kich_thuoc === ctsp.id_kich_thuoc);

                console.log('Màu sắc tìm thấy:', mauSac);
                console.log('Kích thước tìm thấy:', kichThuoc);

                // Tạo đối tượng biến thể với fileList rỗng ban đầu
                return {
                    id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
                    id_mau_sac: ctsp.id_mau_sac,
                    id_kich_thuoc: ctsp.id_kich_thuoc,
                    so_luong: ctsp.so_luong || 1,
                    gia_ban: ctsp.gia_ban || 1100,
                    trang_thai: ctsp.trang_thai || 'Hoạt động',
                    fileList: [], // Khởi tạo rỗng, sẽ được cập nhật sau
                    hinh_anh: [], // Khởi tạo rỗng, sẽ được cập nhật sau
                    ngay_tao: ctsp.ngay_tao,
                    ngay_sua: ctsp.ngay_sua,
                    isExisting: true // Đánh dấu đây là biến thể đã tồn tại
                };
            });

            // Lấy hình ảnh cho từng biến thể
            for (let i = 0; i < variants.value.length; i++) {
                const variant = variants.value[i];
                try {
                    console.log('Đang lấy hình ảnh cho biến thể:', variant.id_chi_tiet_san_pham);

                    // Gọi API trực tiếp từ sanPhamService thay vì dùng store
                    const { data } = await axiosInstance.get(
                        'admin/quan_ly_san_pham/HinhAnhSanPham?idCTSP=' + variant.id_chi_tiet_san_pham + '&anhChinh='
                    );

                    console.log('Hình ảnh đã lấy được:', data);

                    if (data && Array.isArray(data)) {
                        // Lưu URL của tất cả hình ảnh vào biến thể
                        variant.hinh_anh = data.map(img => img.hinh_anh);

                        // Tạo fileList cho component a-upload với thông tin anh_chinh đầy đủ
                        variant.fileList = data.map((img, index) => ({
                            uid: `-${index}`,
                            name: `image-${index}.jpg`,
                            status: 'done',
                            url: img.hinh_anh,
                            anh_chinh: img.anh_chinh === true ? "1" : "0", // Chuyển boolean thành string
                            id_hinh_anh: img.id_hinh_anh
                        }));

                        console.log('FileList sau khi xử lý:', variant.fileList);
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy hình ảnh cho biến thể:', error);
                }
            }

            console.log('Variants sau khi xử lý:', variants.value);
        }

        // Set valid để có thể thêm biến thể sau khi đã tải xong dữ liệu
        isProductValidated.value = true;

    } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        message.error('Không thể tải thông tin sản phẩm: ' + error.message);
    }
});

// Khi load dữ liệu có sẵn
const loadProductData = async (productId) => {
    try {
        // Lấy thông tin sản phẩm theo ID
        await store.getProductById(productId);

        // Kiểm tra xem có dữ liệu sản phẩm không
        if (!store.productById || !store.productById.id_san_pham) {
            throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        console.log('Dữ liệu sản phẩm:', store.productById);

        // Lấy dữ liệu danh mục, thương hiệu, chất liệu trước khi cập nhật form
        await store.getDanhMucList();
        await store.getThuongHieuList();
        await store.getChatLieuList();

        // Lấy danh sách màu sắc và size
        await store.getMauSacList();
        await store.getSizeList();

        console.log('Danh mục:', store.danhMucList);
        console.log('Thương hiệu:', store.thuongHieuList);
        console.log('Chất liệu:', store.chatLieuList);
        console.log('Màu sắc:', store.mauSacList);
        console.log('Size:', store.sizeList);

        danhMucList.value = store.danhMucList;
        thuongHieuList.value = store.thuongHieuList;
        chatLieuList.value = store.chatLieuList;
        mauSacList.value = store.mauSacList;
        sizeList.value = store.sizeList;

        // Cập nhật formState với dữ liệu sản phẩm
        Object.assign(formState, {
            ten_san_pham: store.productById.ten_san_pham,
            mo_ta: store.productById.mo_ta,
            gioi_tinh: store.productById.gioi_tinh,
            hinh_anh: store.productById.hinh_anh,
            id_danh_muc: store.productById.id_danh_muc,
            id_thuong_hieu: store.productById.id_thuong_hieu,
            id_chat_lieu: store.productById.id_chat_lieu,
            trang_thai: store.productById.trang_thai
        });

        // Validate form sau khi load dữ liệu
        await validateForm();

        // ... rest of the loading code
    } catch (error) {
        message.error('Có lỗi khi tải thông tin sản phẩm!');
        console.error(error);
    }
};

// Watch changes in formState để debug
watch(() => formState, (newVal) => {
    console.log('FormState changed:', newVal);
}, { deep: true });

// Thêm các hàm validate giống như trong themSanPham
// 1. Validate và xử lý cho giá chung
const handleGiaChungInput = (value) => {
    console.log('Giá chung thay đổi thành:', value);
    // Không gọi validateGiaChung ở đây nữa để tránh nhân đôi cập nhật

    // Cập nhật giá cho tất cả các biến thể nếu dùng giá chung
    if (useCommonPrice.value && validateGiaChung(value)) {
        variants.value.forEach((variant) => {
            variant.gia_ban = value;
        });
    }
}

const validateGiaChung = (value, showMessage = false) => {
    if (value === undefined || value === null || value === '') {
        if (showMessage) message.warning('Giá bán chung không được để trống');
        return false;
    }

    if (value < 1000) {
        if (showMessage) message.warning('Giá bán chung phải lớn hơn 1000!');
        return false;
    }

    if (value > 100000000) {
        if (showMessage) message.warning('Giá bán chung không được vượt quá 100,000,000!');
        return false;
    }

    return true;
}

// 2. Validate và xử lý cho giá bán của biến thể
const handleGiaBanInput = (value, index) => {
    console.log('Giá biến thể thay đổi thành:', value, 'tại index:', index);
    // Không validate lặp
}

const validateGiaBanSafe = (value, index, showMessage = false) => {
    const variant = variants.value[index];
    if (!variant) return false;

    if (value === undefined || value === null || value === '') {
        if (showMessage) message.error('Vui lòng nhập giá bán!');
        return false;
    }

    if (value < 1000) {
        if (showMessage) message.error('Giá bán phải lớn hơn 1000!');
        return false;
    }

    if (value > 100000000) {
        if (showMessage) message.error('Giá bán không được vượt quá 100,000,000!');
        return false;
    }

    return true;
}

const validateGiaBan = (value, index, showMessage = false) => {
    // Nếu đang sử dụng giá chung, không validate riêng
    if (useCommonPrice.value) return true;
    return validateGiaBanSafe(value, index, showMessage);
}

// 3. Validate và xử lý cho số lượng biến thể
const handleSoLuongInput = (value, index) => {
    console.log('Số lượng biến thể thay đổi thành:', value, 'tại index:', index);
    // Không validate lặp
}

const validateSoLuong = (value, index, showMessage = false) => {
    const variant = variants.value[index];
    if (!variant) return false;

    if (value === undefined || value === null || value === '') {
        if (showMessage) message.error('Vui lòng nhập số lượng!');
        return false;
    }

    if (value < 1) {
        if (showMessage) message.error('Số lượng phải lớn hơn 0!');
        return false;
    }

    if (value > 100000) {
        if (showMessage) message.error('Số lượng không được vượt quá 100,000!');
        return false;
    }

    return true;
}

const resetForm = () => {
    Modal.confirm({
        title: 'Xác nhận làm mới',
        content: 'Bạn có chắc muốn làm mới form? Tất cả dữ liệu sẽ bị xóa.',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk: () => {
            // Code reset ở trên
            Object.assign(formState, {
                ten_san_pham: '',
                mo_ta: '',
                gioi_tinh: undefined,
                hinh_anh: '',
                id_danh_muc: undefined,
                id_thuong_hieu: undefined,
                id_chat_lieu: undefined,
                trang_thai: 'Hoạt động',
                gia_nhap_chung: 0,
                gia_ban_chung: 0
            });
            // ... rest of reset code
        }
    });
};

// Thêm các hàm format và parse mới
const formatNumber = (value) => {
    if (value === undefined || value === null || value === '') return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatNumberNoComma = (value) => {
    if (value === undefined || value === null || value === '') return '';
    return `${value}`;
};

const parseNumberInput = (value) => {
    if (value === undefined || value === null || value === '') return '';
    return value.replace(/,/g, '');
};

const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return '';
    }

    // Nếu là số, chuyển thành chuỗi
    const strValue = String(value);

    // Loại bỏ tất cả dấu phẩy
    const cleanValue = strValue.replace(/,/g, '');

    // Kiểm tra xem có phải số hợp lệ không
    if (!/^\d*$/.test(cleanValue)) {
        console.log('Invalid number format:', cleanValue);
        return 0;
    }

    // Chuyển đổi thành số
    const numValue = Number(cleanValue);
    return numValue;
};

// Thêm các hàm format giá khi blur
const formatPriceOnBlur = (event, index) => {
    const variant = variants.value[index];
    if (!variant || !variant.gia_ban) return;

    // Chuyển đổi giá trị hiện tại thành số trước
    const numericValue = convertPriceToNumber(variant.gia_ban);

    // Format và cập nhật giá trị hiển thị
    let formattedValue = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    variant.gia_ban = formattedValue;
};

const formatCommonPriceOnBlur = () => {
    if (!formState.gia_ban_chung) return;

    // Chuyển đổi giá trị hiện tại thành số trước
    const numericValue = convertPriceToNumber(formState.gia_ban_chung);

    // Format và cập nhật giá trị hiển thị
    let formattedValue = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formState.gia_ban_chung = formattedValue;
};

// Renderer cho itemRender trong a-upload
const uploadItemRender = (originNode, file, fileList) => {
    // Kiểm tra file tồn tại trước khi truy cập thuộc tính
    if (!file) {
        return originNode;
    }

    // Trả về render tùy chỉnh cho các file đã upload
    if (file.status === 'uploading') {
        return h('a-spin');
    }

    // Xử lý cho các file đã hoàn tất hoặc lỗi
    if (file.status === 'done' || file.status === 'error') {
        return h('div', {
            class: 'custom-upload-item',
            style: {
                position: 'relative',
                display: 'inline-block',
                width: '100px',
                height: '100px',
                margin: '0 8px 8px 0',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                overflow: 'hidden',
            }
        }, [
            // Hiển thị hình ảnh
            h('img', {
                src: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''),
                style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }
            }),

            // Hiển thị badge "Chính" nếu là ảnh chính
            file.anh_chinh === "1" ? h('div', {
                style: {
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: '#52c41a',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                }
            }, 'Chính') : null,

            // Overlay với các nút thao tác khi hover
            h('div', {
                class: 'custom-upload-actions',
                style: {
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px'
                }
            }, [
                // Nút đặt ảnh chính
                h('a-button', {
                    type: file.anh_chinh === "1" ? "primary" : "default",
                    size: "small",
                    onClick: (e) => {
                        e.stopPropagation();
                        // Tìm biến thể chứa file này
                        const variant = variants.value.find(v =>
                            v.fileList && v.fileList.some(f => f.uid === file.uid)
                        );
                        if (variant) {
                            setMainImage(variant, file);
                        }
                    }
                }, { default: () => file.anh_chinh === "1" ? 'Chính' : 'Đặt chính' }),

                // Nút xóa ảnh
                h('a-button', {
                    type: "text",
                    size: "small",
                    onClick: (e) => {
                        e.stopPropagation();
                        // Tìm biến thể chứa file này
                        const variant = variants.value.find(v =>
                            v.fileList && v.fileList.some(f => f.uid === file.uid)
                        );
                        if (variant) {
                            handleRemoveImage(file, variant);
                        }
                    },
                    style: {
                        color: 'white'
                    }
                }, {
                    default: () => h(DeleteOutlined)
                })
            ])
        ]);
    }

    // Trả về node gốc cho các trường hợp khác
    return originNode;
};

// Xử lý tải lên hình ảnh
const handleUpload = async (options, variant) => {
    try {
        console.log('Đang tải lên ảnh cho biến thể:', variant.id_chi_tiet_san_pham);
        const { file, onSuccess, onError } = options;

        // Tạo URL tạm thời cho file
        const previewUrl = URL.createObjectURL(file);
        console.log('URL tạm thời:', previewUrl);

        // Thêm ảnh mới vào fileList với thông tin đầy đủ
        const newFile = {
            uid: Date.now().toString(),
            name: file.name,
            status: 'uploading',
            originFileObj: file,
            url: previewUrl,
            anh_chinh: variant.fileList.length === 0 ? "1" : "0", // Nếu là ảnh đầu tiên, đặt làm ảnh chính
            id_hinh_anh: null, // Ảnh mới chưa có ID
            isNew: true // Đánh dấu đây là ảnh mới
        };

        // Cập nhật danh sách file
        variant.fileList = [...variant.fileList, newFile];

        // Đảm bảo hinh_anh mảng đã được khởi tạo
        if (!Array.isArray(variant.hinh_anh)) {
            variant.hinh_anh = [];
        }

        // Cập nhật trạng thái sau khi tải lên
        setTimeout(() => {
            const index = variant.fileList.findIndex(item => item.uid === newFile.uid);
            if (index !== -1) {
                variant.fileList[index].status = 'done';
                variant.fileList = [...variant.fileList];
            }
            onSuccess();
        }, 500);
    } catch (error) {
        console.error('Lỗi khi tải lên hình ảnh:', error);
        message.error('Không thể tải lên hình ảnh, vui lòng thử lại sau');
        options.onError();
    }
};

// Xử lý xóa hình ảnh
const handleRemoveImage = (file, variant) => {
    console.log('Xóa hình ảnh:', file);

    if (!variant || !variant.fileList) {
        console.error('Variant hoặc fileList không hợp lệ', variant);
        return true;
    }

    const index = variant.fileList.findIndex(item => item && item.uid === file.uid);
    if (index !== -1) {
        // Nếu xóa ảnh chính, chuyển ảnh đầu tiên còn lại thành ảnh chính
        if (file.anh_chinh === "1" && variant.fileList.length > 1) {
            // Tìm ảnh tiếp theo để đặt làm ảnh chính
            const nextIndex = variant.fileList.findIndex((item, i) => i !== index && item);
            if (nextIndex !== -1) {
                variant.fileList[nextIndex].anh_chinh = "1";
                console.log('Đã đặt ảnh', variant.fileList[nextIndex].name, 'làm ảnh chính mới');
            }
        }

        // Nếu là ảnh đã lưu trong DB, đánh dấu để xóa khi lưu
        if (file.id_hinh_anh) {
            variant.imagesToDelete = variant.imagesToDelete || [];
            variant.imagesToDelete.push(file.id_hinh_anh);
        }

        // Xóa khỏi fileList
        variant.fileList.splice(index, 1);
        variant.fileList = [...variant.fileList];

        message.success('Đã xóa ảnh');
    } else {
        console.warn('Không tìm thấy file cần xóa trong fileList');
    }
    return true;
};
</script>

<style scoped>
.form-bien-the {
    z-index: 1200;
}

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
    flex-wrap: wrap;
    gap: 8px;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 100px !important;
    height: 100px !important;
    margin: 0 !important;
}

:deep(.ant-upload-list-item-image) {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
    width: 100px;
    height: 100px;
    margin: 0;
}

:deep(.custom-upload-item) {
    display: flex !important;
    flex-direction: column;
    position: relative;
}

:deep(.custom-upload-actions) {
    opacity: 0;
    transition: opacity 0.3s;
}

:deep(.custom-upload-item:hover .custom-upload-actions) {
    opacity: 1;
}

.text-muted {
    font-size: 14px;
    color: #999;
}

.ant-empty {
    margin: 32px 0;
}
</style>