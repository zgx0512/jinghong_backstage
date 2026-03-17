<template>
  <div class="container">
    <div>
      <headerFilter ref="doHeaderFilterRef" @changeFilter="getDataOverview()" />
      <el-row :gutter="16" v-loading="dataOverviewLoading" class="flex gap-y-4">
        <el-col :span="6" v-for="(item, index) in cardData"
          ><CountCard
            :title="item.title"
            :desc="item.desc"
            :count="item.count"
            :rate="item.rate"
            :icon="item.icon"
            :color="item.color"
            :trend="item.trend as number"
          />
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="16" class="mt-4">
      <el-col :span="8"
        ><el-card><PieChart /></el-card
      ></el-col>
      <el-col :span="8"
        ><el-card><MyEchart :options="options3" style="height: 300px"></MyEchart></el-card
      ></el-col>
      <el-col :span="8"
        ><el-card><MyEchart :options="options4" style="height: 300px"></MyEchart></el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Analysis">
import { onMounted, reactive, ref } from 'vue'
import PieChart from './components/PieChart.vue'
import CountCard from './components/CountCard.vue'
import headerFilter from './components/headerFilter.vue'
import { reqDataOverview } from '~/api/dashboard'

// trend 1 上升  2 下降
const cardData = ref<OverviewItem[]>([
  {
    title: '订单数',
    prop: 'order_cnt',
    count: 0,
    desc: '支付订单总数',
    rate: '',
    icon: 'ep-ice-cream',
    color: 'orange'
  },
  {
    title: '订单金额',
    prop: 'order_amount',
    count: 0,
    desc: '支付订单总金额',
    rate: '',
    icon: 'ep-lollipop',
    color: 'blue'
  },
  {
    title: '平均客单价',
    prop: 'avg_order_price',
    count: 0,
    desc: '订单总金额/订单总数',
    rate: '',
    icon: 'ep-coffee-cup',
    color: 'indigo'
  },
  {
    title: '成交订单数',
    prop: 'success_order_cnt',
    count: 0,
    desc: '剔除退款订单后的订单数',
    rate: '',
    icon: 'ep-watermelon',
    color: 'purple'
  },
  {
    title: '成交金额',
    prop: 'success_amount',
    count: 0,
    desc: '剔除退款订单后的订单金额',
    rate: '',
    icon: 'ep-watermelon',
    color: 'purple'
  },
  {
    title: '退款订单数',
    prop: 'refund_order_cnt',
    count: 0,
    desc: '退款订单总数',
    rate: '',
    icon: 'ep-watermelon',
    color: 'purple'
  },
  {
    title: '退款订单金额',
    prop: 'refund_amount',
    count: 0,
    desc: '退款订单总金额',
    rate: '',
    icon: 'ep-watermelon',
    color: 'purple'
  },
  {
    title: '退款率',
    prop: 'refund_rate',
    count: 0,
    desc: '退款订单总数',
    rate: '',
    icon: 'ep-watermelon',
    color: 'purple'
  }
])
const dataOverviewLoading = ref(false)
const doHeaderFilterRef = ref()
// 获取数据概览
const getDataOverview = async () => {
  try {
    dataOverviewLoading.value = true
    const conditions = doHeaderFilterRef.value.getConditions()
    const params = {
      start_date: conditions.date[0],
      end_date: conditions.date[1]
    }
    const res: OverviewDataResponseType = await reqDataOverview(params)
    if (res.code === 200) {
      const { data } = res
      cardData.value.forEach((item) => {
        item.count =
          item.prop === 'refund_rate'
            ? (data[item.prop] * 100).toFixed(2) + '%'
            : Number(data[item.prop].toFixed(2))
        item.rate = (data[item.prop + '_growth_rate'] * 100).toFixed(2) + '%'
        if (item.prop.includes('refund')) {
          item.trend = data[item.prop + '_growth_rate'] < 0 ? 1 : 2
        } else {
          item.trend = data[item.prop + '_growth_rate'] > 0 ? 1 : 2
        }
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    dataOverviewLoading.value = false
  }
}

const options3 = reactive({
  title: {
    text: '访问趋势',
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
})

const options4 = reactive({
  title: {
    text: '访问趋势',
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: ['用户数', '订单数', '商品数', '品牌数']
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: true
    }
  },
  series: [
    {
      data: [50, 260, 150, 40],
      type: 'bar'
    }
  ]
})
onMounted(() => {
  getDataOverview()
})
</script>
