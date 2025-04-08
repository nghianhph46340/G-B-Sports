<template>
    <div class="payment-callback-container">
        <div class="payment-status-card">
            <div class="status-icon" :class="paymentStatus">
                <check-circle-outlined v-if="paymentStatus === 'success'" />
                <close-circle-outlined v-if="paymentStatus === 'failed'" />
                <loading-outlined v-if="paymentStatus === 'processing'" />
            </div>

            <h1 class="status-title">{{ statusTitle }}</h1>
            <p class="status-message">{{ statusMessage }}</p>

            <div class="order-info" v-if="paymentStatus === 'success'">
                <h3>Thông tin đơn hàng</h3>
                <div class="info-row">
                    <span class="label">Mã đơn hàng:</span>
                    <span class="value">{{ orderCode }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Số tiền:</span>
                    <span class="value">{{ formatCurrency(orderAmount) }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Thời gian:</span>
                    <span class="value">{{ formatDate(paymentTime) }}</span>
                </div>
            </div>

            <div class="action-buttons">
                <a-button type="primary" @click="goToOrderTracking" v-if="paymentStatus === 'success'">
                    Theo dõi đơn hàng
                </a-button>
                <a-button @click="goToHome">
                    Về trang chủ
                </a-button>
                <a-button type="primary" @click="tryAgain" v-if="paymentStatus === 'failed'">
                    Thử lại
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined
} from '@ant-design/icons-vue';
import { banHangOnlineService } from '@/services/banHangOnlineService';

const router = useRouter();
const route = useRoute();

// Payment status: success, failed, processing
const paymentStatus = ref('processing');
const orderCode = ref('');
const orderAmount = ref(0);
const paymentTime = ref(new Date());

// Computed properties for dynamic content
const statusTitle = computed(() => {
    switch (paymentStatus.value) {
        case 'success': return 'Thanh toán thành công!';
        case 'failed': return 'Thanh toán thất bại!';
        case 'processing': return 'Đang xử lý thanh toán...';
        default: return 'Trạng thái thanh toán';
    }
});

const statusMessage = computed(() => {
    switch (paymentStatus.value) {
        case 'success':
            return 'Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được thanh toán của bạn và đang xử lý đơn hàng.';
        case 'failed':
            return 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
        case 'processing':
            return 'Hệ thống đang xử lý thanh toán của bạn. Vui lòng không đóng trang này.';
        default:
            return 'Đang kiểm tra trạng thái thanh toán của bạn.';
    }
});

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
};

// Navigation functions
const goToHome = () => {
    router.push('/home');
};

const goToOrderTracking = () => {
    router.push(`/tracuudonhang-banhang?code=${orderCode.value}`);
};

const tryAgain = () => {
    router.push('/thanhtoan-banhang');
};

// Process payment result
const processPaymentResult = async () => {
    try {
        // Lấy thông tin từ query string
        const status = route.query.status || 'error';
        const amount = route.query.amount;
        const transactionId = route.query.transactionId;

        // Kiểm tra xem có mã đơn hàng chờ thanh toán không
        const pendingOrderCode = localStorage.getItem('pendingOrderCode');

        if (status === 'success' && pendingOrderCode) {
            orderCode.value = pendingOrderCode;
            orderAmount.value = amount || 0;
            paymentTime.value = new Date();
            paymentStatus.value = 'success';

            // Gọi API để cập nhật trạng thái đơn hàng
            try {
                const updateResult = await banHangOnlineService.updateOrderStatus({
                    ma_hoa_don: pendingOrderCode,
                    trang_thai: 'Đã xác nhận',
                    trang_thai_thanh_toan: 'Đã thanh toán'
                });

                console.log('Kết quả cập nhật trạng thái:', updateResult);

                // Hiển thị thông báo thành công
                message.success('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');

                // Xóa mã đơn hàng chờ thanh toán
                localStorage.removeItem('pendingOrderCode');
            } catch (updateError) {
                console.error('Lỗi khi cập nhật trạng thái đơn hàng:', updateError);
                message.warning('Thanh toán thành công nhưng có lỗi xảy ra khi cập nhật trạng thái đơn hàng. Vui lòng liên hệ với chúng tôi.');
            }
        } else {
            paymentStatus.value = 'failed';
            message.error('Thanh toán không thành công hoặc đã bị hủy.');
        }
    } catch (error) {
        console.error('Lỗi khi xử lý kết quả thanh toán:', error);
        paymentStatus.value = 'failed';
        message.error('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
    }
};

onMounted(() => {
    // Xử lý kết quả thanh toán sau khi component được mount
    setTimeout(() => {
        processPaymentResult();
    }, 1500); // Đợi 1.5 giây để hiển thị trạng thái "đang xử lý"
});
</script>

<style scoped>
.payment-callback-container {
    width: 100%;
    max-width: 1200px;
    margin: 50px auto;
    padding: 0 20px;
}

.payment-status-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    padding: 40px;
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    animation: fadeInUp 0.5s ease;
}

.status-icon {
    font-size: 80px;
    margin-bottom: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.status-icon.success {
    color: #52c41a;
    background-color: #f6ffed;
    border: 4px solid #b7eb8f;
    animation: pulse 2s infinite;
}

.status-icon.failed {
    color: #f5222d;
    background-color: #fff1f0;
    border: 4px solid #ffa39e;
}

.status-icon.processing {
    color: #1890ff;
    background-color: #e6f7ff;
    border: 4px solid #91d5ff;
    animation: spin 1.5s linear infinite;
}

.status-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 15px;
    color: #2b3940;
}

.status-message {
    font-size: 16px;
    line-height: 1.6;
    color: #6c757d;
    margin-bottom: 30px;
}

.order-info {
    background-color: #f9fafc;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    text-align: left;
}

.order-info h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #2b3940;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.label {
    color: #6c757d;
    font-weight: 500;
}

.value {
    font-weight: 600;
    color: #2b3940;
}

.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
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

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
    }

    70% {
        box-shadow: 0 0 0 15px rgba(82, 196, 26, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>