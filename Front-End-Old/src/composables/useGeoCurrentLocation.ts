import { ref } from 'vue'

export const useGeoCurrentLocation = () => {
  enum GeolocationErrorCode {
    UNDEFINED = 0,
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMEOUT = 3
  }
  const userCurrentPosition = ref<GeolocationPosition | null>(null)
  const geolocationComposableError = ref<Partial<GeolocationPositionError>>({
    code: GeolocationErrorCode.UNDEFINED,
    message: ''
  })
  const geolocationApiOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 60000
  }

  const currentPositionSuccess = (position: GeolocationPosition) => {
    userCurrentPosition.value = position
  }
  const currentPositionError: PositionErrorCallback = (
    error: GeolocationPositionError
  ) => {
    geolocationComposableError.value = error
  }
  //Check if the browser supports geolocation api.
  if ('geolocation' in navigator) {
    /* geolocation IS available */

    navigator.geolocation.getCurrentPosition(
      currentPositionSuccess,
      currentPositionError,
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
    userCurrentPosition,
    geolocationComposableError
  }
}
