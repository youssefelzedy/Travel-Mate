<template>
  <div
    class="destination-component-wrapper w-full flex flex-col items-center flex-grow"
  >
    <div
      class="start-point-wrapper flex flex-row w-full justify-center items-center gap-4 text-white text-xl"
    >
      <div class="w-6 h-6 flex justify-center items-center">
        <slot name="destination-icon"></slot>
      </div>
      <slot name="input-slot"></slot>
      <div class="location-search-icon circle-button p-2">
        <FontAwesomeIcon :icon="faLocationCrosshairs" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
</script>
<style scoped>
.start-point-icon,
.finish-point-icon {
  width: 2rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
