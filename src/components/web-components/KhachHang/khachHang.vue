<template>
    <div class="customer-profile">
        <!-- Header profile -->
        <a-row :gutter="[24, 24]">
            <a-col :span="24">
                <a-card class="profile-header">
                    <div class="profile-content">
                        <div class="profile-avatar">
                            <a-avatar :size="120" :src="userInfo.avatar || defaultAvatar" class="custom-avatar">
                                {{ userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'K' }}
                            </a-avatar>
                            <a-button class="upload-avatar-btn" shape="circle" size="small">
                                <template #icon><camera-outlined /></template>
                            </a-button>
                        </div>
                        <div class="profile-info">
                            <div class="profile-info-header">
                                <h2>{{ userInfo.name || 'Khách hàng' }}</h2>
                            </div>
                            <p class="user-email"><mail-outlined /> {{ userInfo.email }}</p>
                            <p class="user-member-since"><calendar-outlined /> Thành viên từ: {{
                                formatDate(userInfo.createdAt) }}</p>
                            <div class="user-stats">
                                <div class="stat-item">
                                    <shopping-outlined />
                                    <span>{{ orders.length || 0 }}</span>
                                    <p>Đơn hàng</p>
                                </div>
                                <div class="stat-divider"></div>
                                <div class="stat-item">
                                    <gift-outlined />
                                    <span>{{ 0 }}</span>
                                    <p>Ưu đãi</p>
                                </div>
                                <div class="stat-divider"></div>
                                <div class="stat-item">
                                    <environment-outlined />
                                    <span>{{ addresses.length || 0 }}</span>
                                    <p>Địa chỉ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-card>
            </a-col>
        </a-row>

        <!-- Menu và nội dung -->
        <a-row :gutter="[24, 24]" class="mt-4">
            <a-col :xs="24" :md="6">
                <a-card title="Tài khoản của tôi">
                    <a-menu v-model:selectedKeys="selectedMenu" mode="inline" style="border-right: 0">
                        <a-menu-item key="info">
                            <template #icon><user-outlined /></template>
                            Thông tin cá nhân
                        </a-menu-item>
                        <a-menu-item key="orders">
                            <template #icon><shopping-outlined /></template>
                            Đơn hàng của tôi
                        </a-menu-item>
                        <a-menu-item key="address">
                            <template #icon><environment-outlined /></template>
                            Sổ địa chỉ
                        </a-menu-item>
                        <a-menu-item key="password">
                            <template #icon><lock-outlined /></template>
                            Đổi mật khẩu
                        </a-menu-item>
                        <a-menu-item key="logout">
                            <template #icon><logout-outlined /></template>
                            Đăng xuất
                        </a-menu-item>
                    </a-menu>
                </a-card>
            </a-col>

            <a-col :xs="24" :md="18">
                <!-- Thông tin cá nhân -->
                <a-card v-if="selectedMenu.includes('info')" title="Thông tin cá nhân">
                    <a-form :model="userInfo" layout="vertical">
                        <a-row :gutter="16">
                            <a-col :span="12">
                                <a-form-item label="Họ và tên">
                                    <a-input v-model:value="userInfo.name" placeholder="Nhập họ và tên" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="Email">
                                    <a-input v-model:value="userInfo.email" disabled placeholder="Email" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row :gutter="16">
                            <a-col :span="12">
                                <a-form-item label="Số điện thoại">
                                    <a-input v-model:value="userInfo.phone" placeholder="Nhập số điện thoại" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="Ngày sinh">
                                    <a-date-picker v-model:value="userInfo.birthday" style="width: 100%"
                                        format="DD/MM/YYYY" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-form-item>
                            <a-button type="primary" @click="updateProfile">Cập nhật thông tin</a-button>
                        </a-form-item>
                    </a-form>
                </a-card>

                <!-- Đơn hàng -->
                <a-card v-if="selectedMenu.includes('orders')" title="Đơn hàng của tôi">
                    <a-tabs v-model:activeKey="orderTabActive">
                        <a-tab-pane key="all" tab="Tất cả">
                            <a-empty v-if="orders.length === 0" description="Bạn chưa có đơn hàng nào" />
                            <a-list v-else :data-source="orders" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-card style="width: 100%">
                                            <a-row>
                                                <a-col :span="16">
                                                    <p>Mã đơn: {{ item.id }}</p>
                                                    <p>Ngày đặt: {{ formatDate(item.orderDate) }}</p>
                                                    <p>Trạng thái: <a-tag :color="getOrderStatusColor(item.status)">{{
                                                        item.status }}</a-tag></p>
                                                </a-col>
                                                <a-col :span="8" style="text-align: right">
                                                    <p>Tổng tiền: {{ formatCurrency(item.totalAmount) }}</p>
                                                    <a-button type="primary" size="small"
                                                        @click="viewOrderDetail(item.id)">Chi tiết</a-button>
                                                </a-col>
                                            </a-row>
                                        </a-card>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-tab-pane>
                        <a-tab-pane key="pending" tab="Chờ xác nhận"></a-tab-pane>
                        <a-tab-pane key="shipping" tab="Đang giao"></a-tab-pane>
                        <a-tab-pane key="completed" tab="Đã giao"></a-tab-pane>
                        <a-tab-pane key="cancelled" tab="Đã hủy"></a-tab-pane>
                    </a-tabs>
                </a-card>

                <!-- Địa chỉ -->
                <a-card v-if="selectedMenu.includes('address')" title="Sổ địa chỉ">
                    <a-button type="primary" style="margin-bottom: 16px" @click="showAddAddressModal">
                        <plus-outlined /> Thêm địa chỉ mới
                    </a-button>

                    <a-list :data-source="addresses" :pagination="{ pageSize: 3 }">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-card style="width: 100%">
                                    <div style="display: flex; justify-content: space-between">
                                        <div>
                                            <div style="display: flex; align-items: center; gap: 8px">
                                                <strong>{{ item.name }}</strong>
                                                <a-tag v-if="item.isDefault" color="blue">Mặc định</a-tag>
                                            </div>
                                            <p style="margin: 8px 0">{{ item.phone }}</p>
                                            <p>{{ item.address }}, {{ item.ward }}, {{ item.district }}, {{
                                                item.province }}</p>
                                        </div>
                                        <div>
                                            <a-button type="link" @click="editAddress(item)">Sửa</a-button>
                                            <a-popconfirm title="Bạn có chắc muốn xóa địa chỉ này không?" ok-text="Có"
                                                cancel-text="Không" @confirm="deleteAddress(item.id)">
                                                <a-button type="link" danger>Xóa</a-button>
                                            </a-popconfirm>
                                        </div>
                                    </div>
                                </a-card>
                            </a-list-item>
                        </template>
                    </a-list>
                </a-card>

                <!-- Đổi mật khẩu -->
                <a-card v-if="selectedMenu.includes('password')" title="Đổi mật khẩu">
                    <a-form :model="passwordForm" layout="vertical">
                        <a-form-item label="Mật khẩu hiện tại" name="currentPassword">
                            <a-input-password v-model:value="passwordForm.currentPassword"
                                placeholder="Nhập mật khẩu hiện tại" />
                        </a-form-item>
                        <a-form-item label="Mật khẩu mới" name="newPassword">
                            <a-input-password v-model:value="passwordForm.newPassword"
                                placeholder="Nhập mật khẩu mới" />
                        </a-form-item>
                        <a-form-item label="Xác nhận mật khẩu mới" name="confirmPassword">
                            <a-input-password v-model:value="passwordForm.confirmPassword"
                                placeholder="Nhập lại mật khẩu mới" />
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click="changePassword">Đổi mật khẩu</a-button>
                        </a-form-item>
                    </a-form>
                </a-card>
            </a-col>
        </a-row>

        <!-- Modal thêm/sửa địa chỉ -->
        <a-modal v-model:visible="addressModal.visible" :title="'Thêm địa chỉ mới'" :footer="null" :width="550"
            class="mt-5">
            <div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label>Họ tên người nhận</label>
                        <a-input v-model:value="addressModal.data.name" placeholder="Nguyễn Văn A" />
                    </div>
                    <div class="col-md-6">
                        <label>Số điện thoại</label>
                        <a-input v-model:value="addressModal.data.phone" placeholder="0987654321" />
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-4">
                        <label>Tỉnh/Thành phố</label>
                        <a-select v-model:value="addressModal.data.provinceCode" placeholder="Chọn Tỉnh/Thành phố"
                            style="width: 100%" @change="handleProvinceChange">
                            <a-select-option v-for="province in provinces" :key="province.code" :value="province.code">
                                {{ province.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="col-md-4">
                        <label>Quận/Huyện</label>
                        <a-select v-model:value="addressModal.data.districtCode" placeholder="Chọn Quận/Huyện"
                            style="width: 100%" :disabled="!addressModal.data.provinceCode"
                            @change="handleDistrictChange">
                            <a-select-option v-for="district in districts" :key="district.code" :value="district.code">
                                {{ district.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="col-md-4">
                        <label>Phường/Xã</label>
                        <a-select v-model:value="addressModal.data.wardCode" placeholder="Chọn Phường/Xã"
                            style="width: 100%" :disabled="!addressModal.data.districtCode">
                            <a-select-option v-for="ward in wards" :key="ward.code" :value="ward.code">
                                {{ ward.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>

                <div class="mb-3">
                    <label>Địa chỉ cụ thể</label>
                    <a-input v-model:value="addressModal.data.address" placeholder="Số nhà, tên đường..." />
                </div>

                <div class="mb-3">
                    <a-checkbox v-model:checked="addressModal.data.isDefault">Đặt làm địa chỉ mặc định</a-checkbox>
                </div>

                <div class="text-end">
                    <a-button @click="addressModal.visible = false" class="me-2">Cancel</a-button>
                    <a-button type="primary" @click="saveAddress">OK</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
    UserOutlined,
    ShoppingOutlined,
    EnvironmentOutlined,
    LockOutlined,
    LogoutOutlined,
    MailOutlined,
    CalendarOutlined,
    CameraOutlined,
    GiftOutlined,
    PlusOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axiosInstance from '@/config/axiosConfig';

const route = useRoute();

// State cho menu
const selectedMenu = ref(['info']);
const orderTabActive = ref('all');

// Thông tin người dùng mặc định
const defaultAvatar = 'https://joeschmoe.io/api/v1/random';
const userInfo = reactive({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0987654321',
    birthday: '',
    avatar: '',
    createdAt: new Date()
});

// Danh sách đơn hàng và địa chỉ
const orders = ref([]);
const addresses = ref([
    {
        id: 1,
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        address: '123 Đường ABC',
        ward: 'Phường XYZ',
        district: 'Quận 1',
        province: 'TP Hồ Chí Minh',
        isDefault: true
    }
]);

// Form đổi mật khẩu
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// State cho modal địa chỉ
const addressModal = reactive({
    visible: false,
    isEdit: false,
    data: {
        id: null,
        name: '',
        phone: '',
        provinceCode: '',
        province: '',
        districtCode: '',
        district: '',
        wardCode: '',
        ward: '',
        address: '',
        isDefault: false
    }
});

// Dữ liệu cho địa chỉ
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

// Filter cho select
const filterOption = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// Format ngày
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// Format tiền tệ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Màu tag theo trạng thái đơn hàng
const getOrderStatusColor = (status) => {
    const colors = {
        'Chờ xác nhận': 'orange',
        'Đang giao': 'blue',
        'Đã giao': 'green',
        'Đã hủy': 'red'
    };
    return colors[status] || 'default';
};

// Xử lý cập nhật thông tin
const updateProfile = async () => {
    try {
        // Gọi API cập nhật thông tin
        message.success('Cập nhật thông tin thành công');
    } catch (error) {
        message.error('Có lỗi xảy ra khi cập nhật thông tin');
        console.error(error);
    }
};

// Xử lý đổi mật khẩu
const changePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        return message.error('Vui lòng nhập đầy đủ thông tin');
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        return message.error('Mật khẩu xác nhận không khớp');
    }

    try {
        message.success('Đổi mật khẩu thành công');

        // Reset form
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
    } catch (error) {
        message.error('Có lỗi xảy ra khi đổi mật khẩu');
        console.error(error);
    }
};

// Xem chi tiết đơn hàng
const viewOrderDetail = (orderId) => {
    console.log('View order:', orderId);
};

// Xử lý địa chỉ
const showAddAddressModal = () => {
    // Reset modal data
    Object.assign(addressModal.data, {
        id: null,
        name: '',
        phone: '',
        provinceCode: '',
        province: '',
        districtCode: '',
        district: '',
        wardCode: '',
        ward: '',
        address: '',
        isDefault: false
    });
    addressModal.isEdit = false;
    addressModal.visible = true;
};

const editAddress = (address) => {
    Object.assign(addressModal.data, { ...address });
    addressModal.isEdit = true;
    addressModal.visible = true;
};

const deleteAddress = async (addressId) => {
    try {
        message.success('Xóa địa chỉ thành công');
        // Tải lại danh sách địa chỉ
        addresses.value = addresses.value.filter(item => item.id !== addressId);
    } catch (error) {
        message.error('Có lỗi xảy ra khi xóa địa chỉ');
        console.error(error);
    }
};

const saveAddress = async () => {
    try {
        const addressData = { ...addressModal.data };

        // Tìm tên tỉnh/huyện/xã từ code
        const province = provinces.value.find(p => p.code === addressData.provinceCode);
        const district = districts.value.find(d => d.code === addressData.districtCode);
        const ward = wards.value.find(w => w.code === addressData.wardCode);

        addressData.province = province ? province.name : '';
        addressData.district = district ? district.name : '';
        addressData.ward = ward ? ward.name : '';

        // Giả lập lưu địa chỉ
        addressData.id = Date.now();
        addresses.value.push(addressData);
        message.success('Thêm địa chỉ thành công');

        addressModal.visible = false;
    } catch (error) {
        message.error('Có lỗi xảy ra khi lưu địa chỉ');
        console.error(error);
    }
};

// Load tỉnh/thành phố
const loadProvinces = async () => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        provinces.value = await response.json();
    } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành:', error);
    }
};

// Xử lý khi chọn tỉnh/thành phố
const handleProvinceChange = async (value) => {
    addressModal.data.districtCode = '';
    addressModal.data.wardCode = '';
    districts.value = [];
    wards.value = [];

    try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${value}?depth=2`);
        const data = await response.json();
        districts.value = data.districts;
    } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
    }
};

// Xử lý khi chọn quận/huyện
const handleDistrictChange = async (value) => {
    addressModal.data.wardCode = '';
    wards.value = [];

    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${value}?depth=2`);
        const data = await response.json();
        wards.value = data.wards;
    } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
    }
};

