import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css';
import mitt from 'mitt';

const Mit = mitt();

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './assets/reset.css'

const app = createApp(App)


declare module 'vue' {
    export interface ComponentCustomProperties {
        $Bus: typeof Mit
    }
}

app.config.globalProperties.$Bus = Mit;


app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
