<template>
  <AuthPageLayout>
    <template #auth-modal-content>
      <div
        class="flex w-full flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            class="w-44 sm:w-56"
            :src="teamLogo"
            alt="logo"
          />
        </a>
        <div
          class="w-full flex justify-center items-center px-12 bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#5d4797]/[0.5] backdrop-blur-sm dark:border-white/25 dark:border-2"
        >
          <div class="p-4 space-y-4 md:space-y-6 sm:p-8 sm:w-96">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
              {{
                isWaitingEmailSearch ? 'Find your email' : 'Check your inbox.'
              }}
            </h1>
            <form
              v-if="isWaitingEmailSearch"
              @submit.prevent
              class="space-y-4 md:space-y-6"
            >
              <div>
                <p class="text-sm text-white font-thin">
                  Please enter your email address or mobile number to search for
                  your account.
                </p>
                <div class="w-full text-left">
                  <InputComponent
                    v-model="emailValue"
                    label="You email"
                    type="email"
                    placeholder="johndoe@example.com"
                    inputName="email"
                  />
                </div>
              </div>

              <div class="flex flex-row gap-2">
                <button
                  type="submit"
                  class="w-full text-white bg-violet-500 hover:bg-violet-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  @click.prevent="searchEmail"
                >
                  Search
                </button>
                <a
                  href="/login"
                  type="submit"
                  class="w-full text-[#5d4797] bg-white/80 hover:bg-violet-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import teamLogo from '../assets/travel_mate_white.svg'
import InputComponent from '@/components/InputComponent.vue'
import AuthPageLayout from '@/layouts/AuthPageLayout.vue'
import { useDebounceFn } from '@vueuse/core'
import axios from 'axios'
import { toast } from 'vue3-toastify'

let isWaitingEmailSearch = ref(true)
let emailValue = ref('')

const searchEmail = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/forgot-password',
      { email: emailValue.value },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (response.status === 200) {
      isWaitingEmailSearch.value = !isWaitingEmailSearch.value
      toast('Reset password email sent successfully', {
        theme: 'dark',
        type: 'success',
        autoClose: 5000,
        dangerouslyHTMLString: true
      })
      await useDebounceFn(() => router.push('/'), 5000)()
    } else {
      toast("Email doesn't exist", {
        theme: 'dark',
        type: 'error',
        autoClose: 5000,
        dangerouslyHTMLString: true
      })
    }
  } catch (error) {
    console.log(error)
    toast('Error happened', {
      theme: 'dark',
      type: 'error',
      autoClose: 5000,
      dangerouslyHTMLString: true
    })
  }
}
</script>
