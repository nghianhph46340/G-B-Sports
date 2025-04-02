<template>
    <div>
        <h2>Thêm khách hàng</h2>
        <form @submit.prevent="themNhanVien" @reset.prevent="resetForm">
            <a-form :model="formData" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <!-- Mã khách hàng -->
                        <a-form-item label="Mã khách hàng">
                            <a-input disabled />
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Tên khách hàng -->
                        <a-form-item label="Họ tên khách hàng" :validate-status="errors.tenNhanVien ? 'error' : ''"
                            :help="errors.tenNhanVien">
                            <a-input v-model:value="formData.tenNhanVien" placeholder="Nhập tên khách hàng" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Giới tính -->
                        <a-form-item label="Giới tính" :validate-status="errors.gioiTinh ? 'error' : ''"
                            :help="errors.gioiTinh">
                            <a-radio-group v-model:value="formData.gioiTinh">
                                <a-radio :value="true">Nam</a-radio>
                                <a-radio :value="false">Nữ</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Ngày sinh -->
                        <a-form-item label="Ngày sinh" :validate-status="errors.ngaySinh ? 'error' : ''"
                            :help="errors.ngaySinh">
                            <a-date-picker v-model:value="formData.ngaySinh" format="DD/MM/YYYY"
                                placeholder="Chọn ngày sinh" class="w-100" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Số điện thoại -->
                        <a-form-item label="Số điện thoại" :validate-status="errors.soDienThoai ? 'error' : ''"
                            :help="errors.soDienThoai">
                            <a-input v-model:value="formData.soDienThoai" placeholder="Nhập số điện thoại" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Email -->
                        <a-form-item label="Email" :validate-status="errors.email ? 'error' : ''" :help="errors.email">
                            <a-input v-model:value="formData.email" placeholder="Nhập email" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Tỉnh/Thành phố -->
                        <a-form-item label="Tỉnh/Thành phố" :validate-status="errors.selectedProvince ? 'error' : ''"
                            :help="errors.selectedProvince">
                            <a-select v-model:value="selectedProvince" placeholder="Chọn Tỉnh/Thành phố"
                                @change="handleProvinceChange">
                                <a-select-option v-for="province in provinces" :key="province.code"
                                    :value="province.code">
                                    {{ province.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Quận/Huyện -->
                        <a-form-item label="Quận/Huyện" :validate-status="errors.selectedDistrict ? 'error' : ''"
                            :help="errors.selectedDistrict">
                            <a-select v-model:value="selectedDistrict" placeholder="Chọn Quận/Huyện"
                                :disabled="!selectedProvince" @change="handleDistrictChange">
                                <a-select-option v-for="district in districts" :key="district.code"
                                    :value="district.code">
                                    {{ district.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="8">
                        <!-- Phường/Xã -->
                        <a-form-item label="Phường/Xã" :validate-status="errors.selectedWard ? 'error' : ''"
                            :help="errors.selectedWard">
                            <a-select v-model:value="selectedWard" placeholder="Chọn Phường/Xã"
                                :disabled="!selectedDistrict">
                                <a-select-option v-for="ward in wards" :key="ward.code" :value="ward.code">
                                    {{ ward.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <!-- Địa chỉ cụ thể -->
                        <a-form-item label="Số nhà, tên đường" :validate-status="errors.diaChiLienHe ? 'error' : ''"
                            :help="errors.diaChiLienHe">
                            <a-input v-model:value="formData.diaChiLienHe" placeholder="Số nhà, tên đường..." />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <hr>
            <button class="btn btn-primary">+ Thêm địa chỉ khác</button>
           

            <!-- Buttons -->
            <div class="mt-4">
                <button type="submit" class="btn btn-warning me-2">Tạo tài khoản</button>
                <button type="reset" class="btn btn-secondary">Làm mới</button>
            </div>
        </form>
    </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
//Import service ảnh
import axiosInstance from '@/config/axiosConfig';
import { message } from 'ant-design-vue';
import { useGbStore } from '@/stores/gbStore';
import { toast } from 'vue3-toastify';
//--------------------------------------
// Khai báo biến cho ảnh
const store = useGbStore();
const previewImage = ref(null);
const fileInput = ref(null);
const selectedFile = ref(null);
const defaultAvatar = ref('https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png');
// Form data
const formData = reactive({
    maNhanVien: '',
    tenNhanVien: '',
    gioiTinh: null,
    ngaySinh: '',
    soDienThoai: '',
    email: '',
    diaChiLienHe: '',
    anhNhanVien: null,
    trangThai: 'Đang hoạt động'
});

// Địa chỉ
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const selectedProvince = ref('');
const selectedDistrict = ref('');
const selectedWard = ref('');

const validateForm = () => {
    let isValid = true;

    // Reset tất cả lỗi
    Object.keys(errors).forEach(key => {
        errors[key] = '';
    });

    // Check mã nhân viên
    if (!formData.maNhanVien) {
        errors.maNhanVien = 'Mã nhân viên không được để trống';
        isValid = false;
    }

    // Check tên nhân viên
    if (!formData.tenNhanVien.trim()) {
        errors.tenNhanVien = 'Vui lòng nhập tên nhân viên';
        isValid = false;
    } else if (formData.tenNhanVien.length > 50) {
        errors.tenNhanVien = 'Tên nhân viên không được quá 50 ký tự';
        isValid = false;
    }

    // Check giới tính
    if (formData.gioiTinh === null) {
        errors.gioiTinh = 'Vui lòng chọn giới tính';
        isValid = false;
    }

    // Check ngày sinh và tuổi
    if (!formData.ngaySinh) {
        errors.ngaySinh = 'Vui lòng nhập ngày sinh';
        isValid = false;
    } else {
        const age = calculateAge(formData.ngaySinh);
        if (age < 18) {
            errors.ngaySinh = 'Nhân viên phải đủ 18 tuổi';
            isValid = false;
        } else if (age > 60) {
            errors.ngaySinh = 'Nhân viên không được quá 60 tuổi';
            isValid = false;
        }
    }

    // Check số điện thoại
    if (!formData.soDienThoai.trim()) {
        errors.soDienThoai = 'Vui lòng nhập số điện thoại';
        isValid = false;
    } else if (!validatePhoneNumber(formData.soDienThoai)) {
        errors.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0912345678)';
        isValid = false;
    }

    // Check email
    if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email';
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Email không hợp lệ (VD: example@gmail.com)';
        isValid = false;
    }

    // Check địa chỉ
    if (!selectedProvince.value) {
        errors.selectedProvince = 'Vui lòng chọn tỉnh/thành phố';
        isValid = false;
    }

    if (!selectedDistrict.value && selectedProvince.value) {
        errors.selectedDistrict = 'Vui lòng chọn quận/huyện';
        isValid = false;
    }

    if (!selectedWard.value && selectedDistrict.value) {
        errors.selectedWard = 'Vui lòng chọn phường/xã';
        isValid = false;
    }

    if (!formData.diaChiLienHe.trim()) {
        errors.diaChiLienHe = 'Vui lòng nhập địa chỉ cụ thể';
        isValid = false;
    } else if (formData.diaChiLienHe.length > 200) {
        errors.diaChiLienHe = 'Địa chỉ không được quá 200 ký tự';
        isValid = false;
    }

    // Nếu có lỗi, hiển thị toast thông báo
    if (!isValid) {
        toast.error('Vui lòng điền đầy đủ và chính xác thông tin!');
        // Log ra các trường bị lỗi để debug
        console.log('Các trường có lỗi:', Object.entries(errors).filter(([_, value]) => value !== ''));
    }

    return isValid;
};

// Cập nhật hàm validatePhoneNumber để chặt chẽ hơn
const validatePhoneNumber = (phone) => {
    // Số điện thoại Việt Nam: bắt đầu bằng 0, theo sau là 9 chữ số
    // Hỗ trợ các đầu số: 03, 05, 07, 08, 09
    const regex = /^(0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    return regex.test(phone);
};

// Cập nhật hàm validateEmail để chặt chẽ hơn
const validateEmail = (email) => {
    // RFC 5322 Official Standard
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email) && email.length <= 100;
};
// Tính tuổi
const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Lỗi
const errors = reactive({
    tenNhanVien: '',
    gioiTinh: '',
    ngaySinh: '',
    soDienThoai: '',
    email: '',
    selectedProvince: '',
    selectedDistrict: '',
    selectedWard: '',
    diaChiLienHe: ''
});


// API địa chỉ
const loadProvinces = async () => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        provinces.value = data;
    } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành:', error);
    }
};

const handleProvinceChange = async () => {
    if (selectedProvince.value) {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`);
            const data = await response.json();
            districts.value = data.districts;
            selectedDistrict.value = '';
            wards.value = [];
        } catch (error) {
            console.error('Lỗi khi tải quận/huyện:', error);
        }
    } else {
        districts.value = [];
        wards.value = [];
    }
};

const handleDistrictChange = async () => {
    if (selectedDistrict.value) {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`);
            const data = await response.json();
            wards.value = data.wards;
            selectedWard.value = '';
        } catch (error) {
            console.error('Lỗi khi tải phường/xã:', error);
        }
    } else {
        wards.value = [];
    }
};

