<template>
  <AuthPageLayout>
    <template #auth-modal-content>
      <a
        href="/"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-44 sm:w-56"
          src="@/assets/travel_mate_white.svg"
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
            Create an account
          </h1>
          <form
            @submit.prevent
            class="space-y-4 md:space-y-6"
          >
            <InputComponent
              label="Your email"
              type="email"
              name="email"
              id="email"
              placeholder="johndoe@example.com"
              v-model="emailValue"
            />
            <InputComponent
              label="Your full name"
              type="text"
              name="fullName"
              id="fullName"
              placeholder="john doe"
              v-model="fullNameValue"
            />
            <InputComponent
              label="Your password"
              type="password"
              name="password"
              id="password"
              placeholder="●●●●●"
              v-model="passwordValue"
            />
            <InputComponent
              label="Confirm password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="●●●●●"
              v-model="confirmPasswordValue"
            />

            <button
              @submit.prevent
              @click="register"
              type="submit"
              class="w-full text-[#5d4797] bg-white/80 hover:bg-violet-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Create an account
            </button>
            <div class="flex justify-center items-center">
              <p class="text-sm text-white/50 font-normal">
                Already have an account?
                <a
                  href="/login"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >Login here</a
                >
              </p>
            </div>
          </form>
        </div>
      </div>
    </template>
  </AuthPageLayout>
</template>

<style scoped="true">
.wrapper {
  background-image: url('../assets/bg.jpg');
  background-size: cover;
}
</style>

<script setup lang="ts">
import AuthPageLayout from '@/layouts/AuthPageLayout.vue'
import { ref } from 'vue'
import teamLogo from '@/assets/travel_mate_white.svg'
import InputComponent from '@/components/InputComponent.vue'
import axios from 'axios'
import router from '@/router'
import { toast } from 'vue3-toastify'

const emailValue = ref('')
const fullNameValue = ref('')
const passwordValue = ref('')
const confirmPasswordValue = ref('')
const register = async () => {
  try {
    const res = await axios.post(
      'http://localhost:3000/api/v1/users/signup',
      {
        fullname: fullNameValue.value,
        email: emailValue.value,
        password: passwordValue.value,
        passwordConfirm: confirmPasswordValue.value,
        role: 'user'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (res.status === 201) {
      toast('Registeration successful', { type: 'success' })
      router.push('/login')
    }
  } catch (error) {
    console.error('Error during registration:', error)
    toast(`Registeration error ${error}`, { type: 'error' })
  }
}
</script>
