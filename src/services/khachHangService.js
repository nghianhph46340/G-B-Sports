import axiosInstance from "@/config/axiosConfig";

// Lấy danh sách khách hàng
const getAllKhachHang = async (page = 0, size = 5, keyword = null, trangThai = null, updatedId = null) => {
  try {
      let url = `/api/khach-hang/view?page=${page}&size=${size}`;
      if (keyword) {
          url += `&keyword=${encodeURIComponent(keyword)}`;
      }
      if (trangThai) {
          url += `&trangThai=${encodeURIComponent(trangThai)}`;
      }
      if (updatedId) {
          url += `&updatedId=${updatedId}`;
      }
      const { data } = await axiosInstance.get(url);
      return data;
  } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
      return {
          error: true,
          message: 'Có lỗi xảy ra khi tải danh sách khách hàng'
      };
  }
};

// Thêm khách hàng mới
const themKhachHang = async (data) => {
    try {
        const response = await axiosInstance.post('/api/khach-hang/add', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm khách hàng:', error);
        return { error: true, message: 'Có lỗi xảy ra khi thêm khách hàng' };
    }
};

// Lấy thông tin khách hàng để chỉnh sửa
const getKhachHangByIdForEdit = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/khach-hang/edit/${id}`);
    if (response.data.error) {
      return { error: true, message: response.data.error };
    }
    return response.data; // { khachHang }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error);
    return { error: true, message: error.response?.data?.error || 'Có lỗi xảy ra khi lấy thông tin khách hàng' };
  }
};
const suaKhachHang = async (khachHangData) => {
  try {
      const { data } = await axiosInstance.put('/api/khach-hang/update', khachHangData);
      return data;
  } catch (error) {
      console.error('Lỗi khi cập nhật khách hàng:', error);
      return {
          error: true,
          message: 'Có lỗi xảy ra khi cập nhật khách hàng'
      };
  }
};

// Lấy chi tiết khách hàng
const getKhachHangDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/khach-hang/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết khách hàng:', error);
        return { error: true, message: 'Có lỗi xảy ra khi lấy chi tiết khách hàng' };
    }
};

// Thay đổi trạng thái khách hàng
const changeTrangThai = async (idKhachHang) => {
    try {
        const response = await axiosInstance.post('/api/khach-hang/chuyen-trang-thai', null, {
            params: { idKhachHang }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái khách hàng:', error);
        return { error: true, message: 'Có lỗi xảy ra khi thay đổi trạng thái' };
    }
};

export const khachHangService = {
    getAllKhachHang,
    themKhachHang,
    getKhachHangByIdForEdit,
    suaKhachHang,
    getKhachHangDetail,
    changeTrangThai
};
