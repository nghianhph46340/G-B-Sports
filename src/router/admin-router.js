const admin = [
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../layouts/admin-layout.vue'),
        children: [
            {
                path: "",
                name: "admin-home",
                component: () => import('@/views/admin/BanHang/admin.vue')
            },
            {
                path: "baocaothongke",
                name: "admin-bao-cao-thong-ke",
                component: () => import('@/views/admin/BCTK/BCTK.vue')
            },
            {
                path: "quanlysanpham",
                name: "admin-quan-ly-san-pham",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham.vue')
            },
            {
                path: "quanlysanpham/add",
                name: "admin-quan-ly-san-pham-add",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham-them.vue')
            },
            {
                path: "quanlysanpham/update/:id",
                name: "admin-quan-ly-san-pham-update",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham-sua.vue')
            },
            {
                path: "quanlysanpham/chitietsanpham",
                name: "admin-quan-ly-san-pham-chi-tiet-san-pham",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham-chi-tiet-san-pham.vue')
            },
            {
                path: "quanlysanpham/sanpham",
                name: "admin-quan-ly-san-pham-san-pham",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham-san-pham.vue')
            },
            {
                path: "quanlysanpham/thuoctinh",
                name: "admin-quan-ly-san-pham-thuoc-tinh",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham-thuoc-tinh.vue')
            },
            {
                path: "quanlynhanvien",
                name: "admin-quan-ly-nhan-vien",
                component: () => import('@/views/admin/NhanVien/QuanLyNhanVien.vue')
            },
            {
                path: "quanlynhanvien/add",
                name: "admin-quan-ly-nhan-vien-add",
                component: () => import('@/views/admin/NhanVien/ThemNhanVien.vue')
            },
            {
                path: "quanlynhanvien/update/:id",
                name: "admin-quan-ly-nhan-vien-update",
                component: () => import('@/views/admin/NhanVien/SuaNhanVien.vue')
            },
            {
                path: "quanlyhoadon",
                name: "admin-quan-ly-hoa-don",
                component: () => import('@/views/admin/HoaDon/HoaDon.vue')
            },
            {
                path: "hoadon/hdct/:maHoaDon",
                name: "admin-hoa-don-chi-tiet",
                component: () => import('@/views/admin/HoaDon/HDCT.vue')
            },
            {
                path: "test-upload-image",
                name: "test-upload-image",
                component: () => import('@/views/viewTest/testUploadImage.vue')
            },
            {
                path: "quanlyvoucher",
                name: "admin-quan-ly-voucher",
                component: () => import('@/views/admin/Voucher/voucher.vue')
            },
            {
                path: 'quanlyvoucher/add',
                name: 'admin-quan-ly-voucher-add',
                component: () => import('@/views/admin/Voucher/addVoucher.vue'),
            },
            // Thêm route cho sửa voucher
            {
                path: 'quanlyvoucher/update/:id',
                name: 'admin-quan-ly-voucher-update',
                component: () => import('@/views/admin/Voucher/updateVoucher.vue'),
            },

            {
                path: "quanlykhuyenmai",
                name: "admin-quan-ly-khuyen-mai",
                component: () => import('@/views/admin/KhuyenMai/khuyenMai.vue')
            },
            {
                path: '/admin/quanlykhuyenmai/add',
                name: 'admin-quan-ly-khuyen-mai-add',
                component: () => import('@/views/admin/KhuyenMai/addKhuyenMai.vue'),
            },
            {
                path: '/admin/quanlykhuyenmai/update/:id',
                name: 'admin-quan-ly-khuyen-mai-update',
                component: () => import('@/views/admin/KhuyenMai/updateKhuyenMai.vue'),
            },
            {
                path: "quanlykhachhang",
                name: "admin-quan-ly-khach-hang",
                component: () => import('@/views/admin/KhachHang/quanLyKhachHang.vue')
            },
            {
                path: "quanlykhachhang/add",
                name: "admin-quan-ly-khach-hang-add",
                component: () => import('@/views/admin/KhachHang/themKH.vue')
            }
        ]
    }
];

export default admin;