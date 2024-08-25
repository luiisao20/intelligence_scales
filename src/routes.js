import { createWebHistory, createRouter } from 'vue-router'

import Login from './views/Login.vue'
import WAIS from '@/views/WAIS.vue'
import WNV from '@/views/WNV.vue'
import WPPSI from '@/views/WPPSI.vue'
import WISC from '@/views/WISC.vue'
import Home from '@/views/Home.vue'

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
        path: '/wisc',
        component: WISC
    },
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})