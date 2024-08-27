<template>
  <div
    @click.right="openCloseContextMenu"
    @click.left="$router.push('/user/profile')"
    @contextmenu.prevent
    class="flex items-center justify-center duration-150 cursor-pointer hover:bg-violet-500 p-2 w-12 rounded-full bg-violet-800 border-violet-600 border-2"
  >
    <img
      class="profile-picture"
      :src="profilePicture"
    />
  </div>
  <ContextMenuComponent
    v-if="isContextMenuOpen"
    :items="profileButtonContextMenuData"
  />
</template>
<script setup lang="ts">
import { ref, defineProps } from 'vue'
import ContextMenuComponent from './ContextMenuComponent/ContextMenuComponent.vue'
import { profileButtonContextMenuData } from '@/statistics/contextMenuData'

let isContextMenuOpen = ref(false)
let openCloseContextMenu = () => {
  isContextMenuOpen.value = !isContextMenuOpen.value
}
defineProps({
  profilePicture: {
    type: String,
    required: true
  }
})
</script>
<style scoped lang="css">
.profile-picture {
  pointer-events: none;
  z-index: 0;
}
</style>
