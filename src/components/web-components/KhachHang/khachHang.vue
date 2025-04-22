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
                                    <span>{{ vouchers.length || 0 }}</span>
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
                            <a-button type="primary" :loading="isUpdating" @click="updateProfile"
                                class="update-profile-btn" size="large">
                                Cập nhật thông tin
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-card>

                <!-- Đơn hàng -->
                <!-- <a-card v-if="selectedMenu.includes('orders')" title="Đơn hàng của tôi">
                    <a-tabs v-model:activeKey="orderTabActive">
                        <a-tab-pane key="all" tab="Tất cả">
                            <a-empty v-if="orders.length === 0" description="Bạn chưa có đơn hàng nào" />
                            <a-list v-else :data-source="orders" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-card style="width: 100%">
                                            <a-row>
                                                <a-col :span="16">
                                                    <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                                    <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                                    <p>Trạng thái:
                                                        <a-tag :color="getOrderStatusColor(item.trang_thai)">
                                                            {{ item.trang_thai }}
                                                        </a-tag>
                                                    </p>
                                                </a-col>
                                                <a-col :span="8" style="text-align: right">
                                                    <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                                    <a-button type="primary" size="small"
                                                        @click="viewOrderDetail(item.id_hoa_don)">Chi tiết</a-button>
                                                </a-col>
                                            </a-row>
                                        </a-card>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-tab-pane>
                        <a-tab-pane key="pending" tab="Chờ xác nhận">
                            <a-empty v-if="!orders.filter(o => o.trang_thai === 'Chờ xác nhận').length" description="Không có đơn hàng nào đang chờ xác nhận" />
                            <a-list v-else :data-source="orders.filter(o => o.trang_thai === 'Chờ xác nhận')" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-card style="width: 100%">
                                            <a-row>
                                                <a-col :span="16">
                                                    <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                                    <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                                    <p>Trạng thái:
                                                        <a-tag color="orange">{{ item.trang_thai }}</a-tag>
                                                    </p>
                                                </a-col>
                                                <a-col :span="8" style="text-align: right">
                                                    <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                                    <div style="display: flex; gap: 8px; justify-content: flex-end">
                                                        <a-button type="primary" size="small"
                                                            @click="viewOrderDetail(item.id_hoa_don)">Chi tiết</a-button>
                                                        <a-button type="danger" size="small"
                                                            @click="cancelOrder(item.id_hoa_don)">Hủy đơn</a-button>
                                                    </div>
                                                </a-col>
                                            </a-row>
                                        </a-card>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-tab-pane>
                        <a-tab-pane key="shipping" tab="Đang giao">
                            <a-empty v-if="!orders.filter(o => o.trang_thai === 'Đang giao').length" description="Không có đơn hàng nào đang giao" />
                            <a-list v-else :data-source="orders.filter(o => o.trang_thai === 'Đang giao')" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-card style="width: 100%">
                                            <a-row>
                                                <a-col :span="16">
                                                    <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                                    <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                                    <p>Trạng thái:
                                                        <a-tag color="blue">{{ item.trang_thai }}</a-tag>
                                                    </p>
                                                </a-col>
                                                <a-col :span="8" style="text-align: right">
                                                    <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                                    <a-button type="primary" size="small"
                                                        @click="viewOrderDetail(item.id_hoa_don)">Chi tiết</a-button>
                                                </a-col>
                                            </a-row>
                                        </a-card>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-tab-pane>
                        <a-tab-pane key="completed" tab="Đã giao">
                            <a-empty v-if="!orders.filter(o => o.trang_thai === 'Đã giao').length" description="Không có đơn hàng nào đã giao" />
                            <a-list v-else :data-source="orders.filter(o => o.trang_thai === 'Đã giao')" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-card style="width: 100%">
                                            <a-row>
                                                <a-col :span="16">
                                                    <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                                    <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                                    <p>Trạng thái:
                                                        <a-tag color="green">{{ item.trang_thai }}</a-tag>
                                                    </p>
                                                </a-col>
                                                <a-col :span="8" style="text-align: right">
                                                    <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                                    <a-button type="primary" size="small"
                                                        @click="viewOrderDetail(item.id_hoa_don)">Chi tiết</a-button>
                                                </a-col>
                                            </a-row>
                                        </a-card>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-tab-pane>
                        <a-tab-pane key="cancelled" tab="Đã hủy">
                            <a-empty v-if="!orders.filter(o => o.trang_thai === 'Đã hủy').length" description="Không có đơn hàng nào đã hủy" />
                            <a-list v-else :data-source="orders.filter(o => o.trang_thai === 'Đã hủy')" :pagination="{ pageSize: 5 }">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-card style="width: 100%">
                                            <a-row>
                                                <a-col :span="16">
                                                    <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                                    <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                                    <p>Trạng thái:
                                                        <a-tag color="red">{{ item.trang_thai }}</a-tag>
                                                    </p>
                                                </a-col>
                                                <a-col :span="8" style="text-align: right">
                                                    <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                                    <a-button type="primary" size="small"
                                                        @click="viewOrderDetail(item.id_hoa_don)">Chi tiết</a-button>
                                                </a-col>
                                            </a-row>
                                        </a-card>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-tab-pane>
                    </a-tabs>

                    <a-list v-if="orders.length > 0" :data-source="orders" :pagination="false">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-card style="width: 100%">
                                    <a-row>
                                        <a-col :span="16">
                                            <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                            <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                            <p>Trạng thái: <a-tag :color="getOrderStatusColor(item.trang_thai)">{{
                                                item.trang_thai }}</a-tag></p>
                                        </a-col>
                                        <a-col :span="8" style="text-align: right">
                                            <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                            <a-button type="primary" size="small"
                                                @click="viewOrderDetail(item.ma_hoa_don)">Chi tiết</a-button>
                                        </a-col>
                                    </a-row>
                                </a-card>
                            </a-list-item>
                        </template>
                    </a-list>

                    <a-pagination :current="pagination.currentPage + 1" :pageSize="pagination.pageSize"
                        :total="pagination.totalItems" @change="handlePageChange"
                        style="margin-top: 16px; text-align: center" />
                </a-card> -->

                <!-- Đơn hàng -->
                <a-card v-if="selectedMenu.includes('orders')" title="Đơn hàng của tôi">
                    <a-tabs v-model:activeKey="orderTabActive" @change="handleTabChange">
                        <a-tab-pane key="all" tab="Tất cả"></a-tab-pane>
                        <a-tab-pane key="Chờ xác nhận" tab="Chờ xác nhận"></a-tab-pane>
                        <a-tab-pane key="Đang giao" tab="Đang giao"></a-tab-pane>
                        <a-tab-pane key="Hoàn thành" tab="Hoàn thành"></a-tab-pane>
                        <a-tab-pane key="Đã hủy" tab="Đã hủy"></a-tab-pane>
                    </a-tabs>

                    <a-list v-if="orders.length > 0" :data-source="orders" :pagination="false">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-card style="width: 100%">
                                    <a-row>
                                        <a-col :span="16">
                                            <p>Mã đơn: {{ item.ma_hoa_don }}</p>
                                            <p>Ngày đặt: {{ formatDate(item.ngay_tao) }}</p>
                                            <p>Trạng thái: <a-tag :color="getOrderStatusColor(item.trang_thai)">{{
                                                item.trang_thai }}</a-tag></p>
                                        </a-col>
                                        <a-col :span="8" style="text-align: right">
                                            <p>Tổng tiền: {{ formatCurrency(item.tong_tien_sau_giam) }}</p>
                                            <a-button type="primary" size="small"
                                                @click="viewOrderDetail(item.ma_hoa_don)">Chi tiết</a-button>
                                        </a-col>
                                    </a-row>
                                </a-card>
                            </a-list-item>
                        </template>
                    </a-list>

                    <a-pagination :current="pagination.currentPage + 1" :pageSize="pagination.pageSize"
                        :total="pagination.totalItems" @change="handlePageChange"
                        style="margin-top: 16px; text-align: center" />
                </a-card>

                <!-- Địa chỉ -->
                <a-card v-if="selectedMenu.includes('address')" title="Sổ địa chỉ">
                    <a-button type="primary" style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px"
                        @click="showAddAddressModal">
                        <plus-outlined /> <span>Thêm địa chỉ mới</span>
                    </a-button>

                    <a-list :data-source="addresses" :pagination="{ pageSize: 3 }">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-card style="width: 100%">
                                    <div style="display: flex; justify-content: space-between">
                                        <div>
                                            <div style="display: flex; align-items: center; gap: 8px">
                                                <strong>{{ store.userDetails.tenKhachHang }}</strong>
                                                <a-tag v-if="item.isDefault" color="blue">Mặc định</a-tag>
                                            </div>
                                            <p style="margin: 8px 0">{{ store.userDetails.soDienThoai }}</p>
                                            <p>{{ item.address }}, {{ item.ward }}, {{ item.district }}, {{
                                                item.province }}</p>
                                        </div>
                                        <div>
                                            <a-button type="link" @click="editAddress(item)">Sửa</a-button>
                                            <a-popconfirm v-if="addresses.length > 1"
                                                title="Bạn có chắc muốn xóa địa chỉ này không?" ok-text="Có"
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
                    <a-checkbox v-model:checked="addressModal.data.isDefault"
                        :disabled="(addressModal.isEdit && addressModal.data.isDefault && addresses.length === 1)">
                        Đặt làm địa chỉ mặc định
                    </a-checkbox>

                </div>

                <div class="text-end">
                    <a-button @click="addressModal.visible = false" class="me-2">Cancel</a-button>
                    <a-button type="primary" @click="saveAddress">OK</a-button>
                </div>
            </div>
        </a-modal>

        <!-- Modal chi tiết đơn hàng -->
        <a-modal v-model:visible="orderDetailModal.visible" :title="`Chi tiết đơn hàng: ${orderDetailModal.maHoaDon}`" :footer="null" :width="800"
            class="order-detail-modal">
            <a-spin :spinning="orderDetailModal.loading">
                <div v-if="orderDetailModal.data">
                    <!-- Thông tin chung -->
                    <a-row class="section-container">
                        <a-col :span="24">
                            <h3 class="section-title">Thông tin đơn hàng</h3>
                            <a-descriptions bordered :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
                                <a-descriptions-item label="Mã đơn hàng">
                                    {{ orderDetailModal.data.ma_hoa_don }}
                                </a-descriptions-item>
                                <a-descriptions-item label="Ngày đặt">
                                    {{ formatDate(orderDetailModal.data.ngay_tao) }}
                                </a-descriptions-item>
                                <a-descriptions-item label="Trạng thái">
                                    <a-tag :color="getOrderStatusColor(orderDetailModal.data.trang_thai)">
                                        {{ orderDetailModal.data.trang_thai }}
                                    </a-tag>
                                </a-descriptions-item>
                                <a-descriptions-item label="Phương thức thanh toán">
                                    {{ orderDetailModal.data.phuong_thuc_thanh_toan || 'Tiền mặt' }}
                                </a-descriptions-item>
                            </a-descriptions>
                        </a-col>
                    </a-row>

                    <!-- Thông tin người nhận -->
                    <a-row class="section-container">
                        <a-col :span="24">
                            <h3 class="section-title">Thông tin người nhận</h3>
                            <a-descriptions bordered :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
                                <a-descriptions-item label="Tên người nhận">
                                    {{ orderDetailModal.data.ten_nguoi_nhan }}
                                </a-descriptions-item>
                                <a-descriptions-item label="Số điện thoại">
                                    {{ orderDetailModal.data.so_dien_thoai }}
                                </a-descriptions-item>
                                <a-descriptions-item label="Địa chỉ" :span="2">
                                    {{ orderDetailModal.data.dia_chi }}
                                </a-descriptions-item>
                                <a-descriptions-item label="Ghi chú" :span="2">
                                    {{ orderDetailModal.data.ghi_chu || 'Không có ghi chú' }}
                                </a-descriptions-item>
                            </a-descriptions>
                        </a-col>
                    </a-row>

                    <!-- Danh sách sản phẩm -->
                    <a-row class="section-container">
                        <a-col :span="24">
                            <h3 class="section-title">Sản phẩm đã mua</h3>
                            <a-table
                                :columns="orderProductColumns"
                                :data-source="orderDetailModal.products"
                                :pagination="false"
                                :rowKey="record => record.id_chi_tiet_san_pham"
                                size="small">
                                <template #bodyCell="{ column, text, record }">
                                    <template v-if="column.dataIndex === 'hinh_anh'">
                                        <img :src="record.hinh_anh" :alt="record.ten_san_pham" style="width: 50px; height: 50px; object-fit: cover;" />
                                    </template>
                                    <template v-else-if="column.dataIndex === 'ten_san_pham'">
                                        <div>
                                            <div>{{ record.ten_san_pham }}</div>
                                            <div class="product-attrs">
                                                <span v-if="record.mau_sac">Màu: {{ record.mau_sac }}</span>
                                                <span v-if="record.kich_thuoc">Size: {{ record.kich_thuoc }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else-if="column.dataIndex === 'gia'">
                                        {{ formatCurrency(record.gia) }}
                                    </template>
                                </template>
                            </a-table>
                        </a-col>
                    </a-row>

                    <!-- Thông tin thanh toán -->
                    <a-row class="section-container">
                        <a-col :span="24">
                            <h3 class="section-title">Thanh toán</h3>
                            <div class="payment-summary">
                                <div class="summary-item">
                                    <span>Tổng tiền sản phẩm:</span>
                                    <span>{{ formatCurrency(orderDetailModal.data.tong_tien || 0) }}</span>
                                </div>
                                <div class="summary-item">
                                    <span>Phí vận chuyển:</span>
                                    <span>{{ formatCurrency(orderDetailModal.data.phi_van_chuyen || 0) }}</span>
                                </div>
                                <div class="summary-item" v-if="orderDetailModal.data.giam_gia > 0">
                                    <span>Giảm giá:</span>
                                    <span class="discount-value">- {{ formatCurrency(orderDetailModal.data.giam_gia || 0) }}</span>
                                </div>
                                <div class="summary-item total-row">
                                    <span>Tổng thanh toán:</span>
                                    <span class="total-value">{{ formatCurrency(orderDetailModal.data.tong_tien_sau_giam || 0) }}</span>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
                <div v-else-if="!orderDetailModal.loading" class="empty-data">
                    <a-empty description="Không có thông tin đơn hàng" />
                </div>
            </a-spin>
            <div class="modal-footer">
                <a-button @click="orderDetailModal.visible = false">Đóng</a-button>
                <a-button
                    v-if="orderDetailModal.data && orderDetailModal.data.trang_thai === 'Chờ xác nhận'"
                    type="danger"
                    @click="cancelOrder(orderDetailModal.data.id_hoa_don)">
                    Hủy đơn hàng
                </a-button>
                <a-button
                    v-if="orderDetailModal.data && orderDetailModal.data.trang_thai === 'Đã giao'"
                    type="primary">
                    Mua lại
                </a-button>
            </div>
        </a-modal>
    </div>
</template>
<script setup>

import { ref, reactive, onMounted, watch, h } from 'vue';
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
    PlusOutlined,
    CheckCircleFilled
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import axiosInstance from '@/config/axiosConfig';
import { useGbStore } from '@/stores/gbStore';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { khachHangService } from '@/services/khachHangService';
import { hoaDonService } from '@/services/hoaDonService';
import OrderList from '@/components/OrderList.vue';
import { toast } from 'vue3-toastify';

const isLoading = ref(false);

// Add a global center message for consistent UX
if (!window.centerMessage) {
    window.centerMessage = {
        success: (content, duration = 3) => {
            message.success({
                content,
                duration,
                style: { marginTop: '20vh' }
            });
        },
        error: (content, duration = 3) => {
            message.error({
                content,
                duration,
                style: { marginTop: '20vh' }
            });
        },
        warning: (content, duration = 3) => {
            message.warning({
                content,
                duration,
                style: { marginTop: '20vh' }
            });
        },
        info: (content, duration = 3) => {
            message.info({
                content,
                duration,
                style: { marginTop: '20vh' }
            });
        },
        loading: (content, duration = 0) => {
            const hide = message.loading({
                content,
                duration,
                style: { marginTop: '20vh' }
            });
            return hide;
        }
    };
}

// Router y store
const router = useRouter();
const store = useGbStore();

// State cho menu
const selectedMenu = ref(['info']);
const orderTabActive = ref('all');

// Thông tin người dùng mặc định
const defaultAvatar = 'https://joeschmoe.io/api/v1/random';
const userInfo = reactive({
    name: '',
    email: '',
    phone: '',
    birthday: null,
    avatar: '',
    createdAt: new Date()
});

// Thêm state loading cho nút cập nhật
const isUpdating = ref(false);

// Danh sách đơn hàng và địa chỉ
const orders = ref([]);
const vouchers = ref([]);
const addresses = ref([]);

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

// State cho modal chi tiết đơn hàng
const orderDetailModal = reactive({
    visible: false,
    loading: false,
    maHoaDon: '',
    data: null,
    products: []
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
        'Hoàn thành': 'green',
        'Đã hủy': 'red'
    };
    return colors[status] || 'default';
};

// Cấu hình cột cho bảng sản phẩm trong đơn hàng
const orderProductColumns = [
    {
        title: 'Hình ảnh',
        dataIndex: 'hinh_anh',
        width: 80,
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'ten_san_pham',
        ellipsis: true,
    },
    {
        title: 'Số lượng',
        dataIndex: 'so_luong',
        width: 100,
        align: 'center',
    },
    {
        title: 'Đơn giá',
        dataIndex: 'gia',
        width: 150,
        align: 'right',
    },
    {
        title: 'Thành tiền',
        width: 150,
        align: 'right',
        customRender: ({ record }) => formatCurrency(record.gia * record.so_luong),
    },
];

// Xử lý cập nhật thông tin
const updateProfile = async (event) => {
    // Ngăn chặn hành vi mặc định nếu có
    if (event) event.preventDefault();

    // Nếu đang cập nhật, không xử lý thêm lần nhấn nữa
    if (isUpdating.value) return;

    try {
        // Validate dữ liệu
        if (!userInfo.name) {
            return window.centerMessage.error('Vui lòng nhập họ tên');
        }
        if (!userInfo.phone) {
            return window.centerMessage.error('Vui lòng nhập số điện thoại');
        }
        if (!userInfo.birthday) {
            return window.centerMessage.error('Vui lòng chọn ngày sinh');
        }

        // Hiển thị hộp thoại xác nhận trước khi cập nhật
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            content: 'Bạn có chắc chắn muốn cập nhật thông tin cá nhân?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            centered: true, // Đảm bảo modal hiển thị ở giữa màn hình
            wrapClassName: 'modal-center-screen', // Thêm class để CSS đặc biệt
            maskClosable: false, // Ngăn việc đóng modal khi bấm ra ngoài
            zIndex: 1500, // Tăng z-index để modal hiển thị trên cùng
            onOk: async () => {
                // Hiển thị trạng thái loading
                const loadingMessage = window.centerMessage.loading('Đang cập nhật thông tin...');
                isUpdating.value = true;

                try {
                    // Chuẩn bị dữ liệu cập nhật
                    const updateData = {
                        idKhachHang: store.userDetails.idKhachHang,
                        maKhachHang: store.userDetails.maKhachHang,
                        tenKhachHang: userInfo.name,
                        gioiTinh: store.userDetails.gioiTinh,
                        soDienThoai: userInfo.phone,
                        ngaySinh: userInfo.birthday.toDate(),
                        email: userInfo.email,
                        trangThai: store.userDetails.trangThai || 'Đang hoạt động',
                        // Giữ nguyên danh sách địa chỉ
                        diaChiList: store.userDetails.diaChiList || []
                    };

                    console.log('Đang gửi yêu cầu cập nhật...', updateData);

                    // Gọi API cập nhật thông tin
                    const result = await store.suaKhachHang(updateData);

                    // Đóng thông báo loading
                    loadingMessage();

                    console.log('Kết quả từ API:', result);

                    if (result) {
                        // Hiển thị thông báo thành công ngay giữa màn hình
                        window.centerMessage.success('Cập nhật thông tin thành công!');

                        // Cập nhật lại thông tin chi tiết người dùng trong store
                        const updatedUserDetails = { ...store.userDetails };
                        updatedUserDetails.tenKhachHang = userInfo.name;
                        updatedUserDetails.soDienThoai = userInfo.phone;
                        updatedUserDetails.ngaySinh = userInfo.birthday.toDate();

                        // Cập nhật lại store
                        store.userDetails = updatedUserDetails;

                        // Lưu vào localStorage/sessionStorage tùy theo trạng thái "Ghi nhớ đăng nhập"
                        if (localStorage.getItem('isLoggedIn') === 'true') {
                            localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
                        } else {
                            sessionStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
                        }
                    } else {
                        window.centerMessage.error('Cập nhật thông tin không thành công!');
                    }
                } catch (error) {
                    console.error('Lỗi khi cập nhật thông tin:', error);
                    window.centerMessage.error('Có lỗi xảy ra khi cập nhật thông tin');
                } finally {
                    // Đảm bảo tắt trạng thái loading sau khi hoàn thành, thành công hay thất bại
                    isUpdating.value = false;
                }
            },
            onCancel() {
                console.log('Hủy cập nhật thông tin');
                window.centerMessage.info('Đã hủy cập nhật thông tin');
                // Không cần đặt isUpdating.value = false ở đây vì chưa bắt đầu cập nhật
            }
        });
    } catch (error) {
        window.centerMessage.error('Có lỗi xảy ra khi chuẩn bị dữ liệu');
        console.error('Lỗi khi chuẩn bị dữ liệu cập nhật:', error);
        isUpdating.value = false; // Đảm bảo tắt trạng thái loading nếu có lỗi
    }
};

