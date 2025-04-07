import axiosInstance from "@/config/axiosConfig";
// Lấy ds khách hàng
const getAllKhachHang = async(page = 0, size = 3, keyword = null, trangThai = null) => {
    try {
        // Xây dựng URL cơ bản với page và size
        let url = `api/khach-hang/view?page=${page}&size=${size}`;
        
        // Thêm params tùy chọn nếu có
        if (keyword) {
            url += `&keyword=${encodeURIComponent(keyword)}`;
        }
        if (trangThai) {
            url += `&trangThai=${encodeURIComponent(trangThai)}`;
        }

        const {data} = await axiosInstance.get(url);
        
        // data sẽ chứa:
        // - danhSachKhachHang: danh sách khách hàng
        // - diaChiMap: map địa chỉ của khách hàng
        // - currentPage: trang hiện tại
        // - totalPages: tổng số trang
        // - trangThai: trạng thái lọc
        // - keyword: từ khóa tìm kiếm
        // - message: thông báo nếu không tìm thấy kết quả
        
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
        return { 
            error: true,
            message: 'Có lỗi xảy ra khi tải danh sách khách hàng'
        };
    }
}
// Đăng ký khách hàng
const registerKhachHang = async (registerData) => {
    try {
        const { data } = await axiosInstance.post('api/khach-hang/register', registerData);
        return data;
    } catch (error) {
        console.error('Lỗi khi đăng ký khách hàng:', error);
        return {
            error: true,
            message: error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký khách hàng',
            fieldErrors: error.response?.data?.fieldErrors || null
        };
    }
}
// Đăng nhập
const login = async (loginData) => {
    try {
        const { data } = await axiosInstance.post('api/khach-hang/login', loginData);
        return data;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        return {
            error: true,
            message: error.response?.data?.error || 'Có lỗi xảy ra khi đăng nhập',
            fieldErrors: error.response?.data?.fieldErrors || null
        };
    }
}
export const khachHangService = {
    getAllKhachHang,
    registerKhachHang,
    login
}