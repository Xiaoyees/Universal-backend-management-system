import { createRouter,createWebHashHistory } from "vue-router"; 

//制定路由规则
const routes = [
	{
		// 根路径路由配置
		path: "/", // 设置路径为根路径
    name: "main", // 路由名称为main'
		component: () => import("@/views/main.vue") // 懒加载主页组件，当访问根路径时动态加载main.vue组件
	},
];

const router = createRouter({
  // 设置路由模式
	history:createWebHashHistory(),
	routes
});

export default router;