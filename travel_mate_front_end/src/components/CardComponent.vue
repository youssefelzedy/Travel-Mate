<template>
  <div
    class="card-wrapper rounded-3xl w-full flex flex-col justify-center items-center duration-150"
  >
    <slot name="card-content"></slot>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.card-wrapper {
  color: white;
  border: 2px solid rgb(124 58 237);
  background-color: rgb(91 33 182);
  cursor: pointer;
}
.card-wrapper:hover {
  background-color: rgb(140, 68, 255);
  border-color: rgb(140, 68, 255);
}
</style>
