import { createApp } from 'vue'  // 从 Vue 库中导入 createApp 函数，用于创建 Vue 应用实例
import App from './App.vue'     // 导入根组件 App
import "@/assets/less/index.less"  // 导入全局样式文件，确保样式在应用中生效
import router from './router'   // 导入路由配置，管理应用的不同页面和导航
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //从 @element-plus/icons-vue 中导入所有图标并进行全局注册
import { createPinia } from 'pinia'
import '@/api/mock.js'
import api from './api/api'
import { useAllDataStore } from "@/stores"

// 创建 Vue 应用实例，并将根组件 App 传递给它
const app = createApp(App)
// 遍历ElementPlusIconsVue对象的所有键值对
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  // 在应用中注册组件，使用其键作为名称
  app.component(key, component)
}
const pinia = createPinia()

function isRoute(to) {
  // 获取所有已定义的路由
  let res = router.getRoutes();
  // 过滤出路径与目标路由路径匹配的路由，并判断其数量是否大于0
  return res.filter((item) => item.path === to.path).length > 0;
}
/**
 * 在路由跳转前执行的钩子函数
 * 该函数用于全局鉴权和路由守卫
 * @param {Object} to 即将进入的路由对象，包含路径、名称等信息
 * @param {Object} from 当前导航正要离开的路由对象
 * @returns {Object|undefined} 返回路由对象表示重定向，undefined表示继续原导航
 */
router.beforeEach((to, from) => {
  // 检查目标路径是否为登录页，且当前没有登录token(未登录状态)
  if (to.path !== "/login" && !store.state.token) {
    // 未登录且目标路径非登录页，则重定向至登录页
    return { name: "login" };
  }
  // 检查目标路由是否有效
  if (!isRoute(to)) {
    // 无效路由，则重定向至404页面
    return { name: "404" }
  }
})
// 将全局API实例添加到应用的全局属性中，以便在应用的任何部分都能方便地访问API
app.config.globalProperties.$api = api
app.use(pinia)
const store = useAllDataStore()
store.addMenu(router, "refresh")
app.use(ElementPlus)
// 使用路由插件，并将应用挂载到 DOM 中 id 为 'app' 的元素上，启动应用
app.use(router).mount('#app')
