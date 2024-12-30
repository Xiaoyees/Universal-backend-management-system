// 获取环境变量中的模式设置，如果没有设置则默认为"prod"（生产环境）
const env = import.meta.env.MODE || "prod";

/**
根据环境变量动态配置不同环境下的API基础URL和Mock数据URL，以适应开发、测试和生产环境的需求。
 */
const EnvConfig = {
    // 开发环境配置
    development:{
        // 开发环境的基础API地址
        baseApi:"/api",
        // 开发环境的Mock API地址，用于模拟后端服务
        mockApi: "https://apifoxmock.com/m1/4068509-0-default/api",
    },
    // 测试环境配置
    test:{
        // 测试环境的基础API地址
        baseApi:"/api",
        // 测试环境的Mock API地址，用于模拟后端服务
        mockApi: "https://apifoxmock.com/m1/4068509-0-default/api",
    },
    // 生产环境配置
    prod:{
        // 生产环境的基础API地址
        baseApi:"/api",
        // 生产环境的Mock API地址，用于模拟后端服务
        mockApi: "https://apifoxmock.com/m1/4068509-0-default/api",
    },
}

// 导出一个默认的配置对象，用于根据环境变量动态加载环境配置
export default {
    // 定义当前环境变量
    env,
    // 展开当前环境下的配置项，动态加载相应的环境配置
    ...EnvConfig[env],
    // 是否开启mock数据，用于前端开发时模拟后端数据
    //mock
    mock: false,
}