import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/search'
    },
    {
        name: 'search',
        path: '/search',
        component: () => import('@/views/search.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;