<template>
    <!-- 使用el-row组件来布局首页，设置gutter属性为20以定义列之间的间距 -->
    <el-row class="home" :gutter="20">
        <!--左侧区域,因为一共24分栏，这里设置8/24，所以占比1/3 -->
        <el-col :span="8" style="margin-top: 10px">
            <el-card shadow="hover">
                <div class="user">
                    <img :src="getImageUrl('user')" class="user">
                    <div class="user-info">
                        <p class="user-info-admin">Admin</p>
                        <p class="user-info-p">超级管理员</p>
                    </div>
                    </img>
                </div>
                <div class="login-info">
                    <p>上次登录时间：<span>2024-12-28</span></p>
                    <p>上次登录地点：<span>宁波</span></p>
                </div>
            </el-card>

            <el-card shadow="hover" class="user-table">
                <!-- 当 el-table 元素中注入 data 对象数组后，
                在 el-table-column 中用 prop 属性来对应对象中的键名即可填入数据，
                用 label 属性来定义表格的列名。 -->
                <el-table :data="tableData">
                    <el-table-column 
                        v-for="(val, key) in tableLabel" 
                        :key="key" 
                        :prop="key" 
                        :label="val" 
                    />
                </el-table>
            </el-card>    
        </el-col>
        <!-- 右侧区域,占比2/3 -->
        <el-col :span="16" style="margin-top: 10px">
            <!-- 右上订单情况 -->
            <div class="num">
                <el-card 
                    :body-style="{display:'flex', padding:0}" 
                    v-for="item in countData" 
                    :key="item.name"
                >
                    <component :is="item.icon" class="icons" :style="{background: item.color}"></component>
                    <div class="detail">
                        <p class="num">¥{{ item.value }}</p>
                        <p class="txt">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>

            <el-card class="top-echart">
                <div ref="echart" style="height: 280px;"></div>
            </el-card>

            <div class="graph">
                <el-card>
                    <div ref="userEchart" style="height: 240px"></div>
                </el-card>
                <el-card>
                    <div ref="videoEchart" style="height: 240px"></div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script setup>
import {ref, getCurrentInstance, onMounted, reactive} from 'vue'
import * as echarts from 'echarts'
import { debounce } from 'lodash';
const getImageUrl = (user) => {
    return new URL(`../assets/images/${user}.png`, import.meta.url).href
}
const tableData = ref([])
const countData = ref([])
const chartData = ref([])
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})
// 获取当前 Vue 组件实例，并解构出 proxy 对象
// proxy 对象可以用来访问组件的响应式数据和方法
const { proxy } = getCurrentInstance()
onMounted(()=>{
    getTableData(),
    getCountData(),
    getChartData()
})
// 首页左下表格数据
const getTableData = async ()=>{
   const data =  await proxy.$api.getTableData()
   tableData.value = data.tableData
}
// 首页右上数据
const getCountData = async ()=>{
    const data =  await proxy.$api.getCountData()
    countData.value = data
}
//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
        // 图例文字颜色
        textStyle: {
            color: "#333",
        },
        legend: {},
        grid: {
            left: "20%",
        },
        // 提示框
        tooltip: {
            trigger: "axis",
        },
        xAxis: {
            type: "category", // 类目轴
            data: [],
            axisLine: {
            lineStyle: {
                color: "#17b3a3",
            },
            },
            axisLabel: {
            interval: 0,
            color: "#333",
            },
        },
        yAxis: [
            {
            type: "value",
            axisLine: {
                lineStyle: {
                color: "#17b3a3",
                },
            },
            },
        ],
        color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
        series: [],
})

