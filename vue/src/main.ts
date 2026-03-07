import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { installRouter } from '@/router'
import { applyStoredTheme } from '@/composables/useTheme'

installRouter()
applyStoredTheme()
createApp(App).mount('#app')
