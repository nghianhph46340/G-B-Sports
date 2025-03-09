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
            }
        ]
    }
];

export default admin;