<template>
  <el-aside width="180px">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
    >
        <h3>通用后台管理系统</h3>
        <!-- 只有一级菜单 -->
        <el-menu-item 
          v-for="item in noChildren"
          :index="item.path"
          :key="item.path"
        >
          <component class="icons" :is="item.icon"></component>
          <span>{{item.label}}</span>
        </el-menu-item>
        <!-- 有多级菜单 -->
        <el-sub-menu 
          v-for="item in hasChildren"
          :index="item.path"
          :key="item.path"
        >
          <template #title>
            <component class="icons" :is="item.icon"></component>
            <span>{{item.label}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item 
              v-for="(subItem,subIndex) in item.children"
              :index="item.path"
              :key="item.path"
            >
            <component class="icons" :is="item.icon"></component>
            <span>{{subItem.label}}</span>
          </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

      </el-menu>
  </el-aside>
</template>

<script setup>
import {ref,computed} from 'vue'
import { useRouter } from 'vue-router';
const router=useRouter()

const list =ref([
      	{
          path: '/home',
          name: 'home',
          label: '首页',
          icon: 'house',
          url: 'Home'
      	},
        {
            path: '/mall',
            name: 'mall',
            label: '商品管理',
            icon: 'video-play',
            url: 'Mall'
        },
        {
            path: '/user',
            name: 'user',
            label: '用户管理',
            icon: 'user',
            url: 'User'
        },
        {
            path: 'other',
            label: '其他',
            icon: 'location',
            children: [
                {
                    path: '/page1',
                    name: 'page1',
                    label: '页面1',
                    icon: 'setting',
                    url: 'Page1'
                },
                {
                    path: '/page2',
                    name: 'page2',
                    label: '页面2',
                    icon: 'setting',
                    url: 'Page2'
                }
            ]
        }
])
// 计算属性：过滤出没有子项的菜单项
const noChildren = computed(() => list.value.filter(item => !item.children))

// 计算属性：过滤出有子项的菜单项
const hasChildren = computed(() => list.value.filter(item => item.children))
const clickMenu=(item)=>{
    router.push(item.path)
}
</script>

<style lang="less" scoped>
.el-aside{
    height:100%;
    background-color:#545c64;
}
.icons{
    width:18px;
    height:18px;
    margin-right:5px;
}
.el-menu{
    border-right:none;
    h3{
        line-height:48px;
        color:#fff;
        text-align:center;
    }
}

</style>