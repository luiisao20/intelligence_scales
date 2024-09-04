import { createWebHistory, createRouter } from 'vue-router'

import Login from './views/Login.vue'
import WAIS from '@/views/WAIS.vue'
import WNV from '@/views/WNV.vue'
import WPPSI from '@/views/WPPSI.vue'
import WISC from '@/views/WISC.vue'
import Home from '@/views/Home.vue'
import Patient from '@/views/Patient.vue'
import UserProfile from '@/views/UserProfile.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/user',
        component: UserProfile,
    },
    {
        path: '/:id',
        component: Patient,
        props: true,
        children: [
            {
                path: 'wais', 
                component: WAIS
            },
            {
                path: 'wnv', 
                component: WNV
            },
            {
                path: 'wppsi',
                component: WPPSI
            },
            {
                path: 'wisc',
                component: WISC
            }
        ]
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})