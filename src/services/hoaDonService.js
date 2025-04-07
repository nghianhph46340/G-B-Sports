import axiosInstance from "@/config/axiosConfig";

const qlhd = 'qlhd/'; // Base path cho hóa đơn

// Lấy danh sách hóa đơn với phân trang
const getAllHoaDon = async (page = 0, size = 5) => {
    try {
        const { data } = await axiosInstance.get(qlhd + `danh_sach_hoa_don?page=${page}&size=${size}`);
        return data;
    } catch (error) {
        console.error('Lỗi API lấy danh sách hóa đơn:', error);
        return { error: true };
    }
};

const getListHoaDon = async () => {
    try {
        const { data } = await axiosInstance.get(qlhd + `all-hoa-don`);
        return data;
    } catch (error) {
        console.error('Lỗi API lấy list hóa đơn:', error);
        return { error: true };
    }
};

// Lọc hóa đơn theo trạng thái
const filterByTrangThai = async (trangThai, page = 0, size = 5) => {
    try {
        const { data } = await axiosInstance.get(qlhd + `loc_trang_thai_don_hang?trangThai=${trangThai}&page=${page}&size=${size}`);
        return data;
    } catch (error) {
        console.error('Lỗi API lọc hóa đơn theo trạng thái:', error);
        return { error: true };
    }
};

// Lọc hóa đơn theo ngày
const filterByDate = async (tuNgay, denNgay, page = 0, size = 5) => {
    try {
        const params = new URLSearchParams();
        if (tuNgay) params.append('tuNgay', tuNgay);
        if (denNgay) params.append('denNgay', denNgay);
        params.append('page', page);
        params.append('size', size);
        const { data } = await axiosInstance.get(qlhd + `loc_ngay?${params.toString()}`);
        return data;
    } catch (error) {
        console.error('Lỗi API lọc hóa đơn theo ngày:', error);
        return { error: true };
    }
};

// Tìm kiếm hóa đơn
const searchHoaDon = async (keyword, page = 0, size = 5) => {
    try {
        const { data } = await axiosInstance.get(qlhd + `tim_kiem?keyword=${keyword}&page=${page}&size=${size}`);
        return data;
    } catch (error) {
        console.error('Lỗi API tìm kiếm hóa đơn:', error);
        return { error: true };
    }
};

// Lấy chi tiết hóa đơn theo mã hóa đơn
const getCTHD = async (maHoaDon) => {
    try {
        const { data } = await axiosInstance.get(qlhd + `hdct?id=${maHoaDon}`);
        return data;
    } catch (error) {
        console.error('Lỗi API lấy chi tiết hóa đơn:', error);
        return { error: true };
    }
};

// Thay đổi trạng thái hóa đơn
const changeTrangThai = async (maHoaDon, newTrangThai) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'chuyen_trang_thai', null, {
            params: { maHoaDon, newTrangThai }
        });
        return data;
    } catch (error) {
        console.error('Lỗi API thay đổi trạng thái hóa đơn:', error);
        return { error: true };
    }
};

const quayLaiTrangThai = async (maHoaDon) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'quay_lai_trang_thai', null, {
            params: { maHoaDon }
        });
        return data;
    } catch (error) {
        console.error('Lỗi API quay lại trạng thái ban đầu:', error);
        return { error: true };
    }
};

// Hủy hóa đơn
const cancelHoaDon = async (maHoaDon) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'cancel_order', null, {
            params: { maHoaDon }
        });
        return data;
    } catch (error) {
        console.error('Lỗi API hủy hóa đơn:', error);
        return { error: true };
    }
};

// Cập nhật thông tin khách hàng trong hóa đơn
const updateTTKH_in_HD = async (maHoaDon, ttkh) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'update_ttkh', {
            maHoaDon,
            hoTen: ttkh.hoTen,
            email: ttkh.email,
            sdtNguoiNhan: ttkh.sdtNguoiNhan,
            diaChi: ttkh.diaChi
        });
        return data;
    } catch (error) {
        console.error('Lỗi API cập nhật thông tin khách hàng:', error);
        return { error: true };
    }
};

// Cập nhật ghi chú
const updateNote = async (maHoaDon, ghiChu) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'update_note', {
            maHoaDon,
            ghiChu
        });
        return data;
    } catch (error) {
        console.error('Lỗi API cập nhật ghi chú:', error);
        return { error: true };
    }
};

// Lấy danh sách chi tiết sản phẩm
const getAllCTSP_HD = async (page = 0, size = 5, keyword = '') => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        if (keyword) params.append('keyword', keyword);
        const { data } = await axiosInstance.get(qlhd + `ctsp_hd?${params.toString()}`);
        return data;
    } catch (error) {
        console.error('Lỗi API lấy danh sách chi tiết sản phẩm:', error);
        return { error: true };
    }
};

// Thêm sản phẩm vào hóa đơn
const addProductsToInvoice = async (maHoaDon, products) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'addSP_HD', {
            maHoaDon,
            products
        });
        return data;
    } catch (error) {
        console.error('Lỗi API thêm sản phẩm vào hóa đơn:', error);
        return { error: true };
    }
};
const removeProductFromInvoice = async (maHoaDon, idCTSP, soLuong) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'removeSP_HD', null, {
            params: { maHoaDon, idCTSP, soLuong }
        });
        return data;
    } catch (error) {
        console.error('Lỗi API xóa sản phẩm khỏi hóa đơn:', error);
        return { error: true };
    }
};
const updateProductQuantity = async (maHoaDon, idCTSP, quantityChange) => {
    try {
        const { data } = await axiosInstance.post(qlhd + 'update_soLuong', null, {
            params: { maHoaDon, idCTSP, quantityChange }
        });
        return data;
    } catch (error) {
        console.error('Lỗi API cập nhật số lượng sản phẩm:', error);
        return { error: true };
    }
};
export const hoaDonService = {
    getAllHoaDon,
    getListHoaDon,
    filterByTrangThai,
    filterByDate,
    searchHoaDon,
    getCTHD,
    changeTrangThai,
    cancelHoaDon,
    updateTTKH_in_HD,
    updateNote,
    getAllCTSP_HD,
    addProductsToInvoice,
    removeProductFromInvoice,
    updateProductQuantity,
    quayLaiTrangThai
};
