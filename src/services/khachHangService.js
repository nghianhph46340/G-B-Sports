import axiosInstance from '@/config/axiosConfig'

// Lấy danh sách khách hàng
const getAllKhachHang = async (
  page = 0,
  size = 5,
  keyword = null,
  trangThai = null,
  updatedId = null,
) => {
  try {
    let url = `/api/khach-hang/view?page=${page}&size=${size}`
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`
    }
    if (trangThai) {
      url += `&trangThai=${encodeURIComponent(trangThai)}`
    }
    if (updatedId) {
      url += `&updatedId=${updatedId}`
    }
    const { data } = await axiosInstance.get(url)
    return data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error)
    return {
      error: true,
      message: 'Có lỗi xảy ra khi tải danh sách khách hàng',
    }
  }
}

// Thêm khách hàng mới
const themKhachHang = async (data) => {
  try {
    const response = await axiosInstance.post('/api/khach-hang/add', data)
    return response.data
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error)
    throw error // Ném lỗi gốc để giữ thông tin từ backend
  }
}

// Lấy thông tin khách hàng để chỉnh sửa
const getKhachHangByIdForEdit = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/khach-hang/edit/${id}`)
    if (response.data.error) {
      return { error: true, message: response.data.error }
    }
    return response.data // { khachHang }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error)
    return {
      error: true,
      message: error.response?.data?.error || 'Có lỗi xảy ra khi lấy thông tin khách hàng',
    }
  }
}
const suaKhachHang = async (khachHangData) => {
  try {
    const { data } = await axiosInstance.put('/api/khach-hang/update', khachHangData)
    return data
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error)
    return {
      error: true,
      message: 'Có lỗi xảy ra khi cập nhật khách hàng',
    }
  }
}

// Lấy chi tiết khách hàng
const getKhachHangDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/khach-hang/detail/${id}`)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết khách hàng:', error)
    return { error: true, message: 'Có lỗi xảy ra khi lấy chi tiết khách hàng' }
  }
}

// Thay đổi trạng thái khách hàng
const changeTrangThai = async (idKhachHang) => {
  try {
    const response = await axiosInstance.post('/api/khach-hang/chuyen-trang-thai', null, {
      params: { idKhachHang },
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái khách hàng:', error)
    return { error: true, message: 'Có lỗi xảy ra khi thay đổi trạng thái' }
  }
}

const getAllKhachHangNoPage = async () => {
  try {
    const response = await axiosInstance.get('/api/khach-hang/getAllKH')
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy api alll khách hàng:', error)
    return { error: true, message: 'Có lỗi xảy ra khi lấy api alll khách hàng' }
  }
}

// Đăng ký khách hàng
const registerKhachHang = async (registerData) => {
  try {
    const { data } = await axiosInstance.post('api/khach-hang/register', registerData)
    return data
  } catch (error) {
    console.error('Lỗi khi đăng ký khách hàng:', error)
    return {
      error: true,
      message: error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký khách hàng',
      fieldErrors: error.response?.data?.fieldErrors || null,
    }
  }
}
// Đăng nhập
const login = async (loginData) => {
  try {
    const { data } = await axiosInstance.post('api/khach-hang/login', loginData)
    console.log('Dữ liệu từ API đăng nhập:', data) // In dữ liệu từ API đăng nhập
    return data
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error)
    return {
      error: true,
      message: error.response?.data?.error || 'Có lỗi xảy ra khi đăng nhập',
      fieldErrors: error.response?.data?.fieldErrors || null,
    }
  }
}
// Lấy thông tin chi tiết
const getUserDetail = async ({ username, id_roles }) => {
  try {
    let userDetails = null
    if ([1, 2, 3].includes(id_roles)) {
      // Gọi API lấy thông tin nhân viên
      const response = await axiosInstance.get(`admin/details?tenDangNhap=${username}`)
      userDetails = response.data
      console.log('Thông tin nhân viên từ API:', userDetails)
    } else if (id_roles === 4) {
      // Gọi API lấy thông tin khách hàng
      const response = await axiosInstance.get(`api/khach-hang/details?tenDangNhap=${username}`)
      userDetails = response.data
      console.log('Thông tin khách hàng từ API:', userDetails)
    }
    return userDetails
  } catch (error) {
    console.error('Lỗi khi gọi API getUserDetail:', error)
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin chi tiết')
  }
}

export const khachHangService = {
  getAllKhachHang,
  themKhachHang,
  getKhachHangByIdForEdit,
  suaKhachHang,
  getKhachHangDetail,
  changeTrangThai,
  getAllKhachHangNoPage,
  registerKhachHang,
  login,
  getUserDetail,
}
