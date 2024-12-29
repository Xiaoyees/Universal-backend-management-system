import { createApp } from 'vue'  // 从 Vue 库中导入 createApp 函数，用于创建 Vue 应用实例
import App from './App.vue'     // 导入根组件 App
import "@/assets/less/index.less"  // 导入全局样式文件，确保样式在应用中生效
import router from './router'   // 导入路由配置，管理应用的不同页面和导航
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //从 @element-plus/icons-vue 中导入所有图标并进行全局注册
import { createPinia } from 'pinia'
import '@/api/mock.js'

// 创建 Vue 应用实例，并将根组件 App 传递给它
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus)
// 使用路由插件，并将应用挂载到 DOM 中 id 为 'app' 的元素上，启动应用
app.use(router).mount('#app')
