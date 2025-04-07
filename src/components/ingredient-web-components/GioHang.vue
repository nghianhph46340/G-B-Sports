<template>
    <div class="cart-container">
        <!-- Breadcrumb -->
        <div class="breadcrumb-container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#" @click.prevent="goShopping">Trang chủ</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
                </ol>
            </nav>
        </div>

        <div class="cart-content">
            <div class="cart-header">
                <h1>Giỏ hàng của bạn</h1>
                <p class="cart-count" v-if="cartItems.length > 0">
                    Có {{ cartItems.length }} sản phẩm trong giỏ hàng
                </p>
            </div>

            <!-- Empty Cart State -->
            <div v-if="cartItems.length === 0" class="empty-cart">
                <shopping-cart-outlined class="empty-cart-icon" />
                <h2>Giỏ hàng trống</h2>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <a-button type="primary" size="large" @click="goShopping">
                    Tiếp tục mua sắm
                </a-button>
            </div>

            <!-- Cart Items -->
            <div v-else class="cart-items">
                <div class="cart-items-list">
                    <div class="cart-toolbar">
                        <a-checkbox :checked="isAllSelected" @change="e => selectAll(e.target.checked)">
                            <span class="select-all-text">Chọn tất cả ({{ cartItems.length }} sản phẩm)</span>
                        </a-checkbox>
                        <a-button type="text" danger @click="removeSelectedItems"
                            :disabled="selectedItems.length === 0">
                            <delete-outlined />
                            Xóa đã chọn
                        </a-button>
                    </div>

                    <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
                        <a-checkbox :checked="selectedItems.includes(index)" @change="e => {
                            if (e.target.checked) {
                                selectedItems.push(index);
                            } else {
                                selectedItems = selectedItems.filter(i => i !== index);
                            }
                        }"></a-checkbox>

                        <div class="cart-item-content">
                            <div class="col-product">
                                <div class="product-image">
                                    <img :src="item.image" :alt="item.name">
                                </div>
                                <div class="product-info">
                                    <h3 class="product-name">{{ item.name }}</h3>
                                    <div class="product-variant" v-if="item.color || item.size">
                                        <span v-if="item.color">Màu: {{ item.color }}</span>
                                        <span v-if="item.size">Size: {{ item.size }}</span>
                                    </div>
                                    <div class="product-price">
                                        <span class="current-price">{{ formatCurrency(item.price) }}</span>
                                        <span class="original-price"
                                            v-if="item.originalPrice && item.originalPrice > item.price">
                                            {{ formatCurrency(item.originalPrice) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-quantity">
                                <div class="quantity-controls">
                                    <a-button class="quantity-btn" @click="updateQuantity(index, -1)"
                                        :disabled="item.quantity <= 1">
                                        <minus-outlined />
                                    </a-button>
                                    <span class="quantity-value">{{ item.quantity }}</span>
                                    <a-button class="quantity-btn" @click="updateQuantity(index, 1)"
                                        :disabled="item.quantity >= item.maxQuantity">
                                        <plus-outlined />
                                    </a-button>
                                </div>
                            </div>

                            <div class="col-total">
                                <span class="total">{{ formatCurrency(item.price * item.quantity) }}</span>
                            </div>

                            <div class="col-action">
                                <a-button type="text" danger class="remove-btn" @click="removeItem(index)">
                                    <delete-outlined />
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cart-summary">
                    <div class="summary-header">
                        <h2>Tóm tắt đơn hàng</h2>
                    </div>

                    <div class="summary-body">
                        <div class="summary-row">
                            <span class="summary-label">Số lượng đã chọn:</span>
                            <span class="summary-value">{{ totalSelectedQuantity }} sản phẩm</span>
                        </div>

                        <div class="summary-row">
                            <span class="summary-label">Tổng tiền:</span>
                            <span class="summary-value total-price">{{ formatCurrency(totalSelectedPrice) }}</span>
                        </div>

                        <div class="summary-note">
                            <p>* Phí vận chuyển sẽ được tính ở trang thanh toán</p>
                        </div>

                        <div class="summary-actions">
                            <a-button type="primary" block size="large" @click="proceedToCheckout"
                                :disabled="selectedItems.length === 0">
                                Thanh toán
                            </a-button>
                            <a-button block @click="goShopping" class="mt-3">
                                Tiếp tục mua sắm
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ShoppingCartOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useGbStore } from '@/stores/gbStore';

const router = useRouter();
const store = useGbStore();
const cartItems = ref([]);
const selectedItems = ref([]);

// Tải giỏ hàng từ localStorage
const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('gb-sport-cart');
        if (savedCart) {
            cartItems.value = JSON.parse(savedCart);
            console.log('Đã tải giỏ hàng:', cartItems.value.length, 'sản phẩm');
        } else {
            cartItems.value = [];
            console.log('Không có sản phẩm trong giỏ hàng');
        }
    } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
        cartItems.value = [];
    }
};

