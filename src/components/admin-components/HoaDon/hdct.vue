<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <div class="container-fluid main-content">
        <div v-if="loading" class="text-center">
            <a-spin tip="Đang tải dữ liệu..." />
        </div>
        <div v-else-if="store.hoaDonDetail">
            <div class="order-header">
                <a-row :gutter="16">
                    <a-col :md="17">
                        <h2 style="color: #f33b47;">Thông tin chi tiết đơn hàng {{ store.hoaDonDetail.loai_hoa_don }}
                            #{{
                                store.hoaDonDetail.ma_hoa_don || 'N/A' }}</h2>
                    </a-col>
                    <a-col :md="7" class="text-right">
                        <a-button type="primary" @click="$router.push('/admin/quanlyhoadon')">Quay lại</a-button>
                    </a-col>
                </a-row>
                <a-divider />
                <h4 style="text-align: center;">Lịch sử trạng thái</h4><br>
                <div class="status-icons">
                    <div class="col" v-for="history in sortedTrangThaiHistory" :key="history.trang_thai">
                        <div class="status-icon" :class="getStatusClass(history.trang_thai)">
                            <i :class="getIconForStatus(history.trang_thai)"></i>
                            <p>{{ history.trang_thai }}</p>
                            <small>{{ history.ngay_chuyen_formatted }}</small>
                        </div>
                    </div>
                </div>
                <a-divider />

                <div class="order-status">
                    <!-- Nút Quay lại trạng thái ban đầu -->
                    <a-form @submit="revertToInitial" v-if="showRevertButton" :inline="true">
                        <a-button type="warning" html-type="submit">
                            Quay lại trạng thái ban đầu
                        </a-button>
                    </a-form>
                    <a-form @submit="changeStatus" :inline="true">
                        <a-button type="primary" html-type="submit" :disabled="isCompletedOrCancelled"
                            :class="{ 'disabled': isCompletedOrCancelled }">
                            {{ nextStatusText }}
                        </a-button>
                    </a-form>
                    <a-form @submit="cancelOrder" :inline="true">
                        <a-button type="text" html-type="submit" :disabled="cannotCancel"
                            :class="{ 'disabled': cannotCancel }">
                            Hủy đơn
                        </a-button>
                    </a-form>
                    <a-form :inline="true">
                        <a-button type="text" @click="openPrintConfirm">
                            Xuất hóa đơn
                        </a-button>
                    </a-form>
                    <a-modal v-model:open="showPrintConfirm" title="Xác nhận xuất hóa đơn" @ok="confirmPrint(true)"
                        @cancel="confirmPrint(false)">
                        <p>Bạn muốn xuất hóa đơn này phải không?</p>
                        <template #footer>
                            <a-button key="cancel" @click="confirmPrint(false)">Không</a-button>
                            <a-button key="ok" type="primary" @click="confirmPrint(true)">Đúng</a-button>
                        </template>
                    </a-modal>
                </div>
            </div>

            <a-row :gutter="16">
                <a-col :md="24">
                    <div class="info-box">
                        <h5>Thông tin đơn hàng</h5>
                        <hr>
                        <a-row :gutter="16">
                            <a-col :span="12">
                                <p>Mã hóa đơn: {{ store.hoaDonDetail.ma_hoa_don || 'N/A' }}</p>
                                <p>Trạng thái: {{ store.hoaDonDetail.trang_thai_thanh_toan || 'N/A' }}</p>
                                <p>Phương thức thanh toán: {{ store.hoaDonDetail.hinh_thuc_thanh_toan || 'Chưa xác định'
                                    }}</p>
                            </a-col>
                            <a-col :span="12">
                                <p>Ngày tạo: {{ formatDate(store.hoaDonDetail.ngay_tao) }}</p>
                                <p>Nhân viên tiếp nhận: {{ store.hoaDonDetail.ten_nhan_vien || 'Chưa xác định' }}</p>
                                <p>Hình thức nhận hàng: {{ store.hoaDonDetail.phuong_thuc_nhan_hang || 'Chưa xác định'
                                    }}</p>
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>

            <a-row :gutter="16">
                <a-col :md="16">
                    <div class="info-box">
                        <a-row>
                            <a-col :md="19">
                                <h5>Thông tin sản phẩm</h5>
                            </a-col>
                            <a-col :md="5" class="text-right">
                                <a-button type="primary" :disabled="cannotEditProduct"
                                    :class="{ 'disabled': cannotEditProduct }" @click="showAddProductPopupFn">
                                    Thêm sản phẩm
                                </a-button>
                            </a-col>
                        </a-row>
                        <hr>
                        <a-table :columns="productColumns" :data-source="store.chiTietHoaDons" :pagination="false"
                            row-key="id_chi_tiet_san_pham">
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'san_pham'">
                                    <img :src="record.hinh_anh || '/images/default.jpg'" alt="Product"
                                        class="product-image">
                                    {{ record.ten_san_pham || 'N/A' }} <br>
                                    Kích thước: {{ record.kich_thuoc || 'N/A' }},
                                    Màu: {{ record.ten_mau_sac || 'N/A' }}
                                </template>
                                <template v-if="column.key === 'don_gia'">
                                    {{ formatCurrency(record.gia_ban) }} VNĐ
                                </template>
                                <template v-if="column.key === 'so_luong'">
                                    <div class="quantity-display">
                                        <a-button @click="showIncreasePopup(index)" :disabled="cannotEditProduct">
                                            <i class="fas fa-minus"></i>
                                        </a-button>
                                        <span>{{ record.so_luong }}</span>
                                        <a-button @click="showDecreasePopup(index)" :disabled="cannotEditProduct">
                                            <i class="fas fa-plus"></i>
                                        </a-button>
                                    </div>
                                </template>
                                <template v-if="column.key === 'thanh_tien'">
                                    {{ formatCurrency(record.don_gia) }} VNĐ
                                </template>
                                <template v-if="column.key === 'thao_tac'">
                                    <a-button type="danger" size="small" @click="removeProduct(record, index)"
                                        :disabled="cannotEditProduct">
                                        <i class="fas fa-trash"></i>
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                        <div class="total-section">
                            <a-row>
                                <a-col :md="16"></a-col>
                                <a-col :md="4" style="text-align: left;">
                                    <p>Tổng tiền hàng:</p>
                                </a-col>
                                <a-col :md="4" style="text-align: right;">
                                    <h6>{{ formatCurrency(store.hoaDonDetail.tong_tien_truoc_giam) }} VNĐ</h6>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :md="7"></a-col>
                                <a-col :md="9" style="text-align: left;color: red;">
                                    <p>{{ store.hoaDonDetail.mo_ta }}</p>
                                </a-col>
                                <a-col :md="4" style="text-align: left;">
                                    <p>Giảm giá:</p>
                                </a-col>
                                <a-col :md="4" style="text-align: right;color: red;">
                                    <p>- {{
                                        formatCurrency((store.hoaDonDetail.tong_tien_truoc_giam || 0) +
                                            (store.hoaDonDetail.phi_van_chuyen || 0) -
                                            (store.hoaDonDetail.tong_tien_sau_giam ||
                                                0)) }} VNĐ</p>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :md="16"></a-col>
                                <a-col :md="4" style="text-align: left;">
                                    <p>Phí vận chuyển:</p>
                                </a-col>
                                <a-col :md="4" style="text-align: right;">
                                    <p>+ {{ formatCurrency(store.hoaDonDetail.phi_van_chuyen) }} VNĐ</p>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :md="16"></a-col>
                                <a-col :md="4" style="text-align: left;">
                                    <p>Thành tiền:</p>
                                </a-col>
                                <a-col :md="4" style="text-align: right;">
                                    <h6>{{ formatCurrency(store.hoaDonDetail.tong_tien_sau_giam) }} VNĐ</h6>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </a-col>

                <a-col :md="8">
                    <div class="info-box">
                        <a-row>
                            <a-col :md="16">
                                <h5>Thông tin khách hàng</h5>
                            </a-col>
                            <a-col :md="8" class="text-right">
                                <div v-if="!isEditingCustomer">
                                    <a-button type="primary" :disabled="cannotEdit" :class="{ 'disabled': cannotEdit }"
                                        @click="openDrawer">
                                        Sửa
                                    </a-button>
                                </div>
                                <!-- <div v-else>
                                    <a-button type="primary" @click="saveCustomerInfo">Lưu</a-button>
                                    <a-button style="margin-left: 8px;" type="default"
                                        @click="cancelEditingCustomer">Hủy</a-button>
                                </div> -->
                            </a-col>
                        </a-row>
                        <hr>
                        <div v-if="!isEditingCustomer">
                            <p>Tên: {{ store.hoaDonDetail.ho_ten || 'Chưa xác định' }}</p>
                            <p>Email: {{ store.hoaDonDetail.email || 'Chưa xác định' }}</p>
                            <p>Phone: {{ store.hoaDonDetail.sdt_nguoi_nhan || 'Chưa xác định' }}</p>
                            <p>Địa chỉ: {{ store.hoaDonDetail.dia_chi || 'Chưa xác định' }}</p>
                        </div>
                        <!-- <div v-else>
                            <a-form @submit="saveCustomerInfo" layout="vertical">
                                <a-form-item label="Tên">
                                    <a-input v-model:value="editedCustomer.hoTen" required />
                                </a-form-item>
                                <a-form-item label="Email">
                                    <a-input v-model:value="editedCustomer.email" type="email" required />
                                </a-form-item>
                                <a-form-item label="Phone">
                                    <a-input v-model:value="editedCustomer.sdtNguoiNhan" required />
                                </a-form-item>
                                <a-form-item label="Địa chỉ">
                                    <a-input v-model:value="editedCustomer.diaChi" required />
                                </a-form-item>
                            </a-form>
                        </div> -->
                        <!-- Drawer cho chỉnh sửa thông tin khách hàng -->
                        <a-drawer v-model:open="isEditingCustomer" title="Chỉnh sửa thông tin khách hàng"
                            placement="right" :width="500" @after-open-change="afterOpenChange">
                            <a-form :model="editedCustomer" layout="vertical" @submit.prevent="saveCustomerInfo">
                                <a-form-item label="Tên người nhận" name="hoTen">
                                    <a-input v-model:value="editedCustomer.hoTen" placeholder="Nhập tên người nhận" />
                                </a-form-item>
                                <a-form-item label="Email" name="email">
                                    <a-input v-model:value="editedCustomer.email" type="email"
                                        placeholder="Nhập email" />
                                </a-form-item>
                                <a-form-item label="Số điện thoại" name="sdtNguoiNhan">
                                    <a-input v-model:value="editedCustomer.sdtNguoiNhan"
                                        placeholder="Nhập số điện thoại" />
                                </a-form-item>
                                <a-form-item label="Tỉnh/Thành phố" name="tinh">
                                    <a-select v-model:value="editedCustomer.tinh" placeholder="Chọn tỉnh/thành phố"
                                        show-search :filter-option="filterOption" @change="handleTinhChange"
                                        @focus="handleFocus" @blur="handleBlur">
                                        <a-select-option v-for="tinh in tinhList" :key="tinh.id" :value="tinh.name">
                                            {{ tinh.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="Quận/Huyện" name="huyen">
                                    <a-select v-model:value="editedCustomer.huyen" placeholder="Chọn quận/huyện"
                                        show-search :filter-option="filterOption" :disabled="!editedCustomer.tinh"
                                        @change="handleHuyenChange" @focus="handleFocus" @blur="handleBlur">
                                        <a-select-option v-for="huyen in huyenList" :key="huyen.id" :value="huyen.name">
                                            {{ huyen.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="Xã/Phường" name="xa">
                                    <a-select v-model:value="editedCustomer.xa" placeholder="Chọn xã/phường" show-search
                                        :filter-option="filterOption" :disabled="!editedCustomer.huyen"
                                        @focus="handleFocus" @blur="handleBlur">
                                        <a-select-option v-for="xa in xaList" :key="xa.id" :value="xa.name">
                                            {{ xa.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="Địa chỉ cụ thể" name="diaChiCuThe">
                                    <a-input v-model:value="editedCustomer.diaChiCuThe"
                                        placeholder="Nhập địa chỉ cụ thể" />
                                </a-form-item>

                                <!-- Bảng danh sách địa chỉ -->
                                <a-divider orientation="left">Danh sách địa chỉ</a-divider>
                                <a-table :columns="addressColumns" :data-source="addressList" :pagination="false"
                                    row-key="id">
                                    <template #bodyCell="{ column }">
                                        <template v-if="column.key === 'thao_tac'">
                                            <a-button type="link">Chọn</a-button>
                                        </template>
                                    </template>
                                </a-table>

                                <a-form-item>
                                    <a-button type="primary" html-type="submit">Lưu</a-button>
                                    <a-button type="default" @click="closeDrawer">Hủy</a-button>
                                </a-form-item>
                            </a-form>
                        </a-drawer>
                    </div>

                    <div class="info-box">
                        <a-row>
                            <a-col :md="16">
                                <h5>Ghi chú</h5>
                            </a-col>
                            <a-col :md="8" class="text-right">
                                <div v-if="!isEditingNote">
                                    <a-button type="primary" :disabled="cannotEdit" :class="{ 'disabled': cannotEdit }"
                                        @click="startEditingNote">
                                        Sửa
                                    </a-button>
                                </div>
                                <div v-else class="edit-buttons">
                                    <a-button type="primary" @click="saveNote">Lưu</a-button>
                                    <a-button style="margin-left: 8px;" type="default"
                                        @click="cancelEditingNote">Hủy</a-button>
                                </div>
                            </a-col>
                        </a-row>
                        <hr>

                        <div v-if="!isEditingNote">
                            <a-textarea :value="store.hoaDonDetail.ghi_chu || 'Không có ghi chú'" :rows="2" readonly />
                        </div>
                        <div v-else>
                            <a-form @submit="saveNote">
                                <a-form-item>
                                    <a-textarea v-model:value="editedNote" :rows="2" placeholder="Nhập ghi chú..."
                                        maxlength="100" />
                                    <p style="color: red;">Nhập tối đa 100 ký tự</p>
                                </a-form-item>
                            </a-form>
                        </div>
                    </div>
                </a-col>
            </a-row>

            <!-- Popup thêm sản phẩm -->
            <a-modal v-model:visible="showAddProductPopup" title="Danh sách sản phẩm" :footer="null" width="80%">
                <a-row :gutter="16" class="modal-header">
                    <a-col :span="18">
                        <a-input v-model:value="searchKeyword" @input="searchProducts"
                            placeholder="Tìm kiếm sản phẩm..." />
                    </a-col>
                    <a-col :span="6" class="text-right">
                        <a-button type="primary" @click="addSelectedProducts">Thêm sản phẩm</a-button>
                    </a-col>
                </a-row>
                <a-table :columns="productPopupColumns" :data-source="store.listCTSP_HD" :pagination="false"
                    row-key="id_chi_tiet_san_pham">
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'stt'">
                            {{ index + 1 + (store.currentPage * 5) }}
                        </template>
                        <template v-if="column.key === 'gia_ban'">
                            {{ formatCurrency(record.gia_ban || 0) }}
                        </template>
                        <template v-if="column.key === 'so_luong'">
                            <!-- Tính số lượng khả dụng -->
                            {{ record.so_luong }} (Khả dụng: {{ calculateSoLuongTon(record) }})
                        </template>
                        <template v-if="column.key === 'so_luong_mua'">
                            <div class="quantity-input">
                                <a-button @click="decreaseQuantityPopup(index)"
                                    :disabled="quantities[index] <= 0">-</a-button>
                                <a-input-number type="number" v-model:value="quantities[index]" :min="0"
                                    :max="calculateSoLuongTon(record)"
                                    @change="validateQuantity(index, calculateSoLuongTon(record))" />
                                <a-button @click="increaseQuantityPopup(index)"
                                    :disabled="quantities[index] >= calculateSoLuongTon(record)">+</a-button>
                            </div>
                        </template>
                    </template>
                </a-table>
                <div class="pagination">
                    <a-button @click="changePage(store.currentPage - 1)" :disabled="store.currentPage === 0">
                        Trang trước
                    </a-button>
                    <span>Trang {{ store.currentPage + 1 }} / {{ store.totalPages }}</span>
                    <a-button @click="changePage(store.currentPage + 1)"
                        :disabled="store.currentPage >= store.totalPages - 1">
                        Trang sau
                    </a-button>
                </div>
                <a-button type="default" class="close-btn" @click="closeAddProductPopup">Đóng</a-button>
            </a-modal>

            <!-- Popup chỉnh sửa số lượng -->
            <a-modal v-model:visible="showQuantityPopup" width="350px" class="text-center"
                :title="popupType === 'increase' ? 'Giảm số lượng' : 'Thêm số lượng'" :footer="null">
                <div class="popup-input">
                    <label>Số lượng (Khả dụng: {{ currentProduct ? calculateSoLuongTon(currentProduct) : 0 }}):</label>
                    <label style="width: 100px;">Số lượng:</label>
                    <a-input-number style="width: 150px;" type="number" v-model:value="quantityChange" :min="0"
                        :max="popupType === 'increase' ? currentProduct.so_luong : calculateSoLuongTon(currentProduct)" />
                </div>
                <div class="popup-actions">
                    <a-button type="primary" @click="updateQuantity">
                        <i :class="popupType === 'increase' ? 'fas fa-minus' : 'fas fa-plus'"></i>
                    </a-button>
                    <a-button type="default" @click="closeQuantityPopup">Hủy</a-button>
                </div>
            </a-modal>

            <div class="notification">
                {{ store.hoaDonDetail.trang_thai?.toUpperCase() || 'ĐANG XỬ LÝ' }} ĐƠN HÀNG {{
                    formatCurrency(store.hoaDonDetail.tong_tien_sau_giam) }} VNĐ
            </div>
        </div>
        <div v-else class="text-center">
            <p>Không tìm thấy hóa đơn.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import '../../../config/fonts/Roboto-normal'
import '../../../config/fonts/Roboto-bold'
import logo from '../../../images/logo/logo2.png';

// Ant Design Vue components
import { Row as ARow, Col as ACol, Button as AButton, Divider as ADivider, Form as AForm, FormItem as AFormItem, Input as AInput, Textarea as ATextarea, Table as ATable, Modal as AModal, InputNumber as AInputNumber, Spin as ASpin } from 'ant-design-vue';

const store = useGbStore();
const route = useRoute();
const router = useRouter();
const loading = ref(true);

// Product table columns
const productColumns = [
    { title: 'Sản phẩm', key: 'san_pham', width: '40%' },
    { title: 'Đơn giá', key: 'don_gia', width: '20%' },
    { title: 'Số lượng', key: 'so_luong', width: '10%' },
    { title: 'Thành tiền', key: 'thanh_tien', width: '20%' },
    { title: 'Thao tác', key: 'thao_tac', width: '10%' },
];

// Product popup table columns
const productPopupColumns = [
    { title: 'STT', key: 'stt' },
    { title: 'Danh mục', dataIndex: 'ten_danh_muc', key: 'ten_danh_muc' },
    { title: 'Tên sản phẩm', dataIndex: 'ten_san_pham', key: 'ten_san_pham' },
    { title: 'Màu sắc', dataIndex: 'ten_mau', key: 'ten_mau' },
    { title: 'Kích cỡ', dataIndex: 'gia_tri', key: 'gia_tri' },
    { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong' },
    { title: 'Giá bán(VNĐ)', key: 'gia_ban' },
    { title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai' },
    { title: 'Số lượng mua', key: 'so_luong_mua' },
];

// Danh sách trạng thái cho hình thức "Giao hàng"
const defaultStatusSteps = [
    { name: 'Đơn hàng đã đặt', backendStatus: 'Chờ xác nhận', icon: 'fas fa-file-alt' },
    { name: 'Đã xác nhận', backendStatus: 'Đã xác nhận', icon: 'fas fa-check' },
    { name: 'Đã cập nhật', backendStatus: 'Đã cập nhật', icon: 'fas fa-edit' },
    { name: 'Đã giao cho ĐVVC', backendStatus: 'Đang giao', icon: 'fas fa-truck' },
    { name: 'Đã nhận hàng', backendStatus: 'Đã nhận hàng', icon: 'fas fa-box' },
    { name: 'Hoàn thành', backendStatus: 'Hoàn thành', icon: 'fas fa-check-circle' },
    { name: 'Đã hủy', backendStatus: 'Đã hủy', icon: 'fas fa-times-circle' }
];

// Danh sách trạng thái cho "Nhận tại cửa hàng"
const storePickupStatusSteps = [
    { name: 'Chờ xác nhận', backendStatus: 'Chờ xác nhận', icon: 'fas fa-hourglass-start' },
    { name: 'Đã cập nhật', backendStatus: 'Đã cập nhật', icon: 'fas fa-edit' },
    { name: 'Hoàn thành', backendStatus: 'Hoàn thành', icon: 'fas fa-check-circle' },
    { name: 'Đã hủy', backendStatus: 'Đã hủy', icon: 'fas fa-times-circle' }
];

// // Computed property để quyết định danh sách trạng thái
// const computedStatusSteps = computed(() => {
//     if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
//         return storePickupStatusSteps;
//     }
//     return defaultStatusSteps;
// });

// Address table columns
const addressColumns = [
    { title: 'Địa chỉ', dataIndex: 'dia_chi', key: 'dia_chi' },
    { title: 'Thao tác', key: 'thao_tac' },
];

// Danh sách tỉnh, huyện, xã từ API
const tinhList = ref([]);
const huyenList = ref([]);
const xaList = ref([]);

// Dữ liệu mẫu cho bảng danh sách địa chỉ (sẽ xử lý luồng sau)
const addressList = ref([]);

// Trạng thái chỉnh sửa thông tin khách hàng
const isEditingCustomer = ref(false);
const editedCustomer = ref({
    hoTen: '',
    email: '',
    sdtNguoiNhan: '',
    tinh: null,
    huyen: null,
    xa: null,
    diaChiCuThe: '',
    diaChi: '', // Địa chỉ đầy đủ (sẽ được ghép từ các trường)
});
// Hàm tìm kiếm cho select
const filterOption = (input, option) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// Xử lý focus
const handleFocus = () => {
    console.log('Focus on select');
};

// Xử lý blur
const handleBlur = () => {
    console.log('Blur on select');
};

// Mở drawer và load dữ liệu
const openDrawer = async () => {
    // Lấy danh sách tỉnh trước khi mở drawer
    if (tinhList.value.length === 0) {
        await fetchTinhList();
    }
    // Load dữ liệu ban đầu
    editedCustomer.value = {
        hoTen: store.hoaDonDetail.ho_ten || '',
        email: store.hoaDonDetail.email || '',
        sdtNguoiNhan: store.hoaDonDetail.sdt_nguoi_nhan || '',
        tinh: null,
        huyen: null,
        xa: null,
        diaChiCuThe: '',
        diaChi: store.hoaDonDetail.dia_chi || '',
    };

    // Tách địa chỉ thành các trường nếu có
    if (store.hoaDonDetail.dia_chi) {
        const diaChiParts = store.hoaDonDetail.dia_chi.split(', ');
        console.log(diaChiParts.length);
        if (diaChiParts.length > 4 || diaChiParts.length === 4) {
            if (diaChiParts.length > 4) {
                editedCustomer.value.diaChiCuThe = diaChiParts[0] + ', ' + diaChiParts[1];
                editedCustomer.value.xa = diaChiParts[diaChiParts.length - 3];
                editedCustomer.value.huyen = diaChiParts[diaChiParts.length - 2];
                editedCustomer.value.tinh = diaChiParts[diaChiParts.length - 1];
            } if (diaChiParts.length === 4) {
                editedCustomer.value.diaChiCuThe = diaChiParts[0];
                editedCustomer.value.xa = diaChiParts[1];
                editedCustomer.value.huyen = diaChiParts[2];
                editedCustomer.value.tinh = diaChiParts[3];
            }
            // Load danh sách huyện và xã dựa trên tỉnh, huyện đã chọn
            if (editedCustomer.value.tinh) {
                const provinceCode = findProvinceCode(editedCustomer.value.tinh);
                if (provinceCode) {
                    await fetchHuyenList(provinceCode);
                }
            }
            if (editedCustomer.value.huyen) {
                const districtCode = findDistrictCode(editedCustomer.value.huyen);
                if (districtCode) {
                    await fetchXaList(districtCode);
                }
            }
        }
    }
    isEditingCustomer.value = true;
};
// Đóng drawer
const closeDrawer = () => {
    isEditingCustomer.value = false;
    // Reset các trường
    editedCustomer.value = {
        hoTen: '',
        email: '',
        sdtNguoiNhan: '',
        tinh: null,
        huyen: null,
        xa: null,
        diaChiCuThe: '',
        diaChi: '',
    };
    huyenList.value = [];
    xaList.value = [];
};

// Lấy danh sách tỉnh từ API
const fetchTinhList = async () => {
    try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        tinhList.value = response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh:', error);
        toast.error('Không thể lấy danh sách tỉnh!');
    }
};

// Lấy danh sách huyện theo tỉnh
const fetchHuyenList = async (provinceCode) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        huyenList.value = response.data.districts || [];
    } catch (error) {
        console.error('Lỗi khi lấy danh sách huyện:', error);
        toast.error('Không thể lấy danh sách huyện!');
    }
};

// Lấy danh sách xã theo huyện
const fetchXaList = async (districtCode) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        xaList.value = response.data.wards || [];
    } catch (error) {
        console.error('Lỗi khi lấy danh sách xã:', error);
        toast.error('Không thể lấy danh sách xã!');
    }
};

// Tìm mã tỉnh từ tên tỉnh
const findProvinceCode = (provinceName) => {
    const province = tinhList.value.find(tinh => tinh.name === provinceName);
    return province ? province.code : null;
};

// Tìm mã huyện từ tên huyện
const findDistrictCode = (districtName) => {
    const district = huyenList.value.find(huyen => huyen.name === districtName);
    return district ? district.code : null;
};
// Xử lý khi chọn tỉnh
const handleTinhChange = async (value) => {
    editedCustomer.value.huyen = null;
    editedCustomer.value.xa = null;
    xaList.value = [];

    const provinceCode = findProvinceCode(value);
    if (provinceCode) {
        await fetchHuyenList(provinceCode);
    }
};

// Xử lý khi chọn huyện
const handleHuyenChange = async (value) => {
    editedCustomer.value.xa = null;

    const districtCode = findDistrictCode(value);
    if (districtCode) {
        await fetchXaList(districtCode);
    }
};
// Lưu thông tin khách hàng
const saveCustomerInfo = () => {
    if (confirm('Bạn có đồng ý sửa thông tin khách hàng không?')) {
        // Ghép địa chỉ từ các trường
        if (editedCustomer.value.tinh && editedCustomer.value.huyen && editedCustomer.value.xa && editedCustomer.value.diaChiCuThe) {
            editedCustomer.value.diaChi = `${editedCustomer.value.diaChiCuThe}, ${editedCustomer.value.xa}, ${editedCustomer.value.huyen}, ${editedCustomer.value.tinh}`;
        } else {
            editedCustomer.value.diaChi = editedCustomer.value.diaChiCuThe || '';
        }

        // Gọi hàm cập nhật thông tin khách hàng
        store.updateCustomerInfo(store.hoaDonDetail.ma_hoa_don, {
            hoTen: editedCustomer.value.hoTen,
            email: editedCustomer.value.email,
            sdtNguoiNhan: editedCustomer.value.sdtNguoiNhan,
            diaChi: editedCustomer.value.diaChi,
        });

        // Đóng drawer
        closeDrawer();
    }
};
// Hàm xử lý sau khi drawer mở/đóng
const afterOpenChange = (visible) => {
    if (!visible) {
        closeDrawer();
    }
};

const sortedTrangThaiHistory = computed(() => {
    return [...store.trangThaiHistory].sort((a, b) => {
        return new Date(a.ngay_chuyen) - new Date(b.ngay_chuyen);
    });
});

const getIconForStatus = (trangThai) => {
    const statusSteps = store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng'
        ? storePickupStatusSteps
        : defaultStatusSteps;
    const status = statusSteps.find(s => s.backendStatus === trangThai);
    return status ? status.icon : 'fas fa-question'; // Icon mặc định nếu không tìm thấy
};

const isCompletedOrCancelled = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    return trangThai === 'Hoàn thành' || trangThai === 'Đã hủy';
});

const cannotCancel = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return ['Hoàn thành', 'Đã hủy'].includes(trangThai);
    }
    return ['Đang giao', 'Đã nhận hàng', 'Hoàn thành', 'Đã hủy'].includes(trangThai);
});

