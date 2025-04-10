<template>
    <div>
        <h2>Sửa nhân viên</h2>
        <form @submit.prevent="suaNhanVien" @reset.prevent="resetForm">
            <div class="container">
                <div class="row">
                    <!-- Phần ảnh đại diện -->
                    <div class="col-md-4">
                        <div class="avatar-label">
                            <label>Ảnh đại diện</label>
                        </div>
                        <div class="avatar-container d-flex justify-content-center">
                            <div class="avatar-upload">
                                <div class="avatar-preview" @click="triggerFileInput">
                                    <img :src="previewImage || defaultAvatar" alt="Avatar" class="rounded-circle"
                                        :class="{ 'uploading': isUploading }">
                                    <button v-if="previewImage && !isUploading" @click.stop="removeImage"
                                        class="delete-btn" type="button">
                                        ×
                                    </button>
                                    <div v-if="isUploading" class="upload-indicator">
                                        <i class="fas fa-spinner fa-spin"></i>
                                    </div>
                                    <div v-else class="camera-icon">
                                        <i class="fas fa-camera"></i>
                                    </div>
                                </div>
                                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg"
                                    @change="handleImageChange" class="d-none" ref="fileInput">
                                <small v-if="formData.anhNhanVien" class="text-success d-block mt-2">
                                    <i class="fas fa-check-circle"></i> Ảnh đã được tải lên
                                </small>
                            </div>
                        </div>
                    </div>

                    <!-- Form nhập liệu bên phải -->
                    <div class="col-md-8">
                        <!-- Mã nhân viên -->
                        <div class="row mb-2">
                            <div class="col-6">
                                <label class="form-label">Mã nhân viên</label>
                                <input type="text" class="form-control" v-model="formData.maNhanVien" disabled>
                            </div>

                            <!-- Tên nhân viên -->
                            <div class="col-6">
                                <label class="form-label">Tên nhân viên</label>
                                <input type="text" class="form-control" v-model="formData.tenNhanVien"
                                    placeholder="Nhập tên nhân viên">
                                <span v-if="errors.tenNhanVien" class="text-danger">{{ errors.tenNhanVien }}</span>
                            </div>
                        </div>

                        <!-- Giới tính -->
                        <div class="row mb-2">
                            <div class="col-md-6">
                                <label class="form-label">Giới tính</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="gioiTinh" :value="true"
                                        v-model="formData.gioiTinh">
                                    <label class="form-check-label">Nam</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="gioiTinh" :value="false"
                                        v-model="formData.gioiTinh">
                                    <label class="form-check-label">Nữ</label>
                                </div>
                                <span v-if="errors.gioiTinh" class="text-danger">{{ errors.gioiTinh }}</span>
                            </div>

                            <!-- Ngày sinh -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày sinh</label>
                                <input type="date" class="form-control" v-model="formData.ngaySinh">
                                <span v-if="errors.ngaySinh" class="text-danger">{{ errors.ngaySinh }}</span>
                            </div>
                        </div>

                        <!-- Số điện thoại và Email -->
                        <div class="row mb-2">
                            <div class="col-md-6">
                                <label class="form-label">Số điện thoại</label>
                                <input type="tel" class="form-control" v-model="formData.soDienThoai"
                                    placeholder="Nhập số điện thoại">
                                <span v-if="errors.soDienThoai" class="text-danger">{{ errors.soDienThoai }}</span>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="text" class="form-control" v-model="formData.email"
                                    placeholder="Nhập email">
                                <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Phần địa chỉ -->
                <div class="col-12 pb-2 pt-2">
                    <div class="row g-3">
                        <!-- Tỉnh/Thành phố -->
                        <div class="col-md-4">
                            <label class="form-label">Tỉnh/Thành phố</label>
                            <a-select v-model:value="selectedProvince" show-search placeholder="Chọn Tỉnh/Thành phố"
                                style="width: 100%" :options="provinceOptions" :filter-option="filterOption"
                                @change="handleProvinceChange"></a-select>
                            <span v-if="errors.selectedProvince" class="text-danger">{{ errors.selectedProvince
                                }}</span>
                        </div>

                        <!-- Quận/Huyện -->
                        <div class="col-md-4">
                            <label class="form-label">Quận/Huyện</label>
                            <a-select v-model:value="selectedDistrict" show-search placeholder="Chọn Quận/Huyện"
                                style="width: 100%" :options="districtOptions" :filter-option="filterOption"
                                :disabled="!selectedProvince" @change="handleDistrictChange"></a-select>
                            <span v-if="errors.selectedDistrict" class="text-danger">{{ errors.selectedDistrict
                                }}</span>
                        </div>

                        <!-- Phường/Xã -->
                        <div class="col-md-4">
                            <label class="form-label">Phường/Xã</label>
                            <a-select v-model:value="selectedWard" show-search placeholder="Chọn Phường/Xã"
                                style="width: 100%" :options="wardOptions" :filter-option="filterOption"
                                :disabled="!selectedDistrict"></a-select>
                            <span v-if="errors.selectedWard" class="text-danger">{{ errors.selectedWard }}</span>
                        </div>

                        <!-- Địa chỉ cụ thể -->
                        <div class="col-12">
                            <label class="form-label">Địa chỉ cụ thể</label>
                            <input type="text" class="form-control" v-model="formData.diaChiLienHe"
                                placeholder="Số nhà, tên đường...">
                            <span v-if="errors.diaChiLienHe" class="text-danger">{{ errors.diaChiLienHe }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Buttons -->
            <div class="mt-4">
                <button type="submit" class="btn btn-warning me-2" :disabled="isUploading">Sửa nhân viên</button>
                <button type="reset" class="btn btn-secondary" :disabled="isUploading">Làm mới</button>
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
import { useRoute } from 'vue-router';
import { Modal } from 'ant-design-vue';
import router from '@/router';
//--------------------------------------
// Khai báo biến cho ảnh
const store = useGbStore();
const route = useRoute();
const previewImage = ref(null);
const fileInput = ref(null);
const selectedFile = ref(null);
const defaultAvatar = ref('https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png');
const isUploading = ref(false); // Add loading state for image upload
// Form data
const formData = reactive({
    idNhanVien: route.params.id,
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

// Khai báo options cho select
const provinceOptions = ref([]);
const districtOptions = ref([]);
const wardOptions = ref([]);

// Hàm filter cho search
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// Load provinces
const loadProvinces = async () => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        provinces.value = data;
        // Chuyển đổi format cho a-select
        provinceOptions.value = data.map(province => ({
            value: province.code,
            label: province.name
        }));
    } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành:', error);
    }
};

