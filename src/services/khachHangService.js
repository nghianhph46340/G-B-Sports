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
        console.log('Dữ liệu từ API đăng nhập:', data); // In dữ liệu từ API đăng nhập
        return data;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        return {
            error: true,
            message: error.response?.data?.error || 'Có lỗi xảy ra khi đăng nhập',
            fieldErrors: error.response?.data?.fieldErrors || null
        };
    }
};
// Lấy thông tin chi tiết
const getUserDetail = async ({ username, id_roles }) => {
    try {
        let userDetails = null;
        if ([1, 2, 3].includes(id_roles)) {
            // Gọi API lấy thông tin nhân viên
            const response = await axiosInstance.get(`admin/details?tenDangNhap=${username}`);
            userDetails = response.data;
            console.log('Thông tin nhân viên từ API:', userDetails);
        } else if (id_roles === 4) {
            // Gọi API lấy thông tin khách hàng
            const response = await axiosInstance.get(`api/khach-hang/details?tenDangNhap=${username}`);
            userDetails = response.data;
            console.log('Thông tin khách hàng từ API:', userDetails);
        }
        return userDetails;
    } catch (error) {
        console.error('Lỗi khi gọi API getUserDetail:', error);
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin chi tiết');
    }
};
export const khachHangService = {
    getAllKhachHang,
    registerKhachHang,
    login,
    getUserDetail
}