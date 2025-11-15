import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import { Tooltip } from 'primevue'
import material from '@primeuix/themes/material'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.directive('tooltip', Tooltip)
app.use(createPinia())
app.use(router)
app.use(DialogService)
app.use(ConfirmationService)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: material,
  },
})
app.mount('#app')