// Handle province change
const handleProvinceChange = async (value) => {
    if (value) {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${value}?depth=2`);
            const data = await response.json();
            districts.value = data.districts;
            // Chuyển đổi format cho a-select
            districtOptions.value = data.districts.map(district => ({
                value: district.code,
                label: district.name
            }));
            selectedDistrict.value = undefined;
            selectedWard.value = undefined;
            wardOptions.value = [];
        } catch (error) {
            console.error('Lỗi khi tải quận/huyện:', error);
        }
    } else {
        districts.value = [];
        districtOptions.value = [];
        selectedDistrict.value = undefined;
        wardOptions.value = [];
        selectedWard.value = undefined;
    }
};

// Handle district change
const handleDistrictChange = async (value) => {
    if (value) {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${value}?depth=2`);
            const data = await response.json();
            wards.value = data.wards;
            // Chuyển đổi format cho a-select
            wardOptions.value = data.wards.map(ward => ({
                value: ward.code,
                label: ward.name
            }));
            selectedWard.value = undefined;
        } catch (error) {
            console.error('Lỗi khi tải phường/xã:', error);
        }
    } else {
        wards.value = [];
        wardOptions.value = [];
        selectedWard.value = undefined;
    }
};


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

// Xử lý ảnh
const triggerFileInput = () => {
    fileInput.value.click();
};

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (validateImage(file)) {
            selectedFile.value = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.value = e.target.result;
                // Upload image to cloud when selected
                uploadImageToCloud(file);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error('Vui lòng chọn file ảnh có định dạng jpg, jpeg, png và kích thước dưới 5MB');
            fileInput.value.value = '';
        }
    }
};

const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
};

