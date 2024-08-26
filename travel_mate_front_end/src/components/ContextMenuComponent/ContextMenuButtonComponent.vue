<template>
  <div
    v-if="type === 'button'"
    @click="action"
    class="context-menu-button flex flex-row justify-center items-center duration-150 text-white text-lg gap-2 p-2 bg-violet-800 hover:bg-violet-500"
  >
    <slot class="w-6"></slot>
    <p>{{ label }}</p>
  </div>

  <a
    v-if="type === 'anchor'"
    :href="href"
    class="context-menu-button flex flex-row justify-center items-center duration-150 text-white text-lg gap-2 p-2 bg-violet-800 hover:bg-violet-500"
  >
    <slot class="w-6"></slot>
    <p>{{ label }}</p>
  </a>
</template>
<script setup lang="ts">
import { ContextMenuItem } from '@/statistics/contextMenuData'
import { defineProps } from 'vue'
defineProps<Partial<ContextMenuItem>>()
</script>
<style scoped lang="css"></style>