// Khởi tạo dữ liệu
onMounted(async () => {
    await loadProvinces();

    // Đọc tham số tab từ URL
    if (route.query.tab) {
        selectedMenu.value = [route.query.tab];
    }
});

// Thêm đoạn này để cập nhật khi route thay đổi
watch(() => route.query.tab, (newTab) => {
    if (newTab) {
        selectedMenu.value = [newTab];
    }
});
</script>

<style scoped>
.customer-profile {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

.profile-header {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    background: #fff;
}

.profile-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
}

@media (min-width: 768px) {
    .profile-content {
        flex-direction: row;
        padding-left: 30px;
    }
}

.profile-avatar {
    position: relative;
    margin-bottom: 20px;
}

@media (min-width: 768px) {
    .profile-avatar {
        margin-right: 30px;
        margin-bottom: 0;
    }
}

.custom-avatar {
    border: 4px solid #ffebee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #f0f2f5;
}

.upload-avatar-btn {
    position: absolute;
    right: 0;
    bottom: 5px;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: #e53935;
}

.profile-info {
    flex: 1;
    width: 100%;
}

.profile-info-header {
    margin-bottom: 10px;
}

.profile-info h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.user-email,
.user-member-since {
    margin: 5px 0;
    display: flex;
    align-items: center;
    color: #666;
}

