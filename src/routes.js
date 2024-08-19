import { createWebHistory, createRouter } from 'vue-router'

import About from './views/About.vue'
import WAIS from '@/views/WAIS.vue'
import WNV from '@/views/WNV.vue'
import WPPSI from '@/views/WPPSI.vue'
import WISC from '@/views/WISC.vue'

const routes = [
    {
        path: '/wais', 
        component: WAIS
    },
    {
        path: '/wnv', 
        component: WNV
    },
    {
        path: '/wppsi',
        component: WPPSI
    },
    {
        path: '/',
        component: WISC
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