const cannotEditProduct = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return ['Hoàn thành', 'Đã hủy'].includes(trangThai);
    }
    return ["Đã xác nhận", 'Chờ đóng gói', 'Đang giao', 'Đã nhận hàng', 'Hoàn thành', 'Đã hủy'].includes(trangThai);
});

const cannotEdit = computed(() => {
    const trangThai = store.hoaDonDetail?.trang_thai;
    if (store.hoaDonDetail?.phuong_thuc_nhan_hang === 'Nhận tại cửa hàng') {
        return ['Hoàn thành', 'Đã hủy'].includes(trangThai);
    }
    return ["Đã xác nhận", 'Chờ đóng gói', 'Đang giao', 'Đã nhận hàng', 'Hoàn thành', 'Đã hủy'].includes(trangThai);
});

const nextStatusText = computed(() => {
    const phuongThucNhanHang = store.hoaDonDetail?.phuong_thuc_nhan_hang;
    const trangThai = store.hoaDonDetail?.trang_thai;

    if (!phuongThucNhanHang || !trangThai) return 'Chuyển trạng thái';

    if (phuongThucNhanHang === 'Nhận tại cửa hàng') {
        return trangThai === 'Chờ xác nhận' ? 'Hoàn thành' : 'Hoàn thành';
    }

    switch (trangThai) {
        case 'Chờ xác nhận':
            return 'Xác nhận đơn hàng';
        case 'Đã cập nhật': // Chỉ xử lý "Đã cập nhật" sau "Chờ xác nhận"
            return 'Xác nhận đơn hàng'; // Vẫn chuyển sang "Đã xác nhận"
        case 'Đã xác nhận':
            return 'Chuẩn bị hàng';
        case 'Chờ đóng gói':
            return 'Giao cho ĐVVC';
        case 'Đang giao':
            return 'Hoàn thành';
        default:
            return 'Hoàn thành';
    }
});

