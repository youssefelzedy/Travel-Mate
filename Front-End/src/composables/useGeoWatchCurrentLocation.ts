import { ref } from 'vue'

export const useWatchCurrentLocation = () => {
  enum GeolocationErrorCode {
    UNDEFINED = 0,
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMEOUT = 3
  }
  const userPosition = ref<GeolocationPosition | null>(null)
  const userWatchId = ref<number | null>(null)
  const geolocationComposableError = ref<Partial<GeolocationPositionError>>({
    code: GeolocationErrorCode.UNDEFINED,
    message: ''
  })
  const geolocationApiOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 60000
  }

  const watchPositionSuccess = (position: GeolocationPosition) => {
    userPosition.value = position
  }
  const watchPositionError = (error: GeolocationPositionError) => {
    geolocationComposableError.value = error
  }
  //Check if the browser supports geolocation api.
  if ('geolocation' in navigator) {
    userWatchId.value = navigator.geolocation.watchPosition(
      watchPositionSuccess,
      watchPositionError,
      geolocationApiOptions
    )
  } else {
    /* geolocation IS NOT available */
    geolocationComposableError.value = {
      code: GeolocationErrorCode.POSITION_UNAVAILABLE,
      message: 'Geolocation is not available'
    }
  }
  return {
    userWatchId,
    geolocationComposableError
  }
}
