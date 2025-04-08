<template>
    <div class="tracking-container">
        <!-- Breadcrumb -->
        <div class="breadcrumb-container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/home">Trang chủ</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Tra cứu đơn hàng</li>
                </ol>
            </nav>
        </div>

        <div class="tracking-content">
            <div class="tracking-header">
                <h1>Tra cứu đơn hàng</h1>
                <p class="tracking-description">
                    Nhập mã đơn hàng hoặc mã vận đơn để tra cứu thông tin và trạng thái đơn hàng của bạn
                </p>
            </div>

            <div class="tracking-search">
                <a-form layout="vertical" @finish="searchOrder">
                    <a-form-item label="Mã đơn hàng / Mã vận đơn" name="trackingCode">
                        <a-input v-model:value="trackingCode" placeholder="Nhập mã đơn hàng hoặc mã vận đơn"
                            :maxLength="50" :allowClear="true" size="large" />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" @click="searchOrder" :loading="loading" size="large"
                            block>
                            <search-outlined /> Tra cứu
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>

            <div class="search-results" v-if="isSearched">
                <!-- Not Found State -->
                <div v-if="!orderFound" class="not-found">
                    <file-search-outlined class="not-found-icon" />
                    <h2>Không tìm thấy đơn hàng</h2>
                    <p>Không tìm thấy đơn hàng với mã đơn hàng / mã vận đơn bạn vừa nhập.</p>
                    <p>Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
                </div>

                <!-- Order Found State -->
                <div v-else class="order-details">
                    <div class="order-header">
                        <div class="order-info">
                            <h2>Thông tin đơn hàng #{{ order.orderCode }}</h2>
                            <p v-if="order.dateCreated">Ngày đặt hàng: {{ formatDate(order.dateCreated) }}</p>
                        </div>
                        <div :class="['order-status', `status-${order.status.code}`]">
                            <component :is="getStatusIcon(order.status.code)" class="status-icon" />
                            <span>{{ order.status.name }}</span>
                        </div>
                    </div>

                    <div class="tracking-timeline">
                        <div class="timeline-container">
                            <div v-for="(status, index) in statusTimeline" :key="index" :class="['timeline-step', {
                                active: isStatusActive(status.code),
                                completed: isStatusCompleted(status.code),
                                cancelled: order.status.code === 'cancelled' && index > getStatusIndex(order.status.code)
                            }]">
                                <div class="step-icon">
                                    <component :is="status.icon" />
                                </div>
                                <div class="step-content">
                                    <p class="step-name">{{ status.name }}</p>
                                    <p v-if="status.date" class="step-date">{{ formatDate(status.date) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="order-summary">
                        <h3>Chi tiết đơn hàng</h3>
                        <div class="order-products">
                            <div class="product-item" v-for="(item, index) in order.items" :key="index">
                                <div class="product-image">
                                    <img :src="item.image" :alt="item.name" />
                                    <span class="product-quantity">{{ item.quantity }}</span>
                                </div>
                                <div class="product-details">
                                    <p class="product-name">{{ item.name }}</p>
                                    <p class="product-variant" v-if="item.color || item.size">
                                        <span v-if="item.color">Màu: {{ item.color }}</span>
                                        <span v-if="item.size">Size: {{ item.size }}</span>
                                    </p>
                                </div>
                                <div class="product-price">
                                    {{ formatCurrency(item.price * item.quantity) }}
                                </div>
                            </div>
                        </div>

                        <div class="order-totals">
                            <div class="total-row">
                                <span>Tạm tính:</span>
                                <span>{{ formatCurrency(orderSubtotal) }}</span>
                            </div>
                            <div class="total-row" v-if="order.discount">
                                <span>Giảm giá:</span>
                                <span>-{{ formatCurrency(order.discount) }}</span>
                            </div>
                            <div class="total-row">
                                <span>Phí vận chuyển:</span>
                                <span>{{ formatCurrency(order.shippingFee) }}</span>
                            </div>
                            <div class="total-row grand-total">
                                <span>Tổng cộng:</span>
                                <span>{{ formatCurrency(order.total) }}</span>
                            </div>
                        </div>

                        <div class="shipping-info">
                            <h3>Thông tin giao hàng</h3>
                            <div class="info-row">
                                <span class="info-label">Người nhận:</span>
                                <span class="info-value">{{ order.recipient.name }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Số điện thoại:</span>
                                <span class="info-value">{{ order.recipient.phone }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Địa chỉ:</span>
                                <span class="info-value">{{ order.recipient.address }}</span>
                            </div>
                            <div class="info-row" v-if="order.deliveryService">
                                <span class="info-label">Đơn vị vận chuyển:</span>
                                <span class="info-value">{{ order.deliveryService }}</span>
                            </div>
                            <div class="info-row" v-if="order.trackingNumber">
                                <span class="info-label">Mã vận đơn:</span>
                                <span class="info-value">{{ order.trackingNumber }}</span>
                            </div>
                        </div>

                        <div class="order-actions">
                            <a-button v-if="canCancelOrder" type="danger" @click="showCancelConfirm">
                                Hủy đơn hàng
                            </a-button>
                            <a-button type="primary">
                                <printer-outlined /> In đơn hàng
                            </a-button>
                            <a-button>
                                <customer-service-outlined /> Liên hệ hỗ trợ
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="tracking-faqs">
                <h2>Các câu hỏi thường gặp</h2>
                <a-collapse>
                    <a-collapse-panel key="1" header="Làm sao để tìm mã đơn hàng của tôi?">
                        <p>Mã đơn hàng thường được gửi qua email xác nhận đơn hàng hoặc tin nhắn SMS sau khi bạn hoàn
                            tất đặt hàng.
                            Bạn cũng có thể tìm thấy mã đơn hàng trong lịch sử đơn hàng tại tài khoản của bạn.</p>
                    </a-collapse-panel>
                    <a-collapse-panel key="2" header="Tôi không nhận được mã vận đơn?">
                        <p>Mã vận đơn sẽ được cập nhật sau khi đơn hàng của bạn được xác nhận và bàn giao cho đơn vị vận
                            chuyển.
                            Quá trình này có thể mất từ 1-2 ngày làm việc. Nếu sau thời gian này bạn vẫn chưa nhận được,
                            vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>
                    </a-collapse-panel>
                    <a-collapse-panel key="3" header="Làm thế nào để hủy đơn hàng?">
                        <p>Bạn có thể hủy đơn hàng khi đơn hàng đang ở trạng thái "Chờ xác nhận" hoặc "Đã xác nhận" và
                            chưa được giao cho đơn vị vận chuyển.
                            Để hủy đơn hàng, vui lòng nhập mã đơn hàng vào ô tìm kiếm và nhấn nút "Hủy đơn hàng" ở cuối
                            trang thông tin đơn hàng.</p>
                    </a-collapse-panel>
                    <a-collapse-panel key="4" header="Tôi muốn thay đổi thông tin giao hàng?">
                        <p>Để thay đổi thông tin giao hàng, vui lòng liên hệ với bộ phận Chăm sóc Khách hàng của chúng
                            tôi càng sớm càng tốt.
                            Lưu ý rằng nếu đơn hàng đã được giao cho đơn vị vận chuyển, chúng tôi có thể không thay đổi
                            được thông tin giao hàng.</p>
                    </a-collapse-panel>
                </a-collapse>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import {
    SearchOutlined,
    FileSearchOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    InboxOutlined,
    GiftOutlined,
    CarOutlined,
    TrophyOutlined,
    CloseCircleOutlined,
    PrinterOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

// Tracking code input
const trackingCode = ref('');
const loading = ref(false);
const isSearched = ref(false);
const orderFound = ref(false);

// Mock order data - In a real app, this would come from an API
const order = reactive({
    orderCode: 'GB123456789',
    dateCreated: new Date(2023, 6, 15),
    status: {
        code: 'processing',
        name: 'Đang xử lý'
    },
    items: [
        {
            id: 1,
            name: 'Áo thể thao nam ProSport',
            color: 'Đen',
            size: 'L',
            price: 250000,
            quantity: 2,
            image: 'https://via.placeholder.com/80x80'
        },
        {
            id: 2,
            name: 'Giày chạy bộ UltraRun',
            color: 'Xanh Navy',
            size: '42',
            price: 1200000,
            quantity: 1,
            image: 'https://via.placeholder.com/80x80'
        }
    ],
    discount: 100000,
    shippingFee: 30000,
    total: 1630000,
    recipient: {
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
    },
    deliveryService: 'Giao Hàng Nhanh',
    trackingNumber: 'GHN1234567890',
    statusHistory: [
        { code: 'pending', date: new Date(2023, 6, 15), name: 'Chờ xác nhận' },
        { code: 'confirmed', date: new Date(2023, 6, 16), name: 'Đã xác nhận' },
        { code: 'processing', date: new Date(2023, 6, 17), name: 'Đang xử lý' }
    ]
});

// Status timeline definitions
const statusTimeline = [
    { code: 'pending', name: 'Chờ xác nhận', icon: ClockCircleOutlined },
    { code: 'updated', name: 'Đã cập nhật', icon: SyncOutlined },
    { code: 'confirmed', name: 'Đã xác nhận', icon: CheckCircleOutlined },
    { code: 'packaging', name: 'Chờ đóng gói', icon: InboxOutlined },
    { code: 'shipping', name: 'Đang giao', icon: CarOutlined },
    { code: 'completed', name: 'Hoàn thành', icon: TrophyOutlined }
];

// Map status codes to their index in the timeline
const statusIndex = {
    'pending': 0,
    'updated': 1,
    'confirmed': 2,
    'packaging': 3,
    'shipping': 4,
    'completed': 5,
    'cancelled': -1
};

// Compute order subtotal
const orderSubtotal = computed(() => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Determine if user can cancel the order
const canCancelOrder = computed(() => {
    const cancelableStatuses = ['pending', 'confirmed', 'updated'];
    return cancelableStatuses.includes(order.status.code);
});

// Thêm animation khi hiển thị kết quả tìm kiếm
const animateSearch = () => {
    // Thêm hiệu ứng cho việc tìm kiếm
    loading.value = true;

    // Simulate API call
    setTimeout(() => {
        isSearched.value = true;

        // For demo purposes, always show the order if the code matches
        if (trackingCode.value === order.orderCode || trackingCode.value === order.trackingNumber) {
            orderFound.value = true;

            // Update order status based on tracking code for demo
            if (trackingCode.value === 'GB123456789') {
                order.status = { code: 'pending', name: 'Chờ xác nhận' };
                updateOrderStatusHistory('pending');
            } else if (trackingCode.value === 'GB123456790') {
                order.status = { code: 'updated', name: 'Đã cập nhật' };
                updateOrderStatusHistory('updated');
            } else if (trackingCode.value === 'GB123456791') {
                order.status = { code: 'confirmed', name: 'Đã xác nhận' };
                updateOrderStatusHistory('confirmed');
            } else if (trackingCode.value === 'GB123456792') {
                order.status = { code: 'packaging', name: 'Chờ đóng gói' };
                updateOrderStatusHistory('packaging');
            } else if (trackingCode.value === 'GB123456793') {
                order.status = { code: 'shipping', name: 'Đang giao' };
                updateOrderStatusHistory('shipping');
            } else if (trackingCode.value === 'GB123456794') {
                order.status = { code: 'completed', name: 'Hoàn thành' };
                updateOrderStatusHistory('completed');
            } else if (trackingCode.value === 'GB123456795') {
                order.status = { code: 'cancelled', name: 'Đã hủy' };
                updateOrderStatusHistory('cancelled');
            }

            message.success('Tìm thấy thông tin đơn hàng!');
        } else {
            orderFound.value = false;
            message.error('Không tìm thấy đơn hàng với mã bạn đã nhập!');
        }

        loading.value = false;
    }, 1500);
};

// Thay đổi hàm searchOrder gọi đến hàm animateSearch
const searchOrder = () => {
    if (!trackingCode.value) {
        message.warning('Vui lòng nhập mã đơn hàng hoặc mã vận đơn');
        return;
    }

    animateSearch();
};

// Update order status history for demo
const updateOrderStatusHistory = (statusCode) => {
    // Clear existing history
    order.statusHistory = [];

    // Add history based on current status
    const statuses = ['pending', 'updated', 'confirmed', 'packaging', 'shipping', 'completed'];
    const currentIndex = statuses.indexOf(statusCode);

    if (statusCode === 'cancelled') {
        // If cancelled, just add pending and cancelled
        order.statusHistory.push(
            { code: 'pending', date: new Date(2023, 6, 15), name: 'Chờ xác nhận' },
            { code: 'cancelled', date: new Date(), name: 'Đã hủy' }
        );
    } else {
        // Add history up to current status
        for (let i = 0; i <= currentIndex; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (currentIndex - i));
            order.statusHistory.push({
                code: statuses[i],
                date: date,
                name: getStatusName(statuses[i])
            });
        }
    }
};

// Get status name by code
const getStatusName = (code) => {
    const status = statusTimeline.find(s => s.code === code);
    return status ? status.name : '';
};

// Get status index
const getStatusIndex = (statusCode) => {
    return statusIndex[statusCode] !== undefined ? statusIndex[statusCode] : -1;
};

// Check if status is active (current status)
const isStatusActive = (statusCode) => {
    if (order.status.code === 'cancelled' && statusCode === 'cancelled') {
        return true;
    }
    return statusCode === order.status.code;
};

// Check if status is completed (status that has been passed)
const isStatusCompleted = (statusCode) => {
    if (order.status.code === 'cancelled') {
        return statusCode === 'pending'; // Only pending is completed in cancelled state
    }

    const currentStatusIndex = getStatusIndex(order.status.code);
    const checkStatusIndex = getStatusIndex(statusCode);

    return checkStatusIndex < currentStatusIndex;
};

// Get status icon based on status code
const getStatusIcon = (statusCode) => {
    switch (statusCode) {
        case 'pending':
            return ClockCircleOutlined;
        case 'updated':
            return SyncOutlined;
        case 'confirmed':
            return CheckCircleOutlined;
        case 'packaging':
            return InboxOutlined;
        case 'shipping':
            return CarOutlined;
        case 'completed':
            return TrophyOutlined;
        case 'cancelled':
            return CloseCircleOutlined;
        default:
            return ClockCircleOutlined;
    }
};

// Format date
const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};

// Show cancel confirmation dialog
const showCancelConfirm = () => {
    Modal.confirm({
        title: 'Xác nhận hủy đơn hàng',
        content: 'Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
        okText: 'Đồng ý',
        okType: 'danger',
        cancelText: 'Hủy bỏ',
        onOk() {
            cancelOrder();
        }
    });
};

// Cancel order
const cancelOrder = () => {
    loading.value = true;

    // Simulate API call
    setTimeout(() => {
        order.status = { code: 'cancelled', name: 'Đã hủy' };
        updateOrderStatusHistory('cancelled');
        message.success('Đơn hàng đã được hủy thành công');
        loading.value = false;
    }, 1000);
};
</script>

<style scoped>
.tracking-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f9fc;
    min-height: 100vh;
}

/* Breadcrumb styles */
.breadcrumb-container {
    margin-bottom: 30px;
    animation: fadeIn 0.8s ease-in-out;
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
    color: #3f6ad8;
    text-decoration: none;
    transition: all 0.3s ease;
}

.breadcrumb-item a:hover {
    color: #2952cc;
    text-decoration: underline;
}

.breadcrumb-item.active {
    color: #6c757d;
}

/* Header styling */
.tracking-header {
    text-align: center;
    margin-bottom: 40px;
    animation: slideDown 0.8s ease-in-out;
}

.tracking-header h1 {
    font-size: 36px;
    font-weight: 700;
    color: #2b3940;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
}

.tracking-header h1::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3f6ad8, #25b0ed);
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
}

.tracking-description {
    font-size: 17px;
    color: #6c757d;
    max-width: 700px;
    margin: 20px auto 0;
    line-height: 1.6;
}

/* Search box styling */
.tracking-search {
    max-width: 600px;
    margin: 0 auto 40px;
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
    transform: translateY(0);
    transition: all 0.3s ease;
    animation: fadeInUp 0.8s ease-in-out;
}

.tracking-search:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* Not found state */
.not-found {
    text-align: center;
    padding: 60px 20px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
    margin-bottom: 40px;
    animation: fadeIn 0.8s ease-in-out;
}

.not-found-icon {
    font-size: 80px;
    color: #d9d9d9;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

.not-found h2 {
    font-size: 28px;
    color: #2b3940;
    margin-bottom: 15px;
}

.not-found p {
    color: #6c757d;
    max-width: 600px;
    margin: 0 auto 10px;
    font-size: 16px;
    line-height: 1.6;
}

/* Order details styling */
.order-details {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
    margin-bottom: 40px;
    overflow: hidden;
    animation: fadeInUp 0.8s ease-in-out;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    background: linear-gradient(120deg, #f8f9fa, #eef2f7);
    border-bottom: 1px solid #eee;
    flex-wrap: wrap;
    gap: 15px;
}

.order-info h2 {
    font-size: 22px;
    font-weight: 700;
    color: #2b3940;
    margin-bottom: 5px;
}

.order-info p {
    color: #6c757d;
    margin: 0;
    font-size: 15px;
}

.order-status {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
}

.order-status:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.status-icon {
    margin-right: 8px;
    font-size: 20px;
}

.status-pending {
    background: linear-gradient(45deg, #fff7e6, #fff1dc);
    color: #fa8c16;
    border: none;
}

.status-updated {
    background: linear-gradient(45deg, #e6f7ff, #d1e9ff);
    color: #1890ff;
    border: none;
}

.status-confirmed {
    background: linear-gradient(45deg, #f6ffed, #e8f9e0);
    color: #52c41a;
    border: none;
}

.status-packaging {
    background: linear-gradient(45deg, #f0f5ff, #e1ebff);
    color: #2f54eb;
    border: none;
}

.status-shipping {
    background: linear-gradient(45deg, #fcf4ff, #f4e6ff);
    color: #722ed1;
    border: none;
}

.status-completed {
    background: linear-gradient(45deg, #f6ffed, #e8f9e0);
    color: #52c41a;
    border: none;
}

.status-cancelled {
    background: linear-gradient(45deg, #fff1f0, #ffdfde);
    color: #f5222d;
    border: none;
}

/* Timeline styling */
.tracking-timeline {
    padding: 40px 30px;
    border-bottom: 1px solid #eee;
}

.timeline-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    max-width: 900px;
    margin: 0 auto;
}

.timeline-container::before {
    content: '';
    position: absolute;
    top: 30px;
    left: 50px;
    right: 50px;
    height: 4px;
    background: linear-gradient(90deg, #f0f0f0, #e0e0e0);
    z-index: 1;
    border-radius: 4px;
}

.timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    flex: 1;
    transition: all 0.5s ease;
}

.step-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    border: 4px solid #eee;
    color: #d9d9d9;
    font-size: 28px;
    transition: all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    position: relative;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.step-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.15);
    top: -50%;
    left: -50%;
    transform: rotate(45deg);
    transition: all 0.3s ease-in-out;
}

.timeline-step:hover .step-icon::after {
    top: 150%;
    left: 150%;
}

.timeline-step:hover .step-icon {
    transform: scale(1.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.timeline-step.active .step-icon {
    background-color: #fff;
    border-color: currentColor;
    transform: scale(1.1);
    animation: pulse 2s infinite;
}

.timeline-step.completed .step-icon {
    background-color: #f6ffed;
    border-color: #52c41a;
    color: #52c41a;
    transform: scale(1.05);
}

.timeline-step.completed .step-icon::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(82, 196, 26, 0.1);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 1.5s ease-out 1;
}

.timeline-step.active.cancelled .step-icon,
.timeline-step.cancelled .step-icon {
    background-color: #fff1f0;
    border-color: #f5222d;
    color: #f5222d;
}

.timeline-step:nth-child(1).active .step-icon {
    color: #fa8c16;
    /* Pending */
    box-shadow: 0 10px 20px rgba(250, 140, 22, 0.2);
}

.timeline-step:nth-child(2).active .step-icon {
    color: #1890ff;
    /* Updated */
    box-shadow: 0 10px 20px rgba(24, 144, 255, 0.2);
}

.timeline-step:nth-child(3).active .step-icon {
    color: #52c41a;
    /* Confirmed */
    box-shadow: 0 10px 20px rgba(82, 196, 26, 0.2);
}

.timeline-step:nth-child(4).active .step-icon {
    color: #2f54eb;
    /* Packaging */
    box-shadow: 0 10px 20px rgba(47, 84, 235, 0.2);
}

.timeline-step:nth-child(5).active .step-icon {
    color: #722ed1;
    /* Shipping */
    box-shadow: 0 10px 20px rgba(114, 46, 209, 0.2);
}

.timeline-step:nth-child(6).active .step-icon {
    color: #52c41a;
    /* Completed */
    box-shadow: 0 10px 20px rgba(82, 196, 26, 0.2);
}

.step-content {
    text-align: center;
    max-width: 120px;
    transition: all 0.3s ease;
}

.timeline-step:hover .step-content {
    transform: translateY(5px);
}

.step-name {
    font-weight: 600;
    color: #666;
    margin-bottom: 5px;
    font-size: 15px;
    transition: all 0.3s ease;
}

.timeline-step.active .step-name {
    color: #333;
    font-size: 16px;
}

.timeline-step:hover .step-name {
    color: #333;
}

.step-date {
    font-size: 13px;
    color: #999;
    margin: 0;
}

/* Order summary */
.order-summary {
    padding: 40px 30px;
    animation: fadeIn 0.8s ease-in-out;
}

.order-summary h3 {
    font-size: 22px;
    font-weight: 700;
    color: #2b3940;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f2f5;
    position: relative;
}

.order-summary h3::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, #3f6ad8, #25b0ed);
    bottom: -2px;
    left: 0;
    border-radius: 2px;
}

.order-products {
    margin-bottom: 30px;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.3s ease;
    border-radius: 8px;
}

.product-item:hover {
    background-color: #f9fafc;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

.product-image {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 20px;
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.product-item:hover .product-image {
    transform: scale(1.05);
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
}

.product-item:hover .product-image img {
    transform: scale(1.1);
}

.product-quantity {
    position: absolute;
    top: -10px;
    right: -10px;
    background: linear-gradient(135deg, #3f6ad8, #1890ff);
    color: #fff;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 4px 8px rgba(24, 144, 255, 0.25);
    border: 2px solid #fff;
    z-index: 1;
}

.product-details {
    flex: 1;
}

.product-name {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 17px;
    color: #2b3940;
    transition: all 0.3s ease;
}

.product-item:hover .product-name {
    color: #3f6ad8;
}

.product-variant {
    font-size: 14px;
    color: #6c757d;
    background-color: #f8f9fa;
    padding: 3px 10px;
    border-radius: 20px;
    display: inline-block;
}

.product-variant span {
    margin-right: 15px;
}

.product-price {
    font-weight: 700;
    color: #f5222d;
    font-size: 18px;
    transition: all 0.3s ease;
}

.product-item:hover .product-price {
    transform: scale(1.05);
}

/* Order totals */
.order-totals {
    background: linear-gradient(135deg, #f9fafc, #f0f5ff);
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 35px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
}

.order-totals:hover {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
    transform: translateY(-5px);
}

.total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #e8eef3;
}

.total-row:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.grand-total {
    font-weight: 700;
    color: #2b3940;
    font-size: 20px;
}

.grand-total span:last-child {
    color: #f5222d;
    font-size: 22px;
}

/* Shipping info */
.shipping-info {
    margin-bottom: 35px;
    background-color: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
}

.shipping-info:hover {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
}

.shipping-info h3 {
    font-size: 22px;
    font-weight: 700;
    color: #2b3940;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f2f5;
    position: relative;
}

.shipping-info h3::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, #3f6ad8, #25b0ed);
    bottom: -2px;
    left: 0;
    border-radius: 2px;
}

.info-row {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f5f7fa;
}

.info-row:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.info-label {
    font-weight: 600;
    color: #6c757d;
    min-width: 150px;
    display: inline-block;
}

.info-value {
    color: #2b3940;
    font-weight: 500;
}

/* Actions */
.order-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    flex-wrap: wrap;
}

.order-actions .ant-btn {
    padding: 10px 25px;
    height: auto;
    border-radius: 50px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.order-actions .ant-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.order-actions .ant-btn-primary {
    background: linear-gradient(135deg, #3f6ad8, #25b0ed);
    border: none;
}

.order-actions .ant-btn-danger {
    background: linear-gradient(135deg, #ff4d4f, #f5222d);
    border: none;
    color: white;
}

.order-actions .ant-btn-default {
    border: 2px solid #e8eef3;
}

/* FAQs section */
.tracking-faqs {
    margin-top: 70px;
    margin-bottom: 40px;
    animation: fadeIn 0.8s ease-in-out;
}

.tracking-faqs h2 {
    font-size: 28px;
    font-weight: 700;
    color: #2b3940;
    margin-bottom: 30px;
    text-align: center;
    position: relative;
    padding-bottom: 15px;
}

.tracking-faqs h2::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3f6ad8, #25b0ed);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
}

.tracking-faqs .ant-collapse {
    background-color: transparent;
    border: none;
    border-radius: 12px;
    overflow: hidden;
}

.tracking-faqs .ant-collapse-item {
    margin-bottom: 15px;
    border: none;
    background-color: #fff;
    border-radius: 12px !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.tracking-faqs .ant-collapse-item:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.tracking-faqs .ant-collapse-header {
    font-weight: 600 !important;
    color: #2b3940 !important;
    font-size: 16px !important;
    padding: 18px 24px !important;
    background-color: #f9fafc;
    border-radius: 12px 12px 0 0 !important;
}

.tracking-faqs .ant-collapse-content {
    border-top: 1px solid #f0f2f5;
}

.tracking-faqs .ant-collapse-content-box {
    padding: 20px 24px !important;
    color: #6c757d;
    font-size: 15px;
    line-height: 1.6;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(63, 106, 216, 0.4);
    }

    70% {
        box-shadow: 0 0 0 15px rgba(63, 106, 216, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(63, 106, 216, 0);
    }
}

@keyframes ripple {
    from {
        transform: scale(0);
        opacity: 1;
    }

    to {
        transform: scale(1.5);
        opacity: 0;
    }
}

/* Responsive styling */
@media (max-width: 992px) {
    .timeline-container {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 30px;
    }

    .timeline-container::before {
        top: 0;
        bottom: 0;
        left: 30px;
        right: auto;
        width: 4px;
        height: auto;
        background: linear-gradient(180deg, #f0f0f0, #e0e0e0);
    }

    .timeline-step {
        flex-direction: row;
        margin-bottom: 30px;
        width: 100%;
    }

    .timeline-step:last-child {
        margin-bottom: 0;
    }

    .step-icon {
        margin-right: 20px;
        margin-bottom: 0;
    }

    .step-content {
        text-align: left;
        max-width: none;
    }

    .timeline-step:hover .step-content {
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .tracking-header h1 {
        font-size: 30px;
    }

    .order-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .order-actions {
        flex-wrap: wrap;
        gap: 10px;
    }

    .order-actions .ant-btn {
        flex: 1;
        min-width: 45%;
    }
}

@media (max-width: 576px) {
    .product-item {
        flex-wrap: wrap;
    }

    .product-price {
        width: 100%;
        margin-top: 15px;
        text-align: right;
    }

    .product-image {
        width: 70px;
        height: 70px;
    }

    .tracking-faqs h2 {
        font-size: 24px;
    }

    .order-actions .ant-btn {
        width: 100%;
        min-width: 100%;
    }
}
</style>
