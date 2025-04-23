import axiosInstance from "@/config/axiosConfig";
const banHangOnline = "banhangweb/";
const createOrder = async (hoaDon) => {
    const response = await axiosInstance.post(banHangOnline + 'taoHoaDonWeb', hoaDon);
    return response.data;
}
const createOrderChiTiet = async (hoaDonChiTiet) => {
    const response = await axiosInstance.post(banHangOnline + 'taoHoaDonChiTiet', hoaDonChiTiet);
    return response.data;
}
const getThongTinHoaDon = async (maHoaDon) => {
    const response = await axiosInstance.get(banHangOnline + 'thongTinHoaDon?maHoaDon=' + maHoaDon);
    return response.data;
}
const getThongTinTimeLine = async (maHoaDon) => {
    const response = await axiosInstance.get(banHangOnline + 'thongTinTimeLine?maHoaDon=' + maHoaDon);
    return response.data;
}
const getThongTinHoaDonChiTiet = async (maHoaDon) => {
    const response = await axiosInstance.get(banHangOnline + 'thongTinHoaDonChiTiet?maHoaDon=' + maHoaDon);
    return response.data;
}

// Cập nhật trạng thái hóa đơn
const updateOrderStatus = async (data) => {
    try {
        const response = await axiosInstance.put('/hoa-don/update-trang-thai', data);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

const createOrder1 = async (hoaDon) => {
    const response = await axiosInstance.post(banHangOnline + 'taoHoaDonWeb1', hoaDon);
    return response.data;
}
// Giỏ hàng của KH có tài khoản
const getGioHang = async (idKhachHang) => {
    const response = await axiosInstance.get('/gioHangWeb/gioHangByKH?idKhachHang=' +idKhachHang);
    return response.data;
}
// Lấy danh sách địa chỉ của khách hàng
const getDanhSachDiaChi = async (idKhachHang) => {
    const response = await axiosInstance.get('/gioHangWeb/danhSachDiaChi?idKhachHang=' + idKhachHang);
    return response.data;
}
const getGHByIdKH = async (idKhachHang, idChiTietSanPham, soLuong) => {
    const response = await axiosInstance.get('/gioHangWeb/themGHByIdKH?idKH=' + idKhachHang + '&idCTSP=' + idChiTietSanPham + '&soLuong=' + soLuong);
    return response.data;
}
export const banHangOnlineService = {
    createOrder,
    createOrderChiTiet,
    getThongTinHoaDon,
    getThongTinTimeLine,
    getThongTinHoaDonChiTiet,
    updateOrderStatus,
    createOrder1,
    getGioHang,
    getDanhSachDiaChi,
    getGHByIdKH
}

