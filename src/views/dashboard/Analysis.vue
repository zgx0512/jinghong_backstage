<template>
  <div class="analysis-container">
    <div class="data-overview">
      <div class="flex justify-between items-center h-full w-full mb-4">
        <h1 class="font-bold text-[16px]">数据概览</h1>
        <HeaderFilter ref="doHeaderFilterRef" @changeFilter="getDataOverview()" />
      </div>
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
    <el-row class="mt-4">
      <el-col :span="24">
        <el-card><TrendAanalysisChart /></el-card>
      </el-col>
    </el-row>
    <RealTimeMonitor class="mt-4" />
    <el-row class="mt-4">
      <el-col :span="24">
        <el-card><CategorySalesChart /></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Analysis">
import { onMounted, ref } from 'vue'
import CountCard from './components/CountCard.vue'
import HeaderFilter from './components/headerFilter.vue'
import TrendAanalysisChart from './components/TrendAanalysisChart.vue'
import CategorySalesChart from './components/CategorySalesChart.vue'
import RealTimeMonitor from './components/RealTimeMonitor.vue'
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
onMounted(() => {
  getDataOverview()
})
</script>
<style lang="scss" scoped>
.analysis-container {
  padding: 10px;
  .data-overview {
    border: 1px solid var(--el-border-color-light);
    padding: 16px;
    border-radius: 4px;
  }
}
</style>
