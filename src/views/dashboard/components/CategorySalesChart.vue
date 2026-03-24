<template>
  <div>
    <div class="flex justify-between items-center h-full w-full">
      <h1 class="font-bold text-[16px]">商品类目销售分布</h1>
      <HeaderFilter ref="headerFilterRef" @changeFilter="getCategorySales()" />
    </div>
    <MyEchart
      v-if="categorySalesData.length > 0"
      style="height: 340px"
      v-loading="loading"
      :options="options"
    />
    <div v-else class="w-[100%] h-[400px] flex items-center justify-center">暂无数据</div>
  </div>
</template>
<script lang="ts" setup>
import MyEchart from '~/components/echarts/MyEchart.vue'
import HeaderFilter from './headerFilter.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { reqCategorySales } from '~/api/dashboard'

const headerFilterRef = ref<InstanceType<typeof HeaderFilter>>()
const loading = ref(false)
const categorySalesData = ref<CategorySales[]>([])
const themeObserver = ref<MutationObserver | null>(null)

const getCssVarValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const syncThemeColors = () => {
  const textColor = getCssVarValue('--el-text-color-primary')

  options.value.legend.textStyle.color = textColor
  options.value.series[0].emphasis.label.color = textColor
}
// 获取折线图数据
const getCategorySales = async () => {
  try {
    loading.value = true
    const conditions = headerFilterRef.value?.getConditions()
    const res: CategorySalesResponseType = await reqCategorySales({
      start_date: conditions!.date[0],
      end_date: conditions!.date[1]
    })
    if (res.code === 200) {
      categorySalesData.value = res.data
      setOptions()
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const options = ref({
  legend: {
    left: 'center',
    top: 'bottom',
    textStyle: {
      color: 'var(--el-text-color-primary)',
      fontSize: '14px',
      fontWeight: '600'
    }
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      padAngle: 2,
      data: [] as { name: string; value: number }[],
      itemStyle: {
        borderRadius: 10,
        borderColor: 'transparent'
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          color: 'var(--el-text-color-primary)',
          formatter: (params: any) => {
            return `{name|${params.name}}\n{percent|${params.percent}%}`
          },
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 22
            },
            percent: {
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 28
            }
          }
        }
      },
      labelLine: {
        show: false
      }
    }
  ]
})
const setOptions = () => {
  options.value.series[0].data = categorySalesData.value.map((item) => ({
    value: item.order_cnt,
    name: item.category_name
  }))
}
onMounted(() => {
  syncThemeColors()
  themeObserver.value = new MutationObserver(syncThemeColors)
  themeObserver.value.observe(document.documentElement, {
    attributes: true, // 监听变化
    attributeFilter: ['class', 'style'] // 只监听class和style
  })
  getCategorySales()
})

onBeforeUnmount(() => {
  themeObserver.value?.disconnect()
  themeObserver.value = null
})
</script>
<style lang="scss" scoped></style>