.user-email .anticon,
.user-member-since .anticon {
    margin-right: 8px;
    color: #e57373;
}

.user-stats {
    display: flex;
    margin-top: 20px;
    padding: 15px;
    background-color: #ffebee;
    border-radius: 8px;
}

.stat-item {
    flex: 1;
    text-align: center;
}

.stat-item .anticon {
    font-size: 20px;
    color: #e53935;
}

.stat-item span {
    display: block;
    font-size: 18px;
    font-weight: 600;
    margin: 5px 0;
}

.stat-item p {
    margin: 0;
    font-size: 12px;
    color: #999;
}

.stat-divider {
    width: 1px;
    background-color: #e8e8e8;
    margin: 0 15px;
}

.mt-4 {
    margin-top: 24px;
}

.mt-5 {
    margin-top: 30px;
}

/* Overrides for Ant Design components */
:deep(.ant-btn-primary) {
    background-color: #e53935 !important;
    border-color: #e53935 !important;
}

:deep(.ant-btn-primary:hover) {
    background-color: #c62828 !important;
    border-color: #c62828 !important;
}

:deep(.ant-btn-link) {
    color: #e53935 !important;
}

:deep(.ant-btn-link:hover) {
    color: #c62828 !important;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: #e53935 !important;
    border-color: #e53935 !important;
}

:deep(.ant-radio-checked .ant-radio-inner) {
    border-color: #e53935 !important;
}

:deep(.ant-radio-inner::after) {
    background-color: #e53935 !important;
}

:deep(.ant-tag-blue) {
    color: #e53935 !important;
    background: #ffebee !important;
    border-color: #ffcdd2 !important;
}

:deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-color: #e53935 !important;
    box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.2) !important;
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
    background-color: #ffebee !important;
    color: #e53935 !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
    border-color: #e53935 !important;
    box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.2) !important;
}

:deep(.ant-menu-item-selected) {
    color: #e53935 !important;
    background-color: #ffebee !important;
}

:deep(.ant-menu-item:hover) {
    color: #e53935 !important;
}

:deep(.ant-menu-item-selected::after) {
    border-right-color: #e53935 !important;
}

:deep(.ant-tabs-ink-bar) {
    background-color: #e53935 !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #e53935 !important;
}

:deep(.ant-tabs-tab:hover) {
    color: #e53935 !important;
}

:deep(.ant-pagination-item-active) {
    border-color: #e53935 !important;
}

:deep(.ant-pagination-item-active a) {
    color: #e53935 !important;
}
</style>