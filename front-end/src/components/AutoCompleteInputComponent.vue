<template>
  <div class="relative w-full flex flex-col justify-center items-center">
    <input
      :class="inputClass"
      name="search"
      @input="handleInput"
      type="search"
      :value="props.newSearch"
    />
    <ul
      class="z-10 max-w-80 top-[3.2rem] absolute context-menu-wrapper w-full overflow-auto rounded-b-md"
      v-if="
        searchResults.length > 0 &&
        props.newSearch.length > 1 &&
        props.newSearch !== ''
      "
    >
      <li
        class="relative context-menu-button flex flex-row items-center duration-150 text-white text-lg gap-2 p-2 bg-violet-800 hover:bg-violet-500"
        v-for="item in searchResults"
        :key="item.value"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useDebounceFn } from '@vueuse/core'

interface Item {
  label: string
  value: string
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  array: Item[]
  newSearch: string
}>()

const searchResults = ref<Item[]>([])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  debouncedSearch(target.value)
}

const debouncedSearch = useDebounceFn((query: string) => {
  searchResults.value = props.array.filter((item: Item) =>
    item.label.toLowerCase().trim().includes(query.toLowerCase().trim())
  )
}, 650)

const inputClass = computed(() => {
  return searchResults.value.length > 0 &&
    props.newSearch.length > 1 &&
    props.newSearch !== ''
    ? 'open-input'
    : 'closed-input'
})
</script>

<style scoped>
/* Closed Input: Fully Rounded */
.closed-input {
  background-color: #5a21b671;
  border-color: #5b21b6;
  border-width: 0.15rem;
  border-radius: 0.5rem; /* Fully rounded */
  padding: 0.625rem;
  width: 100%;
}
.closed-input:focus {
  outline: none;
}

.open-input:focus {
  outline: none;
}
/* Open Input: Rounded Top Corners Only */
.open-input {
  background-color: #5a21b671;
  border-color: #5b21b6;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-width: 0.15rem;
  padding: 0.625rem;
  width: 100%;
}
</style>
