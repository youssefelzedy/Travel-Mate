<template>
  <div class="landing-wrapper w-full h-full">
    <div class="backdrop-blur-md w-full h-full">
      <header class="absolute inset-x-0 top-0 z-50">
        <nav
          class="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div class="flex lg:flex-1">
            <a
              href="/"
              class="-m-1.5 p-1.5"
            >
              <span class="sr-only">Your Company</span>
              <img
                class="h-8 w-auto"
                :src="teamLogo"
                alt="company logo"
              />
            </a>
          </div>
          <div class="flex lg:hidden">
            <button
              type="button"
              class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              @click="mobileMenuOpen = true"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon
                class="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <div class="hidden lg:flex lg:gap-x-12">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-sm font-semibold leading-6 text-white"
              >{{ item.name }}</a
            >
          </div>
          <div class="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="/login"
              class="text-sm font-semibold leading-6 text-white"
              >Log in <span aria-hidden="true">&rarr;</span></a
            >
          </div>
        </nav>
        <Dialog
          class="lg:hidden"
          @close="mobileMenuOpen = false"
          :open="mobileMenuOpen"
        >
          <div class="fixed inset-0 z-50" />
          <DialogPanel
            class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          >
            <div class="flex items-center justify-between">
              <a
                href="#"
                class="-m-1.5 p-1.5"
              >
                <span class="sr-only">Your Company</span>
                <img
                  class="h-8 w-auto"
                  :src="teamLogo"
                  alt=""
                />
              </a>
              <button
                type="button"
                class="-m-2.5 rounded-md p-2.5 text-gray-700"
                @click="mobileMenuOpen = false"
              >
                <span class="sr-only">Close menu</span>
                <XMarkIcon
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div class="mt-6 flow-root">
              <div class="-my-6 divide-y divide-gray-500/10">
                <div class="space-y-2 py-6">
                  <a
                    v-for="item in navigation"
                    :key="item.name"
                    :href="item.href"
                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/20"
                    >{{ item.name }}</a
                  >
                </div>
                <div class="py-6">
                  <a
                    href="/login"
                    class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/20"
                    >Log in</a
                  >
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div
          class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style="
              clip-path: polygon(
                74.1% 44.1%,
                100% 61.6%,
                97.5% 26.9%,
                85.5% 0.1%,
                80.7% 2%,
                72.5% 32.5%,
                60.2% 62.4%,
                52.4% 68.1%,
                47.5% 58.3%,
                45.2% 34.5%,
                27.5% 76.7%,
                0.1% 64.9%,
                17.9% 100%,
                27.6% 76.8%,
                76.1% 97.7%,
                74.1% 44.1%
              );
            "
          />
        </div>
        <div
          class="flex flex-row gap-10 items-center justify-center mt-32 mb-32"
        >
          <div class="text-center lg:text-left max-w-3xl">
            <h1
              class="text-3xl font-bold tracking-tight text-white lg:text-6xl"
            >
              <span class="text-nowrap">Navigate with confidence:</span> Let
              Travel Mate be your ultimate journey guide!
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-300">
              Travel Mate offers real-time guidance and personalized routes,
              making your journey smooth and stress-free. Focus on the
              adventure; we'll handle the rest.
            </p>
          </div>
          <img
            :src="map"
            class="hidden lg:flex lg:max-w-[30rem]"
          />
        </div>

        <div class="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/registeration"
            class="rounded-md bg-[#5d4797] duration-150 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#8967df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Get started</a
          >
          <a
            href="/learn-more"
            class="text-sm font-semibold leading-6 text-white"
            >Learn more <span aria-hidden="true">→</span></a
          >
        </div>
        <div
          class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style="
              clip-path: polygon(
                74.1% 44.1%,
                100% 61.6%,
                97.5% 26.9%,
                85.5% 0.1%,
                80.7% 2%,
                72.5% 32.5%,
                60.2% 62.4%,
                52.4% 68.1%,
                47.5% 58.3%,
                45.2% 34.5%,
                27.5% 76.7%,
                0.1% 64.9%,
                17.9% 100%,
                27.6% 76.8%,
                76.1% 97.7%,
                74.1% 44.1%
              );
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import teamLogo from '@/assets/travel_mate_white.svg'
import map from '@/assets/map.png'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' }
]

const mobileMenuOpen = ref(false)
</script>

<style>
.landing-wrapper {
  background-image: url('../assets/bg.jpg');
  background-size: cover;
}
</style>
