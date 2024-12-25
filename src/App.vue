<template>
  <router-view> </router-view>
  <el-button type="success">默认</el-button>
  <el-button type="success">Success</el-button>
</template>

<script setup>

</script>

<style>
/* 设置全局样式防止滚动条出现 */
#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>