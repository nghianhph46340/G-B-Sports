
import { defineStore } from 'pinia'
import { check } from 'prettier'
import { toast } from 'vue3-toastify'
import { sanPhamService } from '../services/sanPhamService'
export const useGbStore = defineStore('gbStore', {
    state: () => {
        return {
            //Viết các bộ dữ liệu
            changeLanguage: {},
            check: true,
            language: 'EN',
            status: false,
            id: 0,
            checkNoitification: true,
            getAllSanPham: [],
            getAllChiTietSanPham: []
        }
    },
    actions: {
        //Viết các hàm action
        async getAllSP() {
            const sanPhamRespone = await sanPhamService.getAllSanPham();
            console.log(sanPhamRespone);
            console.log(sanPhamRespone);
            if (sanPhamRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            }
            this.getAllSanPham = sanPhamRespone;

        },
        async getAllCTSP() {
            const chiTietSanPhamRespone = await sanPhamService.getAllChiTietSanPham();
            console.log(chiTietSanPhamRespone);
            if (chiTietSanPhamRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            }
            this.getAllChiTietSanPham = chiTietSanPhamRespone;
        },
        getLangue(check) {
            const vni = {
                "nguoiDung": "Đăng nhập",
                "cuaHang": "Cửa hàng",
                "hoTro": "Hỗ trợ",
                "gioHang": "Giỏ hàng",
                "timKiem": "Bạn đang muốn tìm kiếm gì?"
            }
            const eng = {
                "nguoiDung": "Login",
                "cuaHang": "Store",
                "hoTro": "Support",
                "gioHang": "Cart",
                "timKiem": "What are you looking for?"
            }
            if (!check) {
                this.changeLanguage = vni
                this.check = true
                this.language = 'EN'
            } else {
                this.changeLanguage = eng
                this.check = false
                this.language = 'VI'
            }
        },
        showModal(show) {

            this.status = show
        },
        showModalSideBar(id) {
            this.id = id
            if (this.status) {
                id = 0
                this.id = id
            }
        },
        hideModalSideBar(id) {
            this.id = 0
        },
        showModalSideBar1(show) {
            this.statusSideBar1 = show
        },
        closeNoitification() {
            this.checkNoitification = false
        }
    }
})