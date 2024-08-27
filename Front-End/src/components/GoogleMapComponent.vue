<template>
  <GoogleMap
    ref="mapRef"
    :api-key="apiKey"
    style="width: 100%; height: 100%"
    :center="mapCenter"
    :zoom="15"
    :map-id="googleMapId"
  >
  </GoogleMap>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import logo from '@/assets/user_white.svg'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { GoogleMap, AdvancedMarker, CustomMarker } from 'vue3-google-map'
const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY
const googleMapId = process.env.VUE_APP_GOOGLE_MAP_ID
const center = ref({ lat: 0, lng: 0 })
const markerOptions = {
  position: center,
  gmpDraggable: true,
  zIndex: 1
}
const pinOptions = {
  scale: 1
}
const mapRef = ref(null)
const locationMarker = ref(null)

defineProps({
  mapCenter: {
    type: Object
  }
})
</script>
