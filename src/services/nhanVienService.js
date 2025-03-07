import axiosInstance from "@/config/axiosConfig";

const getAllNhanVien = async()=>{
    const {data} = await axiosInstance.get('admin/quan-ly-nhan-vien')
    if (data.error) {
        console.log('Không lấy dc nhân viên')
    }
    return data;
}
export const nhanVienService = {
    getAllNhanVien
}