<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <!-- 列名 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 每行的数据 -->
      <el-table-column 
        v-for="item in tableLabel" 
        :key="item.prop" 
        :width="item.width ? item.width: 125"
        :prop="item.prop" 
        :label="item.label" 
      />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <!-- 这是 Vue 3 中用于定义作用域插槽（Scoped Slot）的语法。
              它允许父组件向子组件传递数据，并且可以在父组件中使用这些数据。 -->
        <template #="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination 
      class="pager" 
      background 
      layout="prev, pager, next" 
      size="small" 
      :total="config.total"
      @current-change="handleChange" 
    />
  </div>
  <!-- 新增/编辑按钮点击以后的弹窗 -->
  <el-dialog 
    v-model="dialogVisible" 
    :title="action == 'add' ? '新增用户' : '编辑用户'" 
    width="35%" 
    :before-close="handleClose"
  >
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form 
      :inline="true" 
      :model="formUser" 
      :rules="rules" 
      ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker 
              v-model="formUser.birth" 
              type="date" 
              placeholder="请输入" 
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" 
              style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import{ElMessage,ElMessageBox} from 'element-plus'
const { proxy } = getCurrentInstance()
const tableData = ref([])
// 表格列名和数据键名，
// prop 属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 400,
  },
])
const formInline = reactive({
  keyWord: ''
})
// 放置搜索功能的name，和分页器的数据
//其中total是数据总条数，page是当前的页数，设置name根据name进行条件搜索
const config = reactive({
  name:'',
  total:0,
  page:1
})
// 获取表格数据
const getUserTableData = async ()=>{
    const data =  await proxy.$api.getUserData(config)
    // console.log(data)
    // 该新数组是通过对 data.list 中的每个项目进行映射而得到的
    // data.list是一个数组，里面很多对象，所以用map遍历数组然后返回数组
    tableData.value = data.list.map(item => ({
      // 将api获取的data.list里的对象解构到名为item的变量中
      ...item,
      // 如果 sex 值为 1，则显示为'男'，否则显示为'女'
      sexLabel: item.sex === 1 ? '男' : '女'
    }));
    config.total = data.count;
}
// 搜索按钮事件
const handleSearch = () => {
  config.name = formInline.keyWord
  getUserTableData()
}
// 翻页事件
const handleChange= (page) => {
  config.page = page
  getUserTableData()
}
// 表格里的编辑按钮事件
const handleEdit = (val) => {
  action.value = "edit"
  dialogVisible.value = true

  nextTick(() => {
    //因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
    //所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值

    Object.assign(formUser, { ...val, sex: "" + val.sex })
    //这里用字符串拼接的方式改变sex数据类型为字符串，是因为el-option的value有类型的校验
  })
}
// 表格里的删除按钮事件
const handleDelete = (val) => {
  ElMessageBox.confirm("确定要删除吗？").then(async () => {
    await proxy.$api.deleteUser({ id: val.id })
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success'
    })
    getUserTableData()
  })
}
//控制对话框是否显示
const dialogVisible = ref(false)

//新增和编辑共用一个窗口，所以通过设置action区分
const action = ref("add")
//弹窗的表单
const formUser = reactive({})
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: '地址是必填项' }]
})
const handleAdd = () => {
  action.value = "add"
  //打开对话窗
  dialogVisible.value = true
}
//对话框右上角的关闭事件
const handleClose = () => {
  //获取到表单dom，执行resetFields重置表单
  proxy.$refs["userForm"].resetFields()
  //关闭对话框
  dialogVisible.value = false
}

//对话框右下角的取消事件
const handleCancel = () => {
  //获取表单重置表单
  proxy.$refs["userForm"].resetFields()
  dialogVisible.value = false
}
const onSubmit = () => {
  //执行userForm表单的validate进行规则校验，传入一个回调函数，回调函数会接受到一个是否校验通过的变量
  proxy.$refs["userForm"].validate(async (valid) => {

    //如果校验成功
    if (valid) {
      //res用于接收添加用户或者编辑用户接口的返回值
      let res = null
      //sex的数据类型是数字类型，
      // 需要将传入的sex字符串转化为数字类型才能正确传送到后端数据和显示到页面里
      formUser.sex = Number(formUser.sex);
      if (action.value == "add") {
        console.log(formUser)
        res = await proxy.$api.addUser(formUser);
      } else if (action.value == "edit") {
        //在之前的onSubmit方法中增加的代码
        //如果是编辑
        res = await proxy.$api.editUser(formUser)
      }
      //如果接口调用成功即新增或者编辑完成以后
      if (res) {
        //关闭对话框，重置表单，重新请求用户数据
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields()
        getUserTableData()
      }
      //如果校验失败
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      })
    }

  })
}
onMounted(() => {
  getUserTableData()
})

</script>

<style lang="less" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
}
.table{
    position: relative;
    height: 520px;
    .pager{
        position: absolute;
        right: 10px;
        bottom: 30px;
    }
    .el-table{
      width: 100%;
      height:500px
    }
}
.select-clearn {
  display: flex;
}
</style>