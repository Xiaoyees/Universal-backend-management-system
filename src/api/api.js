/*
* 整个项目api的统一管理
提供了一组封装好的函数，用于调用各个模块的 API 接口。
每个函数内部通过 request 函数发起具体的 HTTP 请求，并传递必要的参数。
 */
import request from "./request";

export default{
    // 请求首页左下表格的数据
    getTableData(){
        return request({
            url: '/home/getTableData',
            method: 'get',
            // mock: true,
        });
    },
    getCountData() {
        return request({
            url: '/home/getCountData',
            method: 'get',
            // mock: false,
        });
    },
    getChartData(){
        return request({
            url: '/home/getChartData',
            method: 'get',
            
        });
    },
    getUserData(params) {
        return request({
            url: '/user/getUserData',
            method: 'get',
            data: params
        })
    },
    deleteUser(params) {
        return request({
            url: '/user/deleteUser',
            method: 'get',
            data: params
        })
    },
    addUser(params) {
        return request({
            url: '/user/addUser',
            method: 'post',
            data: params
        })
    },
    editUser(params) {
        return request({
            url: '/user/editUser',
            method: 'post',
            data: params
        })
    },
    getMenu(params) {
        return request({
            url: '/permission/getMenu',
            method: 'post',
            data: params
        })
    },
};

