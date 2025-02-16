import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon-font.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).use(ElementPlus, { locale: zhCn, }).mount('#app');


