
const sell = [
    {
        path: '/sell',
        name: 'sell',
        component: () => import('../layouts/sell.vue'),
        children: [
            {
                path: "mainSell",
                name: "sell-sell",
                component: () => import('../views/web/index.vue')
            }
        ]
    }
];

export default sell;