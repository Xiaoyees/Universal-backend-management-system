<template>
    <div class="body-login">
        <el-form class="login-container">
            <h1>欢迎登录</h1>
            <el-form-item>
                <el-input type="input" placeholder="请登录账号" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="password" placeholder="请登录密码" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="handleLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, getCurrentInstance} from "vue"
import { useAllDataStore } from "@/stores"
import { useRouter} from "vue-router"

// 获取当前组件实例的代理对象,用于后面api的使用
const { proxy } = getCurrentInstance()
const store = useAllDataStore()
const router = useRouter()

const loginForm = reactive({
    username:'',
    password:''
})

const handleLogin = async ()=>{
    const res = await proxy.$api.getMenu(loginForm)
    console.log(res)
    // store.updateMenuList(res.menuList)
    // store.state.token = res.token
    // store.addMenu(router)
    // router.push('/home')
}
</script>

<style scoped lang="less">
.body-login{
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/background.png");
    background-size: 100%;
    overflow: hidden;
}
.login-container{
    width: 350px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    margin: 250px auto;
    h1{
        text-align: center;
        margin-bottom: 20px;
        color: #505450;
    }
    /* 使用 :deep 选择器样式穿透的来样式化子组件中的 .el-form-item__content 类，使其内容居中对齐 */
    :deep(.el-form-item__content){
        justify-content: center;
    }
}
</style>
