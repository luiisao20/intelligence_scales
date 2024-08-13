import { createWebHistory, createRouter } from 'vue-router'

import About from './views/About.vue'
import WAIS from '@/views/WAIS.vue'
import WNV from '@/views/WNV.vue'

const routes = [
    {
        path: '/wais', 
        component: WAIS
    },
    {
        path: '/', 
        component: WNV
    },
    {
        path: '/about',
        component: About
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})