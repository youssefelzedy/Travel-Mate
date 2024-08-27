<template>
  <div
    class="transportation-wrapper flex flex-row justify-center gap-6 p-2 rounded-full"
  >
    <div
      :class="transitSelected ? 'selected' : 'not-selected'"
      id="transit"
      @click="handleSelection"
      class="flex justify-center items-center hover:bg-violet-400 duration-150 cursor-pointer rounded-full p-5 w-6 h-6 text-white"
    >
      <FontAwesomeIcon
        :icon="faBus"
        class="icon"
      />
    </div>
    <div
      :class="taxiSelected ? 'selected' : 'not-selected'"
      id="taxi"
      @click="handleSelection"
      class="flex justify-center items-center hover:bg-violet-400 duration-150 cursor-pointer rounded-full p-5 w-6 h-6 text-white"
    >
      <FontAwesomeIcon
        :icon="faTaxi"
        class="icon"
      />
    </div>
    <div
      :class="walkSelected ? 'selected' : 'not-selected'"
      id="walk"
      @click="handleSelection"
      class="flex justify-center items-center hover:bg-violet-400 duration-150 cursor-pointer rounded-full p-5 w-6 h-6 text-white"
    >
      <FontAwesomeIcon
        :icon="faPersonWalking"
        class="icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBus,
  faTaxi,
  faPersonWalking
} from '@fortawesome/free-solid-svg-icons'

// Define the props
const props = defineProps<{ modelValue: string }>()

// Define the emit function for v-model
const emit = defineEmits(['update:modelValue'])

// Reactive state for selected transportation method
const transitSelected = ref(true)
const taxiSelected = ref(false)
const walkSelected = ref(false)

// Handle selection and emit changes
const handleSelection = (event: Event) => {
  const target = event.target as HTMLDivElement
  const selectedMethod = target.id

  transitSelected.value = selectedMethod === 'transit'
  taxiSelected.value = selectedMethod === 'taxi'
  walkSelected.value = selectedMethod === 'walk'

  emit('update:modelValue', selectedMethod)
}
</script>

<style scoped>
.transportation-wrapper {
  justify-content: space-around;
  color: white;
  border: 2px solid rgb(124 58 237);
  background-color: rgb(91 33 182);
}

.icon {
  pointer-events: none;
}

.selected {
  background-color: #a56cff;
  border-color: #8c44ff;
  box-shadow: 0 0px 10px 2px rgba(255, 255, 255, 0.2);
}

.not-selected {
  background-color: #0f172a;
  opacity: 0.5;
}
</style>