// Lưu giỏ hàng vào localStorage và thông báo cập nhật
const saveCartToLocalStorage = () => {
    localStorage.setItem('gb-sport-cart', JSON.stringify(cartItems.value));

    // Phát ra sự kiện custom để cập nhật các component khác
    window.dispatchEvent(new CustomEvent('cart-updated'));
};

// Tính tổng số tiền của các sản phẩm đã chọn
const totalSelectedPrice = computed(() => {
    let total = 0;
    for (const index of selectedItems.value) {
        if (index < cartItems.value.length) {
            const item = cartItems.value[index];
            total += item.price * item.quantity;
        }
    }
    return total;
});

// Tính tổng số lượng sản phẩm đã chọn
const totalSelectedQuantity = computed(() => {
    let total = 0;
    for (const index of selectedItems.value) {
        if (index < cartItems.value.length) {
            total += cartItems.value[index].quantity;
        }
    }
    return total;
});

// Định dạng tiền tệ
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};

// Xử lý chọn tất cả sản phẩm
const selectAll = (checked) => {
    if (checked) {
        selectedItems.value = [...Array(cartItems.value.length).keys()];
    } else {
        selectedItems.value = [];
    }
};

// Kiểm tra xem đã chọn tất cả chưa
const isAllSelected = computed(() => {
    return selectedItems.value.length === cartItems.value.length && cartItems.value.length > 0;
});

// Cập nhật số lượng sản phẩm
const updateQuantity = (index, change) => {
    const item = cartItems.value[index];
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
        return; // Không cho phép số lượng nhỏ hơn 1
    }

    if (newQuantity > item.maxQuantity) {
        message.warning(`Chỉ có tối đa ${item.maxQuantity} sản phẩm trong kho`);
        return;
    }

    item.quantity = newQuantity;
    saveCartToLocalStorage();
    message.success('Đã cập nhật số lượng sản phẩm');
};

// Xóa sản phẩm khỏi giỏ hàng
const removeItem = (index) => {
    cartItems.value.splice(index, 1);

    // Cập nhật lại danh sách sản phẩm đã chọn
    selectedItems.value = selectedItems.value
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i);

    saveCartToLocalStorage();
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
};

// Điều hướng đến trang sản phẩm
const goShopping = () => {
    router.push('/home');
};

// Xử lý thanh toán
const proceedToCheckout = () => {
    if (selectedItems.value.length === 0) {
        message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
        return;
    }

    // Lấy các sản phẩm đã chọn
    const selectedProducts = selectedItems.value.map(index => {
        const item = cartItems.value[index];
        // Đảm bảo các giá trị số là đúng định dạng
        return {
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            originalPrice: Number(item.originalPrice) || 0,
            maxQuantity: Number(item.maxQuantity) || 1,
            // Đổi tên field để khớp với cấu trúc dữ liệu của trang thanh toán
            id_chi_tiet_san_pham: item.id,
            ten_san_pham: item.name,
            hinh_anh: item.image,
            ten_mau_sac: item.color,
            ten_kich_thuoc: item.size,
            gia: Number(item.price) || 0,
            so_luong: Number(item.quantity) || 1,
            gia_goc: Number(item.originalPrice) || 0
        };
    });

    console.log('Sản phẩm đã chọn để thanh toán:', selectedProducts);

    // Lưu vào store để sử dụng ở trang thanh toán
    store.setCheckoutItems(selectedProducts);

    // Chuyển hướng đến trang thanh toán
    router.push('/thanhtoan-banhang');
};

