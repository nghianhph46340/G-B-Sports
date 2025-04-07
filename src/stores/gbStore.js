// src/stores/gbStore.js
import { defineStore } from 'pinia';
import { toast } from 'vue3-toastify';
import { sanPhamService } from '@/services/sanPhamService';
import { nhanVienService } from '@/services/nhanVienService';
import { voucherService } from '@/services/voucherService';
import { khuyenMaiService } from '@/services/khuyenMaiService';
import { hoaDonService } from '@/services/hoaDonService';
import { khachHangService } from '@/services/khachHangService';
import router from '@/router';

export const useGbStore = defineStore('gbStore', {
    state: () => {
        return {
            changeLanguage: {},
            check: true,
            language: 'EN',
            status: false,
            id: 0,
            checkNoitification: true,
            getAllSanPham: [],
            getAllChiTietSanPham: [],
            searchChiTietSanPham: [],
            searchSanPham: [],
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
            hoaDonDetail: {},
            chiTietHoaDons: [],
            trangThaiHistory: [],
            // Thêm state để lưu thông tin người dùng
            userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
            isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
            id_roles: localStorage.getItem('id_roles') || null, // Thêm id_roles vào state
            listCTSP_HD: [],
            danhMucList: [],
            thuongHieuList: [],
            chatLieuList: [],
            mauSacList: [],
            sizeList: [],
            nhanVienArr: [],
            nhanVienSearch: [],
            sanPhamById: {},
            getAllKhachHangArr: [],
            totalKhachHang: 0,
            currentKhachHang: 0,
            totalItemsKhachHang: 0,
            listSanPhamBanHang: [],
            getAllVoucherArr: [],
            voucherSearch: [],
            voucherTotalPages: 0,
            voucherCurrentPage: 0,
            voucherTotalItems: 0,
            voucherSearchs: '',
            getAllKhuyenMaiArr: [],
            khuyenMaiSearch: [],
            khuyenMaiTotalPages: 0,
            khuyenMaiCurrentPage: 0,
            khuyenMaiTotalItems: 0,
            khuyenMaiSearchs: '',
            cTSPBySanPhamFull: [],
            checkoutItems: [],
            justAddedProduct: false,
        };
    },
    getters: {
        isAdminOrManager: (state) => state.id_roles === '1' || state.id_roles === '2',
        isEmployee: (state) => state.id_roles === '3',
        isCustomer: (state) => state.id_roles === '4',
    },
    actions: {
        async layDanhSachNhanVien() {
            const nhanVienArr = await nhanVienService.layDanhSachNhanVien();
            this.nhanVienArr = nhanVienArr;
        },
        async getAllNhanVien(page = 0, size = 5) {
            try {
                const nhanVien = await nhanVienService.getAllNhanVien(page, size);
                if (nhanVien.error) {
                    toast.error('Không lấy được dữ liệu');
                    return;
                }
                this.getAllNhanVienArr = nhanVien.content || [];
                this.totalPages = nhanVien.totalPages || 0;
                this.currentPage = page;
                this.totalItems = nhanVien.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getNhanVienLocTrangThai(page = 0, size = 5, trangThai) {
            try {
                const nhanvienFilter = await nhanVienService.getNhanVienLocTrangThai(page, size, trangThai);
                if (nhanvienFilter.error) {
                    toast.error('Không lấy được dữ liệu');
                    return;
                }
                this.getAllNhanVienArr = nhanvienFilter.content || [];
                this.totalPages = nhanvienFilter.totalPages || 0;
                this.currentPage = page;
                this.totalItems = nhanvienFilter.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async changeTrangThai(id) {
            try {
                const nhanVien = this.getAllNhanVienArr.find(nhanVien => nhanVien.idNhanVien === id);
                if (nhanVien) {
                    nhanVien.trangThai = nhanVien.trangThai === 'Đang hoạt động' ? 'Đã nghỉ việc' : 'Đang hoạt động';
                }
                nhanVienService.changeTrangThai(id).then(response => {
                    if (response.error) {
                        toast.error('Có lỗi xảy ra');
                        nhanVien.trangThai = nhanVien.trangThai === 'Đang hoạt động' ? 'Đã nghỉ việc' : 'Đang hoạt động';
                    } else {
                        toast.success('Chuyển trạng thái thành công');
                    }
                });
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async themNhanVien(nhanVienMoi) {
            console.log('Dữ liệu truyền vào', nhanVienMoi);
            try {
                const themNhanVienres = await nhanVienService.themNhanViens(nhanVienMoi);
                if (themNhanVienres.error) {
                    toast.error('Có lỗi xảy ra');
                    return;
                }
                return themNhanVienres;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getNhanVienById(id) {
            const nhanVienById = await nhanVienService.getNhanVienById(id);
            return nhanVienById;
        },
        async suaNhanVien(nhanVienUpdate) {
            console.log('Dữ liệu truyền vào', nhanVienUpdate);
            try {
                const suaNhanVienRes = await nhanVienService.suaNhanViens(nhanVienUpdate);
                if (suaNhanVienRes.error) {
                    toast.error('Có lỗi xảy ra');
                    return;
                }
                return suaNhanVienRes;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async searchNhanVien(keyword, page = 0, size = 5) {
            try {
                const searchNhanVienRes = await nhanVienService.searchNhanVien(keyword, page, size);
                if (searchNhanVienRes.error) {
                    toast.error('Có lỗi xảy ra');
                    this.nhanVienSearch = [];
                    this.totalPages = 0;
                    this.currentPage = 0;
                    this.totalItems = 0;
                } else {
                    this.nhanVienSearch = searchNhanVienRes.content || [];
                    this.totalPages = searchNhanVienRes.totalPages || 0;
                    this.currentPage = page;
                    this.totalItems = searchNhanVienRes.totalElements || 0;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getSanPhamBySP(tenSanPham) {
            try {
                const sanPham = await sanPhamService.getSanPhamBySanPham(tenSanPham);
                if (sanPham.error) {
                    toast.error('Không lấy được dữ liệu');
                    return;
                }
                this.listSanPhamBanHang = sanPham;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getSanPhamById(id) {
            const sanPhamByIds = await sanPhamService.getSanPhamById(id);
            if (sanPhamByIds.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.sanPhamById = sanPhamByIds;
        },
        async getDanhMucList() {
            const danhMucRespone = await sanPhamService.getDanhMucList();
            if (danhMucRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.danhMucList = danhMucRespone;
        },
        async getThuongHieuList() {
            const thuongHieuRespone = await sanPhamService.getThuongHieuList();
            if (thuongHieuRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.thuongHieuList = thuongHieuRespone;
        },
        async getChatLieuList() {
            const chatLieuRespone = await sanPhamService.getChatLieuList();
            if (chatLieuRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.chatLieuList = chatLieuRespone;
        },
        async getMauSacList() {
            const mauSacRespone = await sanPhamService.getMauSacList();
            if (mauSacRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.mauSacList = mauSacRespone;
        },
        async getSizeList() {
            const sizeRespone = await sanPhamService.getSizeList();
            if (sizeRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.sizeList = sizeRespone;
        },
        async changeStatusSanPham(id) {
            try {
                const sanPham = this.getAllSanPham.find(sanPham => sanPham.id_san_pham === id);
                if (sanPham) {
                    sanPham.trang_thai = sanPham.trang_thai === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';
                }
                sanPhamService.changeStatusSanPham(id).then(response => {
                    if (response.error) {
                        toast.error('Có lỗi xảy ra');
                        sanPham.trang_thai = sanPham.trang_thai === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';
                    } else {
                        toast.success('Chuyển trạng thái thành công');
                    }
                });
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getCTSPBySanPhamFull(idSanPham) {
            const cTSPBySanPhamFull = await sanPhamService.getCTSPBySanPhamFull(idSanPham);
            if (cTSPBySanPhamFull.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.cTSPBySanPhamFull = cTSPBySanPhamFull;
            console.log(this.cTSPBySanPhamFull);
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
                console.log('Từ ngày: ' + tuNgay + ' Đến ngày: ' + denNgay);
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
        async getHoaDonDetail(maHoaDon) {
            try {
                console.log('maHoaDon:', maHoaDon);
                const response = await hoaDonService.getCTHD(maHoaDon);
                console.log('Response từ getCTHD:', response);
                if (response.error) {
                    toast.error('Không lấy được chi tiết hóa đơn');
                    return;
                }
                this.hoaDonDetail = response.hoaDon || {};
                this.chiTietHoaDons = response.chiTietHoaDons || [];
                this.trangThaiHistory = response.trangThaiHistory || [];
            } catch (error) {
                console.error('Lỗi trong getHoaDonDetail:', error);
                toast.error('Có lỗi xảy ra khi lấy chi tiết hóa đơn');
            }
        },
        async changeTrangThaiHoaDon(maHoaDon, newTrangThai) {
            try {
                const response = await hoaDonService.changeTrangThai(maHoaDon, newTrangThai);
                if (response.error) {
                    toast.error('Cập nhật trạng thái thất bại');
                    return;
                }
                toast.success('Cập nhật trạng thái thành công');
                await this.getHoaDonDetail(maHoaDon);
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async revertToInitialStatus(maHoaDon) {
            try {
                const response = await hoaDonService.quayLaiTrangThai(maHoaDon);
                if (response.error) {
                    toast.error('Quay lại trạng thái ban đầu thất bại');
                    return;
                }
                toast.success('Đã quay lại trạng thái ban đầu thành công');
                await this.getHoaDonDetail(maHoaDon);
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra khi quay lại trạng thái ban đầu');
            }
        },
        async cancelHoaDon(maHoaDon) {
            try {
                const response = await hoaDonService.cancelHoaDon(maHoaDon);
                if (response.error) {
                    toast.error('Hủy hóa đơn thất bại');
                    return;
                }
                toast.success('Hủy hóa đơn thành công');
                await this.getHoaDonDetail(maHoaDon);
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async updateCustomerInfo(maHoaDon, ttkh) {
            try {
                const response = await hoaDonService.updateTTKH_in_HD(maHoaDon, ttkh);
                if (response.error) {
                    toast.error('Cập nhật thông tin khách hàng thất bại');
                    return;
                }
                toast.success('Cập nhật thông tin khách hàng thành công');
                await this.getHoaDonDetail(maHoaDon);
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra khi cập nhật thông tin khách hàng');
            }
        },
        async updateNote(maHoaDon, ghiChu) {
            try {
                const response = await hoaDonService.updateNote(maHoaDon, ghiChu);
                if (response.error) {
                    toast.error('Cập nhật ghi chú thất bại');
                    return;
                }
                toast.success('Cập nhật ghi chú thành công');
                await this.getHoaDonDetail(maHoaDon);
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra khi cập nhật ghi chú');
            }
        },
        async getAllCTSP_HD(page = 0, size = 5, keyword = '') {
            try {
                const response = await hoaDonService.getAllCTSP_HD(page, size, keyword);
                if (response.error) {
                    toast.error('Không lấy được danh sách sản phẩm');
                    return;
                }
                this.listCTSP_HD = response.content || [];
                this.totalPages = response.totalPages || 0;
                this.currentPage = page;
                this.totalItems = response.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra khi lấy danh sách sản phẩm');
            }
        },
        async addProductsToInvoice(maHoaDon, products) {
            try {
                const response = await hoaDonService.addProductsToInvoice(maHoaDon, products);
                if (response.error) {
                    toast.error('Thêm sản phẩm vào hóa đơn thất bại');
                    return;
                }
                toast.success('Thêm sản phẩm vào hóa đơn thành công');
                await this.getHoaDonDetail(maHoaDon);
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra khi thêm sản phẩm');
            }
        },
        async removeProductFromInvoice(maHoaDon, idCTSP, soLuong) {
            try {
                const response = await hoaDonService.removeProductFromInvoice(maHoaDon, idCTSP, soLuong);
                if (response.error) {
                    return { error: true };
                }
                return response;
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm khỏi hóa đơn:', error);
                return { error: true };
            }
        },
        async updateProductQuantity(maHoaDon, idCTSP, quantityChange) {
            try {
                const response = await hoaDonService.updateProductQuantity(maHoaDon, idCTSP, quantityChange);
                if (response.error) {
                    return { error: true };
                }
                return response;
            } catch (error) {
                console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
                return { error: true };
            }
        },
        async importExcel(file) {
            const importExcelRespone = await sanPhamService.importSanPhamFromExcel(file);
            if (importExcelRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            toast.success('Import dữ liệu thành công');
            return importExcelRespone;
        },
        async saveExcelImport(data) {
            const saveExcelImportRespone = await sanPhamService.saveExcelImports(data);
            if (saveExcelImportRespone.error) {
                toast.error('Không thể lưu dữ liệu');
                return;
            }
            toast.success('Lưu dữ liệu thành công');
            return saveExcelImportRespone;
        },
        async getAllSanPhamNgaySua() {
            const sanPhamNgaySua = await sanPhamService.getAllSanPhamNgaySua();
            console.log(sanPhamNgaySua);
            if (sanPhamNgaySua.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.getAllSanPham = sanPhamNgaySua;
        },
        async getAllKhachHang(page = 0, size = 3, keyword = null, trangThai = null) {
            const khachHang = await khachHangService.getAllKhachHang(page, size, keyword, trangThai);
            if (khachHang.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            if (!khachHang.danhSachKhachHang || khachHang.danhSachKhachHang.length === 0) {
                this.getAllKhachHangArr = [];
                this.totalKhachHang = 0;
                this.currentKhachHang = 0;
                this.totalItemsKhachHang = 0;
                if (trangThai && keyword) {
                    toast.error(`Không tìm thấy khách hàng nào với trạng thái "${trangThai}" và từ khóa "${keyword}"`);
                } else if (trangThai) {
                    toast.error(`Không tìm thấy khách hàng nào với trạng thái "${trangThai}"`);
                } else if (keyword) {
                    toast.error(`Không tìm thấy khách hàng nào với từ khóa "${keyword}"`);
                }
                return;
            }
            this.getAllKhachHangArr = khachHang.danhSachKhachHang;
            this.totalKhachHang = khachHang.totalPages || 0;
            this.currentKhachHang = page;
            this.totalItemsKhachHang = khachHang.totalElements || 0;
        },
        async registerKhachHang(registerData) {
            const result = await khachHangService.registerKhachHang(registerData);
            if (result.error) {
                if (result.fieldErrors) {
                    return {
                        error: true,
                        fieldErrors: result.fieldErrors
                    };
                }
                toast.error(result.message || 'Đăng ký tài khoản thất bại!');
                return { error: true };
            }
            toast.success(result.successMessage || 'Đăng ký tài khoản thành công!');
            return { success: true, khachHang: result.khachHang };
        },
        // Thêm action login
        async login(loginData) {
            const result = await khachHangService.login(loginData);
            if (result.error) {
                if (result.fieldErrors) {
                    return {
                        error: true,
                        fieldErrors: result.fieldErrors
                    };
                }
                toast.error(result.message || 'Đăng nhập thất bại!');
                return { error: true };
            }
        
            // Kiểm tra dữ liệu trả về từ API đăng nhập
            if (!result.taiKhoan || !result.taiKhoan.ten_dang_nhap) {
                console.error('Dữ liệu tài khoản không hợp lệ:', result);
                toast.error('Dữ liệu tài khoản không hợp lệ!');
                return { error: true };
            }
        
            // Lưu thông tin cơ bản
            this.userInfo = result.taiKhoan;
            this.isLoggedIn = true;
            this.id_roles = result.id_roles;
        
            // In thông tin tài khoản cơ bản
            console.log('Thông tin tài khoản (tai_khoan):', this.userInfo);
            console.log('ID Roles:', this.id_roles);
        
            // Lưu vào sessionStorage
            sessionStorage.setItem('userInfo', JSON.stringify(result.taiKhoan));
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('id_roles', result.id_roles);
        
            if (loginData.rememberMe) {
                localStorage.setItem('userInfo', JSON.stringify(result.taiKhoan));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('id_roles', result.id_roles);
            }
        
            // Lấy thông tin chi tiết
            try {
                const userDetails = await khachHangService.getUserDetail({
                    username: result.taiKhoan.ten_dang_nhap,
                    id_roles: result.id_roles
                });
                this.userDetails = userDetails;
        
                // In thông tin chi tiết
                console.log('Thông tin chi tiết (userDetails):', this.userDetails);
        
                sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
                if (loginData.rememberMe) {
                    localStorage.setItem('userDetails', JSON.stringify(userDetails));
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin chi tiết:', error);
                toast.error('Không thể lấy thông tin chi tiết tài khoản!');
            }
        
            toast.success(result.successMessage || 'Đăng nhập thành công!');
            return { success: true, id_roles: result.id_roles };
        },
        // Cập nhật restoreLoginState để kiểm tra cả sessionStorage
        restoreLoginState() {
            let userInfo = localStorage.getItem('userInfo');
            let isLoggedIn = localStorage.getItem('isLoggedIn');
            let id_roles = localStorage.getItem('id_roles');

            // Nếu không có trong localStorage, kiểm tra sessionStorage
            if (!userInfo || isLoggedIn !== 'true') {
                userInfo = sessionStorage.getItem('userInfo');
                isLoggedIn = sessionStorage.getItem('isLoggedIn');
                id_roles = sessionStorage.getItem('id_roles');
            }

            if (userInfo && isLoggedIn === 'true') {
                this.userInfo = JSON.parse(userInfo);
                this.isLoggedIn = true;
                this.id_roles = id_roles;
            }
        },

        // Action để đăng xuất
        logout() {
            // Xóa dữ liệu trong localStorage và state
            localStorage.removeItem('id_roles');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('isLoggedIn');
            this.userInfo = null;
            this.isLoggedIn = false;
            this.id_roles = null;
            router.replace('/login-register/login');
            toast.success('Đăng xuất thành công!');
        },
        getPath(path) {
            this.checkRouter = path;
        },
        getRoutePresent(path) {
            this.checkRoutePresent = path;
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
                    break;
                case '/admin/quanlysanpham/add':
                    this.indexMenu = ['3'];
                    break;
                default:
                    this.indexMenu = ['1'];
                    break;
            }
        },
        async getImage(id, anhChinh) {
            const getImageRespone = await sanPhamService.getImageInCTSP(id, anhChinh);
            if (getImageRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.getImages = getImageRespone;
            return getImageRespone;
        },
        async getCTSPBySanPham(id) {
            const getCTSPBySanPhamRespone = await sanPhamService.getCTSPBySanPham(id);
            if (getCTSPBySanPhamRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.getCTSPBySanPhams = getCTSPBySanPhamRespone;
            try {
                const imagePromises = getCTSPBySanPhamRespone.map(async (ctsp) => {
                    const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
                    ctsp.hinh_anh = images.length > 0 ? images[0].hinh_anh : 'Không có ảnh chính';
                });
                await Promise.all(imagePromises);
                this.getCTSPBySanPhams = getCTSPBySanPhamRespone;
            } catch (error) {
                console.log(error);
            }
        },
        async getAllSP() {
            if (this.getAllChiTietSanPham.length === 0) {
                const sanPhamRespone = await sanPhamService.getAllSanPham();
                console.log(sanPhamRespone);
                if (!sanPhamRespone || sanPhamRespone.error) {
                    toast.error('Không lấy được dữ liệu');
                    return;
                }
                this.getAllSanPham = sanPhamRespone;
            } else {
                toast.error('Bị lấy dữ liệu nhiều lần');
            }
        },
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
        async createCTSP(CTSPData) {
            try {
                console.log('Dữ liệu CTSP gửi đi:', CTSPData);
                const response = await sanPhamService.createCTSP(CTSPData);
                console.log('Response từ service thêm chi tiết sản phẩm:', response);
                return response;
            } catch (error) {
                console.error('Lỗi trong createCTSP:', error);
                throw error;
            }
        },
        async getAllCTSP() {
            const chiTietSanPhamRespone = await sanPhamService.getAllChiTietSanPham();
            if (chiTietSanPhamRespone.error) {
                toast.error('Không lấy được dữ liệu');
                return;
            }
            this.getAllChiTietSanPham = chiTietSanPhamRespone;
            try {
                const imagePromises = chiTietSanPhamRespone.map(async (ctsp) => {
                    const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
                    ctsp.hinh_anh = images.length > 0 ? images[0].hinh_anh : 'Không có ảnh chính';
                });
                await Promise.all(imagePromises);
                this.getAllChiTietSanPham = chiTietSanPhamRespone;
            } catch (error) {
                console.log(error);
            }
        },
        async searchCTSP(search) {
            try {
                const chiTietSanPhamRespone = await sanPhamService.searchChiTietSanPham(search);
                if (chiTietSanPhamRespone && chiTietSanPhamRespone.error) {
                    toast.error('Không lấy được dữ liệu');
                    this.searchChiTietSanPham = [];
                    return;
                }
                if (!chiTietSanPhamRespone || !Array.isArray(chiTietSanPhamRespone) || chiTietSanPhamRespone.length === 0) {
                    console.log('Không có kết quả tìm kiếm chi tiết sản phẩm');
                    this.searchChiTietSanPham = [];
                    return;
                }
                try {
                    const imagePromises = chiTietSanPhamRespone.map(async (ctsp) => {
                        if (ctsp && ctsp.id_chi_tiet_san_pham) {
                            const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
                            ctsp.hinh_anh = images && images.length > 0 ? images[0].hinh_anh : 'Không có ảnh chính';
                        }
                        return ctsp;
                    });
                    const results = await Promise.all(imagePromises);
                    this.searchChiTietSanPham = results.filter(item => item !== null);
                    console.log('Kết quả tìm kiếm chi tiết sản phẩm đã xử lý:', this.searchChiTietSanPham);
                } catch (error) {
                    console.log('Lỗi khi xử lý hình ảnh:', error);
                    this.searchChiTietSanPham = chiTietSanPhamRespone;
                }
            } catch (error) {
                console.log('Lỗi khi tìm kiếm chi tiết sản phẩm:', error);
                this.searchChiTietSanPham = [];
            }
        },
        async searchSP(search) {
            try {
                const sanPhamResponse = await sanPhamService.searchSanPham(search);
                if (sanPhamResponse && sanPhamResponse.error) {
                    toast.error('Không lấy được dữ liệu sản phẩm');
                    this.searchSanPham = [];
                    return;
                }
                if (!sanPhamResponse || !Array.isArray(sanPhamResponse) || sanPhamResponse.length === 0) {
                    console.log('Không có kết quả tìm kiếm sản phẩm');
                    this.searchSanPham = [];
                    return;
                }
                this.searchSanPham = sanPhamResponse;
                console.log('Kết quả tìm kiếm sản phẩm:', this.searchSanPham);
            } catch (error) {
                console.log('Lỗi khi tìm kiếm sản phẩm:', error);
                this.searchSanPham = [];
            }
        },
        getLangue(check) {
            const vni = {
                nguoiDung: 'Đăng nhập',
                cuaHang: 'Cửa hàng',
                hoTro: 'Hỗ trợ',
                gioHang: 'Giỏ hàng',
                timKiem: 'Bạn đang muốn tìm kiếm gì?',
            };
            const eng = {
                nguoiDung: 'Login',
                cuaHang: 'Store',
                hoTro: 'Support',
                gioHang: 'Cart',
                timKiem: 'What are you looking for?',
            };
            if (!check) {
                this.changeLanguage = vni;
                this.check = true;
                this.language = 'EN';
            } else {
                this.changeLanguage = eng;
                this.check = false;
                this.language = 'VI';
            }
        },
        showModal(show) {
            this.status = show;
        },
        showModalSideBar(id) {
            this.id = id;
            if (this.status) {
                this.id = 0;
            }
        },
        hideModalSideBar() {
            this.id = 0;
        },
        showModalSideBar1(show) {
            this.statusSideBar1 = show;
        },
        closeNoitification() {
            this.checkNoitification = false;
        },
        async getAllVouchers(page = 0, size = 5) {
            try {
                const vouchers = await voucherService.getAllVouchers(page, size);
                if (vouchers.error) {
                    toast.error('Không lấy được dữ liệu voucher');
                    return;
                }
                this.getAllVoucherArr = vouchers.content || [];
                this.voucherTotalPages = vouchers.totalPages || 0;
                this.voucherCurrentPage = page;
                this.voucherTotalItems = vouchers.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách voucher:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getVoucherLocTrangThai(page = 0, size = 5, trangThai) {
            try {
                const voucherFilter = await voucherService.getVoucherLocTrangThai(page, size, trangThai);
                if (voucherFilter.error) {
                    toast.error('Không lấy được dữ liệu voucher');
                    return;
                }
                this.getAllVoucherArr = voucherFilter.content || [];
                this.voucherTotalPages = voucherFilter.totalPages || 0;
                this.voucherCurrentPage = page;
                this.voucherTotalItems = voucherFilter.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lọc voucher theo trạng thái:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async searchVoucher(keyword, page = 0, size = 5) {
            try {
                const voucherSearch = await voucherService.searchVoucher(keyword, page, size);
                if (voucherSearch.error) {
                    toast.error('Không tìm thấy voucher');
                    this.voucherSearch = [];
                    this.voucherTotalPages = 0;
                    this.voucherCurrentPage = 0;
                    this.voucherTotalItems = 0;
                } else {
                    this.voucherSearch = voucherSearch.content || [];
                    this.voucherTotalPages = voucherSearch.totalPages || 0;
                    this.voucherCurrentPage = page;
                    this.voucherTotalItems = voucherSearch.totalElements || 0;
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm voucher:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async offVoucher(id) {
            try {
                const voucher = this.getAllVoucherArr.find(v => v.id === id);
                if (voucher) {
                    voucher.trangThai = voucher.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra';
                }
                const response = await voucherService.offVoucher(id);
                if (response.error) {
                    toast.error('Không thể tắt voucher');
                    voucher.trangThai = voucher.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra';
                } else {
                    toast.success('Đã tắt voucher thành công');
                }
            } catch (error) {
                console.error('Lỗi khi tắt voucher:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async timKiemVoucherByPrice(minPrice, maxPrice, page = 0, size = 5) {
            try {
                const voucherFilter = await voucherService.timKiemVoucherByPrice(minPrice, maxPrice, page, size);
                if (voucherFilter.error) {
                    toast.error('Không tìm thấy voucher theo giá');
                    return;
                }
                this.getAllVoucherArr = voucherFilter.content || [];
                this.voucherTotalPages = voucherFilter.totalPages || 0;
                this.voucherCurrentPage = page;
                this.voucherTotalItems = voucherFilter.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lọc voucher theo giá:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async timKiemVoucherByDate(startDate, endDate, page = 0, size = 5) {
            try {
                const voucherFilter = await voucherService.timKiemVoucherByDate(startDate, endDate, page, size);
                if (voucherFilter.error) {
                    toast.error('Không tìm thấy voucher theo ngày');
                    return;
                }
                this.getAllVoucherArr = voucherFilter.content || [];
                this.voucherTotalPages = voucherFilter.totalPages || 0;
                this.voucherCurrentPage = page;
                this.voucherTotalItems = voucherFilter.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lọc voucher theo ngày:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async addVoucher(voucherData) {
            try {
                const response = await voucherService.addVoucher(voucherData);
                return response;
            } catch (error) {
                console.error('Lỗi khi thêm voucher:', error);
                throw error;
            }
        },
        async updateVoucher(voucherData) {
            try {
                const response = await voucherService.updateVoucher(voucherData);
                return response;
            } catch (error) {
                console.error('Lỗi khi cập nhật voucher:', error);
                throw error;
            }
        },
        async getVoucherById(id) {
            try {
                const response = await voucherService.getVoucherById(id);
                return response;
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết voucher:', error);
                throw error;
            }
        },
        async getAllKhuyenMai(page = 0, size = 5) {
            try {
                const khuyenMai = await khuyenMaiService.getAllKhuyenMai(page, size);
                if (khuyenMai.error) {
                    toast.error('Không lấy được dữ liệu khuyến mãi');
                    return;
                }
                this.getAllKhuyenMaiArr = khuyenMai.content || [];
                this.khuyenMaiTotalPages = khuyenMai.totalPages || 0;
                this.khuyenMaiCurrentPage = page;
                this.khuyenMaiTotalItems = khuyenMai.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khuyến mãi:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async getKhuyenMaiLocTrangThai(page = 0, size = 5, trangThai) {
            try {
                const khuyenMaiFilter = await khuyenMaiService.getKhuyenMaiLocTrangThai(page, size, trangThai);
                if (khuyenMaiFilter.error) {
                    toast.error('Không lấy được dữ liệu');
                    return;
                }
                this.getAllKhuyenMaiArr = khuyenMaiFilter.content || [];
                this.khuyenMaiTotalPages = khuyenMaiFilter.totalPages || 0;
                this.khuyenMaiCurrentPage = page;
                this.khuyenMaiTotalItems = khuyenMaiFilter.totalElements || 0;
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async searchKhuyenMai(keyword, page = 0, size = 5) {
            try {
                const khuyenMaiSearch = await khuyenMaiService.searchKhuyenMai(keyword, page, size);
                if (khuyenMaiSearch.error) {
                    toast.error('Không tìm thấy khuyến mãi');
                    this.khuyenMaiSearch = [];
                    this.khuyenMaiTotalPages = 0;
                    this.khuyenMaiCurrentPage = 0;
                    this.khuyenMaiTotalItems = 0;
                } else {
                    this.khuyenMaiSearch = khuyenMaiSearch.content || [];
                    this.khuyenMaiTotalPages = khuyenMaiSearch.totalPages || 0;
                    this.khuyenMaiCurrentPage = page;
                    this.khuyenMaiTotalItems = khuyenMaiSearch.totalElements || 0;
                }
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async offKhuyenMai(id) {
            try {
                const khuyenMai = this.getAllKhuyenMaiArr.find(km => km.id === id);
                if (khuyenMai) {
                    khuyenMai.trangThai = khuyenMai.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra';
                }
                const response = await khuyenMaiService.offKhuyenMai(id);
                if (response.error) {
                    toast.error('Không thể tắt khuyến mãi');
                    khuyenMai.trangThai = khuyenMai.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra';
                } else {
                    toast.success('Đã tắt khuyến mãi thành công');
                }
            } catch (error) {
                console.error(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async timKiemKhuyenMaiByPrice(minPrice, maxPrice, page = 0, size = 5) {
            try {
                const khuyenMaiFilter = await khuyenMaiService.timKiemKhuyenMaiByPrice(minPrice, maxPrice, page, size);
                if (khuyenMaiFilter.error) {
                    toast.error('Không tìm thấy khuyến mãi theo giá');
                    return;
                }
                this.getAllKhuyenMaiArr = khuyenMaiFilter.content || [];
                this.khuyenMaiTotalPages = khuyenMaiFilter.totalPages || 0;
                this.khuyenMaiCurrentPage = page;
                this.khuyenMaiTotalItems = khuyenMaiFilter.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lọc theo giá:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        async timKiemKhuyenMaiByDate(startDate, endDate, page = 0, size = 5) {
            try {
                const khuyenMaiFilter = await khuyenMaiService.timKiemKhuyenMaiByDate(startDate, endDate, page, size);
                if (khuyenMaiFilter.error) {
                    toast.error('Không tìm thấy khuyến mãi theo ngày');
                    return;
                }
                this.getAllKhuyenMaiArr = khuyenMaiFilter.content || [];
                this.khuyenMaiTotalPages = khuyenMaiFilter.totalPages || 0;
                this.khuyenMaiCurrentPage = page;
                this.khuyenMaiTotalItems = khuyenMaiFilter.totalElements || 0;
            } catch (error) {
                console.error('Lỗi khi lọc theo ngày:', error);
                toast.error('Có lỗi xảy ra');
            }
        },
        setCheckoutItems(items) {
            this.checkoutItems = Array.isArray(items) ? items : [items];
            console.log('checkoutItems', this.checkoutItems);
        },
        clearCheckoutItems() {
            this.checkoutItems = [];
        },
        async searchSanPhamKM(keyword) {
            try {
                const response = await khuyenMaiService.searchSanPhamKM(keyword);
                if (response && !response.error) {
                    this.searchSanPham = response;
                    return response;
                } else {
                    toast.error('Không tìm thấy sản phẩm');
                    this.searchSanPham = [];
                    return [];
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm sản phẩm:', error);
                toast.error('Có lỗi xảy ra');
                return [];
            }
        },
        async getChiTietSanPhamBySanPham(idSanPham) {
            try {
                const response = await khuyenMaiService.getChiTietSanPhamBySanPham(idSanPham);
                if (response && !response.error) {
                    return response;
                } else {
                    toast.error('Không lấy được chi tiết sản phẩm');
                    return [];
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                toast.error('Có lỗi xảy ra');
                return [];
            }
        },
        async getKhuyenMaiById(id) {
            if (!id || id <= 0) {
                toast.error('ID khuyến mãi không hợp lệ');
                return null;
            }
            try {
                const response = await khuyenMaiService.getKhuyenMaiById(id);
                if (response.error) {
                    toast.error(response.message || 'Không lấy được chi tiết khuyến mãi');
                    return null;
                }
                return response;
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết khuyến mãi:', error);
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết khuyến mãi');
                return null;
            }
        },
        async addKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds) {
            try {
                const response = await khuyenMaiService.addKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds);
                if (response === 'Thêm khuyến mãi thành công!') {
                    toast.success(response);
                    await this.getAllKhuyenMai(0, 5);
                    return true;
                } else {
                    toast.error(response);
                    return false;
                }
            } catch (error) {
                console.error('Lỗi khi thêm khuyến mãi:', error);
                toast.error('Có lỗi xảy ra khi thêm khuyến mãi');
                return false;
            }
        },
        async updateKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds) {
            try {
                const response = await khuyenMaiService.updateKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds);
                if (response === 'Cập nhật khuyến mãi thành công!') {
                    toast.success(response);
                    await this.getAllKhuyenMai(0, 5);
                    return true;
                } else {
                    toast.error(response);
                    return false;
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật khuyến mãi:', error);
                toast.error('Có lỗi xảy ra khi cập nhật khuyến mãi');
                return false;
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'gbStore',
                storage: localStorage,
                paths: ['checkRouter', 'indexMenu', 'language', 'checkNoitification'],
            },
        ],
    },
});