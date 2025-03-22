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
                <!-- <a-form-item label="Giới tính" name="gioi_tinh"
                    :rules="[{ required: true, message: 'Vui lòng chọn giới tính!' }]">
                    <a-radio-group v-model:value="formState.gioi_tinh">
                        <a-radio :value="true">Nam</a-radio>
                        <a-radio :value="false">Nữ</a-radio>
                    </a-radio-group>
                </a-form-item> -->
                <a-form-item label="Giá chung" name="gia_chung">
                    <div class="d-flex align-items-center gap-2">
                        <a-switch v-model:checked="useCommonPrice" :checked-children="'Dùng giá chung'"
                            :un-checked-children="'Giá riêng'" @change="handlePriceChange" />
                        <div v-if="useCommonPrice" class="d-flex gap-2 w-100">
                            <!-- <a-input-number v-model:value="formState.gia_nhap_chung" :min="0"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" style="width: 100%"
                                placeholder="Giá nhập chung" @change="handlePriceChange" /> -->
                            <a-input-number v-model:value="formState.gia_ban_chung" :min="1000" :max="1000000000"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')" style="width: 100%"
                                placeholder="Giá bán chung" @change="handlePriceChange" />
                        </div>
                    </div>
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
                        :before-upload="beforeUpload">
                        <div v-if="fileList.length < 1">
                            <plus-outlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>

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
                <a-button v-if="isProductValidated" type="primary" @click="addVariantType"
                    class="d-flex align-items-center">
                    <plus-outlined />Thêm dạng biến thể
                </a-button>
                <span v-else class="text-muted">
                    Vui lòng xác nhận thông tin sản phẩm trước khi thêm biến thể
                </span>
            </div>

            <template v-if="isProductValidated">
                <div v-for="(variantType, typeIndex) in variantTypes" :key="typeIndex"
                    class="variant-type-item mb-4 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6>Dạng biến thể #{{ typeIndex + 1 }}</h6>
                        <a-button type="text" danger @click="removeVariantType(typeIndex)">
                            <delete-outlined />
                        </a-button>
                    </div>

                    <a-form class="form-bien-the" layout="vertical">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <a-form-item label="Màu sắc"
                                    :rules="[{ required: true, message: 'Vui lòng chọn màu sắc!' }]">
                                    <a-select v-model:value="variantType.id_mau_sac" placeholder="Chọn màu sắc"
                                        @change="() => updateAvailableSizes(typeIndex)">
                                        <a-select-option v-for="color in availableColors" :key="color.id_mau_sac"
                                            :value="color.id_mau_sac">
                                            {{ color.ma_mau_sac + ' ' + color.ten_mau_sac }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div class="col-md-6">
                                <a-form-item label="Kích thước"
                                    :rules="[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước!' }]">
                                    <a-select v-model:value="variantType.selectedSizes" mode="multiple"
                                        placeholder="Chọn kích thước"
                                        @change="(values) => handleSizeChange(values, typeIndex)">
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
                                    <a-input-number v-model:value="variantType.so_luong" :min="1" style="width: 100%"
                                        @change="() => updateVariantsFromType(typeIndex)" />
                                </a-form-item>
                            </div>
                            <!-- <div class="col-md-4">
                                <a-form-item label="Giá nhập" :rules="[
                                    { required: true, message: 'Vui lòng nhập giá nhập!' },
                                    {
                                        validator: (_, value) => {
                                            if (!value || value < 1000) {
                                                return Promise.reject('Giá nhập phải lớn hơn 1000!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]">
                                    <a-input-number v-model:value="variantType.gia_nhap" :min="1000"
                                        :disabled="useCommonPrice" style="width: 100%"
                                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        @change="() => updateVariantsFromType(typeIndex)" />
                                </a-form-item>
                            </div> -->
                            <div class="col-md-6">
                                <a-form-item label="Giá bán" :rules="[
                                    { required: true, message: 'Vui lòng nhập giá bán!' },
                                    {
                                        validator: (_, value) => {
                                            if (!value || value < 1000) {
                                                return Promise.reject('Giá bán phải lớn hơn 1000!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]">
                                    <a-input-number v-model:value="variantType.gia_ban" :min="1000"
                                        :disabled="useCommonPrice" style="width: 100%"
                                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        @change="() => updateVariantsFromType(typeIndex)" />
                                </a-form-item>
                            </div>
                        </div>

                        <a-form-item label="Hình ảnh biến thể"
                            :rules="[{ required: true, message: 'Vui lòng chọn ít nhất 1 hình ảnh!' }]">
                            <div class="d-flex align-items-center gap-2">
                                <a-upload v-model:file-list="variantType.fileList" list-type="picture-card"
                                    :max-count="3" :multiple="true"
                                    :before-upload="(file) => beforeUpload(file, variantType.fileList.length)"
                                    @change="(info) => handleVariantTypeImageChange(info, typeIndex)">
                                    <div v-if="variantType.fileList.length < 3">
                                        <plus-outlined />
                                        <div style="margin-top: 8px">Upload</div>
                                    </div>
                                </a-upload>
                            </div>
                        </a-form-item>
                    </a-form>

                    <!-- Hiển thị danh sách biến thể đã tạo từ dạng biến thể này -->
                    <div v-if="variantType.selectedSizes && variantType.selectedSizes.length > 0" class="mt-3">
                        <h6 class="mb-2">Biến thể đã tạo:</h6>
                        <a-table :dataSource="getVariantsFromType(typeIndex)" :columns="variantColumns" size="small"
                            :pagination="false" :rowKey="record => record.id_mau_sac + '-' + record.id_kich_thuoc">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'action'">
                                    <a-button type="text" danger
                                        @click="removeVariantByKeys(record.id_mau_sac, record.id_kich_thuoc)">
                                        <delete-outlined />
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                    </div>
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

const store = useGbStore();
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
const useCommonPrice = ref(false);
const formState = reactive({
    ma_san_pham: '',
    ten_san_pham: '',
    mo_ta: '',
    // gioi_tinh: undefined,
    hinh_anh: '',
    id_danh_muc: undefined,
    id_thuong_hieu: undefined,
    id_chat_lieu: undefined,
    trang_thai: 'Hoạt động',
    gia_nhap_chung: 0,
    gia_ban_chung: 0,
    ngay_tao: new Date().toISOString(),
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

// Thêm state cho dạng biến thể
const variantTypes = ref([]);
const availableColors = ref([]);
const variantColumns = ref([
    {
        title: 'Màu sắc',
        dataIndex: 'mau_sac_name',
        key: 'mau_sac_name',
    },
    {
        title: 'Kích thước',
        dataIndex: 'kich_thuoc_name',
        key: 'kich_thuoc_name',
    },
    {
        title: 'Số lượng',
        dataIndex: 'so_luong',
        key: 'so_luong',
    },
    // {
    //     title: 'Giá nhập',
    //     dataIndex: 'gia_nhap',
    //     key: 'gia_nhap',
    //     customRender: ({ text }) => {
    //         return text.toLocaleString('vi-VN') + ' đ';
    //     }
    // },
    {
        title: 'Giá bán',
        dataIndex: 'gia_ban',
        key: 'gia_ban',
        customRender: ({ text }) => {
            return text.toLocaleString('vi-VN') + ' đ';
        }
    },
    {
        title: 'Thao tác',
        key: 'action',
    }
]);

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
    // gia_nhap_chung: [
    //     {
    //         validator: (_, value) => {
    //             if (useCommonPrice.value && (!value || value < 1000)) {
    //                 return Promise.reject('Giá nhập phải lớn hơn 1000!');
    //             }
    //             return Promise.resolve();
    //         }
    //     }
    // ],
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
                    // if (!formState.gia_nhap_chung || formState.gia_nhap_chung < 1000) {
                    //     return Promise.reject('Giá nhập phải lớn hơn 1000!');
                    // }
                    if (!formState.gia_ban_chung || formState.gia_ban_chung < 1000) {
                        return Promise.reject('Giá bán phải lớn hơn 1000!');
                    }
                    // if (!formState.gia_nhap_chung || formState.gia_nhap_chung > 999999999) {
                    //     return Promise.reject('Giá nhập phải nhỏ hơn 999.999.999')
                    // }
                    if (!formState.gia_ban_chung || formState.gia_ban_chung > 999999999) {
                        return Promise.reject('Giá bán phải nhỏ hơn 999.999.999')
                    }
                    // Kiểm tra giá nhập phải nhỏ hơn giá bán ít nhất 10%
                    // const minGiaBan = formState.gia_nhap_chung * 1.1; // Giá bán tối thiểu = giá nhập + 10%
                    // if (formState.gia_ban_chung < minGiaBan) {
                    //     return Promise.reject(`Giá bán phải lớn hơn giá nhập ít nhất 10% (Tối thiểu: ${minGiaBan.toLocaleString()}đ)`);
                    // }
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

// Thêm dạng biến thể mới (theo màu sắc)
const addVariantType = () => {
    variantTypes.value.push({
        id_mau_sac: undefined,
        selectedSizes: [],
        so_luong: useCommonPrice.value ? 1 : 0,
        // gia_nhap: useCommonPrice.value ? formState.gia_nhap_chung : 0,
        gia_ban: useCommonPrice.value ? formState.gia_ban_chung : 0,
        fileList: [],
        hinh_anh: []
    });
    updateAvailableColors();
};

// Xóa dạng biến thể
const removeVariantType = (index) => {
    // Xóa các biến thể con liên quan đến dạng biến thể này
    const typeToRemove = variantTypes.value[index];
    if (typeToRemove.id_mau_sac) {
        variants.value = variants.value.filter(v => v.id_mau_sac !== typeToRemove.id_mau_sac);
    }

    // Xóa dạng biến thể
    variantTypes.value.splice(index, 1);

    // Cập nhật lại danh sách màu có sẵn
    updateAvailableColors();
};

// Cập nhật danh sách màu có sẵn (loại bỏ các màu đã được chọn)
const updateAvailableColors = () => {
    if (!mauSacList.value) return;

    const usedColorIds = variantTypes.value
        .filter(vt => vt.id_mau_sac)
        .map(vt => vt.id_mau_sac);

    availableColors.value = mauSacList.value.filter(color => !usedColorIds.includes(color.id_mau_sac));
};

//uploadẢnh
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

// Thêm hàm handleCancel để đóng modal preview
const handleCancel = () => {
    previewVisible.value = false;
};

// Cập nhật kích thước có sẵn khi thay đổi màu sắc
const updateAvailableSizes = (typeIndex) => {
    // Xóa các biến thể cũ của dạng biến thể này
    const currentType = variantTypes.value[typeIndex];
    if (currentType.id_mau_sac) {
        variants.value = variants.value.filter(v => v.id_mau_sac !== currentType.id_mau_sac);
    }

    // Reset danh sách kích thước đã chọn
    currentType.selectedSizes = [];

    // Cập nhật lại biến thể từ dạng biến thể
    updateVariantsFromType(typeIndex);
};

// Xử lý khi thay đổi kích thước
const handleSizeChange = (selectedSizes, typeIndex) => {
    variantTypes.value[typeIndex].selectedSizes = selectedSizes;
    updateVariantsFromType(typeIndex);
};

// Cập nhật danh sách biến thể từ dạng biến thể
const updateVariantsFromType = (typeIndex) => {
    const type = variantTypes.value[typeIndex];

    // Xóa các biến thể cũ của dạng biến thể này
    variants.value = variants.value.filter(v => v.id_mau_sac !== type.id_mau_sac);

    // Nếu chưa chọn màu hoặc chưa chọn kích thước nào thì không tạo biến thể
    if (!type.id_mau_sac || !type.selectedSizes || type.selectedSizes.length === 0) {
        return;
    }

    // Tìm thông tin màu sắc
    const colorInfo = mauSacList.value.find(c => c.id_mau_sac === type.id_mau_sac);
    if (!colorInfo) return;

    // Tạo biến thể mới cho mỗi kích thước đã chọn
    type.selectedSizes.forEach(sizeId => {
        const sizeInfo = sizeList.value.find(s => s.id_kich_thuoc === sizeId);
        if (!sizeInfo) return;

        variants.value.push({
            id_mau_sac: type.id_mau_sac,
            id_kich_thuoc: sizeId,
            mau_sac_name: colorInfo.ma_mau_sac + ' ' + colorInfo.ten_mau_sac,
            kich_thuoc_name: sizeInfo.gia_tri,
            so_luong: type.so_luong,
            // gia_nhap: type.gia_nhap,
            gia_ban: type.gia_ban,
            fileList: [...type.fileList],
            hinh_anh: [...type.hinh_anh]
        });
    });
};

// Lấy danh sách biến thể từ một dạng biến thể
const getVariantsFromType = (typeIndex) => {
    const type = variantTypes.value[typeIndex];
    if (!type.id_mau_sac) return [];

    return variants.value.filter(v => v.id_mau_sac === type.id_mau_sac);
};

// Xóa một biến thể cụ thể bằng id màu sắc và id kích thước
const removeVariantByKeys = (colorId, sizeId) => {
    // Tìm index của biến thể cần xóa
    const index = variants.value.findIndex(
        v => v.id_mau_sac === colorId && v.id_kich_thuoc === sizeId
    );

    if (index !== -1) {
        // Xóa biến thể
        variants.value.splice(index, 1);

        // Cập nhật lại danh sách kích thước đã chọn trong dạng biến thể
        const typeIndex = variantTypes.value.findIndex(vt => vt.id_mau_sac === colorId);
        if (typeIndex !== -1) {
            variantTypes.value[typeIndex].selectedSizes = variantTypes.value[typeIndex].selectedSizes.filter(
                id => id !== sizeId
            );
        }
    }
};

// Xử lý khi upload hình ảnh cho dạng biến thể
const handleVariantTypeImageChange = async (info, typeIndex) => {
    const { fileList } = info;

    // Giới hạn số lượng file
    const limitedFileList = fileList.slice(0, 3);

    // Cập nhật fileList cho dạng biến thể
    variantTypes.value[typeIndex].fileList = limitedFileList;

    // Xử lý các file đã upload thành công
    const successFiles = limitedFileList.filter(file => file.status === 'done');
    variantTypes.value[typeIndex].hinh_anh = successFiles.map(file => file.response.url);

    // Cập nhật hình ảnh cho tất cả biến thể thuộc dạng biến thể này
    updateVariantsFromType(typeIndex);

    // Thông báo kết quả
    const lastFile = info.file;
    if (lastFile.status === 'done') {
        message.success(`${lastFile.name} đã được tải lên thành công`);
    } else if (lastFile.status === 'error') {
        message.error(`${lastFile.name} tải lên thất bại`);
    }
};

// Cập nhật hàm resetForm để hỗ trợ dạng biến thể
const resetForm = () => {
    Object.keys(formState).forEach(key => {
        formState[key] = '';
    });
    fileList.value = [];
    variants.value = [];
    variantTypes.value = [];
    isProductValidated.value = false;
};

// Cập nhật watch cho giá chung
watch([() => formState.gia_nhap_chung, () => formState.gia_ban_chung, () => useCommonPrice.value],
    async ([newGiaNhap, newGiaBan, newUseCommon]) => {
        if (newUseCommon) {
            // Cập nhật giá cho tất cả dạng biến thể
            variantTypes.value.forEach((type, index) => {
                type.gia_nhap = newGiaNhap;
                type.gia_ban = newGiaBan;
                updateVariantsFromType(index);
            });
        }
    }
);
watch(() => variants.value, (newVal) => {
    console.log('Chi tiết sản phẩm đã thay đổi:', newVal);
    console.table(newVal);
}, { deep: true });

// Thêm watch để in ra mảng dạng biến thể
watch(() => variantTypes.value, (newVal) => {
    console.log('Dạng biến thể đã thay đổi:', newVal);
    console.table(newVal);
}, { deep: true });


// Khởi tạo danh sách màu có sẵn khi component được mount
onMounted(() => {
    watch(() => mauSacList.value, () => {
        updateAvailableColors();
    }, { immediate: true });
});

// Fetch initial data
onMounted(async () => {
    try {
        // Lấy danh sách sản phẩm để tạo mã tự động
        await store.getAllSanPhamNgaySua();

        // Tạo mã sản phẩm tự động
        formState.ma_san_pham = generateProductCode(store.getAllSanPham);

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

// Hàm tạo mã sản phẩm tự động
const generateProductCode = (products) => {
    if (!products || products.length === 0) {
        return 'SP001';
    }

    // Lọc ra các mã sản phẩm bắt đầu bằng 'SP' và lấy số lớn nhất
    const productCodes = products
        .map(p => p.ma_san_pham)
        .filter(code => code.startsWith('SP0'))
        .map(code => parseInt(code.substring(2)) || 0);

    const maxNumber = Math.max(...productCodes);
    const nextNumber = maxNumber + 1;

    // Format số với 3 chữ số (ví dụ: 001, 002, ...)
    return `SP0${String(nextNumber).padStart(2, '0')}`;
};

// Thêm hàm kiểm tra dữ liệu
const validateFormData = (data) => {
    if (!data.ten_san_pham) throw new Error('Tên sản phẩm không được để trống');
    // if (data.gioi_tinh === undefined) throw new Error('Vui lòng chọn giới tính');
    if (!data.id_danh_muc) throw new Error('Vui lòng chọn danh mục');
    if (!data.id_thuong_hieu) throw new Error('Vui lòng chọn thương hiệu');
    if (!data.id_chat_lieu) throw new Error('Vui lòng chọn chất liệu');

    // Kiểm tra giá chung
    if (useCommonPrice.value) {
        if (!data.gia_ban_chung || data.gia_ban_chung < 1000) {
            throw new Error('Giá bán phải lớn hơn 1000!');
        }
    }

    // Kiểm tra số lượng và giá trong các biến thể
    if (variants.value.length > 0) {
        variants.value.forEach((variant, index) => {
            if (!variant.so_luong || variant.so_luong < 1) {
                throw new Error(`Số lượng của biến thể #${index + 1} phải lớn hơn 0!`);
            }
            if (!useCommonPrice.value) {
                if (!variant.gia_ban || variant.gia_ban < 1000) {
                    throw new Error(`Giá bán của biến thể #${index + 1} phải lớn hơn 1000!`);
                }
            }
        });
    }

    return true;
};

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
        // for (const variant of variants.value) {
        //     await store.createCTSP({
        //         ...variant,
        //         id_san_pham: productId,
        //         hinh_anh: variant.hinh_anh
        //     });
        // }
        await Promise.all(variants.value.map(async (variant) => {
            await store.createCTSP({
                ...variant,
                id_san_pham: productId,
                trang_thai: 'Hoạt động',
                ngay_tao: new Date().toISOString(),
                ngay_sua: new Date().toISOString(),
                // hinh_anh: variant.hinh_anh
            });

        }));
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

// Watch changes in formState để debug
watch(() => formState, (newVal) => {
    console.log('FormState changed:', newVal);
}, { deep: true });

// Thêm hàm xử lý khi giá biến thể thay đổi
const handleVariantPriceChange = (value, variant, field) => {
    if (field === 'gia_nhap') {
        // Khi giá nhập thay đổi, kiểm tra lại giá bán
        // if (value < 1000) {
        //     message.error('Giá nhập phải lớn hơn 1000!');
        //     variant.gia_nhap = 1000; // Reset về giá trị tối thiểu
        //     return;
        // }
        // const minGiaBan = value * 1.1;
        // if (variant.gia_ban < minGiaBan) {
        //     message.warning(`Giá bán phải lớn hơn giá nhập ít nhất 10% (Tối thiểu: ${minGiaBan.toLocaleString()}đ)`);
        // }
    } else if (field === 'gia_ban') {
        // Khi giá bán thay đổi, kiểm tra xem có đủ 10% không
        if (value < 1000) {
            message.error('Giá bán phải lớn hơn 1000!');
            variant.gia_ban = 1000; // Reset về giá trị tối thiểu
            return;
        }
        // const minGiaBan = variant.gia_nhap * 1.1;
        // if (value < minGiaBan) {
        //     message.warning(`Giá bán phải lớn hơn giá nhập ít nhất 10% (Tối thiểu: ${minGiaBan.toLocaleString()}đ)`);
        // }
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

.variant-type-item {
    background-color: #fafafa;
    transition: all 0.3s ease;
}

.variant-type-item:hover {
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