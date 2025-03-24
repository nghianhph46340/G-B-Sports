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
                <a-form-item label="Tên sản phẩm" name="ten_san_pham"
                    :rules="[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]">
                    <a-input v-model:value="formState.ten_san_pham" />
                </a-form-item>


                <a-form-item label="Danh mục" name="id_danh_muc"
                    :rules="[{ required: true, message: 'Vui lòng chọn danh mục!' }]">
                    <a-select v-model:value="formState.id_danh_muc" placeholder="Chọn danh mục">
                        <a-select-option v-for="item in danhMucList" :key="item.id_danh_muc" :value="item.id_danh_muc">
                            {{ item.ten_danh_muc }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Thương hiệu" name="id_thuong_hieu"
                    :rules="[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]">
                    <a-select v-model:value="formState.id_thuong_hieu" placeholder="Chọn thương hiệu">
                        <a-select-option v-for="item in thuongHieuList" :key="item.id_thuong_hieu"
                            :value="item.id_thuong_hieu">
                            {{ item.ten_thuong_hieu }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Chất liệu" name="id_chat_lieu"
                    :rules="[{ required: true, message: 'Vui lòng chọn chất liệu!' }]">
                    <a-select v-model:value="formState.id_chat_lieu" placeholder="Chọn chất liệu">
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
                        <h6>Biến thể #{{ index + 1 }}</h6>
                        <a-button type="text" danger @click="removeVariant(index)">
                            <delete-outlined />
                        </a-button>
                    </div>

                    <a-form class="form-bien-the" layout="vertical">
                        <div class="row">
                            <div class="col-md-6">
                                <a-form-item label="Màu sắc"
                                    :rules="[{ required: true, message: 'Vui lòng chọn màu sắc!' }]">
                                    <a-select v-model:value="variant.id_mau_sac" placeholder="Chọn màu sắc">
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
                                    <a-select v-model:value="variant.id_kich_thuoc" placeholder="Chọn size">
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
                                <a-form-item label="Số lượng" :rules="[{ required: true, message: 'Vui lòng nhập số lượng!' },
                                {
                                    validator: (_, value) => {
                                        if (value < 1) {
                                            return Promise.reject('Số lượng phải lớn hơn 0!');
                                        }
                                        return Promise.resolve();
                                    }
                                }]">
                                    <a-input-number v-model:value="variant.so_luong" :min="1" style="width: 100%" />
                                </a-form-item>
                            </div>

                            <div class="col-md-6">
                                <a-form-item label="Giá bán" :rules="[{ required: true, message: 'Vui lòng nhập giá bán!' },
                                {
                                    validator: (_, value) => {
                                        if (!value || value < 1000) {
                                            return Promise.reject('Giá bán phải lớn hơn 1000!');
                                        }
                                        const minGiaBan = variant.gia_nhap * 1.1;
                                        if (value < minGiaBan) {
                                            return Promise.reject(`Giá bán phải lớn hơn giá nhập ít nhất 10% (Tối thiểu: ${minGiaBan.toLocaleString()}đ)`);
                                        }
                                        return Promise.resolve();
                                    }
                                }]">
                                    <a-input-number v-model:value="variant.gia_ban" :min="1000"
                                        :disabled="useCommonPrice"
                                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')" style="width: 100%"
                                        @change="(value) => handleVariantPriceChange(value, variant, 'gia_ban')" @blur="(e) => {
                                            if (!e.target.value || e.target.value < 1000) {
                                                variant.gia_ban = 1000;
                                            }
                                        }" />
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

