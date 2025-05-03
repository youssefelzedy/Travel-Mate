<template>
  <section class="w-full h-full">
    <div
      class="wrapper w-full h-full flex justify-center items-center flex-col"
    >
      <slot name="auth-modal-content"></slot>
    </div>
  </section>
</template>

<style scoped="true">
.wrapper {
  background-image: url('../assets/bg.jpg');
  background-size: cover;
}
</style>
