import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
    {
        path: '/index',
        component: () => import('@/pages/IndexPage.vue')
    },
    {
        path: '/',
        redirect: '/index'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;