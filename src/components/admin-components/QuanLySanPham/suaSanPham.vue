<template>
    <div class="row">
        <div class="col-md-6 border-end">
            <h5>Sửa sản phẩm</h5>
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
                        @change="handleImageChange" :before-upload="beforeUpload" :customRequest="handleCustomRequest">
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
                                <a-form-item label="Số lượng" :validate-status="variant.soLuongValidateStatus"
                                    :help="variant.soLuongHelp">
                                    <a-input-number v-model:value="variant.so_luong" class="w-full" :controls="false"
                                        :formatter="formatSoLuong" :parser="parseSoLuong"
                                        placeholder="Nhập số lượng sản phẩm" @blur="validateSoLuong(variant, index)"
                                        @change="validateSoLuong(variant, index)" />
                                </a-form-item>
                            </div>

                            <div class="col-md-6">
                                <a-form-item label="Giá" :validate-status="variant.giaBanValidateStatus"
                                    :help="variant.giaBanHelp">
                                    <a-input-number :readonly="variant.isExisting" v-model:value="variant.gia_ban"
                                        class="w-full" :controls="false" :formatter="formatGiaBan" :parser="parseGiaBan"
                                        placeholder="Nhập giá bán sản phẩm"
                                        :disabled="useCommonPrice || variant.isExisting"
                                        @blur="validateGiaBan(variant, index)"
                                        @change="validateGiaBan(variant, index)" />
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
                                <a-upload v-model:file-list="variant.fileList" list-type="picture-card" :max-count="3"
                                    :multiple="true"
                                    :before-upload="(file) => beforeUpload(file, variant.fileList.length)"
                                    :customRequest="handleCustomRequest"
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
import { ref, reactive, onMounted, watch } from 'vue';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useGbStore } from '@/stores/gbStore';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosConfig';
import { testService } from '@/services/testService';
const store = useGbStore();
const router = useRouter();
const route = useRoute();
// const testServices = testService();
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

