<template>
  <div
    v-if="isModalOpen"
    class="absolute z-50 w-full h-full backdrop-blur-md bg-black/70 flex justify-center items-center"
  >
    <div class="flex flex-row-reverse bg-violet-500 p-4 rounded-lg">
      <button
        @click="closeModal"
        class="flex justify-center items-center close-button w-6 h-6 border-2 border-white rounded-md p-4 hover:bg-white/20 duration-150 hover:shadow-[0px_0px_12px_0px_#ffffff4d]"
      >
        <FontAwesomeIcon
          class="w-6 h-6 text-white"
          :icon="faXmark"
        />
      </button>
      <slot name="modal-content"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ref } from 'vue'
const isModalOpen = ref(true)
const closeModal = () => {
  isModalOpen.value = false
}
</script>
