import axiosInstance from "@/config/axiosConfig";
import { message } from 'ant-design-vue';

const handlePayOSPayment = async (orderData) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        // if (!orderData || !orderData.id || !orderData.total || !orderData.customer || !orderData.orderItems) {
        //     throw new Error('Dữ liệu đơn hàng không hợp lệ');
        // }

        // Gọi API backend để tạo đơn hàng và lấy thông tin thanh toán PayOS
        const response = await axiosInstance.post('/order/create', orderData);
        // customerInfo: {
        //     name: orderData.customer.ho_ten,
        //     phone: orderData.customer.so_dien_thoai,
        //     email: orderData.customer.email
        // },
        // items: orderData.orderItems.map(item => ({
        //     name: item.ten_san_pham,
        //     quantity: item.so_luong,
        //     price: item.gia
        // })),
        // shippingAddress: {
        //     fullName: orderData.customer.ho_ten,
        //     phone: orderData.customer.so_dien_thoai,
        //     address: `${orderData.customer.dia_chi.dia_chi_cu_the}, ${orderData.customer.dia_chi.xa_phuong}, ${orderData.customer.dia_chi.quan_huyen}, ${orderData.customer.dia_chi.tinh_thanh}`
        // }
        // });
        window.location.href = response.data.data.checkoutUrl;
        console.log(response.data)
        // if (response.data && response.data.error === 0) {
        //     // Lưu thông tin thanh toán vào localStorage để sử dụng sau này
        //     localStorage.setItem('paymentInfo', JSON.stringify({
        //         orderCode: response.data.data.orderCode,
        //         amount: response.data.data.amount,
        //         status: response.data.data.status,
        //         checkoutUrl: response.data.data.checkoutUrl,
        //         qrCode: response.data.data.qrCode,
        //         accountNumber: response.data.data.accountNumber,
        //         accountName: response.data.data.accountName,
        //         bin: response.data.data.bin,
        //         paymentLinkId: response.data.data.paymentLinkId
        //     }));

        //     // Chuyển hướng người dùng đến trang thanh toán PayOS

        // } else {
        //     throw new Error(response.data?.message || 'Không thể tạo thanh toán');
        // }
    } catch (error) {
        console.error('Lỗi khi tạo thanh toán:', error);
        message.error(error.response?.data?.message || 'Không thể tạo thanh toán. Vui lòng thử lại sau.');
    }
};

const paymentStatus = async (orderCode) => {
    try {
        // Gọi API backend để kiế trách thanh toán
        const response = await axiosInstance.get(`/order/payment-status/${orderCode}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi kiế trách thanh toán:', error);    
    }
};

export const thanhToanService = {
    handlePayOSPayment,
    paymentStatus
}