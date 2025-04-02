import axiosInstance from "@/config/axiosConfig";

const banHang = "banhang/";

const  getAllHoaDonCTT = async() => {
    try {
        const { data } = await axiosInstance.get(banHang + `getAllHoaDonCTT`);
        return data;
    } catch (error) {
        console.error('Lỗi API lấy danh sách hóa đơn chưa thanh toán:', error);
        return { error: true };
    }
}

const createHoaDon = async(idNhanVien) => {
    try {
        const { data } = await axiosInstance.get(banHang + `createHoaDon?idNhanVien=` + idNhanVien);
        return data;
    } catch (error) {
        console.error('Lỗi API tạo hoá đơn:', error);
        return { error: true };
    }
}

const updateHoaDon = async() => {
    try {
        const { data } = await axiosInstance.get(banHang + `updateHoaDon`);
        return data;
    } catch (error) {
        console.error('Lỗi API update hoá đơn:', error);
        return { error: true };
    }
}

const deleteHoaDon = async(idHoaDon) => {
    try {
        const { data } = await axiosInstance.get(banHang + `deleteHoaDon?idHoaDon=` + idHoaDon);
        return data;
    } catch (error) {
        console.error('Lỗi API xóa hoá đơn:', error);
        return { error: true };
    }
}

const getAllSPHD = async(idHoaDon) => {
    try {
        const { data } = await axiosInstance.get(banHang + `getSPHD?idHoaDon=` + idHoaDon);
        return data;
    } catch (error) {
        console.error('Lỗi API lấy danh sách hóa đơn chưa thanh toán:', error);
        return { error: true };
    }
}

const addSPHD = async(idHoaDon, idCTSP, soLuong, giaBan) => {
    try {
        const { data } = await axiosInstance.post(banHang + `addSPHD?idHoaDon=${idHoaDon}&idCTSP=${idCTSP}&soLuong=${soLuong}&giaBan=${giaBan}`);
        return data;
    } catch (error) {
        console.error('Lỗi API thêm sp hoá đơn:', error);
        return { error: true };
    }
}
const themSPHDMoi = async(idHoaDon, idCTSP, soLuong, giaBan) => {
    try {
        const { data } = await axiosInstance.post(banHang + `themSPHDMoi?idHoaDon=${idHoaDon}&idCTSP=${idCTSP}&soLuong=${soLuong}&giaBan=${giaBan}`);
        return data;
    } catch (error) {
        console.error('Lỗi API thêm sp mới hoá đơn:', error);
        return { error: true };
    }
}

const giamSPHD = async(idHoaDon, idCTSP, soLuong, giaBan) => {
    try {
        const { data } = await axiosInstance.post(banHang + `giamSPHD?idHoaDon=${idHoaDon}&idCTSP=${idCTSP}&soLuong=${soLuong}&giaBan=${giaBan}`);
        return data;
    } catch (error) {
        console.error('Lỗi API giảm sp hoá đơn:', error);
        return { error: true };
    }
}

const trangThaiDonHang = async(idHoaDon) => {
    try {
        const { data } = await axiosInstance.get(banHang + `trangThaiDonHang?idHoaDon=` + idHoaDon);
        return data;
    } catch (error) {
        console.error('Lỗi API trang thai don hang:', error);
        return { error: true };
    }
}

const phuongThucNhanHang = async(idHoaDon, phuongThucNhanHang) => {
    try {        
        const { data } = await axiosInstance.post(banHang + `phuongThucNhanHang?idHoaDon=${idHoaDon}&phuongThucNhanHang=${phuongThucNhanHang}`);        
        return data;
    } catch (error) {
        console.error('Lỗi API phuong thuc nhan hang:', error);
        return { error: true };
    }
}

export const banHangService = {
    getAllHoaDonCTT,
    createHoaDon,
    updateHoaDon,
    deleteHoaDon,
    getAllSPHD,
    addSPHD,
    giamSPHD,
    themSPHDMoi,
    trangThaiDonHang,
    phuongThucNhanHang
}