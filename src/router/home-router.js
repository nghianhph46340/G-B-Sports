

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
            }
        ]
    }
];

export default home;