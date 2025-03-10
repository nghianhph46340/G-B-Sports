import axiosInstance from "@/config/axiosConfig";
// import { toast } from "vue3-toastify/index";
//Hàm xử lý dữ liệu
const qlsp = 'admin/quan_ly_san_pham/'
const getAllSanPham = async () => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'SanPham');
        return data;
    } catch (error) {
        console.log(error);
        console.log('Không lấy được danh sách sản phẩm')
    }



}

const getAllChiTietSanPham = async () => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'getAllCTSP');
        return data;
    } catch (error) {
        console.log(error);
        console.log('Không lấy được danh sách chi tiết sản phẩm');
    }
}
const searchChiTietSanPham = async (search) => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'searchCTSP?keywork=' + search);
        console.log('Datasearch', data);
        return data;
    } catch (error) {
        console.log(error);
        console.log('Không lấy được danh sách chi tiết sản phẩm');
    }
}

const getImageInCTSP = async (id, anhChinh) => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'HinhAnhSanPham?idCTSP=' + id + '&anhChinh=' + anhChinh);
        return data;
    } catch (error) {
        console.log(error);
        // toast.error('Không lấy được hình anh')
    }
}
const getCTSPBySanPham = async (id) => {
    try {
        const { data } = await axiosInstance.get(qlsp + 'CTSPTheoSanPham?id=' + id);
        return data;
    } catch (error) {
        console.log(error);
    }
}
const changeStatusSanPham = async (id) => {
    try {
        const { data } = await axiosInstance.put(qlsp + 'chuyenTrangThaiSanPham?id=' + id);
        return data;
    } catch (error) {
        console.log(error);
    }
}
export const sanPhamService = {
    getAllSanPham,
    getAllChiTietSanPham,
    getImageInCTSP,
    searchChiTietSanPham,
    getCTSPBySanPham,
    changeStatusSanPham
}