import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css';
import mitt from 'mitt';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'

const Mit = mitt();

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './assets/reset.css'

/* add icons to the library */
library.add(faCirclePlay)


const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)


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
