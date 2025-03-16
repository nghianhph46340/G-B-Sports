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
                path: "quanlynhanvien/update",
                name: "admin-quan-ly-nhan-vien-update",
                component: () => import('@/views/admin/NhanVien/SuaNhanVien.vue')
            },
            {
                path: "quanlyhoadon",
                name: "admin-quan-ly-hoa-don",
                component: () => import('@/views/admin/HoaDon/HoaDon.vue')
            },
            {
                path: "hoadon/hdct/:id",
                name: "admin-hoa-don-chi-tiet",
                component: () => import('@/views/admin/HoaDon/HDCT.vue')
            },
            {
                path: "test-upload-image",
                name: "test-upload-image",
                component: () => import('@/views/viewTest/testUploadImage.vue')
            }
        ]
    }
];

export default admin;