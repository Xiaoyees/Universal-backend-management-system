<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义左侧的组件 -->
      <common-aside />
      <!-- 右侧内容 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="el-header">
          <common-header />
        </el-header>
        <!-- 主要内容区域 -->
        <el-main class="right-main">
          main
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonAside from '@/components/CommonAside.vue'
</script>

<style lang="less" scoped>
  .common-layout,.lay-container{
    height: 100%;
  }
  .el-header{
    background-color: #333;
  }
</style>