<template>
  <AuthPageLayout>
    <template #auth-modal-content>
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
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
              Reset password
            </h1>
            <form
              @submit.prevent
              class="space-y-4 md:space-y-6"
            >
              <InputComponent
                v-model="passwordValue"
                label="New password"
                type="password"
                placeholder="●●●●●●●"
                inputName="password"
              />
              <InputComponent
                v-model="confirmPasswordValue"
                label="Confirm new password"
                type="password"
                placeholder="●●●●●●●"
                inputName="password"
              />
              <InputComponent
                v-model="tokenValue"
                label="Your reset token"
                type="password"
                placeholder="●●●●●●●"
                inputName="password"
              />

              <button
                @submit.prevent
                @click="resetPassword"
                type="submit"
                class="w-full text-[#5d4797] bg-white/80 hover:bg-violet-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import teamLogo from '@/assets/travel_mate_white.svg'
import AuthPageLayout from '@/layouts/AuthPageLayout.vue'
import InputComponent from '@/components/InputComponent.vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
const passwordValue = ref('')
const confirmPasswordValue = ref('')
const tokenValue = ref('')
const resetPassword = async () => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/v1/users/reset-password`,
      {
        password: passwordValue.value,
        passwordConfirm: confirmPasswordValue.value,
        resetToken: tokenValue.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status === 200) {
      toast('Password reset successful', {
        type: 'success'
      })
    }
  } catch (error) {
    toast('Password reset failed', {
      type: 'error'
    })
  }
}
</script>
