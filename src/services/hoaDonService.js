import axiosInstance from "@/config/axiosConfig";

const getAllHoaDon = async() => {
    try {
        const {data} = await axiosInstance.get(`hoa_don/danh_sach_hoa_don`)
        return data;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
const getCTHD = async(id) => {
    try {
        const {data} = await axiosInstance.get(`hoa_don/hdct?id=${id}`)
        return data;
    } catch (error) {
        console.error('Lỗi API',error);
        return {error:true};
    }
}
export default {
    getAllHoaDon,
    getCTHD
}
