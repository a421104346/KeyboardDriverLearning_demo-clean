import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next';
import router from './router'

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';
import './style.css'

import App from './App.vue'
import animateStagger from './directives/animate-stagger'

const pinia = createPinia()
const app = createApp(App)

app.use(TDesign);
app.use(pinia)
app.use(router)
app.use(animateStagger)
app.mount('#app')
