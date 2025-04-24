<template>
  <div class="customer-profile">
    <!-- Header profile -->
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card class="profile-header">
          <div class="profile-content">

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
                  <environment-outlined />
                  <span>{{ addresses.length || 0 }}</span>
                  <p>Địa chỉ</p>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <heart-outlined />
                  <span>{{ favoriteProducts || 0 }}</span>
                  <p>Sản phẩm đã yêu thích</p>
                  <a-dropdown v-if="favoriteProducts > 0" :trigger="['click']" placement="bottomRight"
                    overlay-class-name="favorite-products-dropdown">
                    <a-button type="link" class="view-favorites-btn">
                      <span class="favorites-btn-content">
                        Xem sản phẩm <down-outlined />
                      </span>
                    </a-button>
                    <template #overlay>
                      <div class="favorites-dropdown-container">
                        <div class="favorites-header">
                          <heart-outlined />
                          <span>Sản phẩm đã yêu thích</span>
                          <span class="favorites-count">{{ favoriteProducts }}</span>
                        </div>
                        <a-menu class="favorites-dropdown-menu">
                          <a-menu-item v-if="favoritesList.length === 0" disabled>
                            <div class="favorites-loading">
                              <a-spin size="small" />
                              <span>Đang tải danh sách...</span>
                            </div>
                          </a-menu-item>
                          <a-menu-item v-for="item in favoritesList" :key="item.id_chi_tiet_san_pham"
                            @click="goToProductDetail(item)">
                            <div class="favorite-product-item">
                              <div class="favorite-product-image">
                                <img :src="item.hinh_anh" :alt="item.ten_san_pham" />
                              </div>
                              <div class="favorite-product-info">
                                <div class="product-name">{{ item.ten_san_pham }}</div>
                                <div class="product-details">
                                  <span v-if="item.ten_mau_sac">{{ item.ten_mau_sac }}</span>
                                  <span v-if="item.gia_tri && item.ten_mau_sac"> - {{ item.gia_tri }}</span>
                                  <span v-if="item.gia_tri && !item.ten_mau_sac">{{ item.gia_tri }}</span>
                                </div>
                                <div class="product-price">{{ formatCurrency(item.gia_ban) }}</div>
                              </div>
                            </div>
                          </a-menu-item>
                        </a-menu>
                      </div>
                    </template>
                  </a-dropdown>
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
                <a-form-item label="Nhập tên" :validateStatus="nameValidation.status" :help="nameValidation.message">
                  <a-input v-model:value="userInfo.name" placeholder="Nhập tên" @change="validateName" />
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
                <a-form-item label="Số điện thoại" :validateStatus="phoneValidation.status"
                  :help="phoneValidation.message">
                  <a-input v-model:value="userInfo.phone" placeholder="Nhập số điện thoại" @change="validatePhone" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Ngày sinh" :validateStatus="birthdayValidation.status"
                  :help="birthdayValidation.message">
                  <a-date-picker v-model:value="userInfo.birthday" style="width: 100%" format="DD/MM/YYYY"
                    @change="validateBirthday" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" :loading="isUpdating" @click="updateProfile" class="update-profile-btn"
                size="large" :disabled="!isFormValid">
                Cập nhật thông tin
              </a-button>
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
                          <a-button type="primary" size="small" @click="viewOrderDetail(item.id_hoa_don)">Chi
                            tiết</a-button>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="pending" tab="Chờ xác nhận">
              <a-empty v-if="!orders.filter(o => o.trang_thai.trim() === 'Chờ xác nhận').length"
                description="Không có đơn hàng nào đang chờ xác nhận" />
              <a-list v-else :data-source="orders.filter(o => o.trang_thai.trim() === 'Chờ xác nhận')"
                :pagination="{ pageSize: 5 }">
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
                            <a-button type="primary" size="small" @click="viewOrderDetail(item.id_hoa_don)">Chi
                              tiết</a-button>
                            <a-button type="danger" size="small" @click="cancelOrder(item.id_hoa_don)">Hủy
                              đơn</a-button>
                          </div>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="shipping" tab="Đang giao">
              <a-empty v-if="!orders.filter(o => o.trang_thai.trim() === 'Đang giao').length"
                description="Không có đơn hàng nào đang giao" />
              <a-list v-else :data-source="orders.filter(o => o.trang_thai.trim() === 'Đang giao')"
                :pagination="{ pageSize: 5 }">
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
                          <a-button type="primary" size="small" @click="viewOrderDetail(item.id_hoa_don)">Chi
                            tiết</a-button>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="completed" tab="Hoàn thành">
              <a-empty v-if="!orders.filter(o => o.trang_thai.trim() === 'Hoàn thành').length"
                description="Không có đơn hàng nào Hoàn thành" />
              <a-list v-else :data-source="orders.filter(o => o.trang_thai.trim() === 'Hoàn thành')"
                :pagination="{ pageSize: 5 }">
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
                          <a-button type="primary" size="small" @click="viewOrderDetail(item.id_hoa_don)">Chi
                            tiết</a-button>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="cancelled" tab="Đã hủy">
              <a-empty v-if="!orders.filter(o => o.trang_thai.trim() === 'Đã hủy').length"
                description="Không có đơn hàng nào đã hủy" />
              <a-list v-else :data-source="orders.filter(o => o.trang_thai.trim() === 'Đã hủy')"
                :pagination="{ pageSize: 5 }">
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
                          <a-button type="primary" size="small" @click="viewOrderDetail(item.id_hoa_don)">Chi
                            tiết</a-button>
                        </a-col>
                      </a-row>
                    </a-card>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
          </a-tabs>
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
                      <a-popconfirm v-if="addresses.length > 1" title="Bạn có chắc muốn xóa địa chỉ này không?"
                        ok-text="Có" cancel-text="Không" @confirm="deleteAddress(item.id)">
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
              <a-input-password v-model:value="passwordForm.currentPassword" placeholder="Nhập mật khẩu hiện tại" />
            </a-form-item>
            <a-form-item label="Mật khẩu mới" name="newPassword">
              <a-input-password v-model:value="passwordForm.newPassword" placeholder="Nhập mật khẩu mới" />
            </a-form-item>
            <a-form-item label="Xác nhận mật khẩu mới" name="confirmPassword">
              <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="Nhập lại mật khẩu mới" />
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
            <a-select v-model:value="addressModal.data.districtCode" placeholder="Chọn Quận/Huyện" style="width: 100%"
              :disabled="!addressModal.data.provinceCode" @change="handleDistrictChange">
              <a-select-option v-for="district in districts" :key="district.code" :value="district.code">
                {{ district.name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="col-md-4">
            <label>Phường/Xã</label>
            <a-select v-model:value="addressModal.data.wardCode" placeholder="Chọn Phường/Xã" style="width: 100%"
              :disabled="!addressModal.data.districtCode">
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
    <a-modal v-model:visible="orderDetailModal.visible" :title="`Chi tiết đơn hàng: ${orderDetailModal.maHoaDon}`"
      :footer="null" :width="600" class="order-detail-modal" centered>
      <a-spin :spinning="orderDetailModal.loading">
        <div v-if="orderDetailModal.data" class="modal-content">
          <!-- Thông tin chung -->
          <div class="section-container">
            <h3 class="section-title">Thông tin đơn hàng</h3>
            <a-descriptions bordered :column="1" size="small">
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
          </div>

          <!-- Thông tin người nhận -->
          <div class="section-container">
            <h3 class="section-title">Thông tin người nhận</h3>
            <a-descriptions bordered :column="1" size="small">
              <a-descriptions-item label="Tên người nhận">
                {{ orderDetailModal.data.ten_nguoi_nhan }}
              </a-descriptions-item>
              <a-descriptions-item label="Số điện thoại">
                {{ orderDetailModal.data.so_dien_thoai }}
              </a-descriptions-item>
              <a-descriptions-item label="Địa chỉ">
                {{ orderDetailModal.data.dia_chi }}
              </a-descriptions-item>
              <a-descriptions-item label="Ghi chú">
                <a-tooltip :title="orderDetailModal.data.ghi_chu || 'Không có ghi chú'">
                  <span class="truncate">{{ orderDetailModal.data.ghi_chu || 'Không có ghi chú' }}</span>
                </a-tooltip>
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <!-- Danh sách sản phẩm -->
          <div class="section-container">
            <h3 class="section-title">Sản phẩm đã mua</h3>
            <a-table :columns="orderProductColumns" :data-source="orderDetailModal.products" :pagination="false"
              :rowKey="record => record.id_chi_tiet_san_pham" size="small" class="compact-table">
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'hinh_anh'">
                  <img :src="record.hinh_anh" :alt="record.ten_san_pham" class="product-image" />
                </template>
                <template v-else-if="column.dataIndex === 'ten_san_pham'">
                  <div class="product-info">
                    <div class="product-name truncate">{{ record.ten_san_pham }}</div>
                    <div class="product-attrs">
                      <span v-if="record.mau_sac">{{ record.mau_sac }}</span>
                      <span v-if="record.kich_thuoc"> - {{ record.kich_thuoc }}</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'gia'">
                  {{ formatCurrency(record.gia) }}
                </template>
                <template v-else-if="column.dataIndex === 'thanh_tien'">
                  {{ formatCurrency(record.gia * record.so_luong) }}
                </template>
              </template>
            </a-table>
          </div>

          <!-- Thông tin thanh toán -->
          <div class="section-container">
            <h3 class="section-title">Thanh toán</h3>
            <div class="payment-summary">
              <div class="summary-item">
                <span>Tổng tiền sản phẩm</span>
                <span>{{ formatCurrency(calculateProductTotal()) }}</span>
              </div>
              <div class="summary-item">
                <span>Phí vận chuyển</span>
                <span>{{ formatCurrency(orderDetailModal.data.phi_van_chuyen || 0) }}</span>
              </div>
              <div class="summary-item" v-if="orderDetailModal.data.giam_gia > 0">
                <span>Giảm giá</span>
                <span class="discount-value">- {{ formatCurrency(orderDetailModal.data.giam_gia || 0) }}</span>
              </div>
              <div class="summary-item total-row">
                <span>Tổng thanh toán:</span>
                <span class="total-value">{{ formatCurrency(calculateProductTotal() +
                  (orderDetailModal.data.phi_van_chuyen
                    || 0) - (orderDetailModal.data.giam_gia || 0)) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!orderDetailModal.loading" class="empty-data">
          <a-empty description="Không có thông tin đơn hàng" />
        </div>
      </a-spin>
      <div class="modal-footer">
        <a-button @click="orderDetailModal.visible = false" class="btn-close">Đóng</a-button>
        <a-button v-if="orderDetailModal.data && orderDetailModal.data.trang_thai === 'Chờ xác nhận'" type="danger"
          @click="cancelOrder(orderDetailModal.data.id_hoa_don)" class="btn-cancel">
          Hủy đơn hàng
        </a-button>
        <a-button v-if="orderDetailModal.data && orderDetailModal.data.trang_thai === 'Hoàn thành'" type="primary"
          class="btn-reorder">
          Mua lại
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  
  import { ref, reactive, onMounted, watch, h, computed } from 'vue';
  import {
    UserOutlined,
    ShoppingOutlined,
    EnvironmentOutlined,
    LockOutlined,
    LogoutOutlined,
    MailOutlined,
    CalendarOutlined,
    CameraOutlined,
    HeartOutlined,
    PlusOutlined,
    CheckCircleFilled,
    DownOutlined
  } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import axiosInstance from '@/config/axiosConfig';
  import { useGbStore } from '@/stores/gbStore';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { khachHangService } from '@/services/khachHangService';
  import { hoaDonService } from '@/services/hoaDonService';
  import { favoriteService } from '@/services/favoriteService';
  import OrderList from '@/components/OrderList.vue';
  import { toast } from 'vue3-toastify';
  
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
  const favoriteProducts = ref(0);  // Số lượng sản phẩm đã yêu thích
  const favoritesList = ref([]); // Danh sách sản phẩm yêu thích
  
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
      'Đã giao': 'green',
      'Đã hủy': 'red'
    };
    return colors[status] || 'default';
  };
  
  // Cấu hình cột cho bảng sản phẩm trong đơn hàng
  
  const orderProductColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'hinh_anh',
      width: 60,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'ten_san_pham',
    },
    {
      title: 'Số lượng',
      dataIndex: 'so_luong',
      width: 80,
      align: 'center',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'gia',
      width: 100,
      align: 'right',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanh_tien',
      width: 100,
      align: 'right',
      customRender: ({ record }) => formatCurrency(record.gia * record.so_luong),
    },
  ];
  
  // Hàm tính tổng tiền sản phẩm dựa vào sản phẩm
  const calculateProductTotal = () => {
    if (!orderDetailModal.products || orderDetailModal.products.length === 0) return 0;
    return orderDetailModal.products.reduce((total, item) => {
      // Tính dựa trên đơn giá nhân số lượng (thành tiền)
      const itemTotal = Number(item.gia || 0) * Number(item.so_luong || 1);
      return total + itemTotal;
    }, 0);
  };
  
  // Validation states
  const nameValidation = reactive({
    status: '',
    message: ''
  });
  
  const phoneValidation = reactive({
    status: '',
    message: ''
  });
  
  const birthdayValidation = reactive({
    status: '',
    message: ''
  });
  
  // Kiểm tra tính hợp lệ của form
  const isFormValid = computed(() => {
    return nameValidation.status !== 'error' &&
      phoneValidation.status !== 'error' &&
      birthdayValidation.status !== 'error' &&
      userInfo.name &&
      userInfo.phone &&
      userInfo.birthday;
  });
  
  // Validate họ tên - không chứa số và kí tự đặc biệt
  const validateName = () => {
    const specialCharsAndNumbers = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
  
    // Loại bỏ khoảng trắng đầu và cuối
    userInfo.name = userInfo.name.trim();
  
    // Loại bỏ khoảng trắng thừa ở giữa các từ (thay thế nhiều khoảng trắng bằng một khoảng trắng)
    userInfo.name = userInfo.name.replace(/\s+/g, ' ');
      // Kiểm tra độ dài tên
      if (userInfo.name.length > 100) {
      nameValidation.status = 'error';
      nameValidation.message = 'Tên khách hàng không được vượt quá 100 ký tự';
      return false;
    }
    if (userInfo.name.length < 2) {
      nameValidation.status = 'error';
      nameValidation.message = 'Tên khách hàng không được nhỏ hơn 2 ký tự';
      return false;
    }
  
  
    if (!userInfo.name) {
      nameValidation.status = 'error';
      nameValidation.message = 'Vui lòng nhập tên';
      return false;
    }
  
    // Đã bỏ kiểm tra khoảng trắng ở đầu và cuối vì đã có trim()
  
    if (specialCharsAndNumbers.test(userInfo.name)) {
      nameValidation.status = 'error';
      nameValidation.message = 'Tên khách hàng không được chứa số hoặc ký tự đặc biệt';
      return false;
    }
  
    nameValidation.status = 'success';
    nameValidation.message = '';
    return true;
  };
  
  // Validate số điện thoại - chỉ chứa 10 chữ số
  const validatePhone = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const hasLetters = /[a-zA-Z]/;
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  
    // Loại bỏ khoảng trắng đầu và cuối
    userInfo.phone = userInfo.phone.trim();
  
    // Loại bỏ khoảng trắng thừa ở giữa các số
    userInfo.phone = userInfo.phone.replace(/\s+/g, '');
  
    if (!userInfo.phone) {
      phoneValidation.status = 'error';
      phoneValidation.message = 'Vui lòng nhập số điện thoại';
      return false;
    }
  
    if (hasLetters.test(userInfo.phone)) {
      phoneValidation.status = 'error';
      phoneValidation.message = 'Số điện thoại không được chứa chữ cái';
      return false;
    }
  
    if (hasSpecialChars.test(userInfo.phone)) {
      phoneValidation.status = 'error';
      phoneValidation.message = 'Số điện thoại không được chứa ký tự đặc biệt';
      return false;
    }
  
    // Đã bỏ kiểm tra khoảng trắng ở đầu và cuối vì đã có trim()
  
    if (userInfo.phone.length > 10) {
      phoneValidation.status = 'error';
      phoneValidation.message = 'Số điện thoại không được vượt quá 10 chữ số';
      return false;
    }
  
    if (!phoneRegex.test(userInfo.phone)) {
      phoneValidation.status = 'error';
      phoneValidation.message = 'Số điện thoại phải có đúng 10 chữ số';
      return false;
    }
  
    phoneValidation.status = 'success';
    phoneValidation.message = '';
    return true;
  };
  
  // Validate ngày sinh - phải đủ 13 tuổi trở lên
  const validateBirthday = () => {
    if (!userInfo.birthday) {
      birthdayValidation.status = 'error';
      birthdayValidation.message = 'Vui lòng chọn ngày sinh';
      return false;
    }
  
    const birthDate = userInfo.birthday.toDate();
    const today = new Date();
  
    // Tính tuổi
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    // Điều chỉnh tuổi nếu chưa đến sinh nhật trong năm nay
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    if (age < 14) {
      birthdayValidation.status = 'error';
      birthdayValidation.message = 'Bạn phải đủ 14 tuổi trở lên';
      return false;
    }
  
    birthdayValidation.status = 'success';
    birthdayValidation.message = '';
    return true;
  };
  
  // Xử lý cập nhật thông tin
  const updateProfile = async (event) => {
    // Ngăn chặn hành vi mặc định nếu có
    if (event) event.preventDefault();
  
    // Kiểm tra validation trước khi submit
    validateName();
    validatePhone();
    validateBirthday();
  
    // Nếu có lỗi validation, không tiếp tục
    if (!isFormValid.value) {
      window.centerMessage.error('Vui lòng kiểm tra lại thông tin');
      return;
    }
  
    // Nếu đang cập nhật, không xử lý thêm lần nhấn nữa
    if (isUpdating.value) return;
  
    try {
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
              tenKhachHang: userInfo.name.trim(),
              gioiTinh: store.userDetails.gioiTinh,
              soDienThoai: userInfo.phone.trim(),
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
  
            //   // Cập nhật lại thông tin chi tiết người dùng trong store
            //   const updatedUserDetails = { ...store.userDetails };
            //   updatedUserDetails.tenKhachHang = userInfo.name;
            //   updatedUserDetails.soDienThoai = userInfo.phone;
            //   updatedUserDetails.ngaySinh = userInfo.birthday.toDate();
  
            //   // Cập nhật lại store
            //   store.userDetails = updatedUserDetails;
  
            //   // Lưu vào localStorage/sessionStorage tùy theo trạng thái "Ghi nhớ đăng nhập"
            //   if (localStorage.getItem('isLoggedIn') === 'true') {
            //     localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
            //   } else {
            //     sessionStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
            //   }
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
  const isLoading = ref(false);
// Xử lý đổi mật khẩu
const changePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        return toast.error('Vui lòng nhập đầy đủ thông tin');
    }
    if (/\s/.test(passwordForm.newPassword)) {
        return toast.error('Mật khẩu mới không được chứa khoảng trắng');
    }

    if (passwordForm.newPassword.length < 6) {
        return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    if (passwordForm.newPassword.length > 20) {
        return toast.error('Mật khẩu mới không được vượt quá 20 ký tự');
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        return toast.error('Mật khẩu xác nhận không khớp');
    }

    try {
        isLoading.value = true;
        // Gọi API đổi mật khẩu
        const response = await axiosInstance.post('api/khach-hang/change-password', {
            oldPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });

        // Kiểm tra phản hồi từ API
        if (response.data.successMessage) {
            toast.success(response.data.successMessage + 'Vui lòng đăng nhập lại!');

            // Reset form
            passwordForm.currentPassword = '';
            passwordForm.newPassword = '';
            passwordForm.confirmPassword = '';
            localStorage.removeItem('userInfo')
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('id_roles')
            localStorage.removeItem('userDetails')
            localStorage.removeItem('token')
            sessionStorage.removeItem('userInfo')
            sessionStorage.removeItem('isLoggedIn')
            sessionStorage.removeItem('id_roles')
            sessionStorage.removeItem('userDetails')
            sessionStorage.removeItem('token')

            await new Promise(resolve => setTimeout(resolve, 500));
            router.push('/login-register/login');
        } else {
            toast.error(response.data.error || 'Có lỗi xảy ra khi đổi mật khẩu');
        }
    } catch (error) {
        // Xử lý lỗi từ API
        if (error.response?.status === 403) {
            toast.error('Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại!');
            localStorage.removeItem('token');
            router.push('/login-register/login');
        } else if (error.response?.data?.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error('Có lỗi xảy ra khi đổi mật khẩu');
        }
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
  
  // Xem chi tiết đơn hàng
  const viewOrderDetail = async (orderId) => {
    try {
      orderDetailModal.loading = true;
      orderDetailModal.visible = true;
  
      // Tìm mã hóa đơn từ orderId trong danh sách orders
      const order = orders.value.find(o => o.id_hoa_don === orderId);
      if (!order) {
        message.error('Không tìm thấy thông tin đơn hàng');
        orderDetailModal.visible = false;
        orderDetailModal.loading = false;
        return;
      }
  
      // Log thông tin hóa đơn để debug
      console.log('Mã hóa đơn:', order.ma_hoa_don, 'ID hóa đơn:', order.id_hoa_don);
  
      // Khởi tạo thông tin cơ bản từ order
      orderDetailModal.maHoaDon = order.ma_hoa_don;
      orderDetailModal.data = {
        id_hoa_don: order.id_hoa_don,
        ma_hoa_don: order.ma_hoa_don,
        ngay_tao: order.ngay_tao,
        trang_thai: order.trang_thai,
        tong_tien_sau_giam: order.tong_tien_sau_giam,
        phuong_thuc_thanh_toan: order.hinh_thuc_thanh_toan || 'Tiền mặt',
        ten_nguoi_nhan: order.ho_ten || 'Không có thông tin',
        so_dien_thoai: order.sdt_nguoi_nhan || 'Không có thông tin',
        dia_chi: order.dia_chi || 'Không có thông tin',
        ghi_chu: order.ghi_chu || 'Không có thông tin'
      };
      orderDetailModal.products = [];
  
      // Thử lấy phí vận chuyển
      try {
        const shippingFee = await store.getPhiVanChuyen(order.id_hoa_don);
        if (shippingFee && !shippingFee.error) {
          orderDetailModal.data.phi_van_chuyen = shippingFee.phi_van_chuyen || 0;
          console.log("Phí vận chuyển:", orderDetailModal.data.phi_van_chuyen);
        }
      } catch (feeError) {
        console.warn("Không lấy được phí vận chuyển:", feeError);
        orderDetailModal.data.phi_van_chuyen = 0;
      }
  
      // PHƯƠNG PHÁP MỚI: Sử dụng API thay thế trực tiếp thay vì API gốc
      try {
        console.log("Đang gọi API thay thế getOrderProducts");
        const productsData = await hoaDonService.getOrderProducts(order.ma_hoa_don);
  
        if (!productsData.error && productsData.length > 0) {
          // Nếu lấy được danh sách sản phẩm, cập nhật vào modal
          orderDetailModal.products = productsData.map(item => ({
            id_chi_tiet_san_pham: item.id_chi_tiet_san_pham,
            ten_san_pham: item.ten_san_pham,
            hinh_anh: item.hinh_anh,
            so_luong: item.so_luong,
            gia: item.don_gia || item.gia_ban,
            mau_sac: item.ten_mau_sac || item.mau_sac,
            kich_thuoc: item.gia_tri || item.kich_thuoc
          }));
  
          console.log("Đã lấy được thông tin sản phẩm:", orderDetailModal.products);
        } else if (productsData.error) {
          console.error("Lỗi từ API thay thế:", productsData.message);
          message.warning('Không thể tải thông tin sản phẩm trong đơn hàng');
        } else {
          console.warn("API thay thế trả về danh sách trống");
          message.warning('Đơn hàng này không có sản phẩm nào');
        }
      } catch (apiError) {
        console.error("Lỗi khi gọi API lấy sản phẩm:", apiError);
        message.warning('Không thể tải thông tin đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý chi tiết đơn hàng:', error);
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
            const result = await axiosInstance.put(`admin/qlhd/huy-don/${orderId}`);
  
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
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        store.logoutKH();
      }
    });
  };
  
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
        //   await fetchVouchers();
          await fetchFavoriteProducts();
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
  const fetchOrders = async () => {
    try {
      const result = await axiosInstance.get(`admin/qlhd/khach-hang/${store.userDetails.idKhachHang}`);
      orders.value = (result.data || []).map(order => ({
        ...order,
        trang_thai: order.trang_thai.trim().replace(/\s+/g, ' ') // Chuẩn hóa trạng thái
      }));
      console.log('Danh sách đơn hàng sau khi chuẩn hóa:', orders.value);
    } catch (error) {
      console.error("❌ Lỗi khi lấy đơn hàng:", error.response?.data || error);
      orders.value = [];
    }
  };
  
  const fetchVouchers = async () => {
    try {
      const res = await axiosInstance.get(`admin/quan_ly_voucher/used-by-customer?idKhachHang=${store.userDetails.idKhachHang}`);
  
      vouchers.value = res.data || [];
    } catch (err) {
      console.error("❌ Lỗi khi lấy voucher:", err);
    }
  };
  
  const fetchFavoriteProducts = async () => {
    try {
      if (!store.userDetails || !store.userDetails.idKhachHang) return;
  
      // Use the direct count endpoint to get count (this is already working)
      const countResponse = await favoriteService.getCustomerFavoritesCount(store.userDetails.idKhachHang);
  
      if (countResponse.status === 'success') {
        favoriteProducts.value = countResponse.favoritesCount;
        console.log('Số lượng sản phẩm yêu thích:', favoriteProducts.value);
  
        // Only fetch details if there are favorites
        if (favoriteProducts.value > 0) {
          // Try fetching favorite products directly using the existing endpoint
          try {
            const response = await axiosInstance.get(`api/favorites/by-customer?idKhachHang=${store.userDetails.idKhachHang}`);
  
            if (response.data && Array.isArray(response.data)) {
              // Convert the response data into the format needed for the dropdown
              favoritesList.value = response.data.map(item => ({
                id_chi_tiet_san_pham: item.id_chi_tiet_san_pham,
                id_san_pham: item.id_san_pham,
                ten_san_pham: item.ten_san_pham,
                ten_mau_sac: item.ten_mau_sac,
                gia_tri: item.gia_tri,
                gia_ban: item.gia_ban,
                hinh_anh: item.hinh_anh || '/image/logo/logo.png'
              }));
              console.log('Danh sách sản phẩm yêu thích:', favoritesList.value);
            } else {
              console.error('Format dữ liệu không đúng:', response.data);
              favoritesList.value = [];
            }
          } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm yêu thích:", error);
            favoritesList.value = [];
  
            // Fallback to manual fetching if the by-customer endpoint fails
            await fetchFavoriteProductsManually();
          }
        }
      } else {
        favoriteProducts.value = 0;
        favoritesList.value = [];
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy số lượng sản phẩm yêu thích:", error);
      favoriteProducts.value = 0;
      favoritesList.value = [];
    }
  };
  
  // Fallback method to manually fetch favorite products if the endpoint isn't working
  const fetchFavoriteProductsManually = async () => {
    try {
      // Get all products from the main product list
      const allProducts = await store.getAllSanPhamList();
      if (!allProducts || allProducts.length === 0) {
        console.log('Không có sản phẩm nào trong cửa hàng');
        return;
      }
  
      // Filter out products that are favorited by this customer
      // This is a temporary solution until the backend endpoint is fixed
      const favoritedProducts = [];
  
      for (const product of allProducts) {
        try {
          const result = await favoriteService.checkFavoriteStatus(
            store.userDetails.idKhachHang,
            product.id_chi_tiet_san_pham
          );
  
          if (result.isFavorite) {
            favoritedProducts.push({
              id_chi_tiet_san_pham: product.id_chi_tiet_san_pham,
              id_san_pham: product.id_san_pham,
              ten_san_pham: product.ten_san_pham || product.ten,
              ten_mau_sac: product.ten_mau_sac || product.mau_sac,
              gia_tri: product.gia_tri || product.kich_thuoc,
              gia_ban: product.gia_ban,
              hinh_anh: product.hinh_anh || '/image/logo/logo.png'
            });
          }
        } catch (error) {
          console.error(`Lỗi khi kiểm tra sản phẩm ${product.id_chi_tiet_san_pham}:`, error);
        }
      }
  
      favoritesList.value = favoritedProducts;
      console.log('Danh sách sản phẩm yêu thích (fallback):', favoritesList.value);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm thủ công:', error);
    }
  };
  
  const goToProductDetail = (product) => {
    router.push(`/sanphamdetail/${product.id_chi_tiet_san_pham}`);
  };
  
  const viewAllFavorites = () => {
    router.push('/favorites');
  };
  
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
  
    // Thêm validate ban đầu sau khi load dữ liệu
    if (userInfo.name) validateName();
    if (userInfo.phone) validatePhone();
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
  .order-detail-modal {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .order-detail-modal :deep(.ant-modal) {
    max-width: 600px;
    width: 100% !important;
  }
  
  .order-detail-modal :deep(.ant-modal-content) {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 16px;
  }
  
  .order-detail-modal :deep(.ant-modal-title) {
    color: #e53935;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .modal-content {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 8px;
  }
  
  /* Scrollbar styling */
  .modal-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .modal-content::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }
  
  .modal-content::-webkit-scrollbar-thumb {
    background: #e53935;
    border-radius: 3px;
  }
  
  .section-container {
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #e53935;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #f5f5f5;
  }
  
  /* Descriptions */
  :deep(.ant-descriptions-item-label) {
    background-color: #fafafa;
    font-size: 12px;
    padding: 6px 12px;
    width: 150px;
  }
  
  :deep(.ant-descriptions-item-content) {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  :deep(.ant-descriptions-bordered .ant-descriptions-item) {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .truncate {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
  
  /* Table */
  .compact-table :deep(.ant-table) {
    font-size: 12px;
  }
  
  .compact-table :deep(.ant-table-thead > tr > th) {
    background-color: #ffebee;
    color: #333;
    font-weight: 500;
    padding: 8px;
  }
  
  .compact-table :deep(.ant-table-tbody > tr > td) {
    padding: 8px;
  }
  
  .product-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-size: 12px;
    font-weight: 500;
    color: #333;
  }
  
  .product-attrs {
    font-size: 10px;
    color: #888;
  }
  
  .product-attrs span {
    margin-right: 8px;
  }
  
  /* Payment Summary */
  .payment-summary {
    background-color: #fff;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .total-row {
    font-weight: 600;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
  }
  
  .total-value {
    color: #e53935;
    font-size: 14px;
  }
  
  .discount-value {
    color: #52c41a;
  }
  
  /* Modal Footer */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
  
  .btn-close,
  .btn-cancel,
  .btn-reorder {
    height: 32px;
    padding: 0 16px;
    font-size: 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  
  .btn-close {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: #333;
  }
  
  .btn-close:hover {
    background-color: #e0e0e0;
    border-color: #bfbfbf;
  }
  
  .btn-cancel {
    background-color: #fff;
    border-color: #e53935;
    color: #e53935;
  }
  
  .btn-cancel:hover {
    background-color: #e53935;
    color: #fff;
  }
  
  .btn-reorder {
    background-color: #e53935;
    border-color: #e53935;
    color: #fff;
  }
  
  .btn-reorder:hover {
    background-color: #c62828;
    border-color: #c62828;
  }
  
  /* Responsive Design */
  @media (max-width: 576px) {
    .order-detail-modal :deep(.ant-modal) {
      width: 90% !important;
      margin: 16px auto;
    }
  
    .modal-content {
      max-height: 70vh;
    }
  
    :deep(.ant-descriptions-item-label) {
      width: 120px;
    }
  
    .truncate {
      max-width: 200px;
    }
  
    .product-image {
      width: 32px;
      height: 32px;
    }
  
    .modal-footer {
      flex-direction: column;
      align-items: stretch;
    }
  
    .btn-close,
    .btn-cancel,
    .btn-reorder {
      width: 100%;
    }
  }
  
  /* Styles for favorite products dropdown */
  .favorite-products-dropdown {
    width: 300px !important;
  }
  
  .favorites-dropdown-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }
  
  .favorites-header {
    padding: 10px 16px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .favorites-count {
    background-color: #fff;
    color: #e53935;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;
    margin-left: auto;
  }
  
  .favorites-dropdown-menu {
    padding: 0 !important;
    max-height: 300px;
    overflow-y: auto;
    border: none !important;
    box-shadow: none !important;
  }
  
  .favorites-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    justify-content: center;
  }
  
  .favorite-product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
  }
  
  .favorite-product-item:hover {
    background-color: #f9f9f9;
  }
  
  .favorite-product-image {
    flex-shrink: 0;
  }
  
  .favorite-product-image img {
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .favorite-product-info {
    flex: 1;
    min-width: 0;
    /* Prevent overflow issues */
  }
  
  .product-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-details {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .product-price {
    font-size: 14px;
    font-weight: 600;
    color: #e53935;
  }
  
  .favorites-footer {
    padding: 8px 16px;
    border-top: 1px solid #f0f0f0;
    text-align: center;
  }
  
  .see-all-favorites-btn {
    width: 100%;
    height: auto !important;
    padding: 8px 0 !important;
  }
  
  .see-all-btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    color: #e53935;
  }
  
  .view-favorites-btn {
    padding: 0 !important;
    height: auto !important;
    font-size: 14px;
  }
  
  .favorites-btn-content {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  </style>
  