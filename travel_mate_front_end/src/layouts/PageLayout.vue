<template>
  <nav class="w-full bg-[#2d2931] border-b-2 border-b-white/20">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
          <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              class="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
          <a
            href="/"
            class="flex ms-2 md:me-24"
          >
            <img
              :src="teamLogo"
              class="h-8 me-3"
              alt="Travel mate Logo"
            />
          </a>
        </div>
        <div class="flex items-center">
          <div class="flex items-center ms-3">
            <div>
              <Menu
                as="div"
                class="relative ml-3"
              >
                <div
                  class="flex flex-row-reverse gap-3 justify-center items-center"
                >
                  <MenuButton class="relative circle-button p-2">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">Open user menu</span>
                    <img
                      class="h-8 w-8 rounded-full"
                      :src="profilePicture"
                      alt=""
                    />
                  </MenuButton>
                  <div
                    class="email-name text-white text-sm font-semibold bg-violet-500/20 rounded-full p-3 hover:bg-violet-500/50 duration-150"
                  >
                    {{ userData?.email }}
                  </div>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        ]"
                        >Your Profile</a
                      >
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a
                        @click="logOut"
                        :class="[
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        ]"
                      >
                        Log out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <div class="w-full flex flex-col justify-center h-full">
    <div class="flex flex-grow flex-row w-full h-[100vh]">
      <aside
        id="logo-sidebar"
        class="hidden overflow-y-auto max-w-[30rem] flex-col top-[76px] left-0 z-40 pt-6 transition-transform -translate-x-full border-r-white/20 border-r-2 bg-[#2d2931] xl:flex xl:translate-x-0 xl:w-2/6"
        aria-label="Sidebar"
      >
        <div
          class="h-full px-3 pb-4 overflow-y-auto bg-[#2d2931] flex flex-col"
        >
          <slot name="side-menu-slot"></slot>
        </div>
      </aside>
      <div class="w-full h-full flex flex-grow flex-row xl:w-4/6">
        <slot name="background-slot"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject, Ref } from 'vue'
import router from '@/router'
import teamLogo from '@/assets/travel_mate_white.svg'
import defaultProfilePicture from '@/assets/user_white.svg'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { IUserData } from '@/App.vue'

const setUserData =
  inject<(newUser: IUserData | null, userData: Ref<IUserData | null>) => void>(
    'setUserData'
  )

const userData = inject<Ref<IUserData | null>>(
  'userData'
) as Ref<IUserData | null>

const logOut = () => {
  if (setUserData) setUserData(null, userData)
  localStorage.removeItem('user')
  router.push('/login')
}

defineProps<{ userData: IUserData | null }>()
let profilePicture = ref(defaultProfilePicture)
</script>

<style scoped></style>
