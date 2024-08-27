<template>
  <div
    class="wrapper w-full h-full bg-slate-800 flex flex-col justify-center items-center"
  >
    <ModalComponent>
      <template #modal-content>
        <div class="p-20">
          <h1 class="text-3xl text-white font-bold">Modal content</h1>
          <p class="text-white text-center">
            This is a modal component that can be used to display any content
            you want.
          </p>
        </div>
      </template>
    </ModalComponent>
  </div>
  <div class="text-3xl text-white">{{ newValue }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { useDebounceFn } from '@vueuse/core'
const searchTerm = ref('')
const newValue = ref('')
</script>
<style scoped>
.wrapper {
  background-image: url('../assets/bg.jpg');
  background-size: cover;
}
</style>
