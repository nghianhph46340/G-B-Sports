import axiosInstance from "@/config/axiosConfig";

// Lấy danh sách nhân viên
const layDanhSachNhanVien = async() => {
    try {
        const {data} = await axiosInstance.get('admin/quan-ly-nhan-vien/findAll');
        return data;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
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
const changeTrangThai = async(id) => {
    try {
        const data = await axiosInstance.put(`admin/quan-ly-nhan-vien/changeStatus?id=${id}`)
        return data;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
const themNhanViens = async(data) => {
    try {
        const response = await axiosInstance.post('admin/quan-ly-nhan-vien/add', data);
        return response;
    } catch (error) {
        console.error('Lỗi API',error); 
        return {error:true};
    }
}
const suaNhanViens = async(data) => {
    try {
        const response = await axiosInstance.put(`admin/quan-ly-nhan-vien/update`,data);
        return response;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
const getNhanVienById = async(id) => {
    try {
        const response = await axiosInstance.get(`admin/quan-ly-nhan-vien/findById?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
export const nhanVienService = {
    getAllNhanVien,
    getNhanVienLocTrangThai,
    changeTrangThai,
    themNhanViens,
    suaNhanViens,
    layDanhSachNhanVien,
    getNhanVienById
}