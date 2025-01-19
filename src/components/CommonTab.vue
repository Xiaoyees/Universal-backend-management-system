<template>
    <div class="tags">
        <el-tag 
            v-for="(tag,index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :effect="route.name === tag.name ? 'dark':'plain'" 
            @click="handleMenu(tag)"
            @close="handleClose(tag, index)"
        >
        {{ tag.label }}
        </el-tag>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const tags = computed(() => store.state.tags)

const route = useRoute()

const router = useRouter()
const handleMenu = (tag) => {
    router.push(tag.name)
    store.selectMenu(tag)
}

const handleClose = (tag, index) => {
    store.updateTags(tag)

    // 如果标签的名称与路由的名称不匹配，则不执行后续操作
    if (tag.name !== route.name) return

    // 当前索引等于标签长度时，删除的是最后一个标签
    if (index === store.state.tags.length) {
        // 选择前一个标签
        store.selectMenu(tags.value[index - 1])
        // 跳转到前一个标签对应的页面
        router.push(tags.value[index - 1].name)
    } else {
        // 否则，因为不是最后一个标签，所以后一个标签的索引变成当前索引,跳转到后一个标签
        store.selectMenu(tags.value[index])
        // 跳转到后一个标签对应的页面
        router.push(tags.value[index].name)
    }
}

</script>

<style lang="less" scoped>
.tags{
    margin: 20px 0 0 20px;
}
.el-tag{
    margin-right: 10px;
}
</style>