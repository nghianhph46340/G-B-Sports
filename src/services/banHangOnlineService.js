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
export const banHangOnlineService = {
    createOrder,
    createOrderChiTiet
}

