import axios from 'axios'
import { ElMessage } from 'element-plus';// 用于错误信息的显示
import config from '@/config';
// axios的二次封装，将 axios 封装到自定义的 request 函数中，从而实现统一的请求前和请求后的处理逻辑。
const service = axios.create({
    baseURL: config.baseApi,
});
const Network_Error = '网络错误，请稍后再试';
// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((res)=> {
    // 对响应数据做点什么
    const {code, data, msg} = res.data
    if(code === 200){
        return data
    }else{
        const Network_Error = '网络错误，请稍后再试';
        ElMessage.error(msg||'Network_Error')
        return Promise.reject(msg||'Network_Error')
    }
});
// 为 API 请求添加了一系列规则和处理逻辑
function request(options) {
    // 如果请求没有指定请求方法，默认使用 GET 方法。
    options.method = options.method || 'get';
    // get请求调整
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }
    //处理 mock 数据开关。优先使用传入的 options.mock即api上的，
    // 如果api上面未定义（没有这个参数）则使用全局配置 config.mock。
    let isMock = config.mock;
    if (typeof options.mock != 'undefined') {
        isMock = options.mock;
    }
    // 根据当前环境（开发或生产）设置不同的基础 URL。
    // 生产环境下prod不使用 mock 数据；
    if (config.env === 'prod') {
        //不用 mock模拟数据
        service.defaults.baseURL = config.baseApi;
        // 非生产环境下根据 isMock 决定使用 mock API 或真实 API。
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }
    // 发起实际的 HTTP 请求，并返回一个 Promise。
    return service(options);
}

export default request;

/* 该文件通过封装 axios，实现了对 HTTP 请求的集中管理和错误处理，
简化了项目的网络请求代码，并且支持 mock 数据和不同环境下的 URL 切换。 */