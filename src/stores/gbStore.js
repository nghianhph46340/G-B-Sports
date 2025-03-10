
import { defineStore } from 'pinia'
import { check } from 'prettier'
import { toast } from 'vue3-toastify'
import { sanPhamService } from '@/services/sanPhamService'
import { nhanVienService } from '@/services/nhanVienService'
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
            searchChiTietSanPham: [],
            getCTSPBySanPhams: [],
            checkRouter: '',
            getImages: [],
            indexMenu: ['1'],
            searchs: '',
            getAllNhanVienArr: [],
            totalPages: 0,
            currentPage: 0, 
            totalItems: 0
        }
    },
    actions: {
        async getAllNhanVien(page = 0, size = 5) {
            try {
                const nhanVien = await nhanVienService.getAllNhanVien(page, size);
                if (nhanVien.error) {
                    toast.error('Không lấy được dữ liệu')
                    return;
                } else {
                    // this.getAllNhanVienArr = nhanVien;
                    // this.totalItems = 50;  // Tạm thời hardcode để test
                    // this.currentPage = page;
                    this.getAllNhanVienArr = nhanVien.content || []; // Lấy danh sách nhân viên
                    this.totalPages = nhanVien.totalPages || 0;
                    this.currentPage = page;
                    this.totalItems = nhanVien.totalElements || 0;
                }
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getNhanVienLocTrangThai(page = 0, size = 5, trangThai = this.selectTrangThai) {
            try {
                let params = { page, size };
                if (trangThai) {
                    params.trangThai = trangThai; // Chỉ thêm trạng thái nếu có giá trị
                }
                const nhanvienFilter = await nhanVienService.getNhanVienLocTrangThai(page, size, trangThai);
                if (nhanvienFilter.error) {
                    toast.error("Không lấy được dữ liệu");
                    return;
                } else {
                    this.getAllNhanVienArr = nhanvienFilter.content || []; // Lấy danh sách nhân viên
                    this.totalPages = nhanvienFilter.totalPages || 0;
                    this.currentPage = page;
                    this.totalItems = nhanvienFilter.totalElements || 0;
                    this.selectedTrangThai = trangThai;
                }
            } catch (error) {
                console.error(error);
                toast.error("Có lỗi xảy ra");
            }
        },
        getPath(path) {
            this.checkRouter = '';
            this.checkRouter = path
        },
        getIndex(path) {
            this.indexMenu = ['1'];
            switch (path) {
                case '/admin':
                    this.indexMenu = ['1'];
                    break;
                case '/admin/quanlysanpham':
                    this.indexMenu = ['3'];
                    break;
                case '/admin/quanlynhanvien':
                    this.indexMenu = ['10'];
                    break;
                default:
                    this.indexMenu = ['1'];
                    break;

            }
        },

        // Lấy ảnh sản phẩm

        async getImage(id, anhChinh) {
            const getImageRespone = await sanPhamService.getImageInCTSP(id, anhChinh);

            if (getImageRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.getImages = getImageRespone
            }
            return getImageRespone
        },
        //Lấy danh sách chi tiết sản phẩm theo sản phẩm
        async getCTSPBySanPham(id) {
            const getCTSPBySanPhamRespone = await sanPhamService.getCTSPBySanPham(id);
            if (getCTSPBySanPhamRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.getCTSPBySanPhams = getCTSPBySanPhamRespone;
                try {
                    const imagePromises = getCTSPBySanPhamRespone.map(async (ctsp) => {
                        const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
                        ctsp.hinh_anh = await images.length > 0 ? images[0].hinh_anh : "Không có ảnh chính"; // Thêm trường hinh_anh vào object ctsp
                    });
                    this.getCTSPBySanPhams = await Promise.all(imagePromises);
                    this.getCTSPBySanPhams = getCTSPBySanPhamRespone;
                } catch (error) {
                    console.log(error);
                }
            }

        },
        //Lấy danh sách sản phẩm
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
        //Lấy danh sách chi tiết sản phẩm
        async getAllCTSP() {
            const chiTietSanPhamRespone = await sanPhamService.getAllChiTietSanPham();
            if (chiTietSanPhamRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            }
            this.getAllChiTietSanPham = chiTietSanPhamRespone;
            try {
                const imagePromises = chiTietSanPhamRespone.map(async (ctsp) => {
                    const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
                    ctsp.hinh_anh = await images.length > 0 ? images[0].hinh_anh : "Không có ảnh chính"; // Thêm trường hinh_anh vào object ctsp
                });
                this.getAllChiTietSanPham = await Promise.all(imagePromises);
                this.getAllChiTietSanPham = chiTietSanPhamRespone;
            } catch (error) {
                console.log(error);
            }

        },
        //Tìm kiếm chi tiết sản phẩm
        async searchCTSP(search) {
            const chiTietSanPhamRespone = await sanPhamService.searchChiTietSanPham(search);
            if (chiTietSanPhamRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            }
            // this.searchChiTietSanPham = chiTietSanPhamRespone;
            try {
                const imagePromises = chiTietSanPhamRespone.map(async (ctsp) => {
                    const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
                    ctsp.hinh_anh = await images.length > 0 ? images[0].hinh_anh : "Không có ảnh chính"; // Thêm trường hinh_anh vào object ctsp
                });
                this.searchChiTietSanPham = await Promise.all(imagePromises);
                this.searchChiTietSanPham = chiTietSanPhamRespone;
            } catch (error) {
                console.log(error);
            }

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
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'gbStore', // Tên key lưu trong localStorage
                storage: localStorage, // Lưu vào localStorage
                paths: ['checkRouter', 'indexMenu', 'language', 'checkNoitification'] // Chỉ lưu các state này
            }
        ]
    }
})