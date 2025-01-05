import { defineStore } from 'pinia'
import { ref } from 'vue'
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
  //需要把所有定义的state，getters，actions返回出去
  return {
    state,
    selectMenu,
    updateTags

  }
})