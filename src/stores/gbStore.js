
import { defineStore } from 'pinia'
import { check } from 'prettier'
import { toast } from 'vue3-toastify'
import { sanPhamService } from '@/services/sanPhamService'
import { useRoute } from 'vue-router'
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
            getAllChiTietSanPham: [],
            // menuKeyMap: {
            //     1: "/admin",
            //     3: "/admin/quanlysanpham",
            //     4: "/admin/sanpham",
            //     5: "/admin/thuonghieu",
            //     6: "/admin/danhmuc",
            //     7: "/admin/thuoc-tinh"
            // },
            checkRouter: ''
        }
    },
    actions: {
        //Viết các hàm action
        // getKeyByPath(key) {
        //     // const route = useRoute();
        //     for (let index = 0; index < this.menuKeyMap.length; index++) {
        //         if (key === this.menuKeyMap[key]) {
        //             this.checkRouter = key
        //         }
        //     }
        // },
        getPath(path) {
            this.checkRouter = path
        },
        async getAllSP() {
            if (this.getAllChiTietSanPham.length === 0) {
                const sanPhamRespone = await sanPhamService.getAllSanPham();
                console.log(sanPhamRespone);
                if (!sanPhamRespone || sanPhamRespone.error) {
                    toast.error("Không lấy được dữ liệu")
                    return;
                } else {
                    this.getAllSanPham = sanPhamRespone;
                }
            } else {
                toast.error("Bị lấy dữ liệu nhiều lần")
            }



        },
        async getAllCTSP() {
            const chiTietSanPhamRespone = await sanPhamService.getAllChiTietSanPham();
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