import { createApp } from 'vue'
import { Quasar } from 'quasar'
import './style.css'
import App from './App.vue'
import Router from './router'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


const app = createApp(App)

app.use(Quasar, {
  plugins: {},
})

app.use(Router)

app.mount('#app')
