// src/stores/gbStore.js
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import { sanPhamService } from '@/services/sanPhamService'
import { nhanVienService } from '@/services/nhanVienService'
import { voucherService } from '@/services/voucherService'
import { khuyenMaiService } from '@/services/khuyenMaiService'
import { hoaDonService } from '@/services/hoaDonService'
import { check } from 'prettier'
import { useRoute } from 'vue-router'
import { khachHangService } from '@/services/khachHangService'
import { banHangService } from '@/services/banHangService'
import { bctkService } from '@/services/bctkService'
export const useGbStore = defineStore('gbStore', {
  state: () => ({
    // Các state hiện tại chung
    changeLanguage: {},
    check: true,
    language: 'EN',
    status: false,
    id: 0,
    checkNoitification: true,
    checkRouter: '',
    checkRoutePresent: '',
    indexMenu: ['1'],
    searchs: '', // Dùng chung cho tìm kiếm
    //Sản phẩm
    getAllSanPham: [],
    getAllChiTietSanPham: [],
    searchChiTietSanPham: [],
    searchSanPham: [],
    getCTSPBySanPhams: [],
    getImages: [],
    danhMucList: [],
    thuongHieuList: [],
    chatLieuList: [],
    mauSacList: [],
    sizeList: [],
    sanPhamById: {},
    // State cho chi tiết sản phẩm
    cTSPBySanPhamFull: [],
    filteredSanPhamList: [],
    //Giỏ hàng và thanh toán
    checkoutItems: [], //Dữ liệu sản phẩm mua ngay
    justAddedProduct: false, // Thêm flag để đánh dấu vừa thêm sản phẩm mới
    // Cập nhật cấu trúc cho tìm kiếm và lọc
    currentFilter: null, // Bộ lọc hiện tại

    // Danh sách gốc
    getAllSanPham: [], // Danh sách sản phẩm gốc
    getAllChiTietSanPham: [], // Danh sách chi tiết sản phẩm gốc

    // State cho tìm kiếm
    searchKeyword: '', // Từ khóa tìm kiếm hiện tại
    searchProductIds: [], // Lưu trữ ID của các sản phẩm tìm thấy
    filterCriteria: {}, // Lưu trữ các tiêu chí lọc
    filteredProductIds: [], // Lưu trữ ID của các sản phẩm đã lọc
    finalProductIds: [], // ID sản phẩm cuối cùng sau khi kết hợp tìm kiếm và lọc
    isSearching: false, // Đang trong trạng thái tìm kiếm?
    isFiltering: false, // Đang trong trạng thái lọc?
    debug: true, // Chế độ debug để ghi log chi tiết



    //Nhân viên
    getAllNhanVienArr: [],
    totalPages: 0, // Dùng chung cho phân trang
    currentPage: 0, // Dùng chung cho phân trang
    totalItems: 0, // Dùng chung cho phân trang
    nhanVienArr: [],
    nhanVienSearch: [],


    //Hóa đơn
    getAllHoaDonArr: [],
    totalHoaDon: 0,
    currentHoaDon: 0,
    totalItemsHoaDon: 0,
    hoaDonDetail: {},
    chiTietHoaDons: [],
    trangThaiHistory: [],
    getAllHoaDonCTTArr: [],
    listCTSP_HD: [],


    // Đăng ký đăng nhập // Thêm state để lưu thông tin người dùng
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
    id_roles: localStorage.getItem('id_roles') || null, // Thêm id_roles vào state
    userDetails: null,


    //Khách hàng
    getAllKhachHangArr: [],
    totalKhachHang: 0,
    currentKhachHang: 0,
    totalItemsKhachHang: 0,
    listSanPhamBanHang: [],
    getAllCTSPKMList: [],


    // State cho voucher
    getAllVoucherArr: [],
    voucherSearch: [],
    voucherTotalPages: 0,
    voucherCurrentPage: 0,
    voucherTotalItems: 0,
    voucherSearchs: '',

    // State cho khuyến mãi
    getAllKhuyenMaiArr: [],
    khuyenMaiSearch: [],
    khuyenMaiTotalPages: 0, // Riêng cho khuyến mãi
    khuyenMaiCurrentPage: 0, // Riêng cho khuyến mãi
    khuyenMaiTotalItems: 0, // Riêng cho khuyến mãi
    khuyenMaiSearchs: '', // Riêng cho khuyến mãi

    //Thống kê
    thongKe: {
      doanhThu: 0,
      tongDonHang: 0,
      tongSanPham: 0,
    },
    // Thêm state cho filter
    bctkFilter: {
      type: 'hom-nay',
      startDate: '',
      endDate: '',
    },
    topSanPhamBanChay: [],
    topSanPhamBanCham: [],
    // tỉ lệ trạng thái đơn hàng
    tiLeTrangThai: [],
    loading: false,
    error: null,


  }),

  ///Đầu mút2
  actions: {
    // BCTK
    async getSoLieu(type = null, startDate = null, endDate = null) {
      try {
        console.log('Store getSoLieu được gọi với:', { type, startDate, endDate })
        const response = await bctkService.getSoLieu(type, startDate, endDate)

        if (response) {
          console.log('Dữ liệu nhận được trong store:', response)
          this.thongKe = {
            doanhThu: response.doanhThu || 0,
            tongDonHang: response.tongDonHang || 0,
            tongSanPham: response.tongSanPham || 0,
          }
          console.log('State sau khi cập nhật:', this.thongKe)
          return response
        } else {
          toast.error('Không lấy được dữ liệu thống kê')
          return null
        }
      } catch (error) {
        console.error('Lỗi trong store getSoLieu:', error)
        toast.error('Có lỗi xảy ra khi lấy thống kê')
        return null
      }
    },

    // Action để xử lý thay đổi filter
    async handleBCTKFilterChange(filter, customStartDate = null, customEndDate = null) {
      try {
        this.bctkFilter.type = filter

        if (filter === 'tuy-chon') {
          if (!customStartDate || !customEndDate) {
            toast.error('Vui lòng chọn khoảng thời gian')
            return
          }
          this.bctkFilter.startDate = customStartDate
          this.bctkFilter.endDate = customEndDate
          await this.getSoLieu(filter, customStartDate, customEndDate)
        } else {
          this.bctkFilter.startDate = ''
          this.bctkFilter.endDate = ''
          await this.getSoLieu(filter)
        }
      } catch (error) {
        console.error('Lỗi khi thay đổi filter thống kê:', error)
        toast.error('Có lỗi xảy ra khi lọc thống kê')
      }
    },
    async fetchTiLeTrangThai() {
      try {
        this.loading = true;
        const data = await bctkService.getTiLeTrangThai();
        console.log('Dữ liệu thô từ API:', data);

        if (!data || !Array.isArray(data)) {
          console.error('Định dạng dữ liệu không hợp lệ');
          this.tiLeTrangThai = [];
          return;
        }

        // Chuyển đổi từ dữ liệu API sang định dạng frontend cần
        this.tiLeTrangThai = data.map(item => ({
          trangThai: this.formatTrangThai(item.trangThaiDonHang || 'Unknown'),
          soLuong: parseFloat(item.tiLeTrangThaiDonHang || 0), // Lấy phần trăm
          tiLe: parseFloat(item.tiLeTrangThaiDonHang || 0)
        }));

        // Thêm dữ liệu mẫu nếu không có
        if (this.tiLeTrangThai.length === 0) {
          this.tiLeTrangThai = [{
            trangThai: 'Không có dữ liệu',
            soLuong: 100,
            tiLe: 100
          }];
        }

        console.log('Dữ liệu đã xử lý:', this.tiLeTrangThai);
      } catch (error) {
        console.error('Lỗi trong fetchTiLeTrangThai:', error);
        this.error = error.message;
        this.tiLeTrangThai = [{
          trangThai: 'Lỗi',
          soLuong: 100,
          tiLe: 100
        }];
      } finally {
        this.loading = false;
      }
    },

    // Hàm format tên trạng thái (nếu chưa có)
    formatTrangThai(trangThai) {
      switch (trangThai) {
        case "CHO_XAC_NHAN": return "Chờ xác nhận";
        case "DA_XAC_NHAN": return "Đã xác nhận";
        case "DA_CAP_NHAT": return "Đã cập nhật";
        case "DANG_GIAO": return "Đang giao";
        case "HOAN_THANH": return "Hoàn thành";
        case "DA_HUY": return "Đã hủy";
        default: return trangThai;
      }
    },
    async getTopSanPhamBanChay() {
      const topSanPhamBanChay = await bctkService.topSanPhamBanChay()
      this.topSanPhamBanChay = topSanPhamBanChay
    },
    async getTopSanPhamBanCham() {
      const topSanPhamBanCham = await bctkService.topSanPhamBanCham()
      this.topSanPhamBanCham = topSanPhamBanCham
    },
    //Kết thúc BCTK



    //Nhân viên
    async layDanhSachNhanVien() {
      const nhanVienArr = await nhanVienService.layDanhSachNhanVien()
      this.nhanVienArr = nhanVienArr
    },
    async getAllNhanVien(page = 0, size = 5) {
      try {
        const nhanVien = await nhanVienService.getAllNhanVien(page, size)
        if (nhanVien.error) {
          toast.error('Không lấy được dữ liệu')
          return
        } else {
          // this.getAllNhanVienArr = nhanVien;
          // this.totalItems = 50;  // Tạm thởi hardcode để test
          // this.currentPage = page;
          this.getAllNhanVienArr = nhanVien.content || [] // Lấy danh sách nhân viên
          this.totalPages = nhanVien.totalPages || 0
          this.currentPage = page
          this.totalItems = nhanVien.totalElements || 0
        }
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async getNhanVienLocTrangThai(page = 0, size = 5, trangThai = this.selectTrangThai) {
      try {
        let params = { page, size }
        if (trangThai) {
          params.trangThai = trangThai // Chỉ thêm trạng thái nếu có giá trị
        }
        const nhanvienFilter = await nhanVienService.getNhanVienLocTrangThai(page, size, trangThai)
        if (nhanvienFilter.error) {
          toast.error('Không lấy được dữ liệu')
          return
        } else {
          this.getAllNhanVienArr = nhanvienFilter.content || [] // Lấy danh sách nhân viên
          this.totalPages = nhanvienFilter.totalPages || 0
          this.currentPage = page
          this.totalItems = nhanvienFilter.totalElements || 0
          this.selectedTrangThai = trangThai
        }
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async changeTrangThai(id) {
      try {
        // Cập nhật ngay lập tức UI trước khi gọi API
        const nhanVien = this.getAllNhanVienArr.find((nhanVien) => nhanVien.idNhanVien === id)
        if (nhanVien) {
          nhanVien.trangThai =
            nhanVien.trangThai === 'Đang hoạt động' ? 'Đã nghỉ việc' : 'Đang hoạt động'
        }

        //     const chuyenTrangThai = await nhanVienService.changeTrangThai(id);
        //     if (chuyenTrangThai.error) {
        //         toast.error('Có lỗi xảy ra');
        // Gọi API nhưng không chờ phản hồi để tránh lag
        nhanVienService.changeTrangThai(id).then((response) => {
          if (response.error) {
            toast.error('Có lỗi xảy ra')
            // Nếu lỗi, revert trạng thái lại
            nhanVien.trangThai =
              nhanVien.trangThai === 'Đang hoạt động' ? 'Đã nghỉ việc' : 'Đang hoạt động'
          } else {
            toast.success('Chuyển trạng thái thành công')
          }
        })
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async themNhanVien(nhanVienMoi) {
      console.log('Dữ liệu truyền vào', nhanVienMoi)
      try {
        const themNhanVienres = await nhanVienService.themNhanViens(nhanVienMoi)
        if (themNhanVienres.error) {
          toast.error('Có lỗi xảy ra')
          return
        }
        return themNhanVienres
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    //Lấy nhân viên theo id
    async getNhanVienById(id) {
      const nhanVienById = await nhanVienService.getNhanVienById(id)
      return nhanVienById
    },
    //Sửa nhân viên
    async suaNhanVien(nhanVienUpdate) {
      console.log('Dữ liệu truyền vào', nhanVienUpdate)
      try {
        const suaNhanVienRes = await nhanVienService.suaNhanViens(nhanVienUpdate)
        if (suaNhanVienRes.error) {
          toast.error('Có lỗi xảy ra')
          return
        }
        return suaNhanVienRes
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    //Search nhân viên
    async searchNhanVien(keyword, page = 0, size = 5) {
      try {
        const searchNhanVienRes = await nhanVienService.searchNhanVien(keyword, page, size)
        if (searchNhanVienRes.error) {
          toast.error('Có lỗi xảy ra')
          this.nhanVienSearch = []
          this.totalPages = 0
          this.currentPage = 0
          this.totalItems = 0
        } else if (searchNhanVienRes.content.length === 0) {
          toast.error('Không tìm thấy nhân viên nào')
        } else {
          this.nhanVienSearch = searchNhanVienRes.content || []
          this.totalPages = searchNhanVienRes.totalPages || 0
          this.currentPage = page
          this.totalItems = searchNhanVienRes.totalElements || 0
        }
      } catch (error) {
        console.error(error)
      }
    },
    ////////////-----------------Sản phẩm-------------------////////////
    //Lấy danh sách sản phẩm theo sản phẩm
    async getSanPhamBySP(tenSanPham) {
      try {
        const sanPham = await sanPhamService.getSanPhamBySanPham(tenSanPham)
        if (sanPham.error) {
          toast.error('Không lấy được dữ liệu')
          return
        } else {
          this.listSanPhamBanHang = sanPham
        }
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    //Lấy sản phẩm theo id
    async getSanPhamById(id) {
      const sanPhamByIds = await sanPhamService.getSanPhamById(id)
      if (sanPhamByIds.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.sanPhamById = sanPhamByIds
      }
    },
    //Lấy danh sách danh mục
    async getDanhMucList() {
      const danhMucRespone = await sanPhamService.getDanhMucList()
      if (danhMucRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.danhMucList = danhMucRespone
      }
    },
    //Lấy danh sách thương hiệu
    async getThuongHieuList() {
      const thuongHieuRespone = await sanPhamService.getThuongHieuList()
      if (thuongHieuRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.thuongHieuList = thuongHieuRespone
      }
    },
    //Lấy danh sách chất liệu
    async getChatLieuList() {
      const chatLieuRespone = await sanPhamService.getChatLieuList()
      if (chatLieuRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.chatLieuList = chatLieuRespone
      }
    },
    //Lấy danh sách màu sắc
    async getMauSacList() {
      const mauSacRespone = await sanPhamService.getMauSacList()
      if (mauSacRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.mauSacList = mauSacRespone
      }
    },
    //Lấy danh sách size    
    async getSizeList() {
      const sizeRespone = await sanPhamService.getSizeList()
      if (sizeRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.sizeList = sizeRespone
      }
    },

    //Cập nhật trạng thái sản phẩm
    async changeStatusSanPham(id) {
      try {
        // Cập nhật ngay lập tức UI trước khi gọi API
        const sanPham = this.getAllSanPham.find((sanPham) => sanPham.id_san_pham === id)
        if (sanPham) {
          sanPham.trang_thai = sanPham.trang_thai === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động'
        }
        // Gọi API nhưng không chờ phản hồi để tránh lag
        sanPhamService.changeStatusSanPham(id).then((response) => {
          if (response.error) {
            toast.error('Có lỗi xảy ra')
            sanPham.trang_thai =
              sanPham.trang_thai === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động'
          } else {
            toast.success('Chuyển trạng thái thành công')
          }
        })
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async getCTSPBySanPhamFull(idSanPham) {
      const cTSPBySanPhamFull = await sanPhamService.getCTSPBySanPhamFull(idSanPham)
      if (cTSPBySanPhamFull.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.cTSPBySanPhamFull = cTSPBySanPhamFull
        console.log(this.cTSPBySanPhamFull)
      }
    },
    async getAllSanPhamNgaySua() {
      const sanPhamNgaySua = await sanPhamService.getAllSanPhamNgaySua()
      console.log(sanPhamNgaySua)
      if (sanPhamNgaySua.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.getAllSanPham = sanPhamNgaySua
      }
    },
    ///////////-----------------Hóa đơn-------------------////////////
    async getAllHoaDon(page = 0, size = 5) {
      try {
        const hoaDon = await hoaDonService.getAllHoaDon(page, size)
        if (hoaDon.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        this.getAllHoaDonArr = hoaDon.content || []
        this.totalHoaDon = hoaDon.totalPages || 0
        this.currentHoaDon = page
        this.totalItemsHoaDon = hoaDon.totalElements || 0
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async filterByTrangThai(trangThai, page = 0, size = 5) {
      try {
        const response = await hoaDonService.filterByTrangThai(trangThai, page, size)
        if (response.error) {
          toast.error('Không lọc được dữ liệu')
          return
        }
        this.getAllHoaDonArr = response.content || []
        this.totalHoaDon = response.totalPages || 0
        this.currentHoaDon = page
        this.totalItemsHoaDon = response.totalElements || 0
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async filterByDate(tuNgay, denNgay, page = 0, size = 5) {
      try {
        console.log('Từ ngày: ' + tuNgay + 'Đến ngày: ' + denNgay)
        const response = await hoaDonService.filterByDate(tuNgay, denNgay, page, size)
        console.log('Response từ getDate:', response)
        if (response.error) {
          toast.error('Không lọc được dữ liệu')
          return
        }
        this.getAllHoaDonArr = response.content || []
        this.totalHoaDon = response.totalPages || 0
        this.currentHoaDon = page
        this.totalItemsHoaDon = response.totalElements || 0
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async searchHoaDon(keyword, page = 0, size = 5) {
      try {
        const response = await hoaDonService.searchHoaDon(keyword, page, size)
        if (response.error) {
          toast.error('Không tìm kiếm được dữ liệu')
          return
        }
        this.getAllHoaDonArr = response.content || []
        this.totalHoaDon = response.totalPages || 0
        this.currentHoaDon = page
        this.totalItemsHoaDon = response.totalElements || 0
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    // Thêm action mới để lấy chi tiết hóa đơn
    async getHoaDonDetail(maHoaDon) {
      try {
        console.log('maHoaDon:', maHoaDon)
        const response = await hoaDonService.getCTHD(maHoaDon)
        console.log('Response từ getCTHD:', response)
        if (response.error) {
          toast.error('Không lấy được chi tiết hóa đơn')
          return
        } else {
          this.hoaDonDetail = response.hoaDon || {}
          this.chiTietHoaDons = response.chiTietHoaDons || []
          this.trangThaiHistory = response.trangThaiHistory || []
        }
      } catch (error) {
        console.error('Lỗi trong getHoaDonDetail:', error)
        toast.error('Có lỗi xảy ra khi lấy chi tiết hóa đơn')
      }
    },
    // Thêm action để thay đổi trạng thái hóa đơn
    async changeTrangThaiHoaDon(maHoaDon, newTrangThai) {
      try {
        const response = await hoaDonService.changeTrangThai(maHoaDon, newTrangThai)
        if (response.error) {
          toast.error('Cập nhật trạng thái thất bại')
          return
        }
        toast.success('Cập nhật trạng thái thành công')
        await this.getHoaDonDetail(maHoaDon) // Refresh dữ liệu sau khi cập nhật
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async revertToInitialStatus(maHoaDon) {// Quay lại trạng thái Chờ xác nhận
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
    async cancelHoaDon(maHoaDon) {// Thêm action để hủy hóa đơn
      try {
        const response = await hoaDonService.cancelHoaDon(maHoaDon)
        if (response.error) {
          toast.error('Hủy hóa đơn thất bại')
          return
        }
        toast.success('Hủy hóa đơn thành công')
        await this.getHoaDonDetail(maHoaDon) // Refresh dữ liệu sau khi hủy
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
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
    ///////////////////////////Đăng ký tài khoản khách hàng + đăng nhập /////////////////////////////////////////
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
    // Khôi phục trạng thái đăng nhập từ localStorage hoặc sessionStorage
    restoreLoginState() {
        let userInfo = localStorage.getItem('userInfo');
        let isLoggedIn = localStorage.getItem('isLoggedIn');
        let id_roles = localStorage.getItem('id_roles');
        let userDetails = localStorage.getItem('userDetails');

        // Nếu không có trong localStorage, kiểm tra sessionStorage
        if (!userInfo || isLoggedIn !== 'true') {
            userInfo = sessionStorage.getItem('userInfo');
            isLoggedIn = sessionStorage.getItem('isLoggedIn');
            id_roles = sessionStorage.getItem('id_roles');
            userDetails = sessionStorage.getItem('userDetails');
        }

        if (userInfo && isLoggedIn === 'true') {
            this.userInfo = JSON.parse(userInfo);
            this.isLoggedIn = true;
            this.id_roles = id_roles ? parseInt(id_roles) : null;
            this.userDetails = userDetails ? JSON.parse(userDetails) : null;

            // In thông tin để kiểm tra
            console.log('Khôi phục trạng thái đăng nhập:');
            console.log('User Info:', this.userInfo);
            console.log('ID Roles:', this.id_roles);
            console.log('User Details:', this.userDetails);
        } else {
            console.log('Không có dữ liệu đăng nhập để khôi phục.');
        }
    },

    // Đăng xuất
        logout() {
            // Xóa dữ liệu trong localStorage và sessionStorage
            localStorage.removeItem('userInfo');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('id_roles');
            localStorage.removeItem('userDetails');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('id_roles');
            sessionStorage.removeItem('userDetails');

            // Reset trạng thái trong store
            this.userInfo = null;
            this.isLoggedIn = false;
            this.id_roles = null;
            this.userDetails = null;

            // const router = useRouter();
            // router.replace('/login-register/login');
            toast.success('Đăng xuất thành công!');
            window.location.href = '/login-register/login';
        },
    //Import excel
    async importExcel(file) {
      try {
        console.log('Store processing file:', file);
        console.log('File type:', file.type);
        console.log('File name:', file.name);

        // If we have a file from Ant Design Upload, make sure we're using the right reference
        const fileToSend = file.originFileObj || file;

        const importExcelRespone = await sanPhamService.importSanPhamFromExcel(fileToSend);

        if (importExcelRespone.error) {
          toast.error('Không lấy được dữ liệu');
          return importExcelRespone; // Return the error response so we can handle it
        } else {
          toast.success('Import dữ liệu thành công');
        }
        return importExcelRespone;
      } catch (error) {
        console.error('Error in importExcel store method:', error);
        toast.error('Lỗi khi xử lý file Excel');
        throw error; // Rethrow to let the component handle it
      }
    },

    //Save excel
    async saveExcelImport(data) {
      const saveExcelImportRespone = await sanPhamService.saveExcelImports(data)
      if (saveExcelImportRespone.error) {
        toast.error('Không thể lưu dữ liệu')
        return
      } else {
        toast.success('Lưu dữ liệu thành công')
      }
      return saveExcelImportRespone
    },

    // Xuất Excel với các tùy chọn
    async exportExcel(productIds, fields) {
      try {
        console.log('Đang xuất Excel cho sản phẩm:', productIds);
        console.log('Các trường được chọn:', fields);

        const blob = await sanPhamService.exportExcel(productIds, fields);

        // Tạo URL cho blob và tải xuống
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `san-pham-export-${new Date().getTime()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Xuất Excel thành công');
        return true;
      } catch (error) {
        console.error('Lỗi khi xuất Excel:', error);
        toast.error('Không thể xuất Excel');
        return false;
      }
    },
    //Kết thúc Xuất Excel
    //Khách hàng
    //Lấy danh sách khách hàng
    async getAllKhachHang(page = 0, size = 3, keyword = null, trangThai = null) {
      const khachHang = await khachHangService.getAllKhachHang(page, size, keyword, trangThai)
      if (khachHang.error) {
        toast.error('Không lấy được dữ liệu')
        return
      }
      if (!khachHang.danhSachKhachHang || khachHang.danhSachKhachHang.length === 0) {
        this.getAllKhachHangArr = [];
        this.diaChiMap = {};
        this.totalKhachHang = 0;
        this.currentKhachHang = 0;
        this.totalItemsKhachHang = 0;
        // Hiển thị thông báo tùy thuộc vào điều kiện lọc
        if (trangThai && keyword) {
          toast.error(
            `Không tìm thấy khách hàng nào với trạng thái "${trangThai}" và từ khóa "${keyword}"`,
          )
        } else if (trangThai) {
          toast.error(`Không tìm thấy khách hàng nào với trạng thái "${trangThai}"`)
        } else if (keyword) {
          toast.error(`Không tìm thấy khách hàng nào với từ khóa "${keyword}"`)
        }
        return
      }

      // Nếu có dữ liệu thì gán như bình thường
      this.getAllKhachHangArr = khachHang.danhSachKhachHang
      this.diaChiMap = khachHang.diaChiMap || {}
      this.totalKhachHang = khachHang.totalPages || 0
      this.currentKhachHang = page
      this.totalItemsKhachHang = khachHang.totalElements || 0
    },

    ///=======Code bán hàng tại quầy=======///
    async getAllCTSPKM() {
      try {
        const response = await sanPhamService.getAllCTSPKM()
        if (response.error) {
          toast.error('Không lấy được dữ liệu chi tiết sản phẩm khuyến mãi')
          this.getAllCTSPKMList = []
          return
        }
        this.getAllCTSPKMList = response
      } catch (error) {
        console.log(error)
        this.getAllCTSPKMList = []
      }
    },
    async getAllHoaDonCTT() {
      try {
        const hoaDonCTT = await banHangService.getAllHoaDonCTT()
        if (hoaDonCTT.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        this.getAllHoaDonCTTArr = hoaDonCTT
      } catch (error) {
        console.log(error)
        this.getAllHoaDonCTTArr = []
      }
    },
    async createHoaDon(idNhanVien) {
      console.log('idNhanVien hoa don', idNhanVien)
      try {
        const hoaDon = await banHangService.createHoaDon(idNhanVien)
        if (hoaDon.error) {
          toast.error('Không thêm được hoá đơn')
          return
        }
        console.log('hoaDon đã thêm', hoaDon)
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
        throw error
      }
    },
    async deleteHoaDon(idHoaDon) {
      try {
        const hoaDon = await banHangService.deleteHoaDon(idHoaDon)
        if (hoaDon.error) {
          toast.error('Không xóa được hoá đơn')
          return
        }
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
        throw error
      }
    },
    async getAllSPHD(idHoaDon) {
      try {
        const hoaDon = await banHangService.getAllSPHD(idHoaDon)
        if (hoaDon.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        this.getAllSPHDArr = hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lị xảy ra')
        throw error
      }
    },
    async addSPHD(idHoaDon, idCTSP, soLuong, giaBan) {
      try {
        const hoaDon = await banHangService.addSPHD(idHoaDon, idCTSP, soLuong, giaBan)
        if (hoaDon.error) {
          toast.error('Không thêm được sản phẩm vào hoá đơn')
          return
        }
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lị xảy ra')
        throw error
      }
    },
    async themSPHDMoi(idHoaDon, idCTSP, soLuong, giaBan) {
      try {
        const hoaDon = await banHangService.themSPHDMoi(idHoaDon, idCTSP, soLuong, giaBan)
        if (hoaDon.error) {
          toast.error('Không thêm được sản phẩm vào hoá đơn')
          return
        }
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lị xảy ra')
        throw error
      }
    },
    async trangThaiDonHang(idHoaDon) {
      try {
        const hoaDon = await banHangService.trangThaiDonHang(idHoaDon)
        if (hoaDon.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lị xảy ra')
        throw error
      }
    },
    async phuongThucNhanHang(idHoaDon, phuongThucNhanHang) {
      try {
        const hoaDon = await banHangService.phuongThucNhanHang(idHoaDon, phuongThucNhanHang)
        if (hoaDon.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lị xảy ra')
        throw error
      }
    },
    async giamSPHD(idHoaDon, idCTSP, soLuong, giaBan) {
      try {
        const hoaDon = await banHangService.giamSPHD(idHoaDon, idCTSP, soLuong, giaBan)
        if (hoaDon.error) {
          toast.error('Không giảm được sản phẩm hoá đơn')
          return
        }
        return hoaDon
      } catch (error) {
        console.error(error)
        toast.error('Có lị xảy ra')
        throw error
      }
    },
    async getListHoaDon() {
      try {
        const listHD = await hoaDonService.getListHoaDon()
        if (listHD.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        this.getListHoaDonAll = listHD
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },

    /////

    //================= Action cho voucher =================///
    async getAllVouchers(page = 0, size = 5) {
      try {
        const vouchers = await voucherService.getAllVouchers(page, size)
        if (vouchers.error) {
          toast.error('Không lấy được dữ liệu voucher')
          return
        }
        this.getAllVoucherArr = vouchers.content || []
        this.voucherTotalPages = vouchers.totalPages || 0
        this.voucherCurrentPage = page
        this.voucherTotalItems = vouchers.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async getVoucherLocTrangThai(page = 0, size = 5, trangThai) {
      try {
        const voucherFilter = await voucherService.getVoucherLocTrangThai(page, size, trangThai)
        if (voucherFilter.error) {
          toast.error('Không lấy được dữ liệu voucher')
          return
        }
        this.getAllVoucherArr = voucherFilter.content || []
        this.voucherTotalPages = voucherFilter.totalPages || 0
        this.voucherCurrentPage = page
        this.voucherTotalItems = voucherFilter.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lọc voucher theo trạng thái:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async searchVoucher(keyword, page = 0, size = 5) {
      try {
        const voucherSearch = await voucherService.searchVoucher(keyword, page, size)
        if (voucherSearch.error) {
          toast.error('Không tìm thấy voucher')
          this.voucherSearch = []
          this.voucherTotalPages = 0
          this.voucherCurrentPage = 0
          this.voucherTotalItems = 0
        } else {
          this.voucherSearch = voucherSearch.content || []
          this.voucherTotalPages = voucherSearch.totalPages || 0
          this.voucherCurrentPage = page
          this.voucherTotalItems = voucherSearch.totalElements || 0
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm voucher:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async offVoucher(id) {
      try {
        const voucher = this.getAllVoucherArr.find((v) => v.id === id)
        if (voucher) {
          voucher.trangThai = voucher.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra'
        }
        const response = await voucherService.offVoucher(id)
        if (response.error) {
          toast.error('Không thể tắt voucher')
          voucher.trangThai = voucher.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra'
        } else {
          toast.success('Đã tắt voucher thành công')
        }
      } catch (error) {
        console.error('Lỗi khi tắt voucher:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async timKiemVoucherByPrice(minPrice, maxPrice, page = 0, size = 5) {
      try {
        const voucherFilter = await voucherService.timKiemVoucherByPrice(
          minPrice,
          maxPrice,
          page,
          size,
        )
        if (voucherFilter.error) {
          toast.error('Không tìm thấy voucher theo giá')
          return
        }
        this.getAllVoucherArr = voucherFilter.content || []
        this.voucherTotalPages = voucherFilter.totalPages || 0
        this.voucherCurrentPage = page
        this.voucherTotalItems = voucherFilter.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lọc voucher theo giá:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async timKiemVoucherByDate(startDate, endDate, page = 0, size = 5) {
      try {
        const voucherFilter = await voucherService.timKiemVoucherByDate(
          startDate,
          endDate,
          page,
          size,
        )
        if (voucherFilter.error) {
          toast.error('Không tìm thấy voucher theo ngày')
          return
        }
        this.getAllVoucherArr = voucherFilter.content || []
        this.voucherTotalPages = voucherFilter.totalPages || 0
        this.voucherCurrentPage = page
        this.voucherTotalItems = voucherFilter.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lọc voucher theo ngày:', error)
        toast.error('Có lỗi xảy ra')
      }
    },
    async addVoucher(voucherData) {
      try {
        const response = await voucherService.addVoucher(voucherData)
        return response // Trả về chuỗi từ backend
      } catch (error) {
        console.error('Lỗi khi thêm voucher:', error)
        throw error // Để frontend xử lý lỗi
      }
    },
    async updateVoucher(voucherData) {
      try {
        const response = await voucherService.updateVoucher(voucherData)
        return response
      } catch (error) {
        console.error('Lỗi khi cập nhật voucher:', error)
        throw error
      }
    },

    async getVoucherById(id) {
      try {
        const response = await voucherService.getVoucherById(id)
        return response
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết voucher:', error)
        throw error
      }
    },

    // Action cho khuyến mãi
    async getAllKhuyenMai(page = 0, size = 5) {
      try {
        const khuyenMai = await khuyenMaiService.getAllKhuyenMai(page, size)
        if (khuyenMai.error) {
          toast.error('Không lấy được dữ liệu khuyến mãi')
          return
        }
        this.getAllKhuyenMaiArr = khuyenMai.content || []
        this.khuyenMaiTotalPages = khuyenMai.totalPages || 0
        this.khuyenMaiCurrentPage = page
        this.khuyenMaiTotalItems = khuyenMai.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khuyến mãi:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async getKhuyenMaiLocTrangThai(page = 0, size = 5, trangThai) {
      try {
        const khuyenMaiFilter = await khuyenMaiService.getKhuyenMaiLocTrangThai(
          page,
          size,
          trangThai,
        )
        if (khuyenMaiFilter.error) {
          toast.error('Không lấy được dữ liệu')
          return
        }
        this.getAllKhuyenMaiArr = khuyenMaiFilter.content || []
        this.khuyenMaiTotalPages = khuyenMaiFilter.totalPages || 0
        this.khuyenMaiCurrentPage = page
        this.khuyenMaiTotalItems = khuyenMaiFilter.totalElements || 0
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async searchKhuyenMai(keyword, page = 0, size = 5) {
      try {
        const khuyenMaiSearch = await khuyenMaiService.searchKhuyenMai(keyword, page, size)
        if (khuyenMaiSearch.error) {
          toast.error('Không tìm thấy khuyến mãi')
          this.khuyenMaiSearch = []
          this.khuyenMaiTotalPages = 0
          this.khuyenMaiCurrentPage = 0
          this.khuyenMaiTotalItems = 0
        } else {
          this.khuyenMaiSearch = khuyenMaiSearch.content || []
          this.khuyenMaiTotalPages = khuyenMaiSearch.totalPages || 0
          this.khuyenMaiCurrentPage = page
          this.khuyenMaiTotalItems = khuyenMaiSearch.totalElements || 0
        }
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async offKhuyenMai(id) {
      try {
        const khuyenMai = this.getAllKhuyenMaiArr.find((km) => km.id === id)
        if (khuyenMai) {
          khuyenMai.trangThai =
            khuyenMai.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra'
        }
        const response = await khuyenMaiService.offKhuyenMai(id)
        if (response.error) {
          toast.error('Không thể tắt khuyến mãi')
          khuyenMai.trangThai =
            khuyenMai.trangThai === 'Đang diễn ra' ? 'Đã kết thúc' : 'Đang diễn ra'
        } else {
          toast.success('Đã tắt khuyến mãi thành công')
        }
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async timKiemKhuyenMaiByPrice(minPrice, maxPrice, page = 0, size = 5) {
      try {
        const khuyenMaiFilter = await khuyenMaiService.timKiemKhuyenMaiByPrice(
          minPrice,
          maxPrice,
          page,
          size,
        )
        if (khuyenMaiFilter.error) {
          toast.error('Không tìm thấy khuyến mãi theo giá')
          return
        }
        this.getAllKhuyenMaiArr = khuyenMaiFilter.content || []
        this.khuyenMaiTotalPages = khuyenMaiFilter.totalPages || 0
        this.khuyenMaiCurrentPage = page
        this.khuyenMaiTotalItems = khuyenMaiFilter.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lọc theo giá:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    async timKiemKhuyenMaiByDate(startDate, endDate, page = 0, size = 5) {
      try {
        const khuyenMaiFilter = await khuyenMaiService.timKiemKhuyenMaiByDate(
          startDate,
          endDate,
          page,
          size,
        )
        if (khuyenMaiFilter.error) {
          toast.error('Không tìm thấy khuyến mãi theo ngày')
          return
        }
        this.getAllKhuyenMaiArr = khuyenMaiFilter.content || []
        this.khuyenMaiTotalPages = khuyenMaiFilter.totalPages || 0
        this.khuyenMaiCurrentPage = page
        this.khuyenMaiTotalItems = khuyenMaiFilter.totalElements || 0
      } catch (error) {
        console.error('Lỗi khi lọc theo ngày:', error)
        toast.error('Có lỗi xảy ra')
      }
    },

    setCheckoutItems(items) {
      this.checkoutItems = Array.isArray(items) ? items : [items]
      console.log('checkoutItems', this.checkoutItems)
    },

    clearCheckoutItems() {
      this.checkoutItems = []
    },

    // Action tìm kiếm sản phẩm (tùy chọn nếu muốn tích hợp vào store)
    async searchSanPhamKM(keyword) {
      try {
        const response = await khuyenMaiService.searchSanPhamKM(keyword)
        if (response && !response.error) {
          this.searchSanPham = response
          return response
        } else {
          toast.error('Không tìm thấy sản phẩm')
          this.searchSanPham = []
          return []
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error)
        toast.error('Có lỗi xảy ra')
        return []
      }
    },

    // Action lấy chi tiết sản phẩm theo sản phẩm
    async getChiTietSanPhamBySanPham(idSanPham) {
      try {
        const response = await khuyenMaiService.getChiTietSanPhamBySanPham(idSanPham)
        if (response && !response.error) {
          return response
        } else {
          toast.error('Không lấy được chi tiết sản phẩm')
          return []
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
        toast.error('Có lỗi xảy ra')
        return []
      }
    },
    async getKhuyenMaiById(id) {
      if (!id || id <= 0) {
        toast.error('ID khuyến mãi không hợp lệ')
        return null
      }

      try {
        const response = await khuyenMaiService.getKhuyenMaiById(id)
        if (response.error) {
          toast.error(response.message || 'Không lấy được chi tiết khuyến mãi')
          return null
        }
        return response
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết khuyến mãi:', error)
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết khuyến mãi')
        return null
      }
    },
    async addKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds) {
      try {
        const response = await khuyenMaiService.addKhuyenMai(
          khuyenMaiData,
          selectedChiTietSanPhamIds,
        )
        if (response === 'Thêm khuyến mãi thành công!') {
          toast.success(response)
          await this.getAllKhuyenMai(0, 5) // Làm mới danh sách khuyến mãi
          return true
        } else {
          toast.error(response)
          return false
        }
      } catch (error) {
        console.error('Lỗi khi thêm khuyến mãi:', error)
        toast.error('Có lỗi xảy ra khi thêm khuyến mãi')
        return false
      }
    },

    async updateKhuyenMai(khuyenMaiData, selectedChiTietSanPhamIds) {
      try {
        const response = await khuyenMaiService.updateKhuyenMai(
          khuyenMaiData,
          selectedChiTietSanPhamIds,
        )
        if (response === 'Cập nhật khuyến mãi thành công!') {
          toast.success(response)
          await this.getAllKhuyenMai(0, 5) // Làm mới danh sách
          return true
        } else {
          toast.error(response)
          return false
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật khuyến mãi:', error)
        toast.error('Có lỗi xảy ra khi cập nhật khuyến mãi')
        return false
      }
    },
    //================= Kết thúc khuyến mãi =================///
    getPath(path) {
      this.checkRouter = ''
      this.checkRouter = path
    },
    getRoutePresent(path) {
      this.checkRoutePresent = ''
      this.checkRoutePresent = path
    },
    getIndex(path) {
      this.indexMenu = ['1']
      switch (path) {
        case '/admin':
          this.indexMenu = ['1']
          break
        case '/admin/quanlysanpham':
          this.indexMenu = ['3']
          break
        case '/admin/quanlynhanvien':
          this.indexMenu = ['10'];
          break;
        case '/admin/quanlyhoadon':
          this.indexMenu = ['8'];
          break;
        case '/admin/quanlysanpham/add':
          this.indexMenu = ['3'];
          break;
        case '/admin/quanlysanpham/sua':
          this.indexMenu = ['3'];
          break;
        case '/admin/quanlykhachhang':
          this.indexMenu = ['11'];
          break;
        case '/admin/baocaothongke':
          this.indexMenu = ['2'];
          break;
        case '/admin/quanlyvoucher':
          this.indexMenu = ['12'];
          break;
        case '/admin/quanlykhuyenmai':
          this.indexMenu = ['13'];
          break;
        case '/admin/quanlysanpham/sanpham':
          this.indexMenu = ['4'];
          break;
        case '/admin/quanlysanpham/thuoctinh':
          this.indexMenu = ['7'];
          break;
        case '/admin/quanlysanpham/chitietsanpham':
          this.indexMenu = ['5'];
          break;
        default:
          this.indexMenu = ['1']
          break
      }
    },

    // Lấy ảnh sản phẩm

    async getImage(id, anhChinh) {
      const getImageRespone = await sanPhamService.getImageInCTSP(id, anhChinh)

      if (getImageRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.getImages = getImageRespone
      }
      return getImageRespone
    },
    //Lấy danh sách chi tiết sản phẩm theo sản phẩm
    async getCTSPBySanPham(id) {
      const getCTSPBySanPhamRespone = await sanPhamService.getCTSPBySanPham(id)
      if (getCTSPBySanPhamRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        this.getCTSPBySanPhams = getCTSPBySanPhamRespone
        try {
          const imagePromises = getCTSPBySanPhamRespone.map(async (ctsp) => {
            const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true)
            ctsp.hinh_anh = (await images.length) > 0 ? images[0].hinh_anh : 'Không có ảnh chính' // Thêm trường hinh_anh vào object ctsp
          })
          this.getCTSPBySanPhams = await Promise.all(imagePromises)
          this.getCTSPBySanPhams = getCTSPBySanPhamRespone
        } catch (error) {
          console.log(error)
        }
      }
    },
    //Lấy danh sách sản phẩm
    async getAllSP() {
      try {
        console.log('Đang tải danh sách sản phẩm');
        const sanPhamResponse = await sanPhamService.getAllSanPham();

        if (!sanPhamResponse || sanPhamResponse.error) {
          console.error('Không lấy được dữ liệu sản phẩm');
          this.getAllSanPham = [];
          return [];
        }

        console.log('Đã tải', sanPhamResponse.length, 'sản phẩm');
        this.getAllSanPham = sanPhamResponse;

        // Reset trạng thái tìm kiếm và lọc nếu đang tải lại dữ liệu
        if (this.isSearching || this.isFiltering) {
          console.log('Tự động reset trạng thái tìm kiếm và lọc khi tải lại dữ liệu');
          this.resetSearch();
          this.resetFilter();
        }

        return sanPhamResponse;
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        this.getAllSanPham = [];
        return [];
      }
    },
    //Thêm sản phẩm
    async createSanPham(sanPhamData) {
      try {
        console.log('Data gửi đi:', sanPhamData)
        const response = await sanPhamService.createSanPhams(sanPhamData)
        console.log('Response từ service:', response)
        return response
      } catch (error) {
        console.error('Lỗi trong createSanPham:', error)
        throw error
      }
    },
    //Thêm chi tiết sản phẩm
    async createCTSP(CTSPData) {
      try {
        console.log('Dữ liệu CTSP gửi đi:', CTSPData)
        const response = await sanPhamService.createCTSP(CTSPData)
        console.log('Response từ service thêm chi tiết sản phẩm:', response)
        return response
      } catch (error) {
        console.error('Lỗi trong createCTSP:', error)
        throw error
      }
    },
    //Lấy danh sách chi tiết sản phẩm
    async getAllCTSP() {
      try {
        console.log('Đang tải danh sách chi tiết sản phẩm');
        const chiTietSanPhamResponse = await sanPhamService.getAllChiTietSanPham();

        if (!chiTietSanPhamResponse || chiTietSanPhamResponse.error) {
          console.error('Không lấy được dữ liệu chi tiết sản phẩm');
          this.getAllChiTietSanPham = [];
          return [];
        }

        // Xử lý dữ liệu - thêm hình ảnh nếu cần
        try {
          const imagePromises = chiTietSanPhamResponse.map(async (ctsp) => {
            if (ctsp.id_chi_tiet_san_pham) {
              const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true);
              ctsp.hinh_anh = (images && images.length > 0) ? images[0].hinh_anh : 'Không có ảnh chính';
            }
            return ctsp;
          });

          await Promise.all(imagePromises);
        } catch (imageError) {
          console.error('Lỗi khi tải hình ảnh:', imageError);
        }

        console.log('Đã tải', chiTietSanPhamResponse.length, 'chi tiết sản phẩm');
        this.getAllChiTietSanPham = chiTietSanPhamResponse;

        return chiTietSanPhamResponse;
      } catch (error) {
        console.error('Lỗi khi tải danh sách chi tiết sản phẩm:', error);
        this.getAllChiTietSanPham = [];
        return [];
      }
    },
    //Tìm kiếm chi tiết sản phẩm
    async searchCTSP(search) {
      try {
        const chiTietSanPhamRespone = await sanPhamService.searchChiTietSanPham(search)
        if (chiTietSanPhamRespone && chiTietSanPhamRespone.error) {
          toast.error('Không lấy được dữ liệu')
          this.searchChiTietSanPham = []
          return
        }

        // Nếu không có dữ liệu hoặc mảng rỗng
        if (
          !chiTietSanPhamRespone ||
          !Array.isArray(chiTietSanPhamRespone) ||
          chiTietSanPhamRespone.length === 0
        ) {
          console.log('Không có kết quả tìm kiếm chi tiết sản phẩm')
          this.searchChiTietSanPham = []
          return
        }

        try {
          const imagePromises = chiTietSanPhamRespone.map(async (ctsp) => {
            if (ctsp && ctsp.id_chi_tiet_san_pham) {
              const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true)
              ctsp.hinh_anh =
                images && images.length > 0 ? images[0].hinh_anh : 'Không có ảnh chính'
            }
            return ctsp
          })

          const results = await Promise.all(imagePromises)
          this.searchChiTietSanPham = results.filter((item) => item !== null)
          console.log('Kết quả tìm kiếm chi tiết sản phẩm đã xử lý:', this.searchChiTietSanPham)
        } catch (error) {
          console.log('Lỗi khi xử lý hình ảnh:', error)
          this.searchChiTietSanPham = chiTietSanPhamRespone
        }
      } catch (error) {
        console.log('Lỗi khi tìm kiếm chi tiết sản phẩm:', error)
        this.searchChiTietSanPham = []
      }
    },
    // Tìm kiếm sản phẩm
    async searchSP(keyword) {
      console.log('Đang tìm kiếm sản phẩm với từ khóa:', keyword);
      if (!keyword || keyword.trim() === '') {
        this.resetSearch();
        return;
      }

      try {
        // Lưu từ khóa tìm kiếm
        this.searchKeyword = keyword.trim().toLowerCase();

        // Đảm bảo dữ liệu chi tiết sản phẩm đã được tải
        if (!this.getAllChiTietSanPham || this.getAllChiTietSanPham.length === 0) {
          console.log('Chưa có dữ liệu chi tiết sản phẩm, tải từ API');
          await this.getAllCTSP();
        }

        // Tìm kiếm trên chi tiết sản phẩm
        const matchingProductIds = new Set();

        this.getAllChiTietSanPham.forEach(ctsp => {
          // Kết hợp tất cả thông tin có thể tìm kiếm
          const searchableText = [
            ctsp.ten_san_pham?.toLowerCase() || '',
            ctsp.mo_ta?.toLowerCase() || '',
            ctsp.ten_thuong_hieu?.toLowerCase() || '',
            ctsp.ten_danh_muc?.toLowerCase() || '',
            ctsp.ten_chat_lieu?.toLowerCase() || '',
            ctsp.ten_mau_sac?.toLowerCase() || '',
            ctsp.ten_size?.toLowerCase() || '',
            `${ctsp.gia_ban || ''}`,
            `${ctsp.gia_nhap || ''}`,
            `${ctsp.so_luong_ton || ''}`
          ].join(' ');

          // Nếu nội dung có thể tìm kiếm chứa từ khóa
          if (searchableText.includes(this.searchKeyword)) {
            matchingProductIds.add(ctsp.id_san_pham);
          }
        });

        // Cập nhật ID sản phẩm tìm thấy
        this.searchProductIds = [...matchingProductIds];
        console.log(`Tìm thấy ${this.searchProductIds.length} sản phẩm khớp với từ khóa "${keyword}"`);

        // Cập nhật danh sách ID cuối cùng
        this.updateFinalProductIds();
      } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      }
    },
    getLangue(check) {
      const vni = {
        nguoiDung: 'Đăng nhập',
        cuaHang: 'Cửa hàng',
        hoTro: 'Hỗ trợ',
        gioHang: 'Giỏ hàng',
        timKiem: 'Bạn đang muốn tìm kiếm gì?',
      }
      const eng = {
        nguoiDung: 'Login',
        cuaHang: 'Store',
        hoTro: 'Support',
        gioHang: 'Cart',
        timKiem: 'What are you looking for?',
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
    },

    // Action để áp dụng bộ lọc
    async filterSanPham(filterCriteria) {
      console.log('Đang lọc sản phẩm với tiêu chí:', filterCriteria);
      this.filterCriteria = { ...filterCriteria };

      try {
        // Đảm bảo dữ liệu chi tiết sản phẩm đã được tải
        if (!this.getAllChiTietSanPham || this.getAllChiTietSanPham.length === 0) {
          console.warn('Không có dữ liệu chi tiết sản phẩm để lọc');
          this.filteredProductIds = [];
          return;
        }

        // Debug: Log 5 sản phẩm chi tiết đầu tiên để kiểm tra cấu trúc
        if (this.debug) {
          console.log('=== DEBUG: Mẫu chi tiết sản phẩm ===');
          console.log(this.getAllChiTietSanPham.slice(0, 5));
        }

        // Khởi tạo Set để lưu trữ ID sản phẩm khớp
        const matchingProductIds = new Set();

        // Kiểm tra xem có tiêu chí lọc nào không
        const hasFilterCriteria = (
          (filterCriteria.id_danh_muc && filterCriteria.id_danh_muc.length > 0) ||
          (filterCriteria.id_thuong_hieu && filterCriteria.id_thuong_hieu.length > 0) ||
          (filterCriteria.id_chat_lieu && filterCriteria.id_chat_lieu.length > 0) ||
          (filterCriteria.id_mau_sac && filterCriteria.id_mau_sac.length > 0) ||
          (filterCriteria.id_size && filterCriteria.id_size.length > 0) ||
          (filterCriteria.minPrice > 0) ||
          (filterCriteria.maxPrice < 10000000)
        );

        // Nếu không có tiêu chí lọc, trả về tất cả sản phẩm
        if (!hasFilterCriteria) {
          console.log('Không có tiêu chí lọc, lấy tất cả sản phẩm');
          this.filteredProductIds = this.getAllSanPham.map(sp => sp.id_san_pham);
          return;
        }

        // Lọc chi tiết sản phẩm dựa trên tiêu chí
        for (const ctsp of this.getAllChiTietSanPham) {
          // Kiểm tra từng tiêu chí
          let matches = true;

          // Debug: Ghi log lọc đa tiêu chí
          if (this.debug &&
            ((filterCriteria.id_danh_muc && filterCriteria.id_danh_muc.includes(1)) ||
              (filterCriteria.id_thuong_hieu && filterCriteria.id_thuong_hieu.includes(1)) ||
              (filterCriteria.id_chat_lieu && filterCriteria.id_chat_lieu.includes(1)))) {
            console.log('=== DEBUG: Chi tiết kiểm tra khớp với ID = 1 ===');
            console.log('Sản phẩm đang kiểm tra:', ctsp.ten_san_pham);
            console.log('ID danh mục:', ctsp.id_danh_muc, 'Tiêu chí:', filterCriteria.id_danh_muc);
            console.log('ID thương hiệu:', ctsp.id_thuong_hieu, 'Tiêu chí:', filterCriteria.id_thuong_hieu);
            console.log('ID chất liệu:', ctsp.id_chat_lieu, 'Tiêu chí:', filterCriteria.id_chat_lieu);
          }

          // Lọc danh mục - Kiểm tra xem id_danh_muc của sản phẩm có nằm trong danh sách các id đã chọn không
          if (filterCriteria.id_danh_muc && filterCriteria.id_danh_muc.length > 0) {
            const idDanhMucStr = String(ctsp.id_danh_muc);
            const found = filterCriteria.id_danh_muc.some(id => String(id) === idDanhMucStr);
            if (!found) {
              matches = false;
            }
          }

          // Lọc thương hiệu
          if (matches && filterCriteria.id_thuong_hieu && filterCriteria.id_thuong_hieu.length > 0) {
            const idThuongHieuStr = String(ctsp.id_thuong_hieu);
            const found = filterCriteria.id_thuong_hieu.some(id => String(id) === idThuongHieuStr);
            if (!found) {
              matches = false;
            }
          }

          // Lọc chất liệu
          if (matches && filterCriteria.id_chat_lieu && filterCriteria.id_chat_lieu.length > 0) {
            const idChatLieuStr = String(ctsp.id_chat_lieu);
            const found = filterCriteria.id_chat_lieu.some(id => String(id) === idChatLieuStr);
            if (!found) {
              matches = false;
            }
          }

          // Lọc màu sắc
          if (matches && filterCriteria.id_mau_sac && filterCriteria.id_mau_sac.length > 0) {
            const idMauSacStr = String(ctsp.id_mau_sac);
            const found = filterCriteria.id_mau_sac.some(id => String(id) === idMauSacStr);
            if (!found) {
              matches = false;
            }
          }

          // Lọc kích thước
          if (matches && filterCriteria.id_size && filterCriteria.id_size.length > 0) {
            const idSizeStr = String(ctsp.id_kich_thuoc);
            const found = filterCriteria.id_size.some(id => String(id) === idSizeStr);
            if (!found) {
              matches = false;
            }
          }

          // Lọc giá - vẫn giữ nguyên
          if (matches && filterCriteria.minPrice > 0) {
            // Chuyển đổi giá bán sang kiểu số nếu là chuỗi
            const giaBan = typeof ctsp.gia_ban === 'string'
              ? parseFloat(ctsp.gia_ban.replace(/[^\d]/g, ''))
              : ctsp.gia_ban;

            if (giaBan < filterCriteria.minPrice) {
              matches = false;
            }
          }

          if (matches && filterCriteria.maxPrice < 10000000) {
            // Chuyển đổi giá bán sang kiểu số nếu là chuỗi
            const giaBan = typeof ctsp.gia_ban === 'string'
              ? parseFloat(ctsp.gia_ban.replace(/[^\d]/g, ''))
              : ctsp.gia_ban;

            if (giaBan > filterCriteria.maxPrice) {
              matches = false;
            }
          }

          // Nếu chi tiết sản phẩm khớp với tất cả tiêu chí, thêm ID của nó vào Set
          if (matches) {
            matchingProductIds.add(ctsp.id_san_pham);
          }
        }

        // Cập nhật ID sản phẩm đã lọc
        this.filteredProductIds = [...matchingProductIds];
        console.log(`Lọc được ${this.filteredProductIds.length} sản phẩm khớp với tiêu chí`);
      } catch (error) {
        console.error('Lỗi khi lọc sản phẩm:', error);
        this.filteredProductIds = [];
      }
    },

    // Tạo thêm alias để tương thích với code cũ
    async applyFilter(filterCriteria) {
      // Gọi lại hàm filterSanPham để đảm bảo tương thích
      return this.filterSanPham(filterCriteria);
    },

    // Reset bộ lọc
    resetFilter() {
      console.log('Đang reset trạng thái lọc...');
      this.filterCriteria = {};
      this.filteredProductIds = [];

      // Nếu đang kết hợp tìm kiếm và lọc, cập nhật lại kết quả cuối cùng
      if (this.searchProductIds.length > 0) {
        console.log('Vẫn còn tìm kiếm, giữ lại kết quả tìm kiếm');
      }
    },

    // Hàm cập nhật kết quả cuối cùng dựa trên trạng thái tìm kiếm và lọc
    updateFinalProductIds() {
      const isSearching = this.searchKeyword && this.searchProductIds.length > 0;
      const isFiltering = Object.keys(this.filterCriteria).length > 0 && this.filteredProductIds.length > 0;

      console.log(`Đang cập nhật danh sách cuối cùng. Tìm kiếm: ${isSearching}, Lọc: ${isFiltering}`);

      if (isSearching && isFiltering) {
        // Nếu đang tìm kiếm và lọc, lấy giao của 2 danh sách
        this.finalProductIds = this.searchProductIds.filter(id =>
          this.filteredProductIds.includes(id)
        );
        console.log('Kết hợp tìm kiếm và lọc:', this.finalProductIds.length);
      } else if (isSearching) {
        // Nếu chỉ tìm kiếm
        this.finalProductIds = [...this.searchProductIds];
        console.log('Chỉ tìm kiếm:', this.finalProductIds.length);
      } else if (isFiltering) {
        // Nếu chỉ lọc
        this.finalProductIds = [...this.filteredProductIds];
        console.log('Chỉ lọc:', this.finalProductIds.length);
      } else {
        // Nếu không có cả 2
        this.finalProductIds = [];
        console.log('Không có tìm kiếm hoặc lọc');
      }
    },

    // Hàm reset trạng thái tìm kiếm
    resetSearch() {
      console.log('Đang reset trạng thái tìm kiếm...');
      this.searchKeyword = '';
      this.searchProductIds = [];

      // Nếu đang kết hợp tìm kiếm và lọc, cập nhật lại kết quả cuối cùng
      if (this.filteredProductIds.length > 0) {
        console.log('Vẫn còn bộ lọc, giữ lại kết quả lọc');
      }
    },

    // Thêm các phương thức tải dữ liệu danh mục, thương hiệu, chất liệu, màu sắc, kích thước
    async getAllDM() {
      try {
        console.log('Đang tải danh sách danh mục...');
        const response = await sanPhamService.getDanhMucList();

        if (!response || response.error) {
          console.error('Không lấy được dữ liệu danh mục');
          return [];
        }

        console.log(`Đã tải ${response.length} danh mục`);
        this.getAllDanhMuc = response;
        return response;
      } catch (error) {
        console.error('Lỗi khi tải danh sách danh mục:', error);
        this.getAllDanhMuc = [];
        return [];
      }
    },

    async getAllTH() {
      try {
        console.log('Đang tải danh sách thương hiệu...');
        const response = await sanPhamService.getThuongHieuList();

        if (!response || response.error) {
          console.error('Không lấy được dữ liệu thương hiệu');
          return [];
        }

        console.log(`Đã tải ${response.length} thương hiệu`);
        this.getAllThuongHieu = response;
        return response;
      } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
        this.getAllThuongHieu = [];
        return [];
      }
    },

    async getAllCL() {
      try {
        console.log('Đang tải danh sách chất liệu...');
        const response = await sanPhamService.getChatLieuList();

        if (!response || response.error) {
          console.error('Không lấy được dữ liệu chất liệu');
          return [];
        }

        console.log(`Đã tải ${response.length} chất liệu`);
        this.getAllChatLieu = response;
        return response;
      } catch (error) {
        console.error('Lỗi khi tải danh sách chất liệu:', error);
        this.getAllChatLieu = [];
        return [];
      }
    },

    async getAllMS() {
      try {
        console.log('Đang tải danh sách màu sắc...');
        const response = await sanPhamService.getMauSacList();

        if (!response || response.error) {
          console.error('Không lấy được dữ liệu màu sắc');
          return [];
        }

        console.log(`Đã tải ${response.length} màu sắc`);
        this.getAllMauSac = response;
        return response;
      } catch (error) {
        console.error('Lỗi khi tải danh sách màu sắc:', error);
        this.getAllMauSac = [];
        return [];
      }
    },

    async getAllKT() {
      try {
        console.log('Đang tải danh sách kích thước...');
        const response = await sanPhamService.getSizeList();

        if (!response || response.error) {
          console.error('Không lấy được dữ liệu kích thước');
          return [];
        }

        console.log(`Đã tải ${response.length} kích thước`);
        this.getAllKichThuoc = response;
        return response;
      } catch (error) {
        console.error('Lỗi khi tải danh sách kích thước:', error);
        this.getAllKichThuoc = [];
        return [];
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

  getters: {
    /**
     * Lấy danh sách sản phẩm đã được lọc và/hoặc tìm kiếm
     * @returns {Array} Danh sách sản phẩm đã được lọc
     */
    getFilteredProducts() {
      console.log('Đang lấy danh sách sản phẩm đã lọc/tìm kiếm...');

      // Nếu không có tìm kiếm và không có lọc, trả về tất cả sản phẩm
      const isSearching = this.searchKeyword && this.searchProductIds.length > 0;
      const isFiltering = Object.keys(this.filterCriteria).length > 0;

      if (!isSearching && !isFiltering) {
        console.log('Không có tìm kiếm hoặc lọc, trả về tất cả sản phẩm:', this.getAllSanPham.length);
        return this.getAllSanPham;
      }

      try {
        // Format hàm trả về products đúng cấu trúc
        const formatProducts = (productIds) => {
          return productIds.length > 0
            ? this.getAllSanPham.filter(product => productIds.includes(product.id_san_pham))
            : [];
        };

        // Nếu chỉ đang tìm kiếm (không lọc)
        if (isSearching && !isFiltering) {
          const result = formatProducts(this.searchProductIds);
          console.log('Chỉ tìm kiếm, không lọc. Kết quả:', result.length);
          return result;
        }

        // Nếu chỉ đang lọc (không tìm kiếm)
        if (!isSearching && isFiltering) {
          const result = formatProducts(this.filteredProductIds);
          console.log('Chỉ lọc, không tìm kiếm. Kết quả:', result.length);
          return result;
        }

        // Nếu đang tìm kiếm và lọc, lấy giao của 2 danh sách
        const intersectionIds = this.searchProductIds.filter(id =>
          this.filteredProductIds.includes(id)
        );
        const result = formatProducts(intersectionIds);
        console.log('Kết hợp tìm kiếm và lọc:', result.length);
        return result;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm đã lọc:', error);
        return [];
      }
    },
  },
})
