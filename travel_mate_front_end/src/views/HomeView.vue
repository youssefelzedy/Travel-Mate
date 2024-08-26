<template>
  <ModalComponent v-if="modalState">
    <template #modal-content>
      <div class="w-[40rem] p-10">
        <div class="title-wrapper mb-4">
          <h1 class="text-3xl font-bold text-white">
            Welcome, {{ userData?.fullname }}
          </h1>
          <p class="text-white font-medium text-sm pl-14">
            Where would you like to go ?
          </p>
        </div>
        <div class="masonry">
          <CardComponent
            v-for="place in places"
            class="masonry-item"
            :key="place.name"
          >
            <template #card-content>
              <div class="flex flex-col items-center justify-center p-2">
                <h1 class="text-sm font-bold text-white">{{ place.name }}</h1>
                <p class="text-white"></p>
              </div>
            </template>
          </CardComponent>
        </div>
      </div>
    </template>
  </ModalComponent>

  <div class="overflow-y-auto flex flex-col w-full h-full">
    <PageLayout :userData="userData">
      <template #background-slot>
        <GoogleMapComponent :center="mapCenter"></GoogleMapComponent>
      </template>
      <template #side-menu-slot>
        <div class="bg-slate-900/50 rounded-lg p-2">
          <h1 class="text-3xl text-white font-bold text-left m-5">
            Get directions
          </h1>
          <div class="w-full flex justify-center items-center text-le flex-col">
            <TransportationComponent v-model="selectedTransportationMethod" />
            <div
              class="flex flex-col flex-grow justify-center items-center gap-2 mt-2 mb-2"
            >
              <DestinationComponent>
                <template #destination-icon>
                  <FontAwesomeIcon
                    :icon="faStreetView"
                    class="text-white"
                  />
                </template>
                <template #input-slot>
                  <AutoCompleteInputComponent
                    @input="changeValue"
                    v-model="searchValue1"
                    :newSearch="searchValue1"
                    :array="dataArray"
                  />
                </template>
              </DestinationComponent>
              <DestinationComponent>
                <template #destination-icon>
                  <FontAwesomeIcon
                    :icon="faLocationDot"
                    class="text-violet-500"
                  />
                </template>
                <template #input-slot>
                  <AutoCompleteInputComponent
                    v-model="searchValue2"
                    :newSearch="searchValue2"
                    :array="dataArray"
                  />
                </template>
              </DestinationComponent>
            </div>
            <button
              @click="startJourney"
              class="journey-button button button-colored rounded-b-lg"
            >
              Start journey!
            </button>
          </div>
        </div>
        <TouristAttractionMenuComponent v-if="!isJourneyStarted" />
        <TransitionsMenuComponent
          v-else
          :transitionsArray="transitionsArrayData"
        />
      </template>
      <div class="flex flex-col items-center justify-center w-full h-full">
        <img
          :src="profilePicture"
          alt="Profile picture"
          class="w-32 h-32 rounded-full"
        />
        <h1 class="text-2xl font-bold text-white">
          Welcome back, {{ userData?.fullname }}
        </h1>
      </div>
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { places } from '@/statistics/places'
import { useGeoCurrentLocation } from '@/composables/useGeoCurrentLocation'
import { inject, onMounted, ref, Ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStreetView, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import { Transition } from '@/components/TransitionsMenuComponent.vue'
import profilePicturePlaceHolder from '@/assets/user_white.svg'
import PageLayout from '@/layouts/PageLayout.vue'
import TransportationComponent from '@/components/TransportationComponent.vue'
import DestinationComponent from '@/components/DestinationComponent.vue'
import GoogleMapComponent from '@/components/GoogleMapComponent.vue'
import TouristAttractionMenuComponent from '@/components/TouristAttractionMenuComponent.vue'
import TransitionsMenuComponent from '@/components/TransitionsMenuComponent.vue'
import { set, useDebounceFn } from '@vueuse/core'
import AutoCompleteInputComponent from '@/components/AutoCompleteInputComponent.vue'
import { IUserData } from '@/App.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import CardComponent from '@/components/CardComponent.vue'
const searchValue1 = ref('')
const searchValue2 = ref('')

const mapCenter = ref<{ lat: number; lng: number } | null>(null)
const userData = inject<Ref<IUserData | null>>(
  'userData'
) as Ref<IUserData | null>
const setUserData =
  inject<(newUser: IUserData, userData: Ref<IUserData | null>) => void>(
    'setUserData'
  )

const setModalState = inject<(value: boolean) => void>('setModalState')
const modalState = inject<Ref<boolean>>('modalState')
const changeValue = (newValue: Ref<string>, searchValue: string) => {
  newValue.value = searchValue
}

const dataArray = [
  { label: 'Cafe El omda', value: '12' },
  {
    label: 'cafe el rabeea',
    value: '40'
  },
  { label: 'Manshia Square', value: '30' },
  { label: 'Mohamed Ali street', value: '35' }
]
const selectedTransportationMethod = ref('transit')
const profilePicture = ref(profilePicturePlaceHolder)
const transitionsArrayData = ref<Transition[]>([
  {
    transitionState: 'walk',
    startingPointStation: 'Bank-Eleskan',
    finishPointStation: 'ElOmda Cafe',
    startTime: '4:30PM',
    finishTime: '4:35PM'
  },
  {
    transitionState: 'bus',
    microTransitionArray: ['walk', 'walk', 'walk'],
    startingPointStation: 'ElOmda Cafe',
    finishPointStation: 'ElManshia Square',
    startTime: '4:35PM',
    finishTime: '5:35PM'
  },
  {
    transitionState: 'taxi',
    startingPointStation: 'ElManshia Square',
    finishPointStation: 'Masjed ElTawfeky',
    startTime: '5:35PM',
    finishTime: '5:50PM'
  }
])
let isJourneyStarted = ref(false)

const startJourney = async () => {
  try {
    const res = await axios.post(
      'http://localhost:3000/api/v1/journeys/search-microbus',
      {
        location: {
          lat: 31.2587584192,
          lng: 32.2931440543
        },
        destination: {
          lat: 31.2607126949,
          lng: 32.3071995724
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
    if (res.status === 200) {
      console.log('Journey started', res.data)
      isJourneyStarted.value = true
      toast('Journey started', {
        type: 'success'
      })
    }
  } catch (error) {
    toast('Error happened', {
      type: 'error'
    })
    console.log(error)
  }
}
onMounted(() => {
  if (setModalState) setModalState(true)
  const { userCurrentPosition, geolocationComposableError } =
    useGeoCurrentLocation()
  watch(userCurrentPosition, (newPosition) => {
    if (newPosition) {
      mapCenter.value = {
        lat: newPosition.coords.latitude,
        lng: newPosition.coords.longitude
      }
      console.log(mapCenter.value)
    } else {
      console.log('Still waiting for user position...')
    }
  })
})
</script>
