import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

createApp(App)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 5000
    // ...
  } as ToastContainerOptions)
  .mount('#app')
