const home = [
    {
        path: '/',
        name: 'home',
        component: () => import('../layouts/home.vue'),
        children: [
            {
                path: "home",
                name: "home-sell",
                component: () => import('../views/web/index.vue')
            },
            {
                path: "sanphamdetail/:id",
                name: "sanPhamDetail-BanHang",
                component: () => import('../views/web/sanPhamDetail-BanHang.vue'),
                meta: { scrollToTop: true }
            },
            {
                path: "thanhtoan-banhang",
                name: "thanhtoan-banhang",
                component: () => import('../views/web/thanhToan-BanHang.vue'),
                meta: { scrollToTop: true }
            }
        ]
    }
];

// Thêm hàm scrollBehavior để tự động cuộn lên đầu trang khi chuyển route
const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition;
    }

    if (to.matched.some(record => record.meta.scrollToTop)) {
        return { top: 0 };
    }

    return { top: 0 };
};

export { home, scrollBehavior };
export default home;