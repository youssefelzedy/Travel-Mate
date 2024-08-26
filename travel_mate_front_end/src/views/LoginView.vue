<template>
  <AuthPageLayout>
    <template #auth-modal-content>
      <a
        href="/"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-44 sm:w-56"
          :src="teamLogo"
          alt="logo"
        />
      </a>
      <div
        class="w-full flex justify-center items-center px-12 bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#5d4797]/[0.8] dark:border-white/25 dark:border-2"
      >
        <div class="p-4 space-y-4 md:space-y-6 sm:p-8 sm:w-96">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Login
          </h1>
          <form
            @submit.prevent
            class="space-y-4 md:space-y-6"
            action="#"
          >
            <div class="w-full text-left">
              <InputComponent
                v-model="emailValue"
                label="Your email"
                type="email"
                placeholder="johndoe@example.com"
                inputName="email"
              />
            </div>
            <div>
              <InputComponent
                v-model="passwordValue"
                label="Your password"
                type="password"
                placeholder="●●●●●●"
                inputName="password"
              />
              <p class="mt-2 text-sm text-white/50 font-normal">
                Forgotten password?
                <a
                  href="/forget-password"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >reset password</a
                >
              </p>
            </div>

            <button
              @submit.prevent
              @click="login"
              type="submit"
              class="w-full text-[#5d4797] bg-white/80 hover:bg-violet-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Login
            </button>
            <div class="flex justify-center items-center">
              <p class="text-sm text-white/50 font-normal">
                Don't have an account?
                <a
                  href="/registeration"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >Register here</a
                >
              </p>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import AuthPageLayout from '@/layouts/AuthPageLayout.vue'
import { ref, inject, Ref } from 'vue'
import { useRouter } from 'vue-router'
import teamLogo from '@/assets/travel_mate_white.svg'
import InputComponent from '@/components/InputComponent.vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { IUserData } from '@/App.vue'
import { useDebounceFn } from '@vueuse/core'

const router = useRouter()

const emailValue = ref('')
const passwordValue = ref('')

const userData = inject<Ref<IUserData | null>>('userData') as Ref<IUserData>
const setUserData =
  inject<(newUser: IUserData, userData: Ref<IUserData | null>) => void>(
    'setUserData'
  )

const login = async () => {
  try {
    const res = await axios.post(
      'http://localhost:3000/api/v1/users/login',
      {
        email: emailValue.value,
        password: passwordValue.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
    if (res.status === 200) {
      toast('Login successful', {
        type: 'success'
      })
      const { _id, fullname, email, role } = res.data.data.user
      const userDataToBeSaved = {
        id: _id,
        fullname,
        email,
        role
      }
      localStorage.setItem('user', JSON.stringify(userDataToBeSaved))
      if (setUserData) {
        setUserData(userDataToBeSaved, userData)
      }
      router.push('/home')
    }
  } catch (error) {
    console.log(error)
    toast('Login failed', {
      type: 'error'
    })
  }
}
</script>