// Sửa hàm validateProductName để cho phép các ký tự đặc biệt
const validateProductName = async (_, value) => {
    if (!value) return Promise.reject('Tên sản phẩm không được để trống');

    // Kiểm tra nếu tên sản phẩm chỉ chứa số
    if (/^\d+$/.test(value)) {
        return Promise.reject('Tên sản phẩm không được chỉ chứa số');
    }

    // Sửa regex để cho phép thêm ký tự đặc biệt /, -, _, &, (), 
    if (!/^[a-zA-Z0-9À-ỹ\s\-_\/&()]+$/.test(value)) {
        return Promise.reject('Tên sản phẩm chỉ được chứa chữ cái, số và các ký tự -, _, /, &, (), không được chứa các ký tự đặc biệt khác');
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
        isExisting: false, // Đánh dấu đây là biến thể mới
        // Thêm các trường validate status và help
        soLuongValidateStatus: '',
        soLuongHelp: '',
        giaBanValidateStatus: '',
        giaBanHelp: ''
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

// Chuẩn hóa định dạng ngày tháng
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

// Lấy publicId từ URL Cloudinary
const getPublicIdFromUrl = (url) => {
    try {
        // Mẫu URL: http://res.cloudinary.com/dtwsqkqpc/image/upload/v1745539680/l7g7eeubva8op7zzks8h.webp
        const regex = /\/v\d+\/([^/\.]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Lỗi khi phân tích URL:', error);
        return null;
    }
};

// Chuẩn bị dữ liệu variant trước khi gửi
const prepareVariantForSubmit = (variant) => {
    return {
        id_chi_tiet_san_pham: variant.id_chi_tiet_san_pham || null,
        id_san_pham: Number(variant.id_san_pham),
        id_mau_sac: Number(variant.id_mau_sac),
        id_kich_thuoc: Number(variant.id_kich_thuoc),
        so_luong: Number(variant.so_luong),
        gia_ban: Number(convertPriceToNumber(variant.gia_ban)),
        trang_thai: "Hoạt động", // Gán giá trị chuỗi cố định
        // ngay_tao: variant.isExisting ? formatDate(variant.ngay_tao) : formatDate(new Date()),
        // ngay_sua: formatDate(new Date()),
        hinh_anh: (variant.hinh_anh || []).filter(url => url && url.trim() !== '')
    };
};

// Cập nhật hàm xử lý tải lên và xóa ảnh
const handleVariantImageChange = async (info, variantIndex) => {
    console.log('handleVariantImageChange được gọi với:', info);
    const variant = variants.value[variantIndex];

    // Xử lý khi có file được xóa
    if (info.file.status === 'removed') {
        const removedFile = info.file;
        console.log('File bị xóa:', removedFile);

        // Nếu file có URL (đã được tải lên cloud trước đó)
        if (removedFile.url) {
            try {
                // Lấy public_id từ URL
                const publicId = getPublicIdFromUrl(removedFile.url);

                if (publicId) {
                    console.log('Public ID cần xóa:', publicId);
                    // Gọi API xóa ảnh
                    await testService.deleteImage(publicId);
                    message.success(`Đã xóa ảnh khỏi cloud storage`);
                } else if (removedFile.id_hinh_anh) {
                    console.log('Xóa hình ảnh theo ID:', removedFile.id_hinh_anh);
                } else {
                    console.error('Không thể trích xuất public_id từ URL:', removedFile.url);
                }

                // Cập nhật mảng hinh_anh của biến thể
                variant.hinh_anh = variant.hinh_anh.filter(url => url !== removedFile.url);
                console.log('Danh sách hình ảnh sau khi xóa:', variant.hinh_anh);
            } catch (error) {
                console.error('Lỗi khi xóa ảnh:', error);
                message.error('Không thể xóa ảnh: ' + (error.response?.data || error.message));
            }
        }
    }

    // Xử lý khi có file mới được chọn (có originFileObj) - tải lên ngay lập tức
    if (info.file.originFileObj && !info.file.url && info.file.status !== 'removed') {
        console.log('Phát hiện file mới, bắt đầu tải lên cloud:', info.file.name);

        // Đánh dấu file đang tải lên
        info.file.status = 'uploading';

        try {
            // Gọi API tải ảnh lên cloud
            const response = await testService.uploadImage(info.file.originFileObj);
            console.log('Phản hồi từ Cloudinary:', response);

            // Xử lý response để lấy URL
            let imageUrl = null;
            if (typeof response === 'string') {
                imageUrl = response;
            } else if (response && response.data) {
                imageUrl = response.data;
            }

            if (imageUrl) {
                // Cập nhật thông tin file
                info.file.status = 'done';
                info.file.url = imageUrl;

                // Chỉ thêm URL vào danh sách hình ảnh nếu chưa tồn tại
                if (!variant.hinh_anh) {
                    variant.hinh_anh = [];
                }
                if (!variant.hinh_anh.includes(imageUrl)) {
                    variant.hinh_anh.push(imageUrl);
                }

                message.success(`${info.file.name} đã được tải lên thành công`);
                console.log('Danh sách hình ảnh sau khi tải lên:', variant.hinh_anh);
            } else {
                info.file.status = 'error';
                message.error(`${info.file.name} tải lên thất bại: không nhận được URL`);
            }
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên cloud:', error);
            info.file.status = 'error';
            message.error(`${info.file.name} tải lên thất bại: ${error.message}`);
        }
    }

    // Cập nhật fileList và đảm bảo không quá 3 ảnh
    variant.fileList = info.fileList.slice(0, 3);

    // Đồng bộ hoá giữa fileList và hinh_anh để đảm bảo chúng khớp nhau
    // Cập nhật hinh_anh dựa trên fileList có URL
    variant.hinh_anh = variant.fileList
        .filter(file => file.url) // Chỉ lấy file có URL
        .map(file => file.url);   // Lấy URL từ mỗi file

    console.log('Danh sách fileList sau khi cập nhật:', variant.fileList);
    console.log('Danh sách hinh_anh sau khi đồng bộ:', variant.hinh_anh);
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

        // Lấy tất cả biến thể (cả mới và đã tồn tại)
        const allVariants = [...variants.value];

        // Validate từng biến thể
        for (const [index, variant] of allVariants.entries()) {
            // Kiểm tra thông tin cơ bản
            if (!variant.id_mau_sac || !variant.id_kich_thuoc) {
                throw new Error('Vui lòng điền đầy đủ thông tin màu sắc và kích thước cho tất cả biến thể');
            }

            // Validate số lượng
            const soLuong = Number(variant.so_luong);
            if (isNaN(soLuong) || soLuong <= 0) {
                throw new Error(`Biến thể #${index + 1}: Số lượng phải là số dương lớn hơn 0`);
            }
            if (soLuong > 100000) {
                throw new Error(`Biến thể #${index + 1}: Số lượng không được vượt quá 100.000`);
            }

            // Validate giá bán
            const giaBan = convertPriceToNumber(variant.gia_ban);
            if (isNaN(giaBan) || giaBan < 1000) {
                throw new Error(`Biến thể #${index + 1}: Giá bán phải lớn hơn 1.000`);
            }
            if (giaBan > 100000000) {
                throw new Error(`Biến thể #${index + 1}: Giá bán không được vượt quá 100.000.000`);
            }

            // Chuyển đổi số lượng thành số
            variant.so_luong = soLuong;

            // Chuyển đổi giá bán từ chuỗi có dấu phẩy sang số
            variant.gia_ban = giaBan;

            // Kiểm tra danh sách hình ảnh
            if (!variant.hinh_anh || variant.hinh_anh.length === 0) {
                throw new Error(`Biến thể #${index + 1} phải có ít nhất một hình ảnh`);
            }
        }

        // Cập nhật sản phẩm
        formState.id_san_pham = route.params.id;

        // Chuẩn bị toàn bộ danh sách CTSP sẽ gửi đi
        const preparedVariants = allVariants.map(variant => {
            // Đảm bảo variant có id_san_pham
            variant.id_san_pham = formState.id_san_pham;
            return prepareVariantForSubmit(variant);
        });

        // In ra danh sách CTSP đã chuẩn bị
        console.log('Danh sách chi tiết sản phẩm sẽ gửi đi:', JSON.stringify(preparedVariants, null, 2));

        // Cập nhật sản phẩm chính
        console.log('Đang gửi thông tin sản phẩm:', formState);
        const response = await store.createSanPham(formState);
        console.log('Response từ API sản phẩm:', response);

        if (!response) {
            throw new Error('Không nhận được phản hồi hợp lệ từ server khi lưu sản phẩm');
        }

        // Duyệt từng biến thể để lưu
        console.log('Tổng số biến thể cần lưu:', allVariants.length);

        for (let i = 0; i < allVariants.length; i++) {
            const variant = allVariants[i];
            console.log(`Đang xử lý biến thể ${i + 1}/${allVariants.length}:`, variant);

            // Đảm bảo variant có id_san_pham
            variant.id_san_pham = formState.id_san_pham;

            // Chuẩn bị dữ liệu biến thể
            const variantData = prepareVariantForSubmit(variant);
            console.log(`Chi tiết biến thể ${i + 1} sẽ gửi:`, JSON.stringify(variantData, null, 2));

            // Gọi API lưu chi tiết sản phẩm
            try {
                const ctspResponse = await store.createCTSP(variantData);
                console.log(`Lưu biến thể ${i + 1} thành công:`, ctspResponse);
            } catch (error) {
                console.error(`Lỗi khi lưu biến thể ${i + 1}:`, error);
                throw error;
            }
        }

        // Thông báo thành công và chuyển hướng
        message.success('Cập nhật sản phẩm và biến thể thành công!');
        //  await store.getAllSanPhamNgaySua();
        //todo: cập nhật lại dữ liệu mới nhất
        await store.getAllSanPhamNgaySua();
        // Đánh dấu vừa thêm sản phẩm mới
        store.changeAction(true);
        localStorage.setItem('justAddedProduct', 'true');
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
        await store.getAllSanPhamNgaySua();
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

// Hàm xử lý upload ảnh cho sản phẩm chính
const handleImageChange = async (info) => {
    console.log('handleImageChange được gọi với:', info);

    // Xử lý khi ảnh bị xóa (status = 'removed')
    if (info.file.status === 'removed') {
        console.log('Ảnh sản phẩm bị xóa:', info.file);

        // Cập nhật fileList
        fileList.value = [];

        // Nếu ảnh đã được upload lên cloud (có url)
        if (info.file.url) {
            try {
                // Lấy public_id từ URL
                const publicId = getPublicIdFromUrl(info.file.url);

                if (publicId) {
                    console.log('Public ID cần xóa:', publicId);
                    // Gọi API xóa ảnh
                    await testService.deleteImage(publicId);

                    // Xóa URL ảnh khỏi formState
                    formState.hinh_anh = '';

                    message.success('Đã xóa ảnh sản phẩm thành công');
                } else {
                    console.error('Không thể trích xuất public_id từ URL:', info.file.url);
                }
            } catch (error) {
                console.error('Lỗi khi xóa ảnh sản phẩm:', error);
                message.error('Không thể xóa ảnh: ' + (error.response?.data || error.message));
            }
        }
    }

    // Xử lý khi có file mới được chọn (có originFileObj)
    if (info.file.originFileObj && info.file.status !== 'removed') {
        console.log('Phát hiện file mới cho sản phẩm, bắt đầu tải lên cloud:', info.file.name);

        // Đánh dấu file đang tải lên
        const currentFile = { ...info.file, status: 'uploading' };
        fileList.value = [currentFile];

        try {
            // Gọi API tải ảnh lên cloud
            const response = await testService.uploadImage(info.file.originFileObj);
            console.log('Phản hồi từ Cloudinary cho ảnh sản phẩm:', response);

            // Xử lý response để lấy URL
            let imageUrl = null;
            if (typeof response === 'string') {
                imageUrl = response;
            } else if (response && response.data) {
                imageUrl = response.data;
            }

            if (imageUrl) {
                // Cập nhật trạng thái thành công
                const updatedFile = {
                    ...info.file,
                    status: 'done',
                    url: imageUrl,
                    response: response,
                    name: info.file.name || 'product-image.jpg',
                    uid: info.file.uid || '-1'
                };

                // Cập nhật fileList với file đã hoàn thành
                fileList.value = [updatedFile];

                // Cập nhật URL vào formState
                formState.hinh_anh = imageUrl;

                message.success(`${info.file.name} đã được tải lên thành công`);
                console.log('URL ảnh sản phẩm sau khi tải lên:', formState.hinh_anh);
            } else {
                // Cập nhật trạng thái lỗi
                const errorFile = { ...info.file, status: 'error' };
                fileList.value = [errorFile];
                message.error(`${info.file.name} tải lên thất bại: không nhận được URL`);
            }
        } catch (error) {
            console.error('Lỗi khi tải ảnh sản phẩm lên cloud:', error);
            // Cập nhật trạng thái lỗi
            const errorFile = { ...info.file, status: 'error' };
            fileList.value = [errorFile];
            message.error(`${info.file.name} tải lên thất bại: ${error.message}`);
        }
    } else {
        // Đảm bảo giới hạn chỉ 1 ảnh và cập nhật fileList
        fileList.value = info.fileList.slice(0, 1);
    }
};

// Preview ảnh
const handleCustomRequest = (options) => {
    if (options && typeof options.onSuccess === 'function') {
        setTimeout(() => {
            options.onSuccess('ok');
        }, 0);
    }
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

        danhMucList.value = store.danhMucList;
        thuongHieuList.value = store.thuongHieuList;
        chatLieuList.value = store.chatLieuList;
        mauSacList.value = store.mauSacList;
        sizeList.value = store.sizeList;

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
            variants.value = store.getCTSPBySanPhams.map(ctsp => {
                // Tạo fileList từ hinh_anh_list
                let variantFileList = [];

                // Sử dụng hinh_anh_list từ API
                if (ctsp.hinh_anh_list && Array.isArray(ctsp.hinh_anh_list) && ctsp.hinh_anh_list.length > 0) {
                    console.log('Sử dụng hinh_anh_list:', ctsp.hinh_anh_list);

                    variantFileList = ctsp.hinh_anh_list.map((img, index) => {
                        // Kiểm tra xem img.hinh_anh có phải là object hay không
                        let imageUrl = img.hinh_anh;
                        if (typeof imageUrl === 'object' && imageUrl !== null) {
                            console.log('Phát hiện hình ảnh là object:', imageUrl);
                            if (imageUrl.url) {
                                imageUrl = imageUrl.url;
                            } else if (imageUrl.toString) {
                                imageUrl = imageUrl.toString();
                            } else {
                                console.error('Không thể chuyển đổi hình ảnh:', imageUrl);
                                imageUrl = '';
                            }
                        }

                        return {
                            uid: `-${index}`,
                            name: `image-${index}.jpg`,
                            status: 'done',
                            url: imageUrl,
                            anh_chinh: img.anh_chinh === true || img.anh_chinh === "1" || img.anh_chinh === 1 ? "1" : "0",
                            id_hinh_anh: img.id_hinh_anh
                        };
                    });

                    console.log('FileList sau khi xử lý:', variantFileList);
                }

                // Tạo đối tượng biến thể
                return {
                    id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
                    id_mau_sac: ctsp.id_mau_sac,
                    id_kich_thuoc: ctsp.id_kich_thuoc,
                    so_luong: ctsp.so_luong || 1,
                    gia_ban: ctsp.gia_ban || 1100,
                    trang_thai: ctsp.trang_thai || 'Hoạt động',
                    fileList: variantFileList,
                    hinh_anh: variantFileList.map(file => file.url),
                    ngay_tao: ctsp.ngay_tao,
                    ngay_sua: ctsp.ngay_sua,
                    isExisting: true // Đánh dấu đây là biến thể đã tồn tại
                };
            });

            console.log('Variants sau khi xử lý:', variants.value);

            // Đánh dấu form đã được validate để có thể chỉnh sửa biến thể
            isProductValidated.value = true;

            // Đảm bảo validate form sau khi tải dữ liệu
            await validateForm();
        }
    } catch (error) {
        message.error('Có lỗi khi tải dữ liệu: ' + error.message);
        console.error('Chi tiết lỗi:', error);
    }
});

// Watch changes in formState để debug
watch(() => formState, (newVal) => {
    console.log('FormState changed:', newVal);
}, { deep: true });

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

const setMainImage = (file, variantIndex) => {
    const currentVariant = variants.value[variantIndex];
    const fileList = currentVariant.fileList;

    // Lặp qua fileList để cập nhật trạng thái anh_chinh
    fileList.forEach(item => {
        // Reset tất cả ảnh về trạng thái không phải ảnh chính
        item.anh_chinh = false;

        // Nếu item này chính là file được chọn làm ảnh chính
        if (item.uid === file.uid) {
            item.anh_chinh = true;
            console.log('Đã đặt file này làm ảnh chính:', item);
        }
    });

    // Cập nhật lại fileList cho biến thể
    currentVariant.fileList = [...fileList];

    // Nếu file có id_hinh_anh, cập nhật trạng thái anh_chinh thông qua API
    if (file.id_hinh_anh) {
        try {
            // TODO: Thêm API để cập nhật trạng thái ảnh chính dựa trên id_hinh_anh
            console.log('Cập nhật ảnh chính với ID:', file.id_hinh_anh);
            // Ví dụ: await axiosInstance.put(`hinh-anh/${file.id_hinh_anh}/set-main`);
        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh chính:', error);
            message.error('Không thể cập nhật ảnh chính: ' + (error.response?.data || error.message));
        }
    }
};

// Thêm các hàm format và parse cho số lượng và giá
const invalidInputs = ref({
    soLuong: {},
    giaBan: {}
});

const formatSoLuong = (value) => {
    if (value === null || value === undefined || value === '') return '';

    // Kiểm tra có ký tự không hợp lệ
    const originalStr = String(value);
    const hasInvalidChars = /[^\d]/.test(originalStr);

    // Nếu có ký tự không hợp lệ, đánh dấu để hiển thị thông báo
    if (hasInvalidChars) {
        // Tìm variant index hiện tại đang được chỉnh sửa
        const variantIndex = variants.value.findIndex(v => v.so_luong === value || String(v.so_luong) === originalStr);
        if (variantIndex !== -1) {
            invalidInputs.value.soLuong[variantIndex] = true;
            // Gọi validate ngay lập tức
            setTimeout(() => {
                validateSoLuong(variants.value[variantIndex], variantIndex);
            }, 0);
        }
    }

    // Vẫn loại bỏ các ký tự không hợp lệ khi hiển thị
    return originalStr.replace(/[^\d]/g, '');
};

const parseSoLuong = (value) => {
    if (value === null || value === undefined || value === '') return '';
    // Loại bỏ tất cả ký tự không phải số
    return value.replace(/[^\d]/g, '');
};

const formatGiaBan = (value) => {
    if (value === null || value === undefined || value === '') return '';

    // Kiểm tra có ký tự không hợp lệ (chấp nhận số và dấu phẩy)
    const originalStr = String(value);
    const hasInvalidChars = /[^\d,]/.test(originalStr);

    if (hasInvalidChars) {
        // Tìm variant index hiện tại đang được chỉnh sửa
        const variantIndex = variants.value.findIndex(v => v.gia_ban === value || String(v.gia_ban) === originalStr);
        if (variantIndex !== -1) {
            invalidInputs.value.giaBan[variantIndex] = true;
            // Gọi validate ngay lập tức
            setTimeout(() => {
                validateGiaBan(variants.value[variantIndex], variantIndex);
            }, 0);
        }
    }

    // Loại bỏ ký tự không hợp lệ và định dạng phần nghìn
    const numStr = originalStr.replace(/[^\d]/g, '');
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseGiaBan = (value) => {
    if (value === null || value === undefined || value === '') return '';
    // Loại bỏ tất cả ký tự không phải số
    return value.replace(/[^\d]/g, '');
};

// Thêm hàm validate số lượng với đầy đủ điều kiện
const validateSoLuong = (variant, index) => {
    // Reset trạng thái validate
    variant.soLuongValidateStatus = '';
    variant.soLuongHelp = '';

    // Kiểm tra trống
    if (variant.so_luong === undefined || variant.so_luong === null || variant.so_luong === '') {
        variant.soLuongValidateStatus = 'error';
        variant.soLuongHelp = 'Vui lòng nhập số lượng!';
        return false;
    }

    // Hiển thị thông báo nếu đã phát hiện ký tự không hợp lệ
    if (invalidInputs.value.soLuong[index]) {
        variant.soLuongValidateStatus = 'error';
        variant.soLuongHelp = 'Số lượng chỉ được nhập số nguyên dương!';

        // Giữ thông báo lỗi hiển thị trong 3 giây
        setTimeout(() => {
            if (variant.soLuongHelp === 'Số lượng chỉ được nhập số nguyên dương!') {
                invalidInputs.value.soLuong[index] = false;
                // Kiểm tra lại sau khi xóa cờ lỗi
                validateSoLuong(variant, index);
            }
        }, 3000);

        return false;
    }

    // Các kiểm tra khác vẫn giữ nguyên...
    const numValue = Number(variant.so_luong);

    if (numValue <= 0) {
        variant.soLuongValidateStatus = 'error';
        variant.soLuongHelp = 'Số lượng phải lớn hơn 0!';
        return false;
    }

    if (numValue > 100000) {
        variant.soLuongValidateStatus = 'error';
        variant.soLuongHelp = 'Số lượng không được vượt quá 100.000!';
        return false;
    }

    variant.soLuongValidateStatus = 'success';
    return true;
};

// Thêm hàm validate giá bán với đầy đủ điều kiện
const validateGiaBan = (variant, index) => {
    // Reset trạng thái validate
    variant.giaBanValidateStatus = '';
    variant.giaBanHelp = '';

    // Kiểm tra trống
    if (variant.gia_ban === undefined || variant.gia_ban === null || variant.gia_ban === '') {
        variant.giaBanValidateStatus = 'error';
        variant.giaBanHelp = 'Vui lòng nhập giá bán!';
        return false;
    }

    // Hiển thị thông báo nếu đã phát hiện ký tự không hợp lệ
    if (invalidInputs.value.giaBan[index]) {
        variant.giaBanValidateStatus = 'error';
        variant.giaBanHelp = 'Giá bán chỉ được nhập số!';

        // Giữ thông báo lỗi hiển thị trong 3 giây
        setTimeout(() => {
            if (variant.giaBanHelp === 'Giá bán chỉ được nhập số!') {
                invalidInputs.value.giaBan[index] = false;
                // Kiểm tra lại sau khi xóa cờ lỗi
                validateGiaBan(variant, index);
            }
        }, 3000);

        return false;
    }

    // Các kiểm tra khác...
    const numValue = convertPriceToNumber(variant.gia_ban);

    if (numValue <= 0) {
        variant.giaBanValidateStatus = 'error';
        variant.giaBanHelp = 'Giá bán phải lớn hơn 0!';
        return false;
    }

    if (numValue < 1000) {
        variant.giaBanValidateStatus = 'error';
        variant.giaBanHelp = 'Giá bán phải lớn hơn 1.000!';
        return false;
    }

    if (numValue > 100000000) {
        variant.giaBanValidateStatus = 'error';
        variant.giaBanHelp = 'Giá bán không được vượt quá 100.000.000!';
        return false;
    }

    variant.giaBanValidateStatus = 'success';
    return true;
};

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

.text-muted {
    font-size: 14px;
    color: #999;
}

.ant-empty {
    margin: 32px 0;
}
</style>