const pieOptions = reactive({
    tooltip: {
        trigger: "item",
    },
    legend: {},
    color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf",
    ],
    series: []
})
// observer 接收观察器实例对象
const observer = ref(null)
//请求图表数据并渲染的方法
const getChartData = async () => {
    const {orderData,userData,videoData} = await proxy.$api.getChartData()
    //对第一个图表的xAxis和series赋值
    xOptions.xAxis.data=orderData.date
    xOptions.series = Object.keys(orderData.data[0]).map(val=>({
        name:val,
        data:orderData.data.map(item=>item[val]),
        type: "line"
    }))
    //one echarts.init方法初始化ECharts实例，需要传入dom对象
    const OneEcharts = echarts.init(proxy.$refs["echart"])
    //setOption方法应用配置对象
    OneEcharts.setOption(xOptions)
        
    //对第二个图表的xAxis和series赋值
    xOptions.xAxis.data = userData.map((item) => item.date)
    xOptions.series = [
     {
        name: "新增用户",
        data: userData.map((item) => item.new),
        type: "bar",
     },
     {
        name: "活跃用户",
        data: userData.map((item) => item.active),
        type: "bar",
     }]
    //two
    const TwoEcharts = echarts.init(proxy.$refs["userEchart"])
    TwoEcharts.setOption(xOptions)
        
    //对第三个图表(饼图)的series赋值
    pieOptions.series = [
        {
        data: videoData,
        type: "pie",
        },
    ]
    //three
    const ThreeEcharts = echarts.init(proxy.$refs["videoEchart"])
    ThreeEcharts.setOption(pieOptions);


    // 使用lodash库的防抖debounce函数创建一个防抖后的函数resizeDebounced
    // 其作用是当在短时间内多次触发时，只执行最后一次触发的逻辑，避免频繁执行图表resize操作
    // 这里设置延迟时间为200毫秒，可根据实际情况调整合适的值，以平衡图表响应窗口大小变化的及时性和性能
    const resizeDebounced = debounce(() => {
        // 分别调用各个图表实例的resize方法，使图表根据当前容器大小重新调整
        OneEcharts.resize();
        TwoEcharts.resize();
        ThreeEcharts.resize();
    }, 200);
    // 创建ResizeObserver实例，用于监听图表所在容器的大小变化
    observer.value = new ResizeObserver(() => {
        // 当容器大小变化时，调用防抖后的函数resizeDebounced，从而控制图表resize操作的执行频率
        resizeDebounced();
    });

    // 如果这个容器存在（即图表对应的DOM元素存在）
    if (proxy.$refs["echart"]) {
        // 则调用监视器的observe方法，开始监视这个容器的大小变化
        observer.value.observe(proxy.$refs["echart"]);
    }
}
</script>



<style scoped lang="less">
    .home{
        height: 100%;
        // overflow: hidden;//滚动条
        .user{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ccc;
            margin-bottom: 20px;
            img{
                width: 150px;
                height: 150px;
                border-radius: 50%;
                margin-right: 40px;
            }
            .user-info{          
                p{
                    line-height: 40px;
                }
                .user-info-admin{
                    font-size: 35px;
                }
                .user-info-p{
                    color: #999;
                }
            }
        }
        .login-info{
            p{
                line-height: 30px;
                font-size: 14px;
                color: #999;
                span{
                    color: #666;
                    margin-left: 60px;
                }
            }
        }
    }
    .user-table{
        margin-top: 20px;
    }
    .num{
        display: flex;
        flex-wrap: wrap;// 允许 flex 项目在必要时换行显示
        justify-content: space-between;// 设置Flex容器的子元素在主轴方向上的对齐方式为“两端对齐”
        .el-card{
            width: 32%;
            margin-bottom: 20px;
        }
        .icons{
            width: 80px;
            height: 80px;
            font-size: 30px;
            text-align: center;
            line-height: 80px;
            color: #fff;
        }
        .detail{
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .num{
                font-size: 30px;
                margin-bottom: 10px;
            }
            .txt{
                font-size: 15px;
                text-align: center;
            }
        } 
    } 
    .graph{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .el-card{
            width: 48%;
            height: 260px;
        }
    }  
</style>