const nextStatusValue = computed(() => {
    const phuongThucNhanHang = store.hoaDonDetail?.phuong_thuc_nhan_hang;
    const trangThai = store.hoaDonDetail?.trang_thai;

    if (!phuongThucNhanHang || !trangThai) return '';

    if (phuongThucNhanHang === 'Nhận tại cửa hàng') {
        return trangThai === 'Chờ xác nhận' ? 'Hoàn thành' : 'Hoàn thành';
    }

    switch (trangThai) {
        case 'Chờ xác nhận':
            return 'Đã xác nhận';
        case 'Đã cập nhật': // Chỉ xử lý "Đã cập nhật" sau "Chờ xác nhận"
            return 'Đã xác nhận'; // Vẫn chuyển sang "Đã xác nhận"
        case 'Đã xác nhận':
            return 'Chờ đóng gói';
        case 'Chờ đóng gói':
            return 'Đang giao';
        case 'Đang giao':
            return 'Hoàn thành';
        default:
            return 'Hoàn thành';
    }
});

const formatCurrency = (value) => {
    return value ? new Intl.NumberFormat('vi-VN').format(value) : '0';
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusClass = (trangThai) => {
    if (trangThai === 'Đã hủy') {
        return 'text-danger';
    }
    return 'text-success';
};

const changeStatus = () => {
    if (confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng thành "${nextStatusValue.value}" không?`)) {
        const newTrangThai = nextStatusValue.value;
        if (newTrangThai) {
            store.changeTrangThaiHoaDon(store.hoaDonDetail.ma_hoa_don, newTrangThai);
        }
    }
};

const cancelOrder = () => {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.')) {
        store.cancelHoaDon(store.hoaDonDetail.ma_hoa_don);
    }
};

// Trạng thái chỉnh sửa ghi chú
const isEditingNote = ref(false);
const editedNote = ref('');

// Bắt đầu chỉnh sửa ghi chú
const startEditingNote = () => {
    editedNote.value = store.hoaDonDetail.ghi_chu || '';
    isEditingNote.value = true;
};

// Lưu ghi chú
const saveNote = () => {
    if (confirm('Bạn có đồng ý sửa ghi chú không?')) {
        store.updateNote(store.hoaDonDetail.ma_hoa_don, editedNote.value);
        isEditingNote.value = false;
    }
};

// Hủy chỉnh sửa ghi chú
const cancelEditingNote = () => {
    isEditingNote.value = false;
};

// Trạng thái popup thêm sản phẩm
const showAddProductPopup = ref(false);
const searchKeyword = ref('');
const quantities = ref([]);

// Tính số lượng tồn (khả dụng)
const calculateSoLuongTon = (record) => {
    const productInList = store.listCTSP_HD.find(item => item.id_chi_tiet_san_pham === record.id_chi_tiet_san_pham);
    const soLuongBanDau = productInList ? productInList.so_luong : record.so_luong;

    const hdct = store.chiTietHoaDons.find(item => item.id_chi_tiet_san_pham === record.id_chi_tiet_san_pham);
    const soLuongHienCo = hdct ? hdct.so_luong : 0;

    const soLuongTon = (soLuongBanDau || 0) - soLuongHienCo;
    console.log('record.id_chi_tiet_san_pham:', record.id_chi_tiet_san_pham, 'soLuongBanDau:', soLuongBanDau, 'soLuongHienCo:', soLuongHienCo, 'soLuongTon:', soLuongTon);
    return Math.max(soLuongTon, 0);
};
// Tính tổng số lượng sản phẩm trong hóa đơn
const calculateTotalQuantity = () => {
    return store.chiTietHoaDons.reduce((total, item) => total + (item.so_luong || 0), 0);
};
// Hiển thị popup thêm sản phẩm
const showAddProductPopupFn = async () => {
    await store.getAllCTSP_HD(0, 5, '');
    quantities.value = new Array(store.listCTSP_HD.length).fill(0);
    showAddProductPopup.value = true;
};

// Đóng popup thêm sản phẩm
const closeAddProductPopup = () => {
    showAddProductPopup.value = false;
    searchKeyword.value = '';
    quantities.value = new Array(store.listCTSP_HD.length).fill(0);
};

// Tìm kiếm sản phẩm
const searchProducts = async () => {
    await store.getAllCTSP_HD(0, 5, searchKeyword.value);
    quantities.value = new Array(store.listCTSP_HD.length).fill(0);
};

// Thay đổi trang
const changePage = async (page) => {
    if (page >= 0 && page < store.totalPages) {
        await store.getAllCTSP_HD(page, 5, searchKeyword.value);
        quantities.value = new Array(store.listCTSP_HD.length).fill(0);
    }
};

// Tăng số lượng trong Popup
const increaseQuantityPopup = (index) => {
    const max = calculateSoLuongTon(store.listCTSP_HD[index]);
    if (quantities.value[index] < max) {
        quantities.value[index]++;
    }
};

// Giảm số lượng trong Popup
const decreaseQuantityPopup = (index) => {
    if (quantities.value[index] > 0) {
        quantities.value[index]--;
    }
};

// Validate số lượng
const validateQuantity = (index, max) => {
    if (quantities.value[index] < 0) {
        quantities.value[index] = 0;
    }
    if (quantities.value[index] > max) {
        quantities.value[index] = max;
        toast.error(`Số lượng mua không được vượt quá ${max}`);
    }
};

// Thêm sản phẩm vào hóa đơn
const addSelectedProducts = () => {
    const selectedProducts = store.listCTSP_HD
        .map((item, index) => ({
            idCTSP: item.id_chi_tiet_san_pham,
            soLuongMua: quantities.value[index]
        }))
        .filter(product => product.soLuongMua > 0);

    if (selectedProducts.length === 0) {
        toast.error('Vui lòng chọn ít nhất một sản phẩm để thêm!');
        return;
    }
    // Validate số lượng trước khi gửi API
    for (const product of selectedProducts) {
        const ctsp = store.listCTSP_HD.find(item => item.id_chi_tiet_san_pham === product.idCTSP);
        const soLuongTon = calculateSoLuongTon(ctsp);
        if (product.soLuongMua > soLuongTon) {
            toast.error(`Số lượng sản phẩm ${ctsp.ten_san_pham} vượt quá số lượng khả dụng (${soLuongTon})`);
            return;
        }
    }

    store.addProductsToInvoice(store.hoaDonDetail.ma_hoa_don, selectedProducts);
    closeAddProductPopup();
};

// Xóa sản phẩm khỏi hóa đơn
const removeProduct = async (item, index) => {
    // Validate: Không cho phép xóa nếu chỉ còn 1 sản phẩm trong hóa đơn
    if (store.chiTietHoaDons.length === 1) {
        toast.error('Hóa đơn phải có tối thiểu 1 sản phẩm!');
        return;
    }
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${item.ten_san_pham}" khỏi hóa đơn không?`)) {
        try {
            const response = await store.removeProductFromInvoice(
                store.hoaDonDetail.ma_hoa_don,
                item.id_chi_tiet_san_pham,
                item.so_luong
            );

            if (response.error) {
                toast.error('Xóa sản phẩm khỏi hóa đơn thất bại');
                return;
            }

            store.chiTietHoaDons.splice(index, 1);
            await store.getHoaDonDetail(store.hoaDonDetail.ma_hoa_don);
            toast.success('Xóa sản phẩm khỏi hóa đơn thành công');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
        }
    }
};

