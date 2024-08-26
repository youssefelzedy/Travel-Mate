<template>
  <div
    class="mt-2 p-4 w-full flex flex-col justify-center bg-slate-900/50 rounded-lg"
  >
    <h1 class="text-3xl text-white font-bold text-left m-5">
      Places you must try
    </h1>

    <CardComponent
      v-for="attraction in attractions"
      class="w-full h-80 p-4 mt-4"
    >
      <template #card-content>
        <div class="flex justify-between w-full">
          <div
            class="flex flex-row items-center gap-2 text-lg font-semibold bg-slate-900/50 p-[0.7rem] rounded-full"
          >
            <FontAwesomeIcon
              :class="
                attraction.state === 'Open' ? 'open-state' : 'closed-state'
              "
              :icon="faCircle"
            />
            <p class="text-white">{{ attraction.state }}</p>
          </div>
          <div
            class="flex flex-row items-center text-lg font-semibold bg-slate-900/50 p-[0.7rem] rounded-full"
          >
            <div
              class="text-[#FFCE51]"
              v-for="state in rateStars(attraction.rate)"
            >
              <FontAwesomeIcon
                v-if="state === 'full'"
                :icon="faStar"
              />
              <FontAwesomeIcon
                v-if="state === 'half'"
                :icon="faStarHalfAlt"
              />
              <FontAwesomeIcon
                v-if="state === 'empty'"
                :icon="faStarRegular"
              />
            </div>
          </div>
        </div>

        <div class="w-full mt-3 mb-3">
          <h2 class="text-2xl font-bold text-white">{{ attraction.title }}</h2>
        </div>

        <img
          :class="`image-div-${attraction.image}`"
          class="w-96 h-52 bg- bg-cover bg-no-repeat rounded-xl border-2 border-[#7c3aed]"
          alt="Place image"
        />
      </template>
    </CardComponent>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import {
  faCircle,
  faStar,
  faStarHalfAlt
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CardComponent from './CardComponent.vue'

const rateStars = (rate: number) => {
  const integerRate = Math.floor(rate)
  let starArray = []
  if (rate === 0) {
    for (let i = 0; i < 5; i++) starArray.push('empty')
    return starArray
  }
  if (Number.isInteger(rate) === true) {
    for (let i = 0; i < integerRate; i++) {
      starArray.push('full')
    }
  } else {
    for (let i = 0; i < integerRate; i++) {
      starArray.push('full')
    }
    starArray.push('half')
  }
  for (let i = 0; i < 5 - Math.ceil(rate); i++) {
    starArray.push('empty')
  }
  return starArray
}

let attractions = ref([
  {
    title: "Mccdonald's",
    image: 'mccd',
    rate: 2,
    state: 'Closed'
  },
  {
    title: 'Pizza hut',
    image: 'pizza',
    rate: 5,
    state: 'Open'
  },
  {
    title: 'KFC',
    image: 'kfc',
    rate: 4.5,
    state: 'Closed'
  }
])
</script>
<style scoped>
.image-div-pizza {
  background-image: url('../assets/pizza.jpg');
}
.image-div-kfc {
  background-image: url('../assets/kfc.jpg');
}
.image-div-mccd {
  background-image: url('../assets/mccd.jpg');
}

.open-state {
  color: #1cc14a;
}

.closed-state {
  color: #ff2d2d;
}
</style>
