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

const deleteHoaDon = async (idHoaDon) => {
    try {
        const { data } = await axiosInstance.delete(`banhang/deleteHoaDon?idHoaDon=${idHoaDon}`);
        console.log('Response từ API:', data); // Kiểm tra response
        return data;
    } catch (error) {
        console.error('Lỗi API xóa hoá đơn:', error.response?.data || error.message);
        throw error;
    }
};

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
const themSPHDMoi = async (idHoaDon, idCTSP, soLuong, giaBan) => {
    try {
        const { data } = await axiosInstance.post(
            banHang + `themSPHDMoi?idHoaDon=${idHoaDon}&idCTSP=${idCTSP}&soLuong=${soLuong}&giaBan=${giaBan}`
        );
        return data;
    } catch (error) {
        console.error('Lỗi API thêm sp mới hoá đơn:', error.response?.data || error.message);
        return { error: true, message: error.response?.data || 'Có lỗi xảy ra' };
    }
};

const giamSPHD = async(idHoaDon, idCTSP, soLuong, giaBan) => {
    try {
        const { data } = await axiosInstance.post(banHang + `giamSPHD?idHoaDon=${idHoaDon}&idCTSP=${idCTSP}&soLuong=${soLuong}&giaBan=${giaBan}`);
        return data;
    } catch (error) {
        console.error('Lỗi API giảm sp hoá đơn:', error);
        return { error: true };
    }
}

const xoaSPHD = async (idHoaDon, idCTSP) => {
    try {
        const response = await axiosInstance.delete(
            banHang + `xoaSPHD?idHoaDon=${idHoaDon}&idChiTietSanPham=${idCTSP}`
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Lỗi từ server:', error.response.status, error.response.data);
            return { success: false, message: error.response.data.message || 'Có lỗi xảy ra' };
        } else if (error.request) {
            console.error('Không nhận được phản hồi:', error.message);
            return { success: false, message: 'Lỗi mạng hoặc server không phản hồi' };
        } else {
            console.error('Lỗi khác:', error.message);
            return { success: false, message: 'Có lỗi xảy ra' };
        }
    }
};

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
    phuongThucNhanHang,
    xoaSPHD
}