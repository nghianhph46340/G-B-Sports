<template>
    <div>
        <h2>Thêm Nhân Viên</h2>
        <form @submit.prevent="handleSubmit" @reset.prevent="resetForm">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 ">
                        <div class="avatar-label ">
                            <label>Ảnh đại diện</label>
                        </div>
                        <div class="avatar-container d-flex justify-content-center">
                            <div class="avatar-upload">
                                <div class="avatar-preview" @click="triggerFileInput">
                                    <img :src="previewImage || defaultAvatar" alt="Avatar" class="rounded-circle">
                                    <button v-if="previewImage" @click.stop="removeImage" class="delete-btn"
                                        type="button">
                                        ×
                                    </button>
                                    <div class="camera-icon">
                                        <i class="fas fa-camera"></i>
                                    </div>
                                </div>
                                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg"
                                    @change="handleImageChange" class="d-none" ref="fileInput">
                            </div>
                        </div>
                    </div>

                    <!-- Form nhập liệu bên phải -->
                    <div class="col-md-8 ">
                        <!-- Mã nhân viên -->
                        <div class="row mb-2">
                            <div class="col-6 ">

                                <label class="form-label">Mã nhân viên</label>
                                <input type="text" class="form-control" v-model="formData.employeeCode"
                                    placeholder="Nhập mã nhân viên">
                            </div>

                            <!-- Tên nhân viên -->
                            <div class="col-6">
                                <label class="form-label">Tên nhân viên</label>
                                <input type="text" class="form-control" v-model="formData.name"
                                    placeholder="Nhập tên nhân viên">
                            </div>
                        </div>

                        <!-- Giới tính -->
                        <div class="row mb-2">
                            <div class="col-md-6">
                                <label class="form-label">Giới tính</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="gender" value="Nam">
                                    <label class="form-check-label">
                                        Nam
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="gender" value="Nữ" >
                                    <label class="form-check-label">
                                        Nữ
                                    </label>
                                </div>

                            </div>

                            <!-- Ngày sinh -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày sinh</label>
                                <input type="date" class="form-control" v-model="formData.birthDate">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <!-- Số điện thoại -->
                            <div class="col-md-6">
                                <label class="form-label">Số điện thoại</label>
                                <input type="tel" class="form-control" v-model="formData.phone"
                                    placeholder="Nhập số điện thoại">
                            </div>

                            <!-- Email -->
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model="formData.email"
                                    placeholder="Nhập email">
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
                            <select class="form-select" v-model="selectedProvince" @change="handleProvinceChange">
                                <option value="">Chọn Tỉnh/Thành phố</option>
                                <option v-for="province in provinces" :key="province.code" :value="province.code">
                                    {{ province.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Quận/Huyện -->
                        <div class="col-md-4">
                            <label class="form-label">Quận/Huyện</label>
                            <select class="form-select" v-model="selectedDistrict" @change="handleDistrictChange"
                                :disabled="!selectedProvince">
                                <option value="">Chọn Quận/Huyện</option>
                                <option v-for="district in districts" :key="district.code" :value="district.code">
                                    {{ district.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Phường/Xã -->
                        <div class="col-md-4">
                            <label class="form-label">Phường/Xã</label>
                            <select class="form-select" v-model="selectedWard" :disabled="!selectedDistrict">
                                <option value="">Chọn Phường/Xã</option>
                                <option v-for="ward in wards" :key="ward.code" :value="ward.code">
                                    {{ ward.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Địa chỉ cụ thể -->
                        <div class="col-12">
                            <label class="form-label">Địa chỉ cụ thể</label>
                            <input type="text" class="form-control" v-model="formData.address"
                                placeholder="Số nhà, tên đường...">
                        </div>
                    </div>
                </div>

            </div>

            <!-- Buttons -->
            <div class="mt-4">
                <button type="submit" class="btn btn-warning me-2">Tạo tài khoản</button>
                <button type="reset" class="btn btn-secondary">Làm mới</button>
            </div>
        </form>
    </div>
</template>



<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Khai báo biến cho ảnh
const previewImage = ref(null);
const fileInput = ref(null);
const selectedFile = ref(null);
const defaultAvatar = ref('https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png');
// Form data
const formData = ref({
    employeeCode: '',
    name: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    avatar: null
});

// Địa chỉ
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const selectedProvince = ref('');
const selectedDistrict = ref('');
const selectedWard = ref('');

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
                console.log("hihi"+previewImage);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Vui lòng chọn file ảnh có định dạng jpg, jpeg, png và kích thước dưới 5MB');
            fileInput.value.value = '';
        }
    }
};

const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
};

const removeImage = (e) => {
    e.stopPropagation();
    previewImage.value = null;
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

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
    formData.value = {
        employeeCode: '',
        name: '',
        gender: '',
        birthDate: '',
        phone: '',
        email: '',
        address: '',
        avatar: null
    };

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

onMounted(() => {
    loadProvinces();
});
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
  background-color: #f33b47 !important; /* Màu đỏ cho chấm tròn */
  border-color: #f33b47 !important; /* Màu viền */
}

.form-check-input:focus {
  box-shadow: none !important; /* Xóa viền xanh khi focus */
}
</style>