

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
                component: () => import('../views/web/sanPhamDetail-BanHang.vue')
            }
        ]
    }
];

export default home;