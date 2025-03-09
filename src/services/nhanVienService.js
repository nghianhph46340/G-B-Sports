import axiosInstance from "@/config/axiosConfig";

const getAllNhanVien = async(page, size) => {
    try {
        // Đảm bảo page luôn >= 1
        const {data} = await axiosInstance.get(`admin/quan-ly-nhan-vien?page=${page}&size=${size}`)
        return data;
    } catch (error) {
        console.error('Lỗi API:', error);
        return { error: true };
    }
}
const getNhanVienLocTrangThai = async(page, size, trangThai) => {
    try {
        const {data} = await axiosInstance.get(`admin/quan-ly-nhan-vien/locTrangThai?page=${page}&size=${size}&trangThai=${trangThai}`)
        return data;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
export const nhanVienService = {
    getAllNhanVien,
    getNhanVienLocTrangThai
}