// Thêm state cho biến thể
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

    variants.value.push({
        id_mau_sac: undefined,
        id_kich_thuoc: undefined,
        so_luong: 1,
        gia_ban: useCommonPrice.value ? formState.gia_ban_chung : 1100,
        trang_thai: 'Hoạt động',
        fileList: [],
        hinh_anh: [],
        ngay_sua: new Date().toISOString(),
        ngay_tao: new Date().toISOString()
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

        // Validate từng biến thể
        for (const variant of variants.value) {
            if (!variant.id_mau_sac || !variant.id_kich_thuoc) {
                throw new Error('Vui lòng điền đầy đủ thông tin cho tất cả biến thể');
            }
            // Validate giá của biến thể
            if (!useCommonPrice.value) {
                if (!variant.gia_ban || variant.gia_ban < 1000) {
                    throw new Error(`Giá bán của biến thể phải lớn hơn 1000!`);
                }
            }
        }

        // Validate giá chung
        if (useCommonPrice.value) {

            if (!formState.gia_ban_chung || formState.gia_ban_chung < 1000) {
                throw new Error('Giá bán phải lớn hơn 1000!');
            }
        }

        console.log('FormState trước khi gửi:', formState);
        const response = await store.createSanPham(formState);
        console.log('Response nhận được:', response);

        // Kiểm tra response
        if (!response || !response.success) {
            throw new Error(response?.message || 'Không nhận được dữ liệu phản hồi hợp lệ từ server');
        }

        // Lấy ID sản phẩm từ data trả về
        const productId = response.data.id_san_pham;
        if (!productId) {
            throw new Error('Không nhận được ID sản phẩm từ server');
        }

        // Tạo các biến thể CTSP
        for (const variant of variants.value) {
            await store.createCTSP({
                ...variant,
                id_san_pham: productId,
                hinh_anh: variant.hinh_anh
            });
        }

        message.success(response.message || 'Thêm sản phẩm và biến thể thành công!');
        router.push('/admin/quanlysanpham');
    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        if (error.response?.data) {
            // Xử lý lỗi từ server
            const errorMessage = error.response.data.message || 'Có lỗi xảy ra khi thêm sản phẩm';
            message.error(errorMessage);
        } else {
            // Xử lý lỗi khác
            message.error(error.message || 'Có lỗi xảy ra khi thêm sản phẩm');
        }
    } finally {
        loading.value = false;
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
        if (newUseCommon) {
            variants.value.forEach(variant => {
                variant.gia_nhap = newGiaNhap;
                variant.gia_ban = newGiaBan;
            });
            // Validate khi giá thay đổi
            await handlePriceChange();
        }
    }
);


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
            variants.value = store.getCTSPBySanPhams.map(ctsp => {
                console.log('Đang xử lý biến thể:', ctsp);

                // Kiểm tra và log thông tin về màu sắc và kích thước
                const mauSac = mauSacList.value.find(ms => ms.id_mau_sac === ctsp.id_mau_sac);
                const kichThuoc = sizeList.value.find(size => size.id_kich_thuoc === ctsp.id_kich_thuoc);

                console.log('Màu sắc tìm thấy:', mauSac);
                console.log('Kích thước tìm thấy:', kichThuoc);

                // Chuyển đổi URL hình ảnh thành định dạng fileList cho a-upload
                let variantFileList = [];

                if (ctsp.hinh_anh) {
                    console.log('Hình ảnh biến thể gốc:', ctsp.hinh_anh);

                    // Nếu hinh_anh là chuỗi, chuyển thành mảng có một phần tử
                    const hinhAnhArray = typeof ctsp.hinh_anh === 'string'
                        ? [ctsp.hinh_anh]
                        : Array.isArray(ctsp.hinh_anh)
                            ? ctsp.hinh_anh
                            : [];

                    console.log('Mảng hình ảnh sau khi xử lý:', hinhAnhArray);

                    variantFileList = hinhAnhArray.map((url, index) => {
                        const fileItem = {
                            uid: `-${index}`,
                            name: `image-${index}.jpg`,
                            status: 'done',
                            url: url
                        };
                        console.log('File item được tạo:', fileItem);
                        return fileItem;
                    });
                }

                console.log('FileList cuối cùng:', variantFileList);

                // Tạo đối tượng biến thể
                return {
                    id_chi_tiet_san_pham: ctsp.id_chi_tiet_san_pham,
                    id_mau_sac: ctsp.id_mau_sac,
                    id_kich_thuoc: ctsp.id_kich_thuoc,
                    so_luong: ctsp.so_luong || 1,
                    gia_ban: ctsp.gia_ban || 1100,
                    trang_thai: ctsp.trang_thai || 'Hoạt động',
                    fileList: variantFileList,
                    hinh_anh: typeof ctsp.hinh_anh === 'string'
                        ? [ctsp.hinh_anh]
                        : Array.isArray(ctsp.hinh_anh)
                            ? ctsp.hinh_anh
                            : [],
                    ngay_tao: ctsp.ngay_tao,
                    ngay_sua: ctsp.ngay_sua
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

// Khi load dữ liệu có sẵn
const loadProductData = async (productId) => {
    try {
        const product = await store.getProductById(productId);

        // Cập nhật formState
        Object.assign(formState, {
            ten_san_pham: product.ten_san_pham,
            mo_ta: product.mo_ta,
            gioi_tinh: product.gioi_tinh,
            hinh_anh: product.hinh_anh,
            id_danh_muc: product.id_danh_muc,
            id_thuong_hieu: product.id_thuong_hieu,
            id_chat_lieu: product.id_chat_lieu,
            trang_thai: product.trang_thai
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

// Thêm hàm xử lý khi giá biến thể thay đổi
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
const handleImageChange = ({ fileList: newFileList }) => {
    fileList.value = newFileList;
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