// Reset form
const resetForm = () => {
    Object.assign(formData, {
        tenNhanVien: '',
        gioiTinh: null,
        ngaySinh: '',
        soDienThoai: '',
        email: '',
        diaChiLienHe: '',
        anhNhanVien: null,
        trangThai: 'Đang hoạt động'
    });

    // Reset ảnh
    previewImage.value = null;
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }

    // Reset địa chỉ
    selectedProvince.value = '';
    selectedDistrict.value = '';
    selectedWard.value = '';
    districts.value = [];
    wards.value = [];
};

// Submit form
const handleSubmit = async () => {
    try {
        const submitData = {
            ...formData.value,
            province: selectedProvince.value,
            district: selectedDistrict.value,
            ward: selectedWard.value,
            avatar: selectedFile.value
        };

        // Gọi API tạo nhân viên
        console.log('Form data:', submitData);

    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

const taoMaNhanVienMoi = (nhanVienArr) => {
    if (!nhanVienArr || nhanVienArr.length === 0) {
        return 'NV01';
    }

    const nhanVienMoi = nhanVienArr
        .map(nv => nv.maNhanVien)
        .filter(code => code.startsWith('NV'))
        .map(code => parseInt(code.substring(2)) || 0);

    const maxNumber = Math.max(...nhanVienMoi);
    const nextNumber = maxNumber + 1;

    return `NV${String(nextNumber).padStart(2)}`;
};
//--------------------------------------

const themNhanVien = async () => {
    if (validateForm()) {
        try {
            const province = provinces.value.find(p => p.code === selectedProvince.value)?.name || '';
            const district = districts.value.find(d => d.code === selectedDistrict.value)?.name || '';
            const ward = wards.value.find(w => w.code === selectedWard.value)?.name || '';
            const nhanVienMoi = {
                ...formData,
                diaChiLienHe: `${formData.diaChiLienHe}, ${ward}, ${district}, ${province}`.trim()
            };
            console.log('Dữ liệu truyền vào mới them nhan vien', nhanVienMoi);
            const themNhanVien = await store.themNhanVien(nhanVienMoi);
            if (themNhanVien.error) {
                toast.error('Có lỗi xảy ra');
                console.log(themNhanVien.error);
            } else {
                toast.success('Thêm nhân viên thành công');
                router.push('/admin/quanlynhanvien');
            }
        } catch (error) {
            console.error(error);
        }
    }
}

onMounted(async () => {
    try {
        // Load provinces
        await loadProvinces();

        // Load danh sách nhân viên và tạo mã mới
        await store.layDanhSachNhanVien();
        formData.maNhanVien = taoMaNhanVienMoi(store.nhanVienArr);

        console.log('Khởi tạo mã nhân viên:', formData.maNhanVien);
    } catch (error) {
        console.error('Lỗi khởi tạo:', error);
        toast.error('Có lỗi khi khởi tạo dữ liệu');
    }
});
</script>


<style scoped>
.avatar-container {
    display: flex;
    align-items: flex-end;
}

.avatar-label {
    font-weight: 500;
    color: #333;
    padding-top: 10px;
}

.avatar-upload {
    text-align: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    width: fit-content;
}

.avatar-preview {
    width: 150px;
    height: 150px;
    position: relative;
    margin: 0 auto;
    cursor: pointer;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 3px solid #fff;
    border-radius: 50%;
    background-color: #fff;
}

/* Style cho nút xóa */
.delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 25px;
    height: 25px;
    background-color: #000000;
    color: white;
    border: 2px solid #fff;
    border-radius: 50%;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.2s;
    z-index: 2;
    border: 2px solid #000000;
}

/* Icon camera khi hover */
.camera-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 30px;
    opacity: 0;
    transition: all 0.2s;
}

/* Hiệu ứng hover */
.avatar-preview:hover .camera-icon {
    opacity: 1;
}

.avatar-preview:hover .delete-btn {
    opacity: 1;
}

.delete-btn:hover {
    transform: scale(1.1);
    background-color: white;
    color: black;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-control,
.form-select {
    height: 40px;
}

.btn {
    padding: 0.5rem 1.5rem;
}

.form-check-input:checked {
    background-color: #f33b47 !important;
    /* Màu đỏ cho chấm tròn */
    border-color: #f33b47 !important;
    /* Màu viền */
}

.form-check-input:focus {
    box-shadow: none !important;
    /* Xóa viền xanh khi focus */
}
</style>