<template>
  <div>
    <div class="flex justify-between items-center h-full w-full">
      <h1 class="font-bold text-[16px]">趋势分析</h1>
      <HeaderFilter ref="headerFilterRef" @changeFilter="getTrendAnalysis()" />
    </div>
    <!-- 两个指标的选择 -->
    <div class="flex items-center justify-center gap-x-4 mt-4">
      <div class="w-[20px] h-[15px] bg-[#91c0fc] rounded-[3px]"></div>
      <el-select
        v-model="leftIndicator"
        placeholder="请选择指标"
        class="w-[160px]"
        @change="changeIndicator"
      >
        <el-option
          v-for="item in trendAanalysisDataArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="w-[20px] h-[15px] bg-[#fab256] rounded-[3px]"></div>
      <el-select
        v-model="rightIndicator"
        placeholder="请选择指标"
        class="w-[160px]"
        @change="changeIndicator"
      >
        <el-option
          v-for="item in trendAanalysisDataArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <MyEchart v-if="Object.keys(trendAanalysisData).length > 0" style="height: 400px" v-loading="loading" :options="options" />
    <div v-else class="w-[100%] h-[400px] flex items-center justify-center">暂无数据</div>
  </div>
</template>
<script lang="ts" setup>
import MyEchart from '~/components/echarts/MyEchart.vue'
import HeaderFilter from './headerFilter.vue'
import { onMounted, ref } from 'vue'
import { reqTrendAnalysis } from '~/api/dashboard'

// 指标对应的数组
const trendAanalysisDataArr = [
  { label: '订单数', value: 'order_cnt' },
  { label: '订单金额', value: 'order_amount' },
  { label: '平均客单价', value: 'avg_order_price' },
  { label: '成交订单数', value: 'success_order_cnt' },
  { label: '成交金额', value: 'success_amount' },
  { label: '退款订单数', value: 'refund_order_cnt' },
  { label: '退款订单金额', value: 'refund_amount' },
  { label: '退款率', value: 'refund_rate' }
]
const trendAanalysisMap = trendAanalysisDataArr.reduce<Record<string, string>>((acc, cur) => {
  acc[cur.value as string] = cur.label
  return acc
}, {})
// 默认折线图展示的两个指标
const leftIndicator = ref('order_cnt')
const rightIndicator = ref('order_amount')

const headerFilterRef = ref<InstanceType<typeof HeaderFilter>>()
const loading = ref(false)
const trendAanalysisData = ref<{ [key: string]: TrendAnalysisData }>({})
// 获取折线图数据
const getTrendAnalysis = async () => {
  try {
    loading.value = true
    const conditions = headerFilterRef.value?.getConditions()
    const res: TrendAnalysisResponseType = await reqTrendAnalysis({
      start_date: conditions!.date[0],
      end_date: conditions!.date[1]
    })
    if (res.code === 200) {
      trendAanalysisData.value = res.data
      setOptions()
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const options = ref({
  tooltip: {
    renderMode: 'html',
    trigger: 'axis', // 触发类型，'axis'表示坐标轴触发
    backgroundColor: 'var(--el-bg-color-overlay)',
    borderColor: 'var(--el-border-color-light)',
    textStyle: {
      color: 'var(--el-text-color-primary)'
    },
    axisPointer: {
      type: 'line' // 指示器类型
    },
    formatter: function (params: any) {
      // 自定义提示框内容
      let result = params[0].axisValue + '<br/>' // 显示X轴的值
      params.forEach((param: any) => {
        result +=
          param.marker +
          ' ' +
          param.seriesName +
          ': ' +
          (param.seriesName === '退款率' ? `${param.value}%` : param.value) +
          '<br/>'
      })
      return result
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [] as string[],
    boundaryGap: false
  },
  yAxis: [
    {
      type: 'value',
      name: '',
      position: 'left',
      axisLine: {
        show: true
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '',
      position: 'right',
      axisLine: {
        show: true
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '',
      type: 'line',
      smooth: true, // 折线变平滑处理
      yAxisIndex: 0,
      lineStyle: {
        color: '#91c0fc'
      },
      itemStyle: {
        color: '#91c0fc' // 设置数据点的颜色
      },
      data: [] as number[]
    },
    {
      name: '',
      type: 'line',
      smooth: true, // 折线变平滑处理
      yAxisIndex: 1,
      lineStyle: {
        color: '#fab256'
      },
      itemStyle: {
        color: '#fab256' // 设置数据点的颜色
      },
      data: [] as number[]
    }
  ]
})
const setOptions = () => {
  options.value.xAxis.data = Object.keys(trendAanalysisData.value)
  options.value.yAxis[0].name = trendAanalysisMap[leftIndicator.value]
  options.value.yAxis[1].name = trendAanalysisMap[rightIndicator.value]
  options.value.series[0].name = trendAanalysisMap[leftIndicator.value]
  if (leftIndicator.value === 'refund_rate') {
    options.value.series[0].data = Object.values(trendAanalysisData.value).map(
      (item) => Number(item[leftIndicator.value]) * 100
    ) as number[]
    options.value.yAxis[0].axisLabel = {
      formatter: '{value}%'
    }
  } else {
    options.value.series[0].data = Object.values(trendAanalysisData.value).map((item) =>
      Number(item[leftIndicator.value])
    ) as number[]
    options.value.yAxis[0].axisLabel = {
      formatter: '{value}'
    }
  }
  options.value.series[1].name = trendAanalysisMap[rightIndicator.value]
  if (rightIndicator.value === 'refund_rate') {
    options.value.series[1].data = Object.values(trendAanalysisData.value).map(
      (item) => Number(item[rightIndicator.value]) * 100
    ) as number[]
    options.value.yAxis[1].axisLabel = {
      formatter: '{value}%'
    }
  } else {
    options.value.series[1].data = Object.values(trendAanalysisData.value).map((item) =>
      Number(item[rightIndicator.value])
    ) as number[]
    options.value.yAxis[1].axisLabel = {
      formatter: '{value}'
    }
  }
}
const changeIndicator = () => {
  setOptions()
}
onMounted(() => {
  getTrendAnalysis()
})
</script>
<style lang="scss" scoped></style>
