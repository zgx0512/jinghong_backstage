<template>
  <el-card>
    <header class="flex items-center justify-between mb-4">
      <h2 class="font-bold text-[16px]">实时数据监控</h2>
      <div class="flex items-center gap-[16px]">
        <span>{{ currentTime }}</span>
        <el-button
          type="primary"
          size="small"
          class="pl-[20px] pr-[20px]"
          :loading="loading"
          @click="getRealTimeData()"
          >更新数据</el-button
        >
      </div>
    </header>
    <el-row :gutter="16" v-loading="loading">
      <el-col :span="12">
        <el-row class="flex gap-y-[16px] gap-x-[16px]">
          <!-- 今日实时数据 -->
          <el-col :span="7.9" class="data-card" v-for="item in realTimeData" :key="item.prop">
            <h3>{{ item.label }}</h3>
            <div class="num">{{ item.value }}</div>
            <div class="rate" :class="{ green: item.trend === 1, red: item.trend === 0 }">
              较于昨日此刻 {{ item.rate }}
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <h2 class="flex items-center gap-[4px]">
          <MoIcon icon-name="material-symbols:local-fire-department" style="color: #e83c3e" ; />
          <span class="font-bold text-[16px]">热销商品实时榜</span>
        </h2>
        <jh-table
          :data="tableList"
          :tableOptions="tableOptions"
          :tableProp="tableProp"
          :tableColumns="tableColumns"
          :showPagination="false"
        >
        </jh-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script lang="tsx" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import { reqRealTimeData } from '~/api/dashboard'
import { formatThousandSeparator } from '~/utils/formatThousandSeparator'

const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

let timer = setInterval(() => {
  currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}, 1000)
const loading = ref(true)
// trend 0 下降 1 上升或持平
const realTimeData = ref([
  {
    label: '今日实时订单数',
    prop: 'today_order_cnt',
    value: '0',
    rate_prop: 'order_ratio',
    rate: '0.00%',
    trend: 0
  },
  {
    label: '今日实时GMV',
    prop: 'today_order_amount',
    value: '0.00',
    rate_prop: 'order_amount_ratio',
    rate: '0.00%',
    trend: 0
  },
  {
    label: '今日实时退款订单数',
    prop: 'today_refund_order_cnt',
    value: '0',
    rate_prop: 'refund_order_ratio',
    rate: '0.00%',
    trend: 0
  },
  {
    label: '今日实时退款GMV',
    prop: 'today_refund_amount',
    value: '0.00',
    rate_prop: 'refund_amount_ratio',
    rate: '0.00%',
    trend: 0
  },
  {
    label: '今日实时客单价',
    prop: 'today_avg_order_price',
    value: '0.00',
    rate_prop: 'avg_order_price_ratio',
    rate: '0.00%',
    trend: 0
  },
  {
    label: '今日实时退款率',
    prop: 'today_refund_rate',
    value: '0.00%',
    rate_prop: 'refund_rate_ratio',
    rate: '0.00%',
    trend: 0
  }
])
const tableList = ref<OrderProductDatum[]>([])
const tableColumns = ref<JHTableColumnType[]>([])
const tableOptions = ref<JHTableOptionsType>({
  height: '267px'
})
// 表格的基础属性
const tableProp: JHTablePropType = {
  isSelect: false,
  index: true,
  isZh: true,
  title: '排名'
}
const initTable = () => {
  tableColumns.value = [
    {
      label: '商品名称',
      property: 'goods_name',
      width: '150px',
      fit: true,
      align: 'left'
    },
    {
      label: '今日销量',
      property: 'goods_num',
      width: '60px',
      fit: true,
      align: 'center'
    },
    {
      label: '趋势',
      property: 'sales_growth_rate',
      width: '80px',
      fit: true,
      align: 'center',
      component: {
        render(h: any, row: OrderProductDatum) {
          return (
            <div class={row.sales_growth_rate >= 0 ? 'trend green' : 'trend red'}>
              {(row.sales_growth_rate > 0 ? '⬆ ' : '⬇ ') + row.sales_growth_rate?.toFixed(2) + '%'}
            </div>
          )
        }
      }
    }
  ]
}
const getRealTimeData = async () => {
  try {
    loading.value = true
    const res: RealTimeDataResponseType = await reqRealTimeData()
    if (res.code === 200) {
      realTimeData.value.forEach((item) => {
        item.value = res.data[item.prop]
        if (item.prop === 'today_refund_rate') {
          item.value = (res.data[item.prop] * 100).toFixed(2) + '%'
        } else {
          item.value = formatThousandSeparator(item.value)
        }
        item.rate = res.data[item.rate_prop].toFixed(2) + '%'
        if (item.prop.includes('refund')) {
          item.trend = res.data[item.rate_prop] > 0 ? 0 : 1
        } else {
          item.trend = res.data[item.rate_prop] > 0 ? 1 : 0
        }
        if (item.prop.includes('amount')) {
          item.value = `¥${item.value}`
        }
      })
      tableList.value = res.data.orderProductData
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initTable()
  getRealTimeData()
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
<style lang="scss" scoped>
.data-card {
  width: 190px;
  background-color: var(--el-bg-color-page);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
  row-gap: 2px;
  border-radius: 8px;
  h3 {
    font-size: 12px;
    color: var(--el-text-color-regular);
  }
  .num {
    font-size: 20px;
    font-weight: 700;
  }
  .rate {
    font-size: 12px;
  }
  .green {
    color: #67c23a;
  }
  .red {
    color: #f56c6c;
  }
}
:deep(.jh-table) {
  min-width: 460px;
  .trend {
    display: block;
    border: 1px solid var(--el-border-color);
    padding: 2px 4px;
    border-radius: 20px;
  }
  .green {
    border-color: var(--el-color-success);
    background-color: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }
  .red {
    border-color: var(--el-color-danger);
    background-color: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }
}
</style>