// Xử lý đổi mật khẩu
const changePassword = async () => {
    // Validate các trường trước khi hiển thị modal xác nhận
    if (!passwordForm.currentPassword) {
        return message.error('Vui lòng nhập mật khẩu hiện tại');
    }

    if (!passwordForm.newPassword) {
        return message.error('Vui lòng nhập mật khẩu mới');
    }

    if (!passwordForm.confirmPassword) {
        return message.error('Vui lòng xác nhận mật khẩu mới');
    }

    if (passwordForm.newPassword.length < 6) {
        return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    if (passwordForm.newPassword.length > 20) {
        return toast.error('Mật khẩu mới không được vượt quá 20 ký tự');
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        return message.error('Mật khẩu xác nhận không khớp');
    }

    // Kiểm tra mật khẩu mới có trùng với mật khẩu cũ không
    if (passwordForm.currentPassword === passwordForm.newPassword) {
        return message.error({
            content: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
            duration: 3,
            style: {
                marginTop: '20vh', // Hiển thị ở giữa màn hình
            }
        });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (passwordForm.newPassword.length < 6 || passwordForm.newPassword.length > 20) {
        return message.error('Mật khẩu mới phải từ 6 đến 20 ký tự');
    }

    // Hiển thị modal xác nhận trước khi thay đổi mật khẩu
    Modal.confirm({
        title: 'Xác nhận đổi mật khẩu',
        content: 'Bạn có chắc chắn muốn đổi mật khẩu không?',
        okText: 'Đổi mật khẩu',
        cancelText: 'Hủy',
        centered: true, // Đảm bảo modal hiển thị ở giữa màn hình
        wrapClassName: 'modal-center-screen', // Thêm class để CSS đặc biệt
        maskClosable: false, // Ngăn việc đóng modal khi bấm ra ngoài
        zIndex: 1500, // Tăng z-index để modal hiển thị trên cùng
        onOk: async () => {
            try {
                // Hiển thị trạng thái đang xử lý
                const loadingMessage = message.loading('Đang xử lý...', 0);

                // Gọi API đổi mật khẩu
                const result = await khachHangService.changePassword(
                    store.userDetails.idKhachHang,
                    {
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword
                    }
                );

                // Đóng thông báo loading
                loadingMessage();

                // Kiểm tra kết quả từ API
                if (result.error) {
                    // Hiển thị thông báo lỗi chính xác từ backend
                    message.error({
                        content: result.message || 'Đổi mật khẩu thất bại',
                        duration: 3,
                        style: {
                            marginTop: '20vh', // Hiển thị ở giữa màn hình
                        }
                    });
                    console.log('Lỗi từ backend:', result.message);
                    return;
                }

                // Hiển thị thông báo thành công nổi bật hơn
                message.success({
                    content: 'Đổi mật khẩu thành công!',
                    duration: 3, // Hiển thị trong 3 giây
                    style: {
                        marginTop: '20vh', // Hiển thị ở giữa màn hình
                    },
                    icon: () => h(CheckCircleFilled, { style: { color: '#52c41a' } })
                });

                // Reset form
                passwordForm.currentPassword = '';
                passwordForm.newPassword = '';
                passwordForm.confirmPassword = '';
            } catch (error) {
                console.error('Lỗi khi đổi mật khẩu:', error);

                // Hiển thị thông báo lỗi chi tiết từ backend
                let errorMessage = 'Có lỗi xảy ra khi đổi mật khẩu';
                if (error.response && error.response.data) {
                    errorMessage = error.response.data.message || errorMessage;
                }

                message.error({
                    content: errorMessage,
                    duration: 3,
                    style: {
                        marginTop: '20vh', // Hiển thị ở giữa màn hình
                    }
                });
            }
        }
    });
};

// Xem chi tiết đơn hàng
const viewOrderDetail = async (orderId) => {
    try {
        orderDetailModal.loading = true;
        orderDetailModal.visible = true;

        // Sử dụng hoaDonService.getCTHD thay vì gọi API trực tiếp
        const orderData = await hoaDonService.getCTHD(orderId);

        if (orderData.error) {
            message.error('Không thể lấy thông tin chi tiết đơn hàng');
            orderDetailModal.visible = false;
            return;
        }

        orderDetailModal.maHoaDon = orderData.ma_hoa_don;
        orderDetailModal.data = orderData;
        orderDetailModal.products = orderData.san_pham || [];
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        message.error('Không thể lấy thông tin chi tiết đơn hàng');
        orderDetailModal.visible = false;
    } finally {
        orderDetailModal.loading = false;
    }
};

// Hủy đơn hàng
const cancelOrder = async (orderId) => {
    try {
        // Hiển thị modal xác nhận trước khi hủy
        Modal.confirm({
            title: 'Xác nhận hủy đơn',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                // Hiển thị loading khi đang xử lý
                const loadingMessage = message.loading('Đang xử lý...', 0);

                try {
                    // Gọi API để hủy đơn hàng
                    const result = await axiosInstance.put(`/qlhd/huy-don/${orderId}`);

                    // Đóng loading message
                    loadingMessage();

                    if (result.data.success) {
                        // Hiển thị thông báo thành công
                        message.success('Đơn hàng đã được hủy thành công');

                        // Đóng modal chi tiết đơn hàng nếu đang mở
                        orderDetailModal.visible = false;

                        // Cập nhật lại danh sách đơn hàng
                        await fetchOrders();
                    } else {
                        message.error(result.data.message || 'Không thể hủy đơn hàng');
                    }
                } catch (error) {
                    loadingMessage(); // Đóng loading message nếu có lỗi
                    console.error('Lỗi khi hủy đơn hàng:', error);
                    message.error('Có lỗi xảy ra khi hủy đơn hàng');
                }
            }
        });
    } catch (error) {
        console.error('Lỗi khi xử lý hủy đơn:', error);
        message.error('Có lỗi xảy ra khi xử lý yêu cầu');
    }
};

// Xử lý địa chỉ
const showAddAddressModal = () => {
    // Kiểm tra giới hạn số lượng địa chỉ - áp dụng kiểm tra nhanh
    if (addresses.value.length >= 5) {
        message.warning('Bạn chỉ có thể lưu tối đa 5 địa chỉ!');
        return;
    }

    // Reset modal data với Object.assign để tốc độ nhanh hơn
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

const editAddress = async (address) => {
    try {
        addressModal.isEdit = true;
        // Hiển thị loading khi bắt đầu load dữ liệu
        const loadingMsg = message.loading('Đang tải dữ liệu...', 0);

        // Đặt thông tin cơ bản của địa chỉ
        addressModal.data.id = address.id;
        addressModal.data.address = address.address;
        addressModal.data.isDefault = address.isDefault;

        // Tải danh sách tỉnh/thành phố nếu chưa có
        if (!provinces.value.length) {
            await loadProvinces();
        }

        // Tìm mã của tỉnh/thành phố từ tên
        const province = provinces.value.find(p => p.name === address.province);
        if (province) {
            addressModal.data.provinceCode = province.code;
            // Tải danh sách quận/huyện
            const provinceResponse = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
            const provinceData = await provinceResponse.json();
            districts.value = provinceData.districts || [];

            // Tìm mã của quận/huyện từ tên
            const district = districts.value.find(d => d.name === address.district);
            if (district) {
                addressModal.data.districtCode = district.code;
                // Tải danh sách phường/xã
                const districtResponse = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
                const districtData = await districtResponse.json();
                wards.value = districtData.wards || [];

                // Tìm mã của phường/xã từ tên
                const ward = wards.value.find(w => w.name === address.ward);
                if (ward) {
                    addressModal.data.wardCode = ward.code;
                }
            }
        }

        // Đóng thông báo loading
        loadingMsg();
        // Hiện modal
        addressModal.visible = true;
    } catch (error) {
        message.error('Có lỗi xảy ra khi tải thông tin địa chỉ');
        console.error('Lỗi khi tải thông tin địa chỉ để sửa:', error);
    }
};

const fetchAddresses = async () => {
    if (!store.userDetails?.idKhachHang) return;

    try {
        // Thêm indicator loading nếu việc fetch kéo dài > 300ms
        const loadingIndicator = setTimeout(() => {
            message.loading('Đang tải dữ liệu địa chỉ...', 0);
        }, 300);

        const diaChiList = await khachHangService.fetchDiaChiByKhachHangId(store.userDetails.idKhachHang);

        // Clear loading indicator
        clearTimeout(loadingIndicator);

        // Chuyển đổi dữ liệu nhanh hơn bằng cách dùng cấu trúc tối ưu
        addresses.value = diaChiList.map((diaChi) => ({
            id: diaChi.id_dia_chi_khach_hang || diaChi.idDiaChiKhachHang,
            name: store.userDetails.tenKhachHang,
            phone: store.userDetails.soDienThoai,
            address: diaChi.so_nha || diaChi.soNha || '',
            ward: diaChi.xa_phuong || diaChi.xaPhuong || '',
            district: diaChi.quan_huyen || diaChi.quanHuyen || '',
            province: diaChi.tinh_thanh_pho || diaChi.tinhThanhPho || '',
            isDefault: diaChi.dia_chi_mac_dinh || diaChi.diaChiMacDinh || false
        }));
    } catch (error) {
        console.error('❌ Lỗi khi fetchAddresses:', error);
    }
};

const deleteAddress = async (addressId) => {
    try {
        const result = await khachHangService.deleteDiaChi(addressId);

        if (result.error) {
            message.error(result.message || 'Có lỗi xảy ra khi xóa địa chỉ');
            return;
        }

        message.success('Xóa địa chỉ thành công');

        // Gọi lại API để lấy danh sách mới (có địa chỉ mới được đặt mặc định)
        await fetchAddresses();
    } catch (error) {
        console.error('Lỗi khi xóa địa chỉ:', error);
        message.error('Có lỗi xảy ra khi xóa địa chỉ');
    }
};

const saveAddress = async () => {
    try {
        const addressData = { ...addressModal.data };
        delete addressData.name;
        delete addressData.phone;

        // ✅ Nếu là địa chỉ đầu tiên → auto set là mặc định
        if (!addressModal.isEdit && addresses.value.length === 0) {
            addressData.isDefault = true;
        }

        if (!addressData.address ||
            !addressData.provinceCode || !addressData.districtCode || !addressData.wardCode) {
            return message.error('Vui lòng điền đầy đủ thông tin địa chỉ');
        }


        // Tìm tên tỉnh/huyện/xã từ code
        const province = provinces.value.find(p => p.code === addressData.provinceCode);
        const district = districts.value.find(d => d.code === addressData.districtCode);
        const ward = wards.value.find(w => w.code === addressData.wardCode);

        addressData.province = province ? province.name : '';
        addressData.district = district ? district.name : '';
        addressData.ward = ward ? ward.name : '';

        // Prepare data for API
        const diaChiData = {
            soNha: addressData.address,
            xaPhuong: addressData.ward,
            quanHuyen: addressData.district,
            tinhThanhPho: addressData.province,
            diaChiMacDinh: addressData.isDefault
        };

        // Hiển thị loading message
        const loadingMsg = message.loading('Đang xử lý...', 0);

        let result;
        if (addressModal.isEdit && addressModal.data.id) {
            // Editing existing address
            result = await khachHangService.updateDiaChi(addressModal.data.id, diaChiData);
        } else {
            // Adding new address
            if (!addressModal.isEdit && addresses.value.length === 0) {
                addressModal.data.isDefault = true;
            }
            result = await khachHangService.addDiaChi(store.userDetails.idKhachHang, diaChiData);
        }

        // Đóng loading message
        loadingMsg();

        if (result.error) {
            message.error(result.message || 'Có lỗi xảy ra khi lưu địa chỉ');
            return;
        }

        // Đóng modal
        addressModal.visible = false;

        // Hiển thị thông báo thành công
        message.success(addressModal.isEdit ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ mới thành công');

        // Lấy lại danh sách địa chỉ từ API ngay lập tức
        if (store.userDetails?.idKhachHang) {
            try {
                // Sử dụng hàm lấy địa chỉ theo ID khách hàng
                const diaChiList = await khachHangService.fetchDiaChiByKhachHangId(store.userDetails.idKhachHang);
                console.log('Danh sách địa chỉ mới từ API:', diaChiList);

                if (diaChiList && diaChiList.length > 0) {
                    // Cập nhật danh sách địa chỉ hiển thị
                    addresses.value = diaChiList.map((diaChi) => ({
                        id: diaChi.id_dia_chi_khach_hang || diaChi.idDiaChiKhachHang,
                        name: store.userDetails.tenKhachHang,
                        phone: store.userDetails.soDienThoai,
                        address: diaChi.so_nha || diaChi.soNha || '',
                        ward: diaChi.xa_phuong || diaChi.xaPhuong || '',
                        district: diaChi.quan_huyen || diaChi.quanHuyen || '',
                        province: diaChi.tinh_thanh_pho || diaChi.tinhThanhPho || '',
                        isDefault: diaChi.dia_chi_mac_dinh || diaChi.diaChiMacDinh || false
                    }));

                    console.log('Danh sách địa chỉ đã được cập nhật:', addresses.value);

                    // Cập nhật diaChiList trong userDetails
                    if (store.userDetails) {
                        store.userDetails.diaChiList = diaChiList;

                        // Lưu vào localStorage/sessionStorage
                        if (localStorage.getItem('isLoggedIn') === 'true') {
                            localStorage.setItem('userDetails', JSON.stringify(store.userDetails));
                        } else {
                            sessionStorage.setItem('userDetails', JSON.stringify(store.userDetails));
                        }
                    }
                } else {
                    console.log('Không có địa chỉ nào trong danh sách từ API');
                    addresses.value = [];
                }
            } catch (error) {
                console.error('Lỗi khi lấy lại danh sách địa chỉ:', error);
            }
        }
    } catch (error) {
        console.error('Lỗi khi lưu địa chỉ:', error);
        message.error('Có lỗi xảy ra khi lưu địa chỉ');
    }
};

const setDefaultAddress = async (addressId) => {
    try {
        const result = await khachHangService.updateDiaChi(addressId, { diaChiMacDinh: true });

        if (result.error) {
            message.error(result.message || 'Không thể đặt mặc định');
            return;
        }

        message.success('Đã đặt làm địa chỉ mặc định');

        // Reload lại danh sách địa chỉ
        const diaChiList = await khachHangService.fetchDiaChiByKhachHangId(store.userDetails.idKhachHang);
        addresses.value = diaChiList.map((diaChi) => ({
            id: diaChi.id_dia_chi_khach_hang || diaChi.idDiaChiKhachHang,
            name: store.userDetails.tenKhachHang,
            phone: store.userDetails.soDienThoai,
            address: diaChi.so_nha || diaChi.soNha || '',
            ward: diaChi.xa_phuong || diaChi.xaPhuong || '',
            district: diaChi.quan_huyen || diaChi.quanHuyen || '',
            province: diaChi.tinh_thanh_pho || diaChi.tinhThanhPho || '',
            isDefault: diaChi.dia_chi_mac_dinh || diaChi.diaChiMacDinh || false
        }));
    } catch (error) {
        console.error('Lỗi khi đặt mặc định:', error);
        message.error('Có lỗi xảy ra khi đặt mặc định');
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

// Xử lý đăng xuất
const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        store.logout();
    }
};
const fetchOrders = async (trangThai = null) => {
    try {
        isLoading.value = true;
        // Xây dựng URL API
        const url = trangThai && trangThai !== 'all'
            ? `/api/khach-hang/hd_kh_tt?idKH=${store.userDetails.idKhachHang}&trangThai=${trangThai}&page=${pagination.currentPage}&size=${pagination.pageSize}`
            : `/api/khach-hang/hd_kh?idKH=${store.userDetails.idKhachHang}&page=${pagination.currentPage}&size=${pagination.pageSize}`;

        // Gọi API
        const response = await axiosInstance.get(url);

        // Cập nhật danh sách hóa đơn và thông tin phân trang
        orders.value = response.data.content || [];
        pagination.totalItems = response.data.totalElements;
        pagination.totalPages = response.data.totalPages;

        // toast.success('Tải danh sách hóa đơn thành công!');
    } catch (error) {
        toast.error('Có lỗi xảy ra khi tải danh sách hóa đơn!');
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
const pagination = reactive({
    currentPage: 0,
    pageSize: 3,
    totalItems: 0,
    totalPages: 0,
});
const handleTabChange = (key) => {
    orderTabActive.value = key;
    fetchOrders(key === 'all' ? null : key); // Gọi API với trạng thái tương ứng
};
const handlePageChange = (page) => {
    pagination.currentPage = page - 1; // Ant Design sử dụng 1-based index, API sử dụng 0-based index
    fetchOrders(orderTabActive.value === 'all' ? null : orderTabActive.value); // Gọi lại API với trạng thái hiện tại
};

// Khởi tạo dữ liệu
onMounted(async () => {
    await loadProvinces();
    await fetchOrders();
    console.log('Id khách hàng: ', store.userDetails.idKhachHang);
});
// Cập nhật thông tin từ store khi component được mount
const loadUserInfo = async () => {
    console.log('🔥 Đã gọi loadUserInfo');
    if (store.userDetails) {
        // Khách hàng
        if (store.id_roles === 4) {
            userInfo.name = store.userDetails.tenKhachHang || store.userInfo?.ten_dang_nhap || 'Khách hàng';
            userInfo.email = store.userDetails.email || '';
            userInfo.phone = store.userDetails.soDienThoai || '';
            userInfo.createdAt = store.userDetails.ngayTao || new Date();

            if (store.userDetails.ngaySinh) {
                userInfo.birthday = dayjs(store.userDetails.ngaySinh);
            }

            // Log thông tin khách hàng hiện tại
            console.log('Thông tin khách hàng từ store:', store.userDetails);

            // Lấy ID khách hàng từ store
            const idKhachHang = store.userDetails.idKhachHang;
            console.log('ID khách hàng hiện tại:', idKhachHang);

            if (idKhachHang) {
                try {
                    // Gọi API riêng để lấy địa chỉ thông qua ID khách hàng
                    const diaChiList = await khachHangService.fetchDiaChiByKhachHangId(idKhachHang);
                    console.log('Danh sách địa chỉ từ API:', diaChiList);

                    if (diaChiList && diaChiList.length > 0) {
                        // Chuyển đổi dữ liệu địa chỉ từ API sang cấu trúc frontend
                        addresses.value = diaChiList.map((diaChi) => {
                            return {
                                id: diaChi.id_dia_chi_khach_hang || diaChi.idDiaChiKhachHang,
                                name: store.userDetails.tenKhachHang,
                                phone: store.userDetails.soDienThoai,
                                address: diaChi.so_nha || diaChi.soNha || '',
                                ward: diaChi.xa_phuong || diaChi.xaPhuong || '',
                                district: diaChi.quan_huyen || diaChi.quanHuyen || '',
                                province: diaChi.tinh_thanh_pho || diaChi.tinhThanhPho || '',
                                isDefault: diaChi.dia_chi_mac_dinh || diaChi.diaChiMacDinh || false
                            };
                        });
                        console.log('Địa chỉ đã được chuyển đổi:', addresses.value);
                    } else {
                        console.log('Không có địa chỉ nào trong danh sách từ API');
                        addresses.value = [];
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy và xử lý địa chỉ:', error);
                    addresses.value = [];
                }
                await fetchOrders();
                await fetchVouchers();
            } else {
                console.log('Không có ID khách hàng, không thể lấy địa chỉ');
                addresses.value = [];
            }
        }
    } else {
        // Thông báo cho người dùng nếu chưa đăng nhập và chuyển hướng đến trang đăng nhập
        message.warning('Bạn cần đăng nhập để xem thông tin tài khoản!');
        router.push('/login-register/login');
    }
};

// Theo dõi thay đổi từ selectedMenu
watch(selectedMenu, (newVal) => {
    if (newVal.includes('logout')) {
        handleLogout();
        // Reset về tab info để tránh lỗi khi logout và quay lại
        selectedMenu.value = ['info'];
    }
});
// const fetchOrders = async () => {
//     try {
//         const result = await axiosInstance.get(`/qlhd/khach-hang/${store.userDetails.idKhachHang}`);

//         orders.value = result.data || [];
//     } catch (error) {
//         console.error("❌ Lỗi khi lấy đơn hàng:", error.response?.data || error);
//     }
// };

// const fetchVouchers = async () => {
//     try {
//         const res = await axiosInstance.get(`/admin/quan_ly_voucher/used-by-customer?idKhachHang=${store.userDetails.idKhachHang}`);

//         vouchers.value = res.data || [];
//     } catch (err) {
//         console.error("❌ Lỗi khi lấy voucher:", err);
//     }
// };

// Khởi tạo dữ liệu
onMounted(async () => {
    console.log("⚙️ onMounted chạy");
    // Kiểm tra đăng nhập
    if (!store.isLoggedIn) {
        message.warning('Bạn cần đăng nhập để xem thông tin tài khoản!');
        router.push('/login-register/login');
        return;
    }

    // Kiểm tra nếu không phải khách hàng
    if (store.id_roles !== 4) {
        message.warning('Bạn không có quyền truy cập trang này!');
        if ([1, 2, 3].includes(store.id_roles)) {
            router.push('/admin'); // Chuyển hướng đến trang admin
        } else {
            router.push('/home'); // Chuyển hướng về trang chủ
        }
        return;
    }

    // Tải thông tin người dùng
    await loadUserInfo();

    // Tải danh sách tỉnh/thành phố cho form địa chỉ
    await loadProvinces();
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

.update-profile-btn {
    height: 40px !important;
    padding: 0 24px !important;
    font-size: 16px !important;
    min-width: 180px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    overflow: hidden !important;
}

.update-profile-btn:active {
    transform: scale(0.96) !important;
    opacity: 0.9 !important;
}

.update-profile-btn::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
}

.update-profile-btn:active::after {
    opacity: 1;
    width: 100%;
    height: 100%;
    border-radius: 0;
    transform: scale(0, 0) translate(-50%, -50%);
    transition: transform 0.3s ease, opacity 0.3s ease;
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

/* Styles for order detail modal */
.order-detail-modal :deep(.ant-modal-title) {
    color: #e53935;
    font-weight: bold;
}

.section-container {
    margin-bottom: 20px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #e53935;
    padding-bottom: 5px;
    border-bottom: 1px solid #f5f5f5;
}

.product-attrs {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.product-attrs span {
    margin-right: 12px;
}

.payment-summary {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 4px 0;
}

.summary-item:last-child {
    margin-bottom: 0;
}

.total-row {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #ddd;
    font-weight: bold;
}

.total-value {
    color: #e53935;
    font-size: 18px;
}

.discount-value {
    color: #52c41a;
}

.modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
