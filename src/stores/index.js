import { defineStore } from 'pinia'
import { ref ,watch} from 'vue'
//初始化state数据，这里我们使用一个函数来返回
function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'home'
      }
    ],
    currentMenu: null,
    menulist: [],
    token: "",
    routerList: [],
  }
}
//第一个参数要求是一个独一无二的名字
//第二个参数可接受两类值：Setup 函数或 Option 对象。
export const useAllDataStore = defineStore('allData', () => {
  //在 Setup Store 中：
  //ref() 就是 state 属性
  //computed() 就是 getters
  //function() 就是 actions	
  const state = ref(initState())
  // 监视state对象的变化
  watch(
    state,
    (newObj) => {
      // 当新对象的token属性不存在时，直接返回，不执行后续操作
      if (!newObj.token) return;
      // 当token属性存在时，将新对象序列化后存储到localStorage中
      localStorage.setItem('store', JSON.stringify(newObj));
    },
    // 深度监视，意味着递归地比较对象的属性值和属性名
    { deep: true }
  )
/**
 * 根据用户选择更新菜单项
 * 此函数用于处理菜单选择事件，根据选择的菜单项进行相应的逻辑处理
 * @param {Object} val - 选中的菜单项对象，包含菜单的名称和其他信息
 */
  function selectMenu(val) {
    // 当选择首页时，重置当前菜单项为null
    if (val.name === 'home') {
      state.value.currentMenu = null
    } else {
      // console.log(val)
      // 对于非首页的菜单项，更新当前菜单项为选中的菜单项
      state.value.currentMenu = val
      // 查找当前选中的菜单项是否已存在于标签列表中,item 是 state.value.tags 数组中的每一个元素
      let index = state.value.tags.findIndex((item) => item.name === val.name);
      // 如果菜单项不存在于标签列表中，则将其添加到列表中；否则，不执行任何操作
      index === -1 ? state.value.tags.push(val) : "";
    }
  }
/**
 * 根据标签名称更新标签列表
 * 此函数的作用是移除给定名称的标签
 * @param {string} tag - 需要移除的标签对象，包含名称属性
 */
  function updateTags(tag) {
    // 查找标签在列表中的索引位置
    let index = state.value.tags.findIndex((item) => item.name === tag.name);
    // 在找到的位置移除一个标签
    state.value.tags.splice(index, 1);
  }
  function updateMenuList(val) {
    state.value.menulist = val;
  }

  /**
   * 动态添加菜单到路由
   * 该函数根据菜单列表动态生成路由，并将相应的组件懒加载到路由中
   */
  function addMenu(router, type){
    // 当类型为'refresh'时，尝试从本地存储中恢复状态
    if (type === 'refresh') {
      // 检查本地存储中是否存在'store'项
      if (JSON.parse(localStorage.getItem("store"))) {
        // 如果存在，则将状态值设置为本地存储中的值
        state.value = JSON.parse(localStorage.getItem("store"));
        // 初始化路由列表为空数组，表示刷新时重置路由信息
        state.value.routerList = [];
      } else {
        // 如果本地存储中不存在'store'项，则不执行任何操作并退出
        return;
      }
    }
    // 获取菜单列表
    const menu = state.value.menulist;
    // 动态导入所有位于 ../views 目录下及其子目录中的 Vue 组件
    // 这种方式有助于提高性能，因为只有在组件实际需要时才会被加载
    const module = import.meta.glob("../views/**/*.vue");
    // 初始化一个数组，用于存储即将动态添加的路由
    const routerArr = []
    
    // 遍历菜单列表
    menu.forEach((item) => {
      // 如果当前菜单项有子菜单
      if (item.children) {
        // 遍历子菜单
        item.children.forEach((val) => {
          // 构造子菜单项对应的组件路径
          let url = `../views/${val.url}.vue`;
          // 将组件路径关联到子菜单项
          val.component = module[url];
          // 将子菜单项添加到路由数组中
          routerArr.push(...item.children);
        });
      } else {
        // 如果当前菜单项没有子菜单，构造其对应的组件路径
        let url = `../views/${item.url}.vue`;
        // 将组件路径关联到菜单项
        item.component = module[url];
        // 将菜单项添加到路由数组中
        routerArr.push(item);
      }
    });
    
    // 清空现有的路由列表
    state.value.routerList = [];
    // 获取当前所有的路由
    let routers = router.getRoutes();
    // 遍历所有路由，移除不需要的路由
    routers.forEach(item => {
      // 保留 'main', 'login', '404' 这几个路由，其他路由移除
      if (item.name == 'main' || item.name == 'login' || item.name == '404') {
        return
      } else {
        router.removeRoute(item.name)
      }
    })
    
    // 遍历动态生成的路由数组，添加到主路由 'main' 下
    routerArr.forEach(item => {
      // 将新路由添加到状态管理和路由配置中
      state.value.routerList.push(router.addRoute('main', item));
    })
  }
  //需要把所有定义的state，getters，actions返回出去
  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    addMenu,
  }
})