// Trạng thái popup chỉnh sửa số lượng
const showQuantityPopup = ref(false);
const popupType = ref('');
const currentIndex = ref(null);
const quantityChange = ref(0);
const currentProduct = ref(null);

// Hiển thị popup tăng số lượng
const showIncreasePopup = async (index) => {
    currentIndex.value = index;
    popupType.value = 'increase';
    quantityChange.value = 0;
    currentProduct.value = store.chiTietHoaDons[index];

    if (!store.listCTSP_HD || store.listCTSP_HD.length === 0) {
        await store.getAllCTSP_HD(0, 5, '');
    }

    showQuantityPopup.value = true;
};

// Hiển thị popup giảm số lượng
const showDecreasePopup = async (index) => {
    currentIndex.value = index;
    popupType.value = 'decrease';
    quantityChange.value = 0;
    currentProduct.value = store.chiTietHoaDons[index];

    if (!store.listCTSP_HD || store.listCTSP_HD.length === 0) {
        await store.getAllCTSP_HD(0, 5, '');
    }

    showQuantityPopup.value = true;
};

// Đóng popup chỉnh sửa số lượng
const closeQuantityPopup = () => {
    showQuantityPopup.value = false;
    currentIndex.value = null;
    popupType.value = '';
    quantityChange.value = 0;
};

