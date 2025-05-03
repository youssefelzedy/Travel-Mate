import { ref, onMounted, onUnmounted } from 'vue'

export function useScript(src: string, options = { async: true, defer: true }) {
  const scriptLoaded = ref<boolean>(false)
  const scriptError = ref<string | Event | null>(null)

  const appendScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = options.async
      script.defer = options.defer

      script.onload = () => {
        scriptLoaded.value = true
        resolve(true)
      }

      script.onerror = (err) => {
        scriptError.value = err
        reject(err)
      }

      document.head.appendChild(script)
    })
  }

  onMounted(() => {
    appendScript().catch((err) => {
      console.error('Failed to load script:', err)
    })
  })

  onUnmounted(() => {
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      document.head.removeChild(existingScript)
    }
  })

  return {
    scriptLoaded,
    scriptError
  }
}
