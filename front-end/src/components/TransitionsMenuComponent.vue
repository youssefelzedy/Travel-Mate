<template>
  <div
    class="mt-2 p-4 w-full flex flex-col justify-center bg-slate-900/50 rounded-lg"
  >
    <TransitionComponent
      v-for="transition in transitionsArray"
      :startingPointStation="transition.startingPointStation"
      :startTime="transition.startTime"
      :transitionState="transition.transitionState"
      :finishPointStation="transition.finishPointStation"
      :finishTime="transition.finishTime"
      :microTransactionsArray="transition.microTransitionArray"
    />
  </div>
</template>
<script setup lang="ts">
export interface Transition {
  startingPointStation: string
  startTime: string
  transitionState: string
  finishPointStation: string
  finishTime: string
  microTransitionArray?: string[]
}
import TransitionComponent from './TransitionComponent.vue'
defineProps<{
  transitionsArray: Transition[]
}>()
</script>