const updateQuantity = async () => {
    const index = currentIndex.value;
    const item = store.chiTietHoaDons[index];
    const change = quantityChange.value;

    if (change <= 0) {
        toast.error('Số lượng phải lớn hơn 0');
        return;
    }

    if (popupType.value === 'decrease') {
        const soLuongTon = calculateSoLuongTon(item);
        console.log('soLuongTon', soLuongTon);
        if (change > soLuongTon) {
            toast.error(`Số lượng thêm không được vượt quá ${soLuongTon}`);
            return;
        }

        try {
            const response = await store.updateProductQuantity(
                store.hoaDonDetail.ma_hoa_don,
                item.id_chi_tiet_san_pham,
                change
            );

            if (response.error) {
                toast.error('Cập nhật số lượng thất bại');
                return;
            }

            await store.getHoaDonDetail(store.hoaDonDetail.ma_hoa_don);
            toast.success(`Đã thêm ${change} sản phẩm thành công`);
        } catch (error) {
            console.error('Lỗi khi thêm số lượng:', error);
            toast.error('Có lỗi xảy ra khi thêm số lượng');
        }
    } else if (popupType.value === 'increase') {
        // Giảm số lượng
        const totalQuantity = calculateTotalQuantity();
        const newQuantity = totalQuantity - change;
        // Validate: Tổng số lượng sau khi giảm phải >= 1
        if (newQuantity < 1) {
            toast.error('Hóa đơn phải có tối thiểu 1 sản phẩm với số lượng tối thiểu là 1!');
            return;
        }
        if (change >= item.so_luong) {
            toast.error(`Số lượng giảm không được vượt quá ${item.so_luong}`);
            return;
        }
        try {
            const response = await store.updateProductQuantity(
                store.hoaDonDetail.ma_hoa_don,
                item.id_chi_tiet_san_pham,
                -change
            );
            if (response.error) {
                toast.error('Cập nhật số lượng thất bại');
                return;
            }
            await store.getHoaDonDetail(store.hoaDonDetail.ma_hoa_don);
            toast.success(`Đã giảm ${change} sản phẩm thành công`);
        } catch (error) {
            console.error('Lỗi khi giảm số lượng:', error);
            toast.error('Có lỗi xảy ra khi giảm số lượng');
        }
    }

    closeQuantityPopup();
};

