<template>
  <div class="header">
    <div class="l-content">
    <el-button size="small" @click="handleCollapse">
      <!-- 在此处使用组件来渲染图标，组件名为"menu" -->
      <component class="icons" is="menu"></component>
    </el-button>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="getImageUrl('user')" class="user">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import {ref,computed} from 'vue'
import { useAllDataStore } from "@/stores"
// 根据用户获取对应的图片URL
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}
const store = useAllDataStore()
const handleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse
}
</script>

<style lang="less" scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
}

.icons {
  width: 20px;
  height: 20px;
}

.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
//  选择所有在.bread类中的span元素
// :deep是一个伪类选择器，用于在Vue 3的CSS作用域中选择深层次的子组件元素。
:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>