<template>
  <div
    class="transition-wrapper w-full flex flex-col justify-center items-center duration-150 min-h-32"
  >
    <div
      class="flex flex-row flex-grow p-3 gap-7 text-xl font-bold justify-between items-center"
    >
      <div class="time-wrapper flex flex-col justify-between h-full">
        <div class="flex justify-start items-center start-time text-handler">
          {{ startTime }}
        </div>
        <div class="flex justify-start items-center start-time text-handler">
          {{ finishTime }}
        </div>
      </div>

      <div class="circle-wrapper flex flex-col h-full gap-2">
        <FontAwesomeIcon
          class="pt-1"
          :icon="faCircleRegular"
        />
        <div
          class="flex w-0 flex-grow border-r-4 border-dotted p-[0.25rem]"
        ></div>
        <FontAwesomeIcon :icon="faCircleDot" />
      </div>
      <div class="h-full w-full flex flex-col justify-between items-center">
        <div
          class="flex justify-end items-center start-point-station text-handler"
        >
          {{ startingPointStation }}
        </div>
        <div
          class="flex justify-end items-center start-point-station text-handler"
        >
          {{ finishPointStation }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import {
  faBus,
  faTaxi,
  faPersonWalking,
  faEllipsisV,
  faCircleChevronDown,
  faCircleChevronUp,
  faShoePrints
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircleDot,
  faCircle as faCircleSolid
} from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons'
const droppedDown = ref(false)
const dropDownUp = () => {
  droppedDown.value = !droppedDown.value
}

defineProps<{
  transitionState: string
  startingPointStation: string
  finishPointStation: string
  startTime: string
  finishTime: string
  microTransitionArray?: string[]
}>()
</script>
<style scoped>
.text-handler {
  width: 125px;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  font-size: 1rem;
}

.transition-wrapper {
  color: white;

  background-color: rgb(91 33 182);
  cursor: pointer;
}
.card-wrapper:hover {
  background-color: rgb(140, 68, 255);
}
</style>
