<template>
  <div class="w-full">
    <label
      :for="inputName"
      class="flex justify-start w-full items-center text-sm font-medium text-gray-900 dark:text-white"
      :customLabelStyleClass="customLabelStyleClass"
      >{{ label }}</label
    >
    <input
      :value="modelValue"
      @input="onInput"
      :type="type"
      :name="inputName"
      :id="inputName"
      :placeholder="placeholder"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white/20 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :customInputStyleClass="class"
    />
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'

// Define the emit function with the type for 'update:modelValue' event
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

// Input event handler
function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
defineProps({
  modelValue: {
    type: String
  },
  label: {
    type: String
  },
  customLabelStyleClass: {
    type: String
  },
  customInputStyleClass: {
    type: String
  },
  type: {
    type: String
  },
  placeholder: {
    type: String
  },
  inputName: {
    type: String
  },
  class: {
    type: String
  }
})
</script>
