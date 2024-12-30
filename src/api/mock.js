import Mock from 'mockjs'
// 导入 home 模块的 API 接口定义
import homeApi from './mockData/home'
// 导入 user 模块的 API 接口定义
import userApi from './mockData/user'
// 导入 permission 模块的 API 接口定义
import menuApi from './mockData/permission'

//1,拦截路径（正则表达式）;2，方法;3，制造数据
Mock.mock(/api\/home\/getTableData/, 'get', homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/, 'get', homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/, 'get', homeApi.getChartData);
Mock.mock(/user\/getUserData/, "get", userApi.getUserList);
Mock.mock(/user\/deleteUser/, "get", userApi.deleteUser);
Mock.mock(/user\/addUser/, "post", userApi.createUser);
Mock.mock(/user\/editUser/, "post", userApi.updateUser);
Mock.mock(/permission\/getMenu/, "post", menuApi.getMenu);
