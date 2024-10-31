import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/reset.css'
import '@/styles/base.css'
import router from './router'

const app = createApp(App);

app.use(router)
    .mount('#app');