// Computed property để kiểm tra điều kiện hiển thị nút "Quay lại"
const showRevertButton = computed(() => {
    if (store.trangThaiHistory.length === 0) {
        console.log('trangThaiHistory rỗng');
        return false;
    }
    const firstStatus = store.trangThaiHistory[0].trang_thai;
    const currentStatus = store.hoaDonDetail.trang_thai;
    console.log('First Status:', firstStatus);
    console.log('Current Status:', currentStatus);
    console.log('Show Revert Button:', firstStatus === 'Chờ xác nhận' && currentStatus === 'Đã xác nhận');
    return firstStatus === 'Chờ xác nhận' && currentStatus === 'Đã xác nhận';
});

// Hàm xử lý sự kiện "Quay lại trạng thái ban đầu"
const revertToInitial = () => {
    if (confirm('Bạn có chắc muốn quay lại trạng thái "Chờ xác nhận" không?')) {
        store.revertToInitialStatus(store.hoaDonDetail.ma_hoa_don);
    }
};
// Trạng thái modal xác nhận in hóa đơn
const showPrintConfirm = ref(false);

// Hàm mở modal xác nhận in
const openPrintConfirm = () => {
    showPrintConfirm.value = true;
};

// Hàm xử lý xác nhận in
const confirmPrint = (shouldPrint) => {
    showPrintConfirm.value = false;
    if (shouldPrint) {
        printInvoice();
    }
};
const printInvoice = () => {
    const doc = new jsPDF();
    // Thiết lập font chữ (mặc định của jsPDF là Helvetica)
    doc.setFont("Roboto");
    // Thêm logo
    const logoWidth = 30; // Chiều rộng logo (mm)
    const logoHeight = 20; // Chiều cao logo (mm)
    const pageWidth = doc.internal.pageSize.getWidth(); // Chiều rộng trang A4 (210mm)
    const logoX = (pageWidth - logoWidth) / 2; // Căn giữa logo theo chiều ngang
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight); // Thêm logo vào PDF
    // Tiêu đề "HÓA ĐƠN BÁN HÀNG"
    doc.setFontSize(18);
    doc.setFont("Roboto", "bold");
    doc.text("HÓA ĐƠN BÁN HÀNG", 105, 50, { align: "center" });
    // Thông tin cửa hàng
    doc.setFontSize(16);
    doc.setFont("Roboto", "bold");
    doc.text("G&B SPORTS", 105, 60, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text("Địa chỉ: Phương Canh, Nam Từ Liêm, Hà Nội", 105, 68, { align: "center" });
    doc.text("Điện thoại: 0123456789", 105, 74, { align: "center" });
    // Vẽ đường kẻ ngang
    doc.setLineWidth(0.5);
    doc.line(20, 78, 190, 78);
    // Thông tin hóa đơn
    doc.setFontSize(12);
    doc.setFont("Roboto", "normal");
    doc.text(`Mã hóa đơn: ${store.hoaDonDetail.ma_hoa_don || 'N/A'}`, 20, 86);
    doc.text(`Ngày: ${formatDate(store.hoaDonDetail.ngay_tao)}`, 20, 94);
    doc.text(`Tên khách hàng: ${store.hoaDonDetail.ho_ten || 'Khách lẻ'}`, 20, 102);
    // Danh sách sản phẩm
    let y = 110;
    doc.setFontSize(12);
    doc.setFont("Roboto", "bold");
    doc.text("Sản phẩm", 20, y);
    // Tiêu đề bảng
    y += 10;
    doc.setFontSize(10);
    doc.setFont("Roboto", "bold");
    doc.text("Số lượng", 100, y, { align: "center" });
    doc.text("Đơn giá", 130, y, { align: "center" });
    doc.text("Thành tiền", 170, y, { align: "center" });
    // Vẽ đường kẻ ngang dưới tiêu đề bảng
    y += 2;
    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    // Danh sách sản phẩm
    y += 6;
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    store.chiTietHoaDons.forEach((item, index) => {
        // Tên sản phẩm
        const productName = `${index + 1}. ${item.ten_san_pham} (${item.ten_mau_sac} - ${item.kich_thuoc})`;
        const productLines = doc.splitTextToSize(productName, 80); // Chia nhỏ nếu tên quá dài
        doc.text(productLines, 20, y);

        // Số lượng
        doc.text(`${item.so_luong}`, 100, y, { align: "center" });

        // Đơn giá
        doc.text(`${formatCurrency(item.gia_ban)} VNĐ`, 130, y, { align: "center" });

        // Thành tiền
        const thanhTien = item.so_luong * item.gia_ban;
        doc.text(`${formatCurrency(thanhTien)} VNĐ`, 170, y, { align: "center" });

        // Tăng y dựa trên số dòng của tên sản phẩm
        y += productLines.length * 6 + 4;
    });
    // Vẽ đường kẻ ngang sau danh sách sản phẩm
    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    // Tổng tiền
    y += 10;
    doc.setFontSize(12);
    doc.setFont("Roboto", "normal");
    doc.text(`Tổng tiền hàng: ${formatCurrency(store.hoaDonDetail.tong_tien_truoc_giam)} VNĐ`, 20, y);
    y += 6;
    const giamGia = (store.hoaDonDetail.tong_tien_truoc_giam || 0) +
        (store.hoaDonDetail.phi_van_chuyen || 0) -
        (store.hoaDonDetail.tong_tien_sau_giam || 0);
    doc.text(`Giảm giá: ${formatCurrency(giamGia)} VNĐ`, 20, y);
    y += 6;
    doc.text(`Phí vận chuyển: ${formatCurrency(store.hoaDonDetail.phi_van_chuyen || 0)} VNĐ`, 20, y);
    y += 6;
    doc.setFont("Roboto", "bold");
    doc.text(`Thành tiền: ${formatCurrency(store.hoaDonDetail.tong_tien_sau_giam)} VNĐ`, 20, y);
    // Chân trang
    y += 10;
    doc.setFontSize(10);
    doc.setFont("Roboto", "normal");
    doc.text("Cảm ơn Quý Khách, hẹn gặp lại!", 105, y, { align: "center" });
    // Lưu file PDF
    doc.save(`HoaDon_${store.hoaDonDetail.ma_hoa_don}.pdf`);
};

