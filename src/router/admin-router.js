const admin = [
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../layouts/admin-layout.vue'),
        children: [
            {
                path: "admin",
                name: "admin-home",
                component: () => import('../views/admin/admin.vue')
            }
        ]
    }
];

export default admin;