// Uploads image to cloud service and updates formData with the URL
const uploadImageToCloud = async (file) => {
    if (!file) {
        return;
    }

    try {
        // Show loading indicator
        isUploading.value = true;
        const toastId = toast.loading('Đang tải ảnh lên...');

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await axiosInstance.post('testImage', formDataUpload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data) {
            // Update formData with cloud image URL
            formData.anhNhanVien = response.data;
            toast.update(toastId, {
                render: 'Tải ảnh thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
            console.log('Uploaded image URL:', response.data);
        } else {
            toast.update(toastId, {
                render: 'Không thể tải ảnh lên',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        toast.error('Có lỗi khi tải ảnh lên: ' + (error.response?.data || error.message));
    } finally {
        isUploading.value = false;
    }
};

const removeImage = (e) => {
    e.stopPropagation();

    // Delete image from cloud if we have a URL
    if (formData.anhNhanVien) {
        deleteImageFromCloud(formData.anhNhanVien);
    }

    // Reset all image related values
    previewImage.value = null;
    selectedFile.value = null;
    formData.anhNhanVien = null;

    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Delete image from cloud service
const deleteImageFromCloud = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        // Lấy publicId từ URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split('.')[0]; // Lấy phần trước .jpg hoặc .png

        // Gọi API xóa ảnh
        await axiosInstance.delete("testDeleteImage?publicId=" + publicId);
        console.log('Đã xóa ảnh từ cloud');
    } catch (error) {
        console.error('Error deleting image:', error);
        // We don't show error toast here to avoid confusing the user
    }
};

// Reset form
const resetForm = () => {
    Modal.confirm({
        title: 'Xác nhận làm mới',
        content: 'Bạn có chắc muốn làm mới form? Tất cả dữ liệu sẽ bị xóa.',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk: () => {
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
            if (formData.anhNhanVien) {
                // Attempt to delete the image from cloud if there was one
                deleteImageFromCloud(formData.anhNhanVien);
            }

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
        }
    });
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
//Xử lý ảnh
const file = ref(null);
const imageUrl = ref('');
const loading = ref(false);

const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
        file.value = selectedFile;
        // Preview ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl.value = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    } else {
        message.error('Vui lòng chọn file ảnh!');
    }
};
//upload ảnh
const uploadImage = async () => {
    if (!file.value) {
        message.warning('Vui lòng chọn ảnh trước!');
        return;
    }

    loading.value = true;
    const formData = new FormData();
    formData.append('file', file.value); // Phải đúng tên 'file' để match với @RequestParam

    try {
        const response = await axiosInstance.post('testImage?file=', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Response:', response); // Debug response
        if (response.data) {
            imageUrl.value = response.data; // URL từ Cloudinary
            message.success('Upload ảnh thành công!');
        }
    } catch (error) {
        console.error('Upload error:', error);
        message.error('Có lỗi khi upload ảnh: ' + (error.response?.data || error.message));
    } finally {
        loading.value = false;
    }
};
//xóa ảnh
const deleteImage = async () => {
    if (!imageUrl.value) {
        message.warning('Không có ảnh để xóa!');
        return;
    }

    loading.value = true;
    try {
        // Lấy publicId từ URL
        const urlParts = imageUrl.value.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split('.')[0]; // Lấy phần trước .jpg hoặc .png

        // Gọi API xóa ảnh
        await axiosInstance.delete("testDeleteImage?publicId=" + publicId);

        // Reset state sau khi xóa
        imageUrl.value = '';
        file.value = null;
        message.success('Xóa ảnh thành công!');
    } catch (error) {
        console.error('Xóa ảnh error:', error);
        message.error('Có lỗi khi xóa ảnh: ' + (error.response?.data || error.message));
    } finally {
        loading.value = false;
    }
};
//--------------------------------------

const suaNhanVien = async () => {
    if (isUploading.value) {
        toast.warning('Vui lòng đợi tải ảnh lên hoàn tất');
        return;
    }

    if (validateForm()) {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn sửa nhân viên này không?',
            onOk: async () => {
                try {
                    const province = provinces.value.find(p => p.code === selectedProvince.value)?.name || '';
                    const district = districts.value.find(d => d.code === selectedDistrict.value)?.name || '';
                    const ward = wards.value.find(w => w.code === selectedWard.value)?.name || '';
                    const nhanVienUpdate = {
                        idNhanVien: formData.idNhanVien,
                        maNhanVien: formData.maNhanVien,
                        tenNhanVien: formData.tenNhanVien,
                        gioiTinh: formData.gioiTinh,
                        ngaySinh: formData.ngaySinh,
                        soDienThoai: formData.soDienThoai,
                        email: formData.email,
                        trangThai: formData.trangThai,
                        anhNhanVien: formData.anhNhanVien,
                        diaChiLienHe: `${formData.diaChiLienHe}, ${ward}, ${district}, ${province}`.trim(),
                        taiKhoan: {
                            id_tai_khoan: formData.taiKhoan.id_tai_khoan,
                            mat_khau: formData.taiKhoan.mat_khau,
                            roles: formData.taiKhoan.roles
                        }
                    };
                    console.log('Dữ liệu truyền vào mới sửa nhan vien', nhanVienUpdate);
                    const suaNhanViens = await store.suaNhanVien(nhanVienUpdate);
                    if (suaNhanViens.error) {
                        toast.error('Có lỗi xảy ra');
                        console.log(suaNhanViens.error);
                    } else {
                        toast.success('Sửa nhân viên thành công');
                        router.push('/admin/quanlynhanvien');
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            onCancel() {
                console.log('Đã hủy sửa nhân viên');
            }
        });
    }
}

onMounted(async () => {
    try {
        // Load provinces trước
        await loadProvinces();

        // Lấy thông tin nhân viên
        const nhanVienById = await store.getNhanVienById(route.params.id);
        console.log('Dữ liệu nhân viên:', nhanVienById);

        // Gán thông tin cơ bản
        formData.idNhanVien = nhanVienById.idNhanVien;
        formData.maNhanVien = nhanVienById.maNhanVien;
        formData.tenNhanVien = nhanVienById.tenNhanVien;
        formData.gioiTinh = nhanVienById.gioiTinh;
        formData.ngaySinh = nhanVienById.ngaySinh;
        formData.soDienThoai = nhanVienById.soDienThoai;
        formData.email = nhanVienById.email;
        formData.trangThai = nhanVienById.trangThai;
        formData.anhNhanVien = nhanVienById.anhNhanVien;
        formData.taiKhoan = nhanVienById.taiKhoan;

        // Set preview image if there is avatar
        if (nhanVienById.anhNhanVien) {
            previewImage.value = nhanVienById.anhNhanVien;
        }

        // Xử lý địa chỉ
        const addressParts = nhanVienById.diaChiLienHe.split(',').map(part => part.trim());
        formData.diaChiLienHe = addressParts[0]; // Địa chỉ cụ thể
        const wardName = addressParts[1];
        const districtName = addressParts[2];
        const provinceName = addressParts[3];

        // Tìm và set province
        const province = provinceOptions.value.find(p => p.label === provinceName);
        if (province) {
            selectedProvince.value = province.value;
            await handleProvinceChange(province.value);

            // Tìm và set district
            const district = districtOptions.value.find(d => d.label === districtName);
            if (district) {
                selectedDistrict.value = district.value;
                await handleDistrictChange(district.value);

                // Tìm và set ward
                const ward = wardOptions.value.find(w => w.label === wardName);
                if (ward) {
                    selectedWard.value = ward.value;
                }
            }
        }

    } catch (error) {
        console.error('Lỗi khởi tạo:', error);
        toast.error('Có lỗi khi khởi tạo dữ liệu');
    }
});
// onMounted(() => {
//     loadProvinces();
// });
// onMounted(async () => {
//   await store.layDanhSachNhanVien();
//     formData.maNhanVien = taoMaNhanVienMoi(store.nhanVienArr);
// })
</script>

<!-- Phần template và style giữ nguyên như cũ -->

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

:deep(.ant-select) {
    width: 100%;
}

:deep(.ant-select-selector) {
    height: 40px !important;
    padding: 4px 11px !important;
}

:deep(.ant-select-selection-search-input) {
    height: 38px !important;
}

:deep(.ant-select-selection-placeholder),
:deep(.ant-select-selection-item) {
    line-height: 32px !important;
}

.avatar-preview img.uploading {
    opacity: 0.6;
    filter: blur(1px);
}

/* Upload indicator */
.upload-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    z-index: 3;
}

.upload-indicator i {
    font-size: 32px;
    color: white;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>