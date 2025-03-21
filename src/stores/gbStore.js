import { defineStore } from 'pinia'
import { check } from 'prettier'
import { toast } from 'vue3-toastify'
import { sanPhamService } from '@/services/sanPhamService'
import { nhanVienService } from '@/services/nhanVienService'
import { useRoute } from 'vue-router'
import { hoaDonService } from '@/services/hoaDonService'
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
            checkRoutePresent: '',
            getImages: [],
            indexMenu: ['1'],
            searchs: '',
            getAllNhanVienArr: [],
            totalPages: 0,
            currentPage: 0,
            totalItems: 0,
            getAllHoaDonArr: [],
            totalHoaDon: 0,
            currentHoaDon: 0,
            totalItemsHoaDon: 0,
            hoaDonDetail: {},         // Chi tiết hóa đơn hiện tại
            chiTietHoaDons: [],       // Danh sách chi tiết sản phẩm trong hóa đơn
            trangThaiHistory: [],
            danhMucList: [],
            thuongHieuList: [],
            chatLieuList: [],
            mauSacList: [],
            sizeList: [],
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
        async changeTrangThai(id) {
            try {
                // 🔥 Cập nhật ngay lập tức UI trước khi gọi API
                const nhanVien = this.getAllNhanVienArr.find(nhanVien => nhanVien.idNhanVien === id);
                if (nhanVien) {
                    nhanVien.trangThai = nhanVien.trangThai === "Đang hoạt động" ? "Đã nghỉ việc" : "Đang hoạt động";
                }

                //     const chuyenTrangThai = await nhanVienService.changeTrangThai(id);
                //     if (chuyenTrangThai.error) {
                //         toast.error('Có lỗi xảy ra');
                // 🚀 Gọi API nhưng không chờ phản hồi để tránh lag
                nhanVienService.changeTrangThai(id).then(response => {
                    if (response.error) {
                        toast.error('Có lỗi xảy ra');
                        // 🔄 Nếu lỗi, revert trạng thái lại
                        nhanVien.trangThai = nhanVien.trangThai === "Đang hoạt động" ? "Đã nghỉ việc" : "Đang hoạt động";
                    } else {
                        toast.success('Chuyển trạng thái thành công');
                    }
                });
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        //Lấy danh sách danh mục
        async getDanhMucList() {
            const danhMucRespone = await sanPhamService.getDanhMucList();
            if (danhMucRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.danhMucList = danhMucRespone;
            }
        },
        //Lấy danh sách thương hiệu
        async getThuongHieuList() {
            const thuongHieuRespone = await sanPhamService.getThuongHieuList();
            if (thuongHieuRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.thuongHieuList = thuongHieuRespone;
            }
        },
        //Lấy danh sách chất liệu
        async getChatLieuList() {
            const chatLieuRespone = await sanPhamService.getChatLieuList();
            if (chatLieuRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.chatLieuList = chatLieuRespone;
            }
        },
        //Lấy danh sách màu sắc
        async getMauSacList() {
            const mauSacRespone = await sanPhamService.getMauSacList();
            if (mauSacRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.mauSacList = mauSacRespone;
            }
        },
        //Lấy danh sách size    
        async getSizeList() {
            const sizeRespone = await sanPhamService.getSizeList();
            if (sizeRespone.error) {
                toast.error("Không lấy được dữ liệu")
                return;
            } else {
                this.sizeList = sizeRespone;
            }
        },

        //Cập nhật trạng thái sản phẩm
        async changeStatusSanPham(id) {
            try {
                // 🔥 Cập nhật ngay lập tức UI trước khi gọi API
                const sanPham = this.getAllSanPham.find(sanPham => sanPham.id_san_pham === id);
                if (sanPham) {
                    sanPham.trang_thai = sanPham.trang_thai === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
                }
                // 🚀 Gọi API nhưng không chờ phản hồi để tránh lag
                sanPhamService.changeStatusSanPham(id).then(response => {
                    if (response.error) {
                        toast.error('Có lỗi xảy ra');
                        sanPham.trang_thai = sanPham.trang_thai === "Hoạt động" ? "Không hoạt động" : "Hoạt động";
                    } else {
                        toast.success('Chuyển trạng thái thành công');
                    }
                });
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getAllHoaDon(page = 0, size = 5) {
            try {
                const hoaDon = await hoaDonService.getAllHoaDon(page, size);
                if (hoaDon.error) {
                    toast.error('Không lấy được dữ liệu');
                    return;
                }
                this.getAllHoaDonArr = hoaDon.content || [];
                this.totalHoaDon = hoaDon.totalPages || 0;
                this.currentHoaDon = page;
                this.totalItemsHoaDon = hoaDon.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async filterByTrangThai(trangThai, page = 0, size = 5) {
            try {
                const response = await hoaDonService.filterByTrangThai(trangThai, page, size);
                if (response.error) {
                    toast.error('Không lọc được dữ liệu');
                    return;
                }
                this.getAllHoaDonArr = response.content || [];
                this.totalHoaDon = response.totalPages || 0;
                this.currentHoaDon = page;
                this.totalItemsHoaDon = response.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async filterByDate(tuNgay, denNgay, page = 0, size = 5) {
            try {
                console.log('Từ ngày: ' + tuNgay + 'Đến ngày: ' + denNgay)
                const response = await hoaDonService.filterByDate(tuNgay, denNgay, page, size);
                console.log('Response từ getDate:', response);
                if (response.error) {
                    toast.error('Không lọc được dữ liệu');
                    return;
                }
                this.getAllHoaDonArr = response.content || [];
                this.totalHoaDon = response.totalPages || 0;
                this.currentHoaDon = page;
                this.totalItemsHoaDon = response.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async searchHoaDon(keyword, page = 0, size = 5) {
            try {
                const response = await hoaDonService.searchHoaDon(keyword, page, size);
                if (response.error) {
                    toast.error('Không tìm kiếm được dữ liệu');
                    return;
                }
                this.getAllHoaDonArr = response.content || [];
                this.totalHoaDon = response.totalPages || 0;
                this.currentHoaDon = page;
                this.totalItemsHoaDon = response.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        // Thêm action mới để lấy chi tiết hóa đơn
        async getHoaDonDetail(maHoaDon) {
            try {
                console.log('maHoaDon:', maHoaDon);
                const response = await hoaDonService.getCTHD(maHoaDon);
                console.log('Response từ getCTHD:', response);
                if (response.error) {
                    toast.error('Không lấy được chi tiết hóa đơn');
                    return;
                } else {
                    this.hoaDonDetail = response.hoaDon || {};
                    this.chiTietHoaDons = response.chiTietHoaDons || [];
                    this.trangThaiHistory = response.trangThaiHistory || [];
                }
            } catch (error) {
                console.error('Lỗi trong getHoaDonDetail:', error);
                toast.error('Có lỗi xảy ra khi lấy chi tiết hóa đơn');
            }
        },
        // Thêm action để thay đổi trạng thái hóa đơn
        async changeTrangThaiHoaDon(maHoaDon, newTrangThai) {
            try {
                const response = await hoaDonService.changeTrangThai(maHoaDon, newTrangThai);
                if (response.error) {
                    toast.error('Cập nhật trạng thái thất bại');
                    return;
                }
                toast.success('Cập nhật trạng thái thành công');
                await this.getHoaDonDetail(maHoaDon); // Refresh dữ liệu sau khi cập nhật
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        // Thêm action để hủy hóa đơn
        async cancelHoaDon(maHoaDon) {
            try {
                const response = await hoaDonService.cancelHoaDon(maHoaDon);
                if (response.error) {
                    toast.error('Hủy hóa đơn thất bại');
                    return;
                }
                toast.success('Hủy hóa đơn thành công');
                await this.getHoaDonDetail(maHoaDon); // Refresh dữ liệu sau khi hủy
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        getPath(path) {
            this.checkRouter = '';
            this.checkRouter = path
        },
        getRoutePresent(path) {
            this.checkRoutePresent = '';
            this.checkRoutePresent = path
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
                case 'admin/quanlyhoadon':
                    this.indexMenu = ['8'];
                case '/admin/quanlysanpham/add':
                    this.indexMenu = ['3'];
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
        //Thêm sản phẩm
        async createSanPham(sanPhamData) {
            try {
                console.log('Data gửi đi:', sanPhamData);
                const response = await sanPhamService.createSanPhams(sanPhamData);
                console.log('Response từ service:', response);
                return response;
            } catch (error) {
                console.error('Lỗi trong createSanPham:', error);
                throw error;
            }
        },
        //Thêm chi tiết sản phẩm
        async createCTSP(CTSPData) {
            try {
                console.log('Dữ liệu CTSP gửi đi:', CTSPData)
                const response = await sanPhamService.createCTSP(CTSPData);
                console.log('Response từ service thêm chi tiết sản phẩm:', response);
                return response;
            } catch (error) {
                console.error('Lỗi trong createCTSP:', error);
                throw error;
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