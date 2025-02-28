import axiosInstance from "@/config/axiosConfig";
//Hàm xử lý dữ liệu
const qlsp = 'admin/quan_ly_san_pham/'
const getAllSanPham = async () => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'SanPham');
        console.log(qlsp + 'SanPham');
        console.log(data.data);
        return data;
    } catch (error) {
        console.log(error);
        console.log('Không lấy được danh sách sản phẩm')
    }



}

const getAllChiTietSanPham = async () => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'getAllCTSP');
        console.log(qlsp + 'getAllCTSP');
        console.log(data.data);
        return data;
    } catch (error) {
        console.log(error);
        console.log('Không lấy được danh sách chi tiết sản phẩm');
    }
}

export const sanPhamService = {
    getAllSanPham,
    getAllChiTietSanPham
}