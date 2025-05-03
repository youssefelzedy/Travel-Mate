import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import RegisterationView from '../views/RegisterationView.vue'
import LoginView from '@/views/LoginView.vue'
import ForgetPasswordView from '@/views/ForgetPasswordView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  },
  {
    path: '/registeration',
    name: 'Registeration',
    component: RegisterationView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/forget-password',
    name: 'Forgot password',
    component: () => import('../views/ForgetPasswordView.vue')
  },
  {
    path: '/reset-password',
    name: 'Reset password',
    component: () => import('../views/ResetPasswordView.vue')
  },
  {
    path: '/',
    name: 'Landing page',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/',
    name: 'Landing page',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/test',
    name: 'testing',
    component: () => import('../views/TestView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
