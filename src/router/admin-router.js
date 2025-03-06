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
                path: "quanlysanpham",
                name: "admin-quan-ly-san-pham",
                component: () => import('@/views/admin/SanPham/admin-quan-ly-san-pham.vue')
            }
        ]
    }
];

export default admin;