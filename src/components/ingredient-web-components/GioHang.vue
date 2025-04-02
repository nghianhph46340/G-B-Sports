<template>
    <div class="cart-container">
        <!-- Breadcrumb -->
        <div class="breadcrumb-container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
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
                <div class="cart-table">
                    <div class="table-header">
                        <div class="col-select">
                            <a-checkbox :checked="isAllSelected" :indeterminate="isIndeterminate"
                                @change="toggleSelectAll">
                                Chọn tất cả
                            </a-checkbox>
                        </div>
                        <div class="col-product">Sản phẩm</div>
                        <div class="col-price">Giá</div>
                        <div class="col-quantity">Số lượng</div>
                        <div class="col-total">Tổng</div>
                        <div class="col-action"></div>
                    </div>

                    <div class="table-body">
                        <div v-for="(item, index) in cartItems" :key="index" class="table-row">
                            <div class="col-select">
                                <a-checkbox v-model:checked="item.selected" @change="handleItemSelect" />
                            </div>
                            <div class="col-product">
                                <div class="product-info">
                                    <img :src="item.hinh_anh" :alt="item.ten_san_pham" class="product-image" />
                                    <div class="product-details">
                                        <h3 class="product-name">{{ item.ten_san_pham }}</h3>
                                        <div class="product-variants">
                                            <span class="variant-item">
                                                <span class="variant-label">Màu:</span>
                                                <span class="variant-value">{{ item.ten_mau_sac }}</span>
                                            </span>
                                            <span class="variant-item">
                                                <span class="variant-label">Size:</span>
                                                <span class="variant-value">{{ item.ten_kich_thuoc }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-price">
                                <span class="price">{{ formatCurrency(item.gia) }}</span>
                            </div>

                            <div class="col-quantity">
                                <div class="quantity-controls">
                                    <a-button class="quantity-btn" @click="updateQuantity(index, -1)"
                                        :disabled="item.so_luong <= 1">
                                        <minus-outlined />
                                    </a-button>
                                    <span class="quantity-value">{{ item.so_luong }}</span>
                                    <a-button class="quantity-btn" @click="updateQuantity(index, 1)"
                                        :disabled="item.so_luong >= item.so_luong_ton">
                                        <plus-outlined />
                                    </a-button>
                                </div>
                            </div>

                            <div class="col-total">
                                <span class="total">{{ formatCurrency(item.gia * item.so_luong) }}</span>
                            </div>

                            <div class="col-action">
                                <a-button type="text" danger class="remove-btn" @click="removeItem(index)">
                                    <delete-outlined />
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cart Summary -->
                <div class="cart-summary">
                    <div class="summary-header">
                        <h2>Tổng quan đơn hàng</h2>
                    </div>
                    <div class="summary-content">
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
                    <div class="summary-actions">
                        <a-button class="continue-shopping" @click="goShopping">
                            Tiếp tục mua sắm
                        </a-button>
                        <a-button type="primary" class="checkout-btn" @click="proceedToCheckout">
                            Thanh toán
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
    ShoppingCartOutlined,
    MinusOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue';
import { useGbStore } from '@/stores/gbStore';

const router = useRouter();
const store = useGbStore();

// Cart items
const cartItems = ref([

    // Add more items as needed
]);

// Selection state
const isAllSelected = computed(() => {
    return cartItems.value.length > 0 && cartItems.value.every(item => item.selected);
});

const isIndeterminate = computed(() => {
    const selectedCount = cartItems.value.filter(item => item.selected).length;
    return selectedCount > 0 && selectedCount < cartItems.value.length;
});

// Selection methods
const toggleSelectAll = (e) => {
    cartItems.value.forEach(item => {
        item.selected = e.target.checked;
    });
};

const handleItemSelect = () => {
    // This method is called when individual items are selected/deselected
};

// Updated computed values for selected items
const selectedItems = computed(() => {
    return cartItems.value.filter(item => item.selected);
});

const subtotal = computed(() => {
    return selectedItems.value.reduce((total, item) => total + (item.gia * item.so_luong), 0);
});

const discount = computed(() => {
    // Implement discount logic here
    return 0;
});

const shippingFee = computed(() => {
    return subtotal.value > 500000 ? 0 : 30000;
});

const grandTotal = computed(() => {
    return subtotal.value - discount.value + shippingFee.value;
});

// Methods
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const updateQuantity = (index, change) => {
    const item = cartItems.value[index];
    const newQuantity = item.so_luong + change;

    if (newQuantity >= 1 && newQuantity <= item.so_luong_ton) {
        item.so_luong = newQuantity;
    }
};

const removeItem = (index) => {
    cartItems.value.splice(index, 1);
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
};

const goShopping = () => {
    router.push('/san-pham');
};

const proceedToCheckout = () => {
    if (selectedItems.value.length === 0) {
        message.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
        return;
    }
    router.push('/thanh-toan');
};
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
    font-size: 24px;
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
}

.empty-cart-icon {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
}

.empty-cart h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
}

.empty-cart p {
    color: #666;
    margin-bottom: 20px;
}

/* Cart items */
.cart-items {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
}

.cart-table {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.table-header {
    display: grid;
    grid-template-columns: 40px 2fr 1fr 1fr 1fr 0.5fr;
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
    font-weight: 600;
    color: #333;
}

.table-body {
    padding: 10px 0;
}

.table-row {
    display: grid;
    grid-template-columns: 40px 2fr 1fr 1fr 1fr 0.5fr;
    padding: 20px;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.table-row:last-child {
    border-bottom: none;
}

/* Product info */
.product-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
}

.product-details {
    flex: 1;
}

.product-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.product-variants {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.variant-item {
    font-size: 12px;
    color: #666;
}

.variant-label {
    font-weight: 500;
    margin-right: 5px;
}

/* Price and total */
.price,
.total {
    font-weight: 600;
    color: #333;
}

/* Quantity controls */
.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-value {
    min-width: 30px;
    text-align: center;
    font-weight: 500;
}

/* Remove button */
.remove-btn {
    color: #ff4d4f;
}

.remove-btn:hover {
    color: #ff7875;
}

/* Cart summary */
.cart-summary {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    height: fit-content;
}

.summary-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.summary-header h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.summary-content {
    margin-bottom: 20px;
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

.summary-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.continue-shopping {
    width: 100%;
}

.checkout-btn {
    width: 100%;
    height: 40px;
}

/* Selection column */
.col-select {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
}

/* Responsive styles */
@media (max-width: 992px) {
    .cart-items {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .table-header {
        grid-template-columns: 40px 1fr;
    }

    .table-row {
        grid-template-columns: 40px 1fr;
        gap: 15px;
    }

    .col-select {
        grid-row: 1;
    }

    .col-product {
        grid-column: 2 / -1;
    }

    .col-price,
    .col-quantity,
    .col-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        grid-column: 2 / -1;
    }

    .col-action {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    .product-info {
        position: relative;
    }
}

@media (max-width: 576px) {
    .cart-container {
        padding: 10px;
    }

    .product-image {
        width: 60px;
        height: 60px;
    }

    .product-name {
        font-size: 13px;
    }

    .summary-actions {
        flex-direction: column;
    }
}
</style>