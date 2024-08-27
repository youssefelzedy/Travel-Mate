<template>
  <div class="context-menu-wrapper max-w-40 max-h-56 overflow-auto rounded-md">
    <div v-for="item in items">
      <ContextMenuButtonComponent
        v-if="item.type === 'button'"
        :type="item.type"
        :action="item.action"
        :key="item.label"
        :label="item.label"
      >
        <FontAwesomeIcon :icon="item.icon" />
      </ContextMenuButtonComponent>
      <ContextMenuButtonComponent
        v-if="item.type === 'anchor'"
        :type="item.type"
        :href="item.href"
        :key="item.label"
        :label="item.label"
      >
        <FontAwesomeIcon :icon="item.icon" />
      </ContextMenuButtonComponent>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ContextMenuButtonComponent from '@/components/ContextMenuComponent/ContextMenuButtonComponent.vue'
import { ContextMenuItem } from '@/statistics/contextMenuData'

defineProps({
  items: {
    type: Array as () => ContextMenuItem[],
    required: true
  }
})
</script>
<style scoped lang="css"></style>