onMounted(async () => {
    const maHoaDon = route.params.maHoaDon;
    if (maHoaDon) {
        loading.value = true;
        await store.getHoaDonDetail(maHoaDon);
        loading.value = false;
        console.log('trang_thai:', store.hoaDonDetail?.trang_thai);
        console.log('phuong_thuc_nhan_hang:', store.hoaDonDetail?.phuong_thuc_nhan_hang);
        console.log('nextStatusText:', nextStatusText.value);
        console.log('Danh sách chi tiết hóa đơn:', store.chiTietHoaDons);
        console.log('Mô tả: ', store.chiTietHoaDons?.moTa);
    }
});
</script>

<style scoped>
.main-content {
    padding: 20px;
}

.order-header {
    background-color: #f8f9fa;
    padding: 10px;
    margin-bottom: 20px;
}

.status-icons {
    display: flex;
    justify-content: flex-start;
    gap: 40px;
    margin-bottom: 20px;
    position: relative;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 10px 0;
}

.status-icon {
    text-align: center;
    font-size: 14px;
    position: relative;
    z-index: 1;
    min-width: 100px;
}

.status-icon:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 100%;
    width: 40px;
    height: 2px;
    background-color: #1890ff;
    z-index: 0;
}

.status-icon i {
    font-size: 24px;
    margin-bottom: 5px;
}

