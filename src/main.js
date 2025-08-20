import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 1. 导入 router

const app = createApp(App)

app.use(router) // 2. 使用 router

app.mount('#app')