// Xóa các sản phẩm đã chọn
const removeSelectedItems = () => {
    if (selectedItems.value.length === 0) {
        message.warning('Vui lòng chọn ít nhất một sản phẩm để xóa');
        return;
    }

    // Sắp xếp theo thứ tự giảm dần để xóa từ cuối lên
    const sortedIndexes = [...selectedItems.value].sort((a, b) => b - a);

    for (const index of sortedIndexes) {
        cartItems.value.splice(index, 1);
    }

    selectedItems.value = [];
    saveCartToLocalStorage();
    message.success('Đã xóa các sản phẩm đã chọn khỏi giỏ hàng');
};

// Tải giỏ hàng khi component được tạo
onMounted(() => {
    loadCartFromLocalStorage();
});
</script>

<style scoped>
.cart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
}

/* Breadcrumb styles */
.breadcrumb-container {
    margin-bottom: 30px;
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

/* Cart header */
.cart-header {
    margin-bottom: 30px;
}

.cart-header h1 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.cart-count {
    color: #666;
    font-size: 14px;
}

/* Empty cart state */
.empty-cart {
    text-align: center;
    padding: 60px 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
}

.empty-cart-icon {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
}

.empty-cart h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.empty-cart p {
    color: #666;
    margin-bottom: 20px;
    font-size: 16px;
}

/* Cart items */
.cart-items {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
}

@media (max-width: 992px) {
    .cart-items {
        grid-template-columns: 1fr;
    }
}

.cart-items-list {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.cart-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.select-all-text {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.cart-item {
    display: flex;
    align-items: flex-start;
    padding: 20px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

.cart-item:hover {
    background-color: #f9f9f9;
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-content {
    display: flex;
    flex: 1;
    margin-left: 15px;
    align-items: center;
}

@media (max-width: 768px) {
    .cart-item-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .col-quantity,
    .col-total,
    .col-action {
        margin-top: 15px;
        align-self: flex-start;
    }
}

.col-product {
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 15px;
}

.product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
    border: 1px solid #eee;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
    color: #333;
}

.product-variant {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.product-variant span {
    margin-right: 10px;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 8px;
}

.current-price {
    font-weight: 600;
    color: #f43f5e;
    font-size: 15px;
}

.original-price {
    color: #999;
    text-decoration: line-through;
    font-size: 13px;
}

.col-quantity {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.quantity-btn {
    background-color: #f5f5f5;
    border: none;
    border-radius: 0;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.quantity-btn:hover {
    background-color: #e0e0e0;
}

.quantity-value {
    padding: 0 12px;
    font-size: 14px;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
}

.col-total {
    font-weight: 600;
    color: #333;
    font-size: 16px;
    margin: 0 20px;
    min-width: 100px;
    text-align: right;
}

.col-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.remove-btn {
    color: #ff4d4f;
    transition: all 0.2s;
}

.remove-btn:hover {
    color: #ff7875;
    background-color: #fff1f0;
}

/* Summary section */
.cart-summary {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    height: fit-content;
}

.summary-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.summary-header h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.summary-body {
    margin-bottom: 20px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #eee;
}

.summary-row:last-of-type {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    font-size: 18px;
}

.summary-label {
    color: #666;
    font-weight: 500;
}

.summary-value {
    font-weight: 600;
    color: #333;
}

.summary-value.total-price {
    color: #ff4d4f;
    font-size: 20px;
    font-weight: 700;
}

.summary-note {
    margin-bottom: 20px;
    font-size: 13px;
    color: #666;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border-left: 3px solid #1890ff;
}

.summary-note p {
    margin: 0;
}

.summary-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.mt-3 {
    margin-top: 12px;
}
</style>