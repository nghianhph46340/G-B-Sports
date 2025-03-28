import axiosInstance from "@/config/axiosConfig";
// Lấy ds khách hàng
const getAllKhachHang = async(page = 0, size = 3, keyword = null, trangThai = null) => {
    try {
        // Xây dựng URL cơ bản với page và size
        let url = `api/khach-hang/view?page=${page}&size=${size}`;
        
        // Thêm params tùy chọn nếu có
        if (keyword) {
            url += `&keyword=${encodeURIComponent(keyword.trim())}`;
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

export const khachHangService = {
    getAllKhachHang
}