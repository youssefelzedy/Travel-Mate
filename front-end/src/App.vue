<template>
  <router-view />
</template>

<script setup lang="ts">
import router from '@/router'
export interface IUserData {
  id: number
  fullname: string
  email: string
  role: string
}
import { ref, provide, Ref, watch, computed } from 'vue'

const modalState = ref(false)
const user = ref<IUserData | null>(null)
const userLocalStorage = localStorage.getItem('user')
if (userLocalStorage) {
  user.value = JSON.parse(userLocalStorage)
}
const allowedGuestRoutes = [
  '/login',
  '/registeration',
  '/forgot-password',
  '/reset-password'
]

const setUserData = (newUser: IUserData, userData: Ref<IUserData | null>) => {
  userData.value = newUser
}
const setModalState = (value: boolean) => {
  modalState.value = value
}
provide('userData', user)
provide('setUserData', setUserData)
provide('modalState', modalState)
provide('setModalState', setModalState)

router.beforeEach((to, from, next) => {
  //Logged in users should not be able to access login, register, forgot-password, reset-password routes.
  if (user.value || localStorage.getItem('user')) {
    if (allowedGuestRoutes.includes(to.path)) {
      next('/home')
    } else {
      next()
    }
  }
  //Guest users should not be able to access home, profile, settings, and other authenticated routes.
  else {
    if (allowedGuestRoutes.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
</script>
<style>
#app {
  width: 100%;
  height: 100vh;
  background-color: rgb(41, 39, 42);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
