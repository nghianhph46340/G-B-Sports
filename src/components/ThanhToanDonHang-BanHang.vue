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
                    <h2 class="section-title">Thông tin khách hàng</h2>
                    <div class="customer-info" v-if="customer">
                        <div class="info-group">
                            <p><span class="info-label">Họ tên:</span> {{ customer.ho_ten }}</p>
                            <p><span class="info-label">Số điện thoại:</span> {{ customer.so_dien_thoai }}</p>
                            <p><span class="info-label">Email:</span> {{ customer.email }}</p>
                        </div>
                    </div>

                    <!-- Hiển thị địa chỉ đã chọn -->
                    <div class="selected-address-info" v-if="selectedAddress">
                        <h3 class="subsection-title">Địa chỉ giao hàng đã chọn</h3>
                        <div class="address-display">
                            <p class="address-display-name">{{ selectedAddress.ten_nguoi_nhan }}</p>
                            <p class="address-display-phone">{{ selectedAddress.so_dien_thoai }}</p>
                            <p class="address-display-full">
                                {{ selectedAddress.dia_chi_cu_the }}, {{ selectedAddress.xa_phuong }},
                                {{ selectedAddress.quan_huyen }}, {{ selectedAddress.tinh_thanh }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="section-box">
                    <h2 class="section-title">Địa chỉ giao hàng</h2>
                    <a-radio-group v-model:value="selectedAddressId" class="address-list">
                        <div v-for="address in customerAddresses" :key="address.id" class="address-item">
                            <a-radio :value="address.id" class="address-radio">
                                <div class="address-content">
                                    <p class="address-name">{{ address.ten_nguoi_nhan }}</p>
                                    <p class="address-phone">{{ address.so_dien_thoai }}</p>
                                    <p class="address-full">
                                        {{ address.dia_chi_cu_the }}, {{ address.xa_phuong }},
                                        {{ address.quan_huyen }}, {{ address.tinh_thanh }}
                                    </p>
                                    <div class="address-actions">
                                        <a-tag v-if="address.mac_dinh" color="blue">Mặc định</a-tag>
                                        <a class="action-link" @click.stop="editAddress(address)">Sửa</a>
                                        <a class="action-link delete" v-if="!address.mac_dinh"
                                            @click.stop="confirmDeleteAddress(address)">Xóa</a>
                                    </div>
                                </div>
                            </a-radio>
                        </div>
                    </a-radio-group>

                    <div class="add-address-button">
                        <a-button type="dashed" @click="showAddAddressModal" block>
                            <plus-outlined />Thêm địa chỉ mới
                        </a-button>
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
                                        <p class="payment-desc">Thanh toán bằng tiền mặt khi nhận hàng</p>
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
                                    {{ item.ten_mau_sac }} / {{ item.ten_kich_thuoc }}
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
            </div>
        </div>

        <!-- Address Modal -->
        <a-modal v-model:visible="addressModalVisible" :title="isEditingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'"
            @ok="saveAddress" :zIndex="1050" :mask-closable="false" class="address-modal">
            <a-form :model="addressForm" layout="vertical">
                <a-form-item label="Họ tên người nhận" name="ten_nguoi_nhan" required>
                    <a-input v-model:value="addressForm.ten_nguoi_nhan" placeholder="Nhập họ tên người nhận" />
                </a-form-item>
                <a-form-item label="Số điện thoại" name="so_dien_thoai" required>
                    <a-input v-model:value="addressForm.so_dien_thoai" placeholder="Nhập số điện thoại" />
                </a-form-item>
                <a-form-item label="Tỉnh/Thành phố" name="tinh_thanh" required>
                    <a-select v-model:value="addressForm.tinh_thanh" placeholder="Chọn Tỉnh/Thành phố"
                        @change="handleProvinceChange" :loading="loadingProvinces">
                        <a-select-option v-for="province in provinces" :key="province.code" :value="province.name">
                            {{ province.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Quận/Huyện" name="quan_huyen" required>
                    <a-select v-model:value="addressForm.quan_huyen" placeholder="Chọn Quận/Huyện"
                        @change="handleDistrictChange" :loading="loadingDistricts" :disabled="!addressForm.tinh_thanh">
                        <a-select-option v-for="district in districts" :key="district.code" :value="district.name">
                            {{ district.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Phường/Xã" name="xa_phuong" required>
                    <a-select v-model:value="addressForm.xa_phuong" placeholder="Chọn Phường/Xã" :loading="loadingWards"
                        :disabled="!addressForm.quan_huyen">
                        <a-select-option v-for="ward in wards" :key="ward.code" :value="ward.name">
                            {{ ward.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Địa chỉ cụ thể" name="dia_chi_cu_the" required>
                    <a-textarea v-model:value="addressForm.dia_chi_cu_the" placeholder="Số nhà, tên đường..."
                        :rows="2" />
                </a-form-item>
                <a-form-item name="mac_dinh">
                    <a-checkbox v-model:checked="addressForm.mac_dinh">Đặt làm địa chỉ mặc định</a-checkbox>
                </a-form-item>
            </a-form>
        </a-modal>

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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import axios from 'axios';
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

const router = useRouter();
const route = useRoute();
const store = useGbStore();

// Timeline status
const currentStatus = ref(2); // 1: Cart, 2: Checkout, 3: Order, 4: Complete

// Customer information
const customer = ref({
    id: 1,
    ho_ten: 'Nguyễn Văn A',
    so_dien_thoai: '0987654321',
    email: 'nguyenvana@example.com'
});

// Customer addresses
const customerAddresses = ref([
    {
        id: 1,
        ten_nguoi_nhan: 'Nguyễn Văn A',
        so_dien_thoai: '0987654321',
        tinh_thanh: 'Hồ Chí Minh',
        quan_huyen: 'Quận 1',
        xa_phuong: 'Phường Bến Nghé',
        dia_chi_cu_the: '123 Đường Lê Lợi',
        mac_dinh: true
    },
    {
        id: 2,
        ten_nguoi_nhan: 'Nguyễn Văn A',
        so_dien_thoai: '0987654321',
        tinh_thanh: 'Hà Nội',
        quan_huyen: 'Quận Hai Bà Trưng',
        xa_phuong: 'Phường Bách Khoa',
        dia_chi_cu_the: '456 Đường Lê Thanh Nghị',
        mac_dinh: false
    }
]);
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
    tinh_thanh: '',
    quan_huyen: '',
    xa_phuong: '',
    dia_chi_cu_the: '',
    mac_dinh: false
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

// Computed values for order summary
const subtotal = computed(() => {
    return orderItems.value.reduce((total, item) => total + (item.gia * item.so_luong), 0);
});

// Calculate discount based on applied vouchers
const calculateDiscount = () => {
    let totalDiscount = 0;

    appliedCoupons.value.forEach(voucher => {
        let discountAmount = 0;

        if (voucher.loai === 'percent') {
            // Percentage discount
            discountAmount = subtotal.value * (voucher.gia_tri / 100);

            // Cap discount at maximum value if set
            if (voucher.gia_tri_toi_da && discountAmount > voucher.gia_tri_toi_da) {
                discountAmount = voucher.gia_tri_toi_da;
            }
        } else if (voucher.loai === 'fixed') {
            // Fixed amount discount
            discountAmount = voucher.gia_tri;
        }

        totalDiscount += discountAmount;
    });

    return totalDiscount;
};

const discount = computed(() => {
    return calculateDiscount();
});

const shippingFee = computed(() => {
    // Base shipping fee - free shipping for orders over 500,000 VND
    let fee = subtotal.value > 500000 ? 0 : 30000;

    // Apply shipping vouchers
    const shippingVoucher = appliedCoupons.value.find(c => c.loai === 'shipping');
    if (shippingVoucher) {
        fee = Math.max(0, fee - shippingVoucher.gia_tri);
    }

    return fee;
});

const grandTotal = computed(() => {
    return subtotal.value - discount.value + shippingFee.value;
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

// Fetch customer addresses
const fetchCustomerAddresses = async () => {
    try {
        // In a real app, this would fetch from an API
        // await store.getCustomerAddresses();
        // customerAddresses.value = store.customerAddresses;
        // Set the default address as selected
        const defaultAddress = customerAddresses.value.find(addr => addr.mac_dinh);
        if (defaultAddress) {
            selectedAddressId.value = defaultAddress.id;
        } else if (customerAddresses.value.length > 0) {
            selectedAddressId.value = customerAddresses.value[0].id;
        }
        console.log('Fetched customer addresses');
    } catch (error) {
        console.error('Error fetching customer addresses:', error);
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
        tinh_thanh: '',
        quan_huyen: '',
        xa_phuong: '',
        dia_chi_cu_the: '',
        mac_dinh: false
    });
    addressModalVisible.value = true;
};

// Edit existing address
const editAddress = (address) => {
    isEditingAddress.value = true;
    Object.assign(addressForm, { ...address });
    addressModalVisible.value = true;

    // Load districts and wards for the selected address
    if (addressForm.tinh_thanh) {
        handleProvinceChange(addressForm.tinh_thanh);
    }
    if (addressForm.quan_huyen) {
        handleDistrictChange(addressForm.quan_huyen);
    }
};

// Save address (add new or update existing)
const saveAddress = () => {
    // Validate form
    if (!addressForm.ten_nguoi_nhan || !addressForm.so_dien_thoai ||
        !addressForm.tinh_thanh || !addressForm.quan_huyen ||
        !addressForm.xa_phuong || !addressForm.dia_chi_cu_the) {
        message.error('Vui lòng điền đầy đủ thông tin địa chỉ');
        return;
    }

    let newAddressId; // Khai báo biến ở đầu hàm để có thể truy cập ở mọi nơi trong hàm

    if (isEditingAddress.value) {
        // Update existing address
        const index = customerAddresses.value.findIndex(addr => addr.id === addressForm.id);
        if (index !== -1) {
            customerAddresses.value[index] = { ...addressForm };

            // If setting as default, update other addresses
            if (addressForm.mac_dinh) {
                customerAddresses.value.forEach((addr, i) => {
                    if (i !== index) {
                        addr.mac_dinh = false;
                    }
                });
            }

            newAddressId = addressForm.id;
            message.success('Cập nhật địa chỉ thành công');
        }
    } else {
        // Add new address
        newAddressId = customerAddresses.value.length > 0
            ? Math.max(...customerAddresses.value.map(addr => addr.id)) + 1
            : 1;

        const newAddress = { ...addressForm, id: newAddressId };

        // If setting as default, update other addresses
        if (newAddress.mac_dinh) {
            customerAddresses.value.forEach(addr => {
                addr.mac_dinh = false;
            });
        }

        customerAddresses.value.push(newAddress);
        message.success('Thêm địa chỉ mới thành công');
    }

    // Set as selected address
    selectedAddressId.value = newAddressId;

    // Close modal
    addressModalVisible.value = false;
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

// Place order
const placeOrder = async () => {
    // Validate if address is selected
    if (!selectedAddressId.value) {
        message.warning('Vui lòng chọn địa chỉ giao hàng');
        return;
    }

    try {
        placing.value = true;

        // Calculate and log the complete invoice
        const orderData = calculateOrderTotals();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Handle different payment methods
        if (selectedPaymentMethod.value === 'online') {
            // Redirect to payment gateway
            message.success('Đang chuyển hướng đến cổng thanh toán...');

            // Simulate redirect to payment gateway
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, this would redirect to a payment gateway
            // window.location.href = paymentUrl;

            // For demo purposes, we'll just update the status and continue
            currentStatus.value = 3;

            // Simulate payment completion
            setTimeout(() => {
                currentStatus.value = 4;
                message.success('Đặt hàng thành công!');
                // router.push('/order-complete');
            }, 2000);
        } else {
            // COD payment - immediately mark as ordered
            currentStatus.value = 3;

            setTimeout(() => {
                currentStatus.value = 4;
                message.success('Đặt hàng thành công!');
                // router.push('/order-complete');
            }, 1000);
        }

        placing.value = false;
    } catch (error) {
        console.error('Error placing order:', error);
        message.error('Không thể đặt hàng. Vui lòng thử lại sau.');
        placing.value = false;
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
        orderItems.value = [...store.checkoutItems];
    }
    // Hoặc kiểm tra nếu có dữ liệu query từ route
    else if (route.query.data) {
        try {
            const productData = JSON.parse(atob(route.query.data));
            console.log('Đã nhận dữ liệu sản phẩm từ query params:', productData);
            orderItems.value = Array.isArray(productData) ? productData : [productData];
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

// Calculate complete order totals and log to console
const calculateOrderTotals = () => {
    // Create complete invoice object
    const invoice = {
        customer: customer.value,
        shippingAddress: selectedAddress.value,
        orderItems: orderItems.value,
        payment: {
            method: selectedPaymentMethod.value,
            onlineMethod: selectedPaymentMethod.value === 'online' ? selectedOnlineMethod.value : null
        },
        totals: {
            subtotal: subtotal.value,
            discount: discount.value,
            shippingFee: shippingFee.value,
            total: grandTotal.value
        },
        appliedVouchers: appliedCoupons.value.map(voucher => ({
            id: voucher.id,
            code: voucher.ma,
            name: voucher.ten,
            type: voucher.loai,
            value: voucher.gia_tri,
            maxDiscount: voucher.gia_tri_toi_da
        })),
        note: orderNote.value,
        createdAt: getCurrentDateVN().toISOString(),
        createdAtVN: formatDateVN(new Date())
    };

    // Log complete invoice to console
    console.log('THÔNG TIN HÓA ĐƠN:', invoice);

    return invoice;
};

// Đặt ở cuối script setup, trước khi đóng thẻ script
// Theo dõi sự thay đổi của selectedAddressId để cập nhật địa chỉ hiển thị
watch(selectedAddressId, (newId) => {
    if (newId) {
        console.log('Selected address ID changed:', newId);
        // Có thể thêm logic cập nhật hiển thị địa chỉ ở đây nếu cần
    }
});

// Address deletion
const confirmDeleteAddress = (address) => {
    if (address.mac_dinh) {
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
                const defaultAddress = customerAddresses.value.find(addr => addr.mac_dinh);
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
</style>