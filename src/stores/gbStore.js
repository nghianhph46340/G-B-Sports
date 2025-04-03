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
  state: () => {
    return {
      // Các state hiện tại
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
      searchs: '', // Dùng chung cho tìm kiếm
      getAllNhanVienArr: [],
      totalPages: 0, // Dùng chung cho phân trang
      currentPage: 0, // Dùng chung cho phân trang
      totalItems: 0, // Dùng chung cho phân trang
      getAllHoaDonArr: [],
      totalHoaDon: 0,
      currentHoaDon: 0,
      totalItemsHoaDon: 0,
      hoaDonDetail: {},
      chiTietHoaDons: [],
      trangThaiHistory: [],
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
      getAllCTSPKMList: [],
      getAllHoaDonCTTArr: [],
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
      // State cho chi tiết sản phẩm
      cTSPBySanPhamFull: [],
      //Giỏ hàng và thanh toán
      checkoutItems: [], //Dữ liệu sản phẩm mua ngay
      justAddedProduct: false, // Thêm flag để đánh dấu vừa thêm sản phẩm mới
    }
  },

  ///Đầu mút2
  actions: {
    // Thêm action cho BCTK
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
    async getTopSanPhamBanChay() {
      const topSanPhamBanChay = await bctkService.topSanPhamBanChay()
      this.topSanPhamBanChay = topSanPhamBanChay
    },
    async getTopSanPhamBanCham() {
      const topSanPhamBanCham = await bctkService.topSanPhamBanCham()
      this.topSanPhamBanCham = topSanPhamBanCham
    },
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
    // Thêm action để hủy hóa đơn
    async cancelHoaDon(maHoaDon) {
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
    //Import excel
    async importExcel(file) {
      const importExcelRespone = await sanPhamService.importSanPhamFromExcel(file)
      if (importExcelRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      } else {
        toast.success('Import dữ liệu thành công')
      }
      return importExcelRespone
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

    ///Code bán hàng tại quầy
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

    // Action cho voucher
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
      if (this.getAllChiTietSanPham.length === 0) {
        const sanPhamRespone = await sanPhamService.getAllSanPham()
        console.log(sanPhamRespone)
        if (!sanPhamRespone || sanPhamRespone.error) {
          toast.error('Không lấy được dữ liệu')
          return
        } else {
          this.getAllSanPham = sanPhamRespone
        }
      } else {
        toast.error('Bị lấy dữ liệu nhiều lần')
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
      const chiTietSanPhamRespone = await sanPhamService.getAllChiTietSanPham()
      if (chiTietSanPhamRespone.error) {
        toast.error('Không lấy được dữ liệu')
        return
      }
      this.getAllChiTietSanPham = chiTietSanPhamRespone
      try {
        const imagePromises = chiTietSanPhamRespone.map(async (ctsp) => {
          const images = await this.getImage(ctsp.id_chi_tiet_san_pham, true)
          ctsp.hinh_anh = (await images.length) > 0 ? images[0].hinh_anh : 'Không có ảnh chính' // Thêm trường hinh_anh vào object ctsp
        })
        this.getAllChiTietSanPham = await Promise.all(imagePromises)
        this.getAllChiTietSanPham = chiTietSanPhamRespone
      } catch (error) {
        console.log(error)
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
    async searchSP(search) {
      try {
        const sanPhamResponse = await sanPhamService.searchSanPham(search)
        if (sanPhamResponse && sanPhamResponse.error) {
          toast.error('Không lấy được dữ liệu sản phẩm')
          this.searchSanPham = []
          return
        }

        // Nếu không có dữ liệu hoặc mảng rỗng
        if (!sanPhamResponse || !Array.isArray(sanPhamResponse) || sanPhamResponse.length === 0) {
          console.log('Không có kết quả tìm kiếm sản phẩm')
          this.searchSanPham = []
          return
        }

        // Xử lý dữ liệu sản phẩm nếu cần
        this.searchSanPham = sanPhamResponse
        console.log('Kết quả tìm kiếm sản phẩm:', this.searchSanPham)
      } catch (error) {
        console.log('Lỗi khi tìm kiếm sản phẩm:', error)
        this.searchSanPham = []
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
})
