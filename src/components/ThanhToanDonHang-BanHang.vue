<template>
    <div class="checkout-container">
        <!-- Breadcrumb -->
        <div class="breadcrumb-container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
                    <li class="breadcrumb-item"><a href="#">Giỏ hàng</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Thanh toán</li>
                </ol>
            </nav>
        </div>

        <!-- Order Status Timeline -->
        <div class="order-timeline">
            <div class="timeline-step" :class="{ active: currentStatus >= 1, completed: currentStatus > 1 }">
                <div class="step-icon">
                    <shopping-cart-outlined v-if="currentStatus < 1" />
                    <check-circle-outlined v-else />
                </div>
                <div class="step-label">Giỏ hàng</div>
            </div>
            <div class="timeline-connector" :class="{ active: currentStatus >= 1 }"></div>
            <div class="timeline-step" :class="{ active: currentStatus >= 2, completed: currentStatus > 2 }">
                <div class="step-icon">
                    <form-outlined v-if="currentStatus < 2" />
                    <check-circle-outlined v-else />
                </div>
                <div class="step-label">Thanh toán</div>
            </div>
            <div class="timeline-connector" :class="{ active: currentStatus >= 2 }"></div>
            <div class="timeline-step" :class="{ active: currentStatus >= 3, completed: currentStatus > 3 }">
                <div class="step-icon">
                    <credit-card-outlined v-if="currentStatus < 3" />
                    <check-circle-outlined v-else />
                </div>
                <div class="step-label">Đặt hàng</div>
            </div>
            <div class="timeline-connector" :class="{ active: currentStatus >= 3 }"></div>
            <div class="timeline-step" :class="{ active: currentStatus >= 4, completed: currentStatus > 4 }">
                <div class="step-icon">
                    <gift-outlined v-if="currentStatus < 4" />
                    <check-circle-outlined v-else />
                </div>
                <div class="step-label">Hoàn tất</div>
            </div>
        </div>

        <div class="checkout-main-content">
            <!-- Left Side: Customer Information and Payment Methods -->
            <div class="checkout-info-section">
                <div class="section-box">
                    <h2 class="section-title">Thông tin giao hàng</h2>
                    <div class="customer-info">
                        <a-form :model="customer" layout="vertical" class="shipping-form" ref="customerForm"
                            :rules="validationRules">
                            <div class="form-row">
                                <a-form-item label="Họ tên người nhận" name="ho_ten" required class="form-item">
                                    <a-input v-model:value="customer.ho_ten" placeholder="Nhập họ tên người nhận" />
                                </a-form-item>
                                <a-form-item label="Số điện thoại" name="so_dien_thoai" required class="form-item">
                                    <a-input v-model:value="customer.so_dien_thoai" placeholder="Nhập số điện thoại" />
                                </a-form-item>
                            </div>
                            <div class="form-row">
                                <a-form-item label="Email" name="email" required class="form-item">
                                    <a-input v-model:value="customer.email" placeholder="Nhập email" />
                                </a-form-item>
                                <a-form-item label="Tỉnh/Thành phố" name="tinh_thanh_pho" required class="form-item">
                                    <a-select v-model:value="customer.tinh_thanh_pho" placeholder="Chọn Tỉnh/Thành phố"
                                        @change="handleProvinceChange" :loading="loadingProvinces">
                                        <a-select-option v-for="province in provinces" :key="province.code"
                                            :value="province.name">
                                            {{ province.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div class="form-row">
                                <a-form-item label="Quận/Huyện" name="quan_huyen" required class="form-item">
                                    <a-select v-model:value="customer.quan_huyen" placeholder="Chọn Quận/Huyện"
                                        @change="handleDistrictChange" :loading="loadingDistricts"
                                        :disabled="!customer.tinh_thanh_pho">
                                        <a-select-option v-for="district in districts" :key="district.code"
                                            :value="district.name">
                                            {{ district.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="Phường/Xã" name="xa_phuong" required class="form-item">
                                    <a-select v-model:value="customer.xa_phuong" placeholder="Chọn Phường/Xã"
                                        :loading="loadingWards" :disabled="!customer.quan_huyen">
                                        <a-select-option v-for="ward in wards" :key="ward.code" :value="ward.name">
                                            {{ ward.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div class="form-row">
                                <a-form-item label="Địa chỉ cụ thể" name="so_nha" required class="form-item full-width">
                                    <a-textarea v-model:value="customer.so_nha" placeholder="Số nhà, tên đường..."
                                        :rows="2" />
                                </a-form-item>
                            </div>
                        </a-form>
                    </div>
                </div>

                <div class="section-box">
                    <h2 class="section-title">Phương thức thanh toán</h2>
                    <a-radio-group v-model:value="selectedPaymentMethod" class="payment-methods">
                        <div class="payment-method-item">
                            <a-radio value="cod" class="payment-radio">
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <dollar-outlined />
                                    </div>
                                    <div class="payment-info">
                                        <p class="payment-name">Thanh toán khi nhận hàng (COD)</p>
                                        <p class="payment-desc">Thanh toán khi nhận hàng</p>
                                    </div>
                                </div>
                            </a-radio>
                        </div>

                        <div class="payment-method-item">
                            <a-radio value="online" class="payment-radio">
                                <div class="payment-content">
                                    <div class="payment-icon">
                                        <credit-card-outlined />
                                    </div>
                                    <div class="payment-info">
                                        <p class="payment-name">Thanh toán trực tuyến</p>
                                        <p class="payment-desc">Thanh toán qua VNPAY, Momo, thẻ ngân hàng</p>
                                    </div>
                                </div>
                            </a-radio>
                        </div>
                    </a-radio-group>

                    <!-- Online Payment Options (shown only if online payment is selected) -->
                    <div v-if="selectedPaymentMethod === 'online'" class="online-payment-options">
                        <a-radio-group v-model:value="selectedOnlineMethod" class="online-methods">
                            <div class="online-method-item">
                                <a-radio value="vnpay" class="online-radio">
                                    <div class="online-content">
                                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                            alt="VNPAY" class="online-logo" />
                                        <span>VNPAY</span>
                                    </div>
                                </a-radio>
                            </div>
                            <div class="online-method-item">
                                <a-radio value="payos" class="online-radio">
                                    <div class="online-content">
                                        <img src="../images/icon/depositphotos_593773014-stock-illustration-ruble-money-icon-shadow-russian-899359828.jpg"
                                            alt="Payos" class="online-logo" />
                                        <span>PayOs</span>
                                    </div>
                                </a-radio>
                            </div>
                            <div class="online-method-item">
                                <a-radio value="momo" class="online-radio">
                                    <div class="online-content">
                                        <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                            alt="Momo" class="online-logo" />
                                        <span>Ví Momo</span>
                                    </div>
                                </a-radio>
                            </div>
                            <div class="online-method-item">
                                <a-radio value="bank" class="online-radio">
                                    <div class="online-content">
                                        <bank-outlined />
                                        <span>Thẻ ATM/Internet Banking</span>
                                    </div>
                                </a-radio>
                            </div>
                        </a-radio-group>
                    </div>
                </div>

                <div class="section-box">
                    <h2 class="section-title">Ghi chú đơn hàng</h2>
                    <a-textarea v-model:value="orderNote" placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                        :rows="4" />
                </div>
            </div>

            <!-- Right Side: Order Summary -->
            <div class="checkout-summary-section">
                <div class="section-box">
                    <h2 class="section-title">Thông tin đơn hàng</h2>

                    <div class="order-products">
                        <div class="product-item" v-for="(item, index) in orderItems" :key="index">
                            <div class="product-image">
                                <img :src="item.hinh_anh" :alt="item.ten_san_pham" />
                                <span class="product-quantity">{{ item.so_luong }}</span>
                            </div>
                            <div class="product-details">
                                <p class="product-name">{{ item.ten_san_pham }}</p>
                                <p class="product-variant">
                                    Màu sắc: {{ item.ten_mau_sac }} <br>Size: {{ item.ten_kich_thuoc }}
                                </p>
                            </div>
                            <div class="product-price">
                                {{ formatCurrency(item.gia * item.so_luong) }}
                            </div>
                        </div>
                    </div>

                    <div class="coupon-section">
                        <a-button type="primary" @click="showVoucherModal" class="select-voucher-btn" block>
                            <gift-outlined /> Chọn voucher
                        </a-button>
                        <div class="applied-coupons" v-if="appliedCoupons.length > 0">
                            <div class="applied-coupon" v-for="(coupon, index) in appliedCoupons" :key="index">
                                <div class="coupon-info">
                                    <div class="coupon-badge">
                                        <span class="coupon-type">{{ coupon.loai === 'percent' ? 'GIẢM %' : 'GIẢM GIÁ'
                                            }}</span>
                                    </div>
                                    <div class="coupon-details">
                                        <p class="coupon-value">{{ coupon.loai === 'percent' ? `Giảm ${coupon.gia_tri}%`
                                            : formatCurrency(coupon.gia_tri) }}</p>
                                        <p class="coupon-code">{{ coupon.ma }}</p>
                                        <p class="coupon-desc">{{ coupon.mo_ta }}</p>
                                    </div>
                                </div>
                                <a-button type="text" danger @click="removeCoupon(index)" class="remove-coupon-btn">
                                    <close-outlined />
                                </a-button>
                            </div>
                        </div>
                    </div>

                    <div class="order-summary">
                        <div class="summary-item">
                            <span class="item-label">Tạm tính:</span>
                            <span class="item-value">{{ formatCurrency(subtotal) }}</span>
                        </div>
                        <div class="summary-item" v-if="discount > 0">
                            <span class="item-label">Giảm giá:</span>
                            <span class="item-value discount">-{{ formatCurrency(discount) }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="item-label">Phí vận chuyển:</span>
                            <span class="item-value">{{ formatCurrency(shippingFee) }}</span>
                        </div>
                        <div class="summary-item total">
                            <span class="item-label">Tổng cộng:</span>
                            <span class="item-value">{{ formatCurrency(grandTotal) }}</span>
                        </div>
                    </div>

                    <div class="order-actions">
                        <a-button type="primary" size="large" @click="placeOrder" :loading="placing" block>
                            Đặt hàng ngay
                        </a-button>
                    </div>
                </div>
                <div class="section-box address-info">
                    <h2 class="section-title">Thông tin địa chỉ</h2>

                    <!-- Danh sách địa chỉ của khách hàng đã đăng nhập -->
                    <div v-if="store.danhSachDiaChi && store.danhSachDiaChi.length > 0" class="address-list">
                        <a-radio-group v-model:value="selectedAddressId" class="address-radio-group">
                            <div v-for="(address, index) in store.danhSachDiaChi" :key="index" class="address-item">
                                <!-- Sử dụng index làm value cho radio -->
                                <a-radio :value="index" class="address-radio">
                                    <div class="address-content">
                                        <p class="address-name">{{ customer.ho_ten }}
                                            <span v-if="address.dia_chi_mac_dinh === 'true'" class="default-tag">[Mặc định]</span>
                                        </p>
                                        <p class="address-phone">{{ customer.so_dien_thoai }}</p>
                                        <p class="address-email">{{ customer.email }}</p>
                                        <p class="address-full">
                                            {{ address.so_nha }}, {{ address.xa_phuong }}, {{ address.quan_huyen }}, {{ address.tinh_thanh_pho }}
                                        </p>
                                    </div>
                                </a-radio>
                            </div>
                        </a-radio-group>
                    </div>
                    <div v-else class="empty-address-message">
                        Chưa có địa chỉ nào.
                    </div>
                </div>
            </div>

        </div>


        <!-- Voucher Modal -->
        <a-modal v-model:visible="voucherModalVisible" title="Chọn voucher" :footer="null" class="voucher-modal"
            :zIndex="1050" :mask-closable="false">
            <div class="voucher-list">
                <div v-for="(voucher, index) in availableVouchers" :key="index" class="voucher-item"
                    :class="{ 'disabled': !isVoucherValid(voucher), 'selected': isVoucherSelected(voucher) }"
                    @click="selectVoucher(voucher)">
                    <div class="voucher-left">
                        <div class="voucher-badge">
                            <span class="voucher-type">{{ voucher.loai === 'percent' ? 'GIẢM %' : 'GIẢM GIÁ' }}</span>
                        </div>
                    </div>
                    <div class="voucher-content">
                        <p class="voucher-value">{{ voucher.loai === 'percent' ? `Giảm ${voucher.gia_tri}%` :
                            formatCurrency(voucher.gia_tri) }}</p>
                        <p class="voucher-code">{{ voucher.ma }}</p>
                        <p class="voucher-desc">{{ voucher.mo_ta }}</p>
                        <p class="voucher-condition" v-if="voucher.dieu_kien > 0">
                            Đơn tối thiểu {{ formatCurrency(voucher.dieu_kien) }}
                        </p>
                        <p class="voucher-expiry">HSD: 31/12/2023</p>
                    </div>
                    <div class="voucher-right">
                        <a-button :type="isVoucherSelected(voucher) ? 'default' : 'primary'"
                            :disabled="!isVoucherValid(voucher)" @click.stop="toggleVoucher(voucher)">
                            {{ isVoucherSelected(voucher) ? 'Bỏ chọn' : 'Áp dụng' }}
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="voucher-actions">
                <a-button @click="voucherModalVisible = false">Đóng</a-button>
            </div>
        </a-modal>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message, Form, Modal } from 'ant-design-vue';
import axios from 'axios';
import { thanhToanService } from '@/services/thanhToan';
import {
    ShoppingCartOutlined,
    CheckCircleOutlined,
    FormOutlined,
    CreditCardOutlined,
    GiftOutlined,
    PlusOutlined,
    DollarOutlined,
    BankOutlined,
    CloseOutlined
} from '@ant-design/icons-vue';
import { useGbStore } from '@/stores/gbStore';
import { banHangOnlineService } from '@/services/banHangOnlineService';

const router = useRouter();
const route = useRoute();
const store = useGbStore();
// Timeline status
const currentStatus = ref(2); // 1: Cart, 2: Checkout, 3: Order, 4: Complete

// Customer information
const customer = ref({
    id: 1,
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    tinh_thanh_pho: '',
    quan_huyen: '',
    xa_phuong: '',
    so_nha: '',
    dia_chi_mac_dinh: 0  // Dùng 0 thay vì false
});

// Customer addresses
const customerAddresses = ref([]);
const selectedAddressId = ref(1);

// Payment methods
const selectedPaymentMethod = ref('cod');
const selectedOnlineMethod = ref('vnpay');

// Order note
const orderNote = ref('');

// Order items
const orderItems = ref([]);

// Coupon code
const couponCode = ref('');
const applyingCoupon = ref(false);
const appliedCoupons = ref([]);

// Address modal
const addressModalVisible = ref(false);
const isEditingAddress = ref(false);
const addressForm = reactive({
    id: null,
    ten_nguoi_nhan: '',
    so_dien_thoai: '',
    email: '',
    tinh_thanh_pho: '',
    quan_huyen: '',
    xa_phuong: '',
    so_nha: '',
    dia_chi_mac_dinh: false
});

// Location data for address form
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const loadingProvinces = ref(false);
const loadingDistricts = ref(false);
const loadingWards = ref(false);

// Order placement
const placing = ref(false);

// Form validation
const customerForm = ref(null);

// Validation rules
const validationRules = {
    ho_ten: [
        { required: true, message: 'Vui lòng nhập họ tên người nhận', trigger: 'blur' },
        { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự', trigger: 'blur' }
    ],
    so_dien_thoai: [
        { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
        { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
    ],
    email: [
        { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
        { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],
    tinh_thanh_pho: [
        { required: true, message: 'Vui lòng chọn Tỉnh/Thành phố', trigger: 'change' }
    ],
    quan_huyen: [
        { required: true, message: 'Vui lòng chọn Quận/Huyện', trigger: 'change' }
    ],
    xa_phuong: [
        { required: true, message: 'Vui lòng chọn Phường/Xã', trigger: 'change' }
    ],
    so_nha: [
        { required: true, message: 'Vui lòng nhập địa chỉ cụ thể', trigger: 'blur' },
        { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự', trigger: 'blur' }
    ]
};

// Computed values for order summary
const subtotal = computed(() => {
    return orderItems.value.reduce((total, item) => {
        // Đảm bảo giá và số lượng đều là số
        const price = Number(item.gia || item.price || 0);
        const quantity = Number(item.so_luong || item.quantity || 1);
        return total + (price * quantity);
    }, 0);
});

// Calculate discount based on applied vouchers
const calculateDiscount = () => {
    let totalDiscount = 0;
    const subTotal = Number(subtotal.value || 0);

    appliedCoupons.value.forEach(voucher => {
        let discountAmount = 0;

        if (voucher.loai === 'percent') {
            // Percentage discount
            const percentValue = Number(voucher.gia_tri || 0);
            discountAmount = subTotal * (percentValue / 100);

            // Cap discount at maximum value if set
            if (voucher.gia_tri_toi_da && discountAmount > Number(voucher.gia_tri_toi_da)) {
                discountAmount = Number(voucher.gia_tri_toi_da);
            }
        } else if (voucher.loai === 'fixed') {
            // Fixed amount discount
            discountAmount = Number(voucher.gia_tri || 0);
        }

        totalDiscount += discountAmount;
    });

    return totalDiscount;
};

const discount = computed(() => {
    return Number(calculateDiscount() || 0);
});

const shippingFee = computed(() => {
    // Base shipping fee - free shipping for orders over 500,000 VND
    const subTotal = Number(subtotal.value || 0);
    let fee = subTotal > 500000 ? 0 : 30000;

    // Apply shipping vouchers
    const shippingVoucher = appliedCoupons.value.find(c => c.loai === 'shipping');
    if (shippingVoucher) {
        const voucherValue = Number(shippingVoucher.gia_tri || 0);
        fee = Math.max(0, fee - voucherValue);
    }

    return fee;
});

const grandTotal = computed(() => {
    const subTotal = Number(subtotal.value || 0);
    const disc = Number(discount.value || 0);
    const shipping = Number(shippingFee.value || 0);
    return subTotal - disc + shipping;
});

// Fetch customer data
const fetchCustomerData = async () => {
    try {
        // In a real app, this would fetch from an API
        // await store.getCustomerInfo();
        // customer.value = store.customerInfo;
        console.log('Fetched customer data');
    } catch (error) {
        console.error('Error fetching customer data:', error);
        message.error('Không thể tải thông tin khách hàng');
    }
};

// Kiểm tra trạng thái đăng nhập
const isLoggedIn = computed(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
});

// Lấy danh sách địa chỉ khi KH đăng nhập
const fetchCustomerAddresses = async () => {
    try {
        const userDetailsStr = sessionStorage.getItem('userDetails');
        if (!userDetailsStr) return;

        const userDetails = JSON.parse(userDetailsStr);
        if (!userDetails || !userDetails.idKhachHang) return;

        // Điền thông tin cơ bản
        customer.value.ho_ten = userDetails.tenKhachHang || '';
        customer.value.so_dien_thoai = userDetails.soDienThoai || '';
        customer.value.email = userDetails.email || '';

        // Gọi API lấy danh sách địa chỉ
        await store.getDanhSachDiaChi(userDetails.idKhachHang);
        console.log('Danh sách địa chỉ từ API:', store.danhSachDiaChi);

        if (store.danhSachDiaChi && store.danhSachDiaChi.length > 0) {
            // Tìm index của địa chỉ mặc định
            const defaultAddressIndex = store.danhSachDiaChi.findIndex(addr => addr.dia_chi_mac_dinh === 'true');
            
            // Nếu có địa chỉ mặc định, chọn nó. Nếu không, chọn địa chỉ đầu tiên
            const selectedIndex = defaultAddressIndex !== -1 ? defaultAddressIndex : 0;
            
            // Set selectedAddressId để chọn radio button
            selectedAddressId.value = selectedIndex;
            
            // Lấy địa chỉ được chọn
            const selectedAddr = store.danhSachDiaChi[selectedIndex];
            
            // Cập nhật thông tin địa chỉ vào form
            if (selectedAddr) {
                customer.value = {
                    ...customer.value, // Giữ thông tin cá nhân
                    tinh_thanh_pho: selectedAddr.tinh_thanh_pho,
                    quan_huyen: selectedAddr.quan_huyen,
                    xa_phuong: selectedAddr.xa_phuong,
                    so_nha: selectedAddr.so_nha
                };
                console.log('Đã set địa chỉ mặc định:', selectedAddr);
            }
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
        message.error('Không thể tải địa chỉ khách hàng');
    }
};
// Fetch order items from cart
const fetchOrderItems = async () => {
    try {
        // In a real app, this would fetch from an API or use cart state
        // await store.getCartItems();
        // orderItems.value = store.cartItems;
        console.log('Fetched order items');
    } catch (error) {
        console.error('Error fetching order items:', error);
        message.error('Không thể tải thông tin sản phẩm');
    }
};

// Fetch provinces from Vietnam location API
const fetchProvinces = async () => {
    try {
        loadingProvinces.value = true;
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        provinces.value = response.data;
        loadingProvinces.value = false;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        message.error('Không thể tải danh sách tỉnh/thành phố');
        loadingProvinces.value = false;
    }
};

// Fetch districts based on selected province
const handleProvinceChange = async (provinceName) => {
    try {
        addressForm.quan_huyen = '';
        addressForm.xa_phuong = '';
        districts.value = [];
        wards.value = [];

        loadingDistricts.value = true;
        const province = provinces.value.find(p => p.name === provinceName);
        if (province) {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
            districts.value = response.data.districts;
        }
        loadingDistricts.value = false;
    } catch (error) {
        console.error('Error fetching districts:', error);
        message.error('Không thể tải danh sách quận/huyện');
        loadingDistricts.value = false;
    }
};

// Fetch wards based on selected district
const handleDistrictChange = async (districtName) => {
    try {
        addressForm.xa_phuong = '';
        wards.value = [];

        loadingWards.value = true;
        const district = districts.value.find(d => d.name === districtName);
        if (district) {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
            wards.value = response.data.wards;
        }
        loadingWards.value = false;
    } catch (error) {
        console.error('Error fetching wards:', error);
        message.error('Không thể tải danh sách phường/xã');
        loadingWards.value = false;
    }
};

// Add new address
const showAddAddressModal = () => {
    isEditingAddress.value = false;
    Object.assign(addressForm, {
        id: null,
        ten_nguoi_nhan: customer.value.ho_ten,
        so_dien_thoai: customer.value.so_dien_thoai,
        tinh_thanh_pho: '',
        quan_huyen: '',
        xa_phuong: '',
        so_nha: '',
        dia_chi_mac_dinh: false
    });
    addressModalVisible.value = true;
};

// Edit existing address
const editAddress = (address) => {
    isEditingAddress.value = true;
    Object.assign(addressForm, {
        ...address,
        // Chuyển đổi 0/1 sang boolean
        dia_chi_mac_dinh: address.dia_chi_mac_dinh === 1
    });
    addressModalVisible.value = true;

    // Load districts and wards for the selected address
    if (addressForm.tinh_thanh_pho) {
        handleProvinceChange(addressForm.tinh_thanh_pho);
    }
    if (addressForm.quan_huyen) {
        handleDistrictChange(addressForm.quan_huyen);
    }
};

// Save address (add new or update existing)
const saveAddress = async () => {
    // Validate form
    if (!addressForm.ten_nguoi_nhan || !addressForm.so_dien_thoai ||
        !addressForm.tinh_thanh_pho || !addressForm.quan_huyen ||
        !addressForm.xa_phuong || !addressForm.so_nha) {
        message.error('Vui lòng điền đầy đủ thông tin địa chỉ');
        return;
    }

    try {
        // Lấy thông tin người dùng từ sessionStorage
        const userDetailsStr = sessionStorage.getItem('userDetails');
        if (!userDetailsStr) {
            message.error('Vui lòng đăng nhập để lưu địa chỉ');
            return;
        }

        const userDetails = JSON.parse(userDetailsStr);
        if (!userDetails || !userDetails.idKhachHang) {
            message.error('Không tìm thấy thông tin khách hàng');
            return;
        }

        // Xử lý kiểu dữ liệu cho địa chỉ mặc định
        addressForm.dia_chi_mac_dinh = addressForm.dia_chi_mac_dinh ? 1 : 0;

        if (isEditingAddress.value) {
            // Gọi API cập nhật địa chỉ
            await banHangOnlineService.updateAddress(addressForm);
            message.success('Cập nhật địa chỉ thành công');
        } else {
            // Thêm ID khách hàng vào form
            addressForm.id_khach_hang = userDetails.idKhachHang;

            // Gọi API thêm địa chỉ mới
            await banHangOnlineService.addAddress(addressForm);
            message.success('Thêm địa chỉ mới thành công');
        }

        // Tải lại danh sách địa chỉ
        await store.getDanhSachDiaChi(userDetails.idKhachHang);

        // Nếu đây là địa chỉ mặc định, chọn nó và cập nhật thông tin giao hàng
        if (addressForm.dia_chi_mac_dinh === 1) {
            // Tìm địa chỉ vừa thêm/sửa trong danh sách đã tải lại
            const updatedAddress = store.danhSachDiaChi.find(
                addr => addr.so_nha === addressForm.so_nha &&
                    addr.xa_phuong === addressForm.xa_phuong &&
                    addr.quan_huyen === addressForm.quan_huyen
            );

            if (updatedAddress) {
                selectedAddressId.value = updatedAddress.id;
                // Cập nhật thông tin địa chỉ vào form giao hàng
                customer.value.tinh_thanh_pho = updatedAddress.tinh_thanh_pho;
                customer.value.quan_huyen = updatedAddress.quan_huyen;
                customer.value.xa_phuong = updatedAddress.xa_phuong;
                customer.value.so_nha = updatedAddress.so_nha;
            }
        }

        // Đóng modal
        addressModalVisible.value = false;
    } catch (error) {
        console.error('Lỗi khi lưu địa chỉ:', error);
        message.error('Có lỗi xảy ra khi lưu địa chỉ');
    }
};

// Apply coupon code
const applyCoupon = async () => {
    if (!couponCode.value) {
        message.warning('Vui lòng nhập mã giảm giá');
        return;
    }

    try {
        applyingCoupon.value = true;

        // In a real app, this would validate the coupon with an API
        // const response = await store.validateCoupon(couponCode.value);

        // Simulate API response
        await new Promise(resolve => setTimeout(resolve, 800));

        // Example coupon validation
        const couponExists = appliedCoupons.value.some(c => c.ma === couponCode.value);

        if (couponExists) {
            message.warning('Mã giảm giá đã được áp dụng');
        } else {
            // Mock coupon data
            const coupon = {
                ma: couponCode.value,
                mo_ta: couponCode.value === 'WELCOME50'
                    ? 'Giảm 50% cho đơn hàng đầu tiên'
                    : 'Giảm 50,000đ cho đơn hàng từ 500,000đ',
                loai: couponCode.value === 'WELCOME50' ? 'percent' : 'fixed',
                gia_tri: couponCode.value === 'WELCOME50' ? 50 : 50000,
                dieu_kien: couponCode.value === 'WELCOME50' ? 0 : 500000
            };

            // Check coupon conditions
            if (coupon.dieu_kien > 0 && subtotal.value < coupon.dieu_kien) {
                message.warning(`Đơn hàng chưa đạt điều kiện áp dụng mã (tối thiểu ${formatCurrency(coupon.dieu_kien)})`);
            } else {
                appliedCoupons.value.push(coupon);
                message.success('Áp dụng mã giảm giá thành công');
                couponCode.value = '';
            }
        }

        applyingCoupon.value = false;
    } catch (error) {
        console.error('Error applying coupon:', error);
        message.error('Không thể áp dụng mã giảm giá');
        applyingCoupon.value = false;
    }
};

// Remove coupon
const removeCoupon = (index) => {
    appliedCoupons.value.splice(index, 1);
    message.success('Đã xóa mã giảm giá');
};

// Thêm vào sau các biến ref khác
const generatedInvoice = ref(null); // Lưu trữ đối tượng hóa đơn đã tạo

// Calculate complete order totals and create full invoice object
const calculateOrderTotals = () => {
    // Tạo đối tượng hóa đơn đầy đủ với tất cả thông tin cần thiết
    const currentDate = new Date();

    const invoice = {
        // Thông tin đơn hàng
        hoaDon: {
            trang_thai: 'Hoàn thành',
            voucher: {
                id: 1
            },
            sdt_nguoi_nhan: customer.value.so_dien_thoai,
            dia_chi: customer.value.so_nha + ', ' + customer.value.xa_phuong + ', ' + customer.value.quan_huyen + ', ' + customer.value.tinh_thanh_pho,
            email: customer.value.email,
            tong_tien_truoc_giam: subtotal.value,
            tong_tien_sau_giam: grandTotal.value,
            phi_van_chuyen: shippingFee.value,
            tong_tien_thanh_toan: grandTotal.value,
            ho_ten: customer.value.ho_ten,
            ghi_chu: orderNote.value,
            hinh_thuc_thanh_toan: selectedPaymentMethod.value === 'online' ? 'Chuyển khoản' : 'Tiền mặt',
            // Thông tin thanh toán
            phuong_thuc_thanh_toan: {
                loai: selectedPaymentMethod.value,
                chi_tiet: selectedPaymentMethod.value === 'online' ? selectedOnlineMethod.value : 'cod',
                ten: selectedPaymentMethod.value === 'online'
                    ? (selectedOnlineMethod.value === 'vnpay'
                        ? 'VNPAY'
                        : selectedOnlineMethod.value === 'momo'
                            ? 'Ví MoMo'
                            : selectedOnlineMethod.value === 'payos'
                                ? 'PayOS'
                                : 'Thẻ ATM/Internet Banking')
                    : 'Thanh toán khi nhận hàng'
            },
            // Tổng tiền đơn hàng
            tong_tien: {
                tam_tinh: Number(subtotal.value || 0),
                giam_gia: Number(discount.value || 0),
                phi_van_chuyen: Number(shippingFee.value || 0),
                tong_cong: Number(grandTotal.value || 0)
            },
        },
        hoaDonChiTiet: orderItems.value.map(item => ({
            chiTietSanPham: {
                id_chi_tiet_san_pham: item.id,
            },
            so_luong: item.so_luong,
            don_gia: item.gia * item.so_luong
        })),


        // Thông tin cho thanh toán online (nếu cần)
        payment_info: {
            productName: "Đơn hàng " + `GB-${currentDate.getTime()}`,
            description: `GB Sport - ${orderItems.value.length} sản phẩm`,
            returnUrl: "http://localhost:5173/home",
            price: Number(grandTotal.value || 0),
            cancelUrl: "http://localhost:5173/thanhtoan-banhang"
        }
    };

    // Lưu hóa đơn vào biến ref để sử dụng sau này
    generatedInvoice.value = invoice;

    // Log để debug
    console.log('ĐỐI TƯỢNG HÓA ĐƠN ĐẦY ĐỦ:', JSON.stringify(invoice, null, 2));

    return invoice;
};

// Place order - updated with form validation
const placeOrder = async () => {
    try {
        // Validate form
        await customerForm.value.validate();

        placing.value = true;

        // Tạo đối tượng hóa đơn đầy đủ
        const orderData = calculateOrderTotals();
        console.log('ĐỐI TƯỢNG HÓA ĐƠN ĐẦY ĐỦ:', JSON.stringify(orderData.hoaDon, null, 2));
        const hoaDon = orderData.hoaDon;
        const hoaDonChiTiet = orderData.hoaDonChiTiet;
        console.log('ĐỐI TƯỢNG HÓA ĐƠN CHI TIẾT:', JSON.stringify(hoaDonChiTiet, null, 2));

        // Lưu hóa đơn vào store nếu có (tùy chọn)
        if (store.setInvoiceData) {
            store.setInvoiceData(orderData);
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Handle different payment methods
        if (selectedPaymentMethod.value === 'online') {
            if (selectedOnlineMethod.value === 'payos') {
                try {
                    // Tạo hóa đơn trong hệ thống trước khi chuyển hướng thanh toán
                    const response = await banHangOnlineService.createOrder(hoaDon);
                    const responseChiTiet = await banHangOnlineService.createOrderChiTiet(orderData.hoaDonChiTiet);
                    console.log('Response từ server:', response);
                    console.log('Response chi tiết từ server:', responseChiTiet);

                    // Lưu mã hóa đơn vào localStorage để kiểm tra sau khi thanh toán
                    if (response && response.ma_hoa_don) {
                        localStorage.setItem('pendingOrderCode', response.ma_hoa_don);
                    }

                    // Đặt URL callback để xử lý sau khi thanh toán
                    const returnUrl = window.location.origin + '/payment-callback';
                    orderData.payment_info.returnUrl = returnUrl;

                    // Chuyển đến trang thanh toán PayOS
                    await thanhToanService.handlePayOSPayment(orderData.payment_info);

                    // Lưu ý: Code sau đây sẽ không chạy ngay lập tức vì người dùng sẽ bị chuyển hướng
                    // Xử lý callback sẽ được thực hiện ở trang payment-callback
                } catch (error) {
                    console.error('Lỗi khi xử lý thanh toán PayOS:', error);
                    message.error('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
                }
            } else if (selectedOnlineMethod.value === 'vnpay') {
                // Redirect to VNPAY payment gateway
                message.info('Đang chuyển hướng đến cổng thanh toán VNPAY...');
                const response = await banHangOnlineService.createOrder1(hoaDon);
                const responseChiTiet = await banHangOnlineService.createOrderChiTiet(orderData.hoaDonChiTiet);
                console.log('Response từ server:', response);
                console.log('Response chi tiết từ server:', responseChiTiet);
                // Implement VNPAY payment logic here
            } else if (selectedOnlineMethod.value === 'momo') {
                // Redirect to Momo payment gateway
                message.info('Đang chuyển hướng đến cổng thanh toán Momo...');
                // Implement Momo payment logic here
            } else {
                // Handle bank payment
                message.info('Đang chuyển hướng đến cổng thanh toán ngân hàng...');
                // Implement bank payment logic here
            }
        } else {
            // COD payment - immediately mark as ordered
            try {
                // Tạo hóa đơn trong hệ thống
                const response = await banHangOnlineService.createOrder(hoaDon);
                const responseChiTiet = await banHangOnlineService.createOrderChiTiet(orderData.hoaDonChiTiet);
                console.log('Response từ server:', response);
                console.log('Response chi tiết từ server:', responseChiTiet);

                // Lưu mã hóa đơn vào localStorage
                if (response && response.ma_hoa_don) {
                    localStorage.setItem('lastOrderCode', response.ma_hoa_don);
                }

                // Cập nhật trạng thái đơn hàng
                currentStatus.value = 3;

                // Hiển thị thông báo thành công và chuyển đến trang hoàn tất
                setTimeout(() => {
                    currentStatus.value = 4;
                    message.success('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');

                    // Hiển thị modal xác nhận đặt hàng thành công
                    Modal.success({
                        title: 'Đặt hàng thành công',
                        content: `Đơn hàng của bạn đã được tạo thành công với mã đơn hàng ${response.ma_hoa_don}. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.`,
                        okText: 'Theo dõi đơn hàng',
                        onOk: () => {
                            router.push(`/tracuudonhang-banhang?code=${response.ma_hoa_don}`);
                        }
                    });

                    // Xóa giỏ hàng sau khi đặt hàng thành công
                    if (store.clearCart) {
                        store.clearCart();
                    }
                }, 1000);
            } catch (error) {
                console.error('Lỗi khi tạo đơn hàng COD:', error);
                message.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.');
            }
        }

        placing.value = false;

        // Trả về đối tượng hóa đơn để sử dụng bên ngoài nếu cần
        return generatedInvoice.value;
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error);

        // Hiển thị lỗi từ validation (nếu có)
        if (error.errorFields) {
            message.error('Vui lòng điền đầy đủ thông tin giao hàng');
        } else {
            message.error('Không thể đặt hàng. Vui lòng thử lại sau.');
        }

        placing.value = false;
        return null;
    }
};

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm lấy ngày hiện tại theo múi giờ +7 (Việt Nam)
const getCurrentDateVN = () => {
    const date = new Date();
    // Chuyển đổi thành múi giờ Việt Nam (UTC+7)
    const vnTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    return vnTime;
};

// Hàm định dạng ngày giờ theo định dạng Việt Nam
const formatDateVN = (dateString) => {
    const date = new Date(dateString);
    // Chuyển đổi thành múi giờ Việt Nam (UTC+7)
    const vnTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    return vnTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Initialize data on component mount
onMounted(async () => {
    // Kiểm tra xem có sản phẩm mua ngay từ store không
    if (store.checkoutItems && store.checkoutItems.length > 0) {
        console.log('Đã nhận sản phẩm mua ngay từ store:', store.checkoutItems);

        // Xử lý và chuẩn hóa dữ liệu đơn hàng
        orderItems.value = store.checkoutItems.map(item => {
            // Đảm bảo các giá trị số đều được chuyển đổi đúng định dạng
            const processedItem = {
                ...item,
                // Sử dụng gia hoặc price tùy theo field có sẵn
                gia: Number(item.gia || item.price || 0),
                price: Number(item.gia || item.price || 0),
                so_luong: Number(item.so_luong || item.quantity || 1),
                quantity: Number(item.so_luong || item.quantity || 1)
            };

            console.log('Đã xử lý sản phẩm:', processedItem);
            return processedItem;
        });
    }
    // Hoặc kiểm tra nếu có dữ liệu query từ route
    else if (route.query.data) {
        try {
            const productData = JSON.parse(atob(route.query.data));
            console.log('Đã nhận dữ liệu sản phẩm từ query params:', productData);

            // Xử lý và chuẩn hóa dữ liệu đơn hàng
            const processedData = Array.isArray(productData) ? productData : [productData];
            orderItems.value = processedData.map(item => {
                return {
                    ...item,
                    // Đảm bảo các giá trị số đều được chuyển đổi đúng định dạng
                    gia: Number(item.gia || item.price || 0),
                    price: Number(item.gia || item.price || 0),
                    so_luong: Number(item.so_luong || item.quantity || 1),
                    quantity: Number(item.so_luong || item.quantity || 1)
                };
            });
        } catch (error) {
            console.error('Lỗi khi phân tích dữ liệu sản phẩm:', error);
            message.error('Không thể đọc thông tin sản phẩm');
        }
    }

    // Fetch initial data
    await Promise.all([
        fetchCustomerData(),
        fetchCustomerAddresses(),
        fetchProvinces(),
        fetchVouchers() // Load vouchers on mount
    ]);
});

// Voucher management
const voucherModalVisible = ref(false);
const availableVouchers = ref([]);
const allVouchers = ref([]);

// Fetch vouchers from store
const fetchVouchers = async () => {
    try {
        const response = await store.getAllVouchers();
        if (response && response.content) {
            allVouchers.value = response.content;
            filterValidVouchers();
            console.log('Loaded vouchers:', allVouchers.value);
        }
    } catch (error) {
        console.error('Error loading vouchers:', error);
        message.error('Không thể tải danh sách voucher');
    }
};

// Filter valid vouchers based on current order and date
const filterValidVouchers = () => {
    const currentDate = getCurrentDateVN();

    availableVouchers.value = allVouchers.value.filter(voucher => {
        // Kiểm tra ngày hiệu lực
        const startDate = new Date(voucher.ngayBatDau);
        const endDate = new Date(voucher.ngayHetHan);
        const isDateValid = startDate <= currentDate && endDate >= currentDate;

        // Kiểm tra trạng thái voucher
        const isStatusValid = voucher.trangThai === 'Đang diễn ra';

        // Kiểm tra số lượng còn lại
        const hasQuantity = voucher.soLuong > 0;

        // Kiểm tra giá trị tối thiểu của đơn hàng
        const meetsMinValue = subtotal.value >= voucher.giaTriToiThieu;

        // Lưu thông tin kiểm tra vào voucher để hiển thị lý do nếu không thỏa mãn
        return isDateValid && isStatusValid && hasQuantity && meetsMinValue;
    }).map(voucher => {
        return {
            id: voucher.id,
            ma: voucher.maVoucher,
            ten: voucher.tenVoucher,
            mo_ta: voucher.moTa,
            loai: voucher.kieuGiamGia === 'Phần trăm' ? 'percent' : 'fixed',
            gia_tri: voucher.giaTriGiam,
            dieu_kien: voucher.giaTriToiThieu,
            gia_tri_toi_da: voucher.giaTriToiDa,
            ngay_bat_dau: voucher.ngayBatDau,
            ngay_bat_dau_fmt: formatDateVN(voucher.ngayBatDau),
            ngay_het_han: voucher.ngayHetHan,
            ngay_het_han_fmt: formatDateVN(voucher.ngayHetHan),
            trang_thai: voucher.trangThai,
            so_luong: voucher.soLuong
        };
    });

    console.log('Filtered vouchers:', availableVouchers.value);
};

// Watch for changes in subtotal to update available vouchers
watch(subtotal, () => {
    filterValidVouchers();
});

// Show voucher selection modal
const showVoucherModal = async () => {
    // Reload vouchers to ensure we have the latest data
    await fetchVouchers();
    voucherModalVisible.value = true;
};

// Check if a voucher is valid to use
const isVoucherValid = (voucher) => {
    if (voucher.dieu_kien > 0 && subtotal.value < voucher.dieu_kien) {
        return false;
    }

    // Check if voucher is in the valid date range
    const currentDate = getCurrentDateVN();
    const startDate = new Date(voucher.ngay_bat_dau);
    const endDate = new Date(voucher.ngay_het_han);
    if (currentDate < startDate || currentDate > endDate) {
        return false;
    }

    // Check voucher status
    if (voucher.trang_thai !== 'Đang diễn ra') {
        return false;
    }

    // Check if voucher has quantity left
    if (voucher.so_luong <= 0) {
        return false;
    }

    return true;
};

// Check if a voucher is already selected
const isVoucherSelected = (voucher) => {
    return appliedCoupons.value.some(c => c.ma === voucher.ma);
};

// Toggle voucher selection
const toggleVoucher = (voucher) => {
    if (isVoucherSelected(voucher)) {
        // Remove voucher
        const index = appliedCoupons.value.findIndex(c => c.ma === voucher.ma);
        if (index !== -1) {
            appliedCoupons.value.splice(index, 1);
            message.success('Đã bỏ áp dụng mã giảm giá');
        }
    } else {
        // Add voucher if valid
        if (isVoucherValid(voucher)) {
            appliedCoupons.value.push(voucher);
            message.success('Áp dụng mã giảm giá thành công');

            // Update discount calculations
            calculateOrderTotals();
        } else {
            message.warning(`Đơn hàng chưa đạt điều kiện áp dụng mã (tối thiểu ${formatCurrency(voucher.dieu_kien)})`);
        }
    }
};

// Select a voucher (just for handling UI interaction)
const selectVoucher = (voucher) => {
    // Only for UI highlighting purposes, actual selection happens in toggleVoucher
    if (!isVoucherValid(voucher)) {
        message.warning(`Đơn hàng chưa đạt điều kiện áp dụng mã (tối thiểu ${formatCurrency(voucher.dieu_kien)})`);
    }
};

// Đặt ở cuối script setup, trước khi đóng thẻ script
// Theo dõi sự thay đổi của selectedAddressId để cập nhật địa chỉ hiển thị
watch(selectedAddressId, (newIndex) => {
    if (typeof newIndex === 'number' && store.danhSachDiaChi && store.danhSachDiaChi[newIndex]) {
        const selectedAddr = store.danhSachDiaChi[newIndex];
        
        if (selectedAddr) {
            console.log('Đã tìm thấy địa chỉ được chọn:', selectedAddr);
            
            // Cập nhật thông tin địa chỉ vào form
            customer.value = {
                ...customer.value, // Giữ nguyên thông tin cá nhân hiện tại
                tinh_thanh_pho: selectedAddr.tinh_thanh_pho,
                quan_huyen: selectedAddr.quan_huyen,
                xa_phuong: selectedAddr.xa_phuong,
                so_nha: selectedAddr.so_nha
            };
            
            console.log('Đã cập nhật form với thông tin mới:', customer.value);
        }
    }
});

// Address deletion
const confirmDeleteAddress = (address) => {
    if (address.dia_chi_mac_dinh) {
        message.warning('Không thể xóa địa chỉ mặc định');
        return;
    }

    // Show confirmation dialog
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?');

    if (confirmDelete) {
        deleteAddress(address.id);
    }
};

const deleteAddress = (addressId) => {
    // Find address index
    const index = customerAddresses.value.findIndex(addr => addr.id === addressId);

    if (index !== -1) {
        // Remove the address
        customerAddresses.value.splice(index, 1);

        // If the deleted address was selected, select another one
        if (selectedAddressId.value === addressId) {
            if (customerAddresses.value.length > 0) {
                // Find default address or use the first one
                const defaultAddress = customerAddresses.value.find(addr => addr.dia_chi_mac_dinh);
                selectedAddressId.value = defaultAddress ? defaultAddress.id : customerAddresses.value[0].id;
            } else {
                selectedAddressId.value = null;
            }
        }

        message.success('Đã xóa địa chỉ thành công');
    }
};

// Thêm computed property để lấy địa chỉ đã chọn
const selectedAddress = computed(() => {
    if (!selectedAddressId.value) return null;
    return customerAddresses.value.find(addr => addr.id === selectedAddressId.value);
});

// Trong phần script, thêm các hàm xử lý thanh toán ZaloPay

</script>

<style scoped>
/* General styles */
.checkout-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
}

.breadcrumb-container {
    margin-bottom: 20px;
}

.breadcrumb {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

.breadcrumb-item {
    display: inline-block;
    font-size: 14px;
}

.breadcrumb-item+.breadcrumb-item::before {
    content: '/';
    padding: 0 8px;
    color: #6c757d;
}

.breadcrumb-item a {
    color: #007bff;
    text-decoration: none;
}

.breadcrumb-item.active {
    color: #6c757d;
}

/* Order Timeline */
.order-timeline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    position: relative;
    padding: 0 20px;
}

.timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
}

.step-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    border: 2px solid #ddd;
    color: #6c757d;
    transition: all 0.3s ease;
}

.timeline-step.active .step-icon {
    background-color: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
}

.timeline-step.completed .step-icon {
    background-color: #f6ffed;
    border-color: #52c41a;
    color: #52c41a;
}

.step-label {
    font-size: 14px;
    font-weight: 500;
    color: #6c757d;
    transition: all 0.3s ease;
}

.timeline-step.active .step-label {
    color: #1890ff;
    font-weight: 600;
}

.timeline-step.completed .step-label {
    color: #52c41a;
    font-weight: 600;
}

.timeline-connector {
    height: 2px;
    background-color: #ddd;
    flex: 1;
    margin: 0 10px;
    position: relative;
    top: -25px;
    z-index: 1;
    transition: all 0.3s ease;
}

.timeline-connector.active {
    background-color: #1890ff;
}

/* Main content layout */
.checkout-main-content {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.checkout-info-section {
    flex: 2;
    min-width: 300px;
}

.checkout-summary-section {
    flex: 1;
    min-width: 300px;
}

.section-box {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 20px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    width: 50px;
    background-color: #1890ff;
}

/* Customer info */
.customer-info {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
}

.info-group {
    margin-bottom: 15px;
}

.info-group p {
    margin: 8px 0;
    font-size: 14px;
}

.info-label {
    font-weight: 600;
    color: #555;
    margin-right: 10px;
    min-width: 100px;
    display: inline-block;
}

/* Address section */
.address-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.address-item {
    position: relative;
    transition: all 0.3s ease;
}

.address-radio {
    display: block;
    width: 100%;
}

.address-content {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
    margin-left: 10px;
    transition: all 0.3s ease;
}

.address-radio:hover .address-content {
    background-color: #f0f7ff;
}

.address-radio:has(:checked) .address-content {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
}

.address-name {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 5px;
}

.address-phone {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.address-full {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
}

.address-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.action-link {
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;
}

.action-link:hover {
    text-decoration: underline;
}

.action-link.delete {
    color: #ff4d4f;
}

.action-link.delete:hover {
    color: #ff7875;
}

.add-address-button {
    margin-top: 15px;
}

/* Payment methods */
.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.payment-method-item {
    position: relative;
    transition: all 0.3s ease;
}

.payment-radio {
    display: block;
    width: 100%;
}

.payment-content {
    display: flex;
    align-items: center;
    gap: 15px;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
    margin-left: 10px;
    transition: all 0.3s ease;
}

.payment-radio:hover .payment-content {
    background-color: #f0f7ff;
}

.payment-radio:has(:checked) .payment-content {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
}

.payment-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1890ff;
}

.payment-info {
    flex: 1;
}

.payment-name {
    font-weight: 600;
    margin-bottom: 5px;
}

.payment-desc {
    font-size: 13px;
    color: #666;
}

/* Online payment methods */
.online-payment-options {
    margin-top: 15px;
    padding: 15px;
    background-color: #fafafa;
    border-radius: 6px;
    border: 1px dashed #ddd;
}

.online-methods {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.online-method-item {
    flex: 1;
    min-width: 150px;
}

.online-radio {
    display: block;
    width: 100%;
}

.online-content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid #eee;
    transition: all 0.3s ease;
}

.online-radio:hover .online-content {
    background-color: #f0f7ff;
}

.online-radio:has(:checked) .online-content {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
}

.online-logo {
    width: 30px;
    height: 30px;
    object-fit: contain;
}

/* Order summary section */
.order-products {
    max-height: 350px;
    overflow-y: auto;
    margin-bottom: 20px;
    padding-right: 5px;
}

.product-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.product-image {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-quantity {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #1890ff;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
}

.product-details {
    flex: 1;
}

.product-name {
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 14px;
}

.product-variant {
    font-size: 13px;
    color: #666;
}

.product-price {
    font-weight: 600;
    color: #ff4d4f;
    font-size: 15px;
    white-space: nowrap;
}

/* Coupon section */
.coupon-section {
    margin-bottom: 20px;
}

.applied-coupons {
    margin-top: 15px;
}

.applied-coupon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    background: linear-gradient(45deg, #f6ffed, #e6f7ff);
    border: 1px solid #b7eb8f;
    border-radius: 6px;
    margin-bottom: 10px;
    overflow: hidden;
    position: relative;
}

.coupon-info {
    display: flex;
    flex: 1;
}

.coupon-badge {
    width: 60px;
    background-color: #52c41a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 12px 5px;
    text-align: center;
    text-transform: uppercase;
    position: relative;
}

.coupon-details {
    padding: 10px 15px;
    flex: 1;
}

.coupon-value {
    font-weight: 700;
    font-size: 16px;
    color: #52c41a;
    margin-bottom: 3px;
}

.coupon-code {
    font-weight: 600;
    margin-bottom: 3px;
    color: #555;
}

.coupon-desc {
    font-size: 12px;
    color: #666;
    margin: 0;
}

.remove-coupon-btn {
    margin-right: 5px;
    margin-top: -5px;
}

/* Voucher modal styling */
.voucher-list {
    max-height: 400px;
    overflow-y: auto;
}

.voucher-item {
    display: flex;
    margin-bottom: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
}

.voucher-item:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.voucher-item.disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.voucher-item.selected {
    border-color: #1890ff;
    background-color: #e6f7ff;
}

.voucher-left {
    width: 80px;
    position: relative;
}

.voucher-badge {
    height: 100%;
    background-color: #1890ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 12px 5px;
    text-align: center;
    text-transform: uppercase;
    position: relative;
}

.voucher-badge::after {
    content: "";
    position: absolute;
    right: -8px;
    top: 0;
    bottom: 0;
    width: 16px;
    background-image: radial-gradient(circle at 0 50%, transparent 8px, #1890ff 8px);
    background-size: 16px 16px;
    background-repeat: repeat-y;
}

.voucher-item.disabled .voucher-badge {
    background-color: #bfbfbf;
}

.voucher-item.selected .voucher-badge {
    background-color: #52c41a;
}

.voucher-content {
    padding: 15px;
    flex: 1;
}

.voucher-value {
    font-weight: 700;
    font-size: 16px;
    color: #1890ff;
    margin-bottom: 5px;
}

.voucher-item.selected .voucher-value {
    color: #52c41a;
}

.voucher-code {
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

.voucher-desc {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
}

.voucher-condition {
    font-size: 12px;
    color: #ff4d4f;
    margin-bottom: 5px;
}

.voucher-expiry {
    font-size: 12px;
    color: #999;
    margin: 0;
}

.voucher-right {
    width: 100px;
    padding: 15px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.voucher-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

/* Order summary */
.order-summary {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 14px;
}

.item-label {
    color: #666;
}

.item-value {
    font-weight: 600;
    color: #333;
}

.item-value.discount {
    color: #52c41a;
}

.summary-item.total {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-size: 16px;
}

.summary-item.total .item-label {
    color: #333;
    font-weight: 600;
}

.summary-item.total .item-value {
    color: #ff4d4f;
    font-size: 18px;
}

.order-actions {
    margin-top: 20px;
}

/* Address modal */
:deep(.ant-form-item) {
    margin-bottom: 15px;
}

:deep(.ant-modal-footer) {
    border-top: 1px solid #f0f0f0;
    padding: 10px 16px;
}

/* Responsive styles */
@media (max-width: 992px) {
    .checkout-main-content {
        flex-direction: column;
    }

    .checkout-info-section,
    .checkout-summary-section {
        width: 100%;
    }

    .online-methods {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .order-timeline {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        padding-left: 30px;
    }

    .timeline-step {
        flex-direction: row;
        align-items: center;
        width: 100%;
    }

    .step-icon {
        margin-bottom: 0;
        margin-right: 15px;
    }

    .timeline-connector {
        height: 100%;
        width: 2px;
        position: absolute;
        left: 30px;
        top: 0;
        bottom: 0;
        margin: 0;
    }
}

@media (max-width: 576px) {
    .section-box {
        padding: 15px;
    }

    .product-item {
        flex-wrap: wrap;
    }

    .product-price {
        width: 100%;
        margin-top: 10px;
        text-align: right;
    }

    .step-label {
        font-size: 12px;
    }
}

/* Animation effects */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-box {
    animation: fadeIn 0.3s ease-in-out;
}

/* Select voucher button */
.select-voucher-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* CSS cho modal */
.address-modal,
.voucher-modal {

    /* Đảm bảo modal hiển thị lên trên */
    :deep(.ant-modal) {
        top: 50px;
    }

    :deep(.ant-modal-content) {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    :deep(.ant-modal-header) {
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 24px;
    }

    :deep(.ant-modal-title) {
        font-weight: 600;
        font-size: 16px;
    }
}

/* Styles cho địa chỉ đã chọn */
.subsection-title {
    font-size: 16px;
    font-weight: 500;
    margin: 20px 0 10px;
    color: #333;
}

.selected-address-info {
    border-top: 1px dashed #ddd;
    margin-top: 15px;
    padding-top: 15px;
}

.address-display {
    background-color: #f0f7ff;
    padding: 15px;
    border-radius: 6px;
    border-left: 3px solid #1890ff;
}

.address-display-name {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 5px;
}

.address-display-phone {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.address-display-full {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 0;
}

/* Form styling */
.shipping-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
}

.form-item {
    flex: 1;
    margin-bottom: 0;
}

.form-item.full-width {
    flex: 0 0 100%;
}

.form-item.checkbox-item {
    margin-top: 8px;
}

:deep(.ant-form-item-label) {
    padding-bottom: 4px;
}

:deep(.ant-form-item-label > label) {
    font-weight: 500;
    color: #333;
    font-size: 14px;
}

:deep(.ant-input),
:deep(.ant-select-selector) {
    border-radius: 6px;
    border-color: #d9d9d9;
    height: 40px;
    padding: 4px 11px;
    transition: all 0.3s;
}

:deep(.ant-input:hover),
:deep(.ant-select-selector:hover) {
    border-color: #40a9ff;
}

:deep(.ant-input:focus),
:deep(.ant-select-selector:focus) {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

:deep(.ant-select-disabled .ant-select-selector) {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, 0.25);
}

:deep(.ant-checkbox-wrapper) {
    font-size: 14px;
    color: #666;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: #1890ff;
    border-color: #1890ff;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
    border-color: #40a9ff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 16px;
    }

    .form-item {
        width: 100%;
    }

    .shipping-form {
        padding: 15px;
    }
}

.default-tag {
    font-size: 12px;
    color: #52c41a;
    font-weight: normal;
    margin-left: 8px;
}

.empty-address-message {
    color: #999;
    font-style: italic;
    margin-bottom: 15px;
}

.add-address-btn {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.section-header .section-title {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.section-header .section-title::after {
    display: none;
}
</style>