.status-icon small {
    display: block;
    font-size: 12px;
    color: #666;
}

.order-status {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.info-box {
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: relative;
}

.info-box h5 {
    margin-top: 0;
    color: #1f1f1f;
    font-weight: 500;
}

.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 10px;
}

.total-section {
    margin-top: 10px;
    text-align: right;
}

.notification {
    background-color: #fff1f0;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
    margin-top: 20px;
    color: #cf1322;
    font-weight: 500;
}

.text-danger {
    color: #ff4d4f;
}

.text-success {
    color: #52c41a;
}

.quantity-display {
    display: flex;
    align-items: center;
    gap: 5px;
}

.quantity-display span {
    min-width: 30px;
    text-align: center;
}

.quantity-input {
    display: flex;
    align-items: center;
    gap: 5px;
}

.modal-header {
    margin-bottom: 20px;
}

.close-btn {
    display: block;
    margin: 20px auto 0;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.popup-input {
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.popup-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.text-right {
    text-align: right;
}

/* Style cho drawer */
:deep(.ant-drawer-body) {
    padding: 20px;
}

:deep(.ant-form-item) {
    margin-bottom: 16px;
}

:deep(.ant-select) {
    width: 100%;
}

/* Đảm bảo select có chiều cao đồng bộ */
:deep(.ant-select-selector) {
    height: 40px;
    display: flex;
    align-items: center;
}

:deep(.ant-input-number) {
    width: 100%;
}

/* Style cho bảng danh sách địa chỉ */
:deep(.ant-table) {
    margin-bottom: 20px;
}
</style>