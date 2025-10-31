<template>
  <div>
    <page-filter ref="pageFilterRef" :filterConfigs="filterConfigs" :useFont12="true" />
    <jh-table
      :tableColumns="tableColumns"
      :tableOptions="tableOptions"
      :data="tableList"
      :tableProp="tableProp"
      :page_info="page_info"
    />
  </div>
</template>

<script setup lang="tsx">
defineOptions({
  name: 'OrderList'
})
import { ref, onMounted, onBeforeMount } from 'vue'
import { FILTER_CONFIGS, TABLE_COLUMNS } from './const'
import { getOrderList } from '~/api/order/order-list'

const filterConfigs = ref<filterConfigType[]>([])
const tableColumns = ref<any[]>([])
const initFilter = () => {
  filterConfigs.value = [...FILTER_CONFIGS]
}

const tableList = ref<OrderResponse[]>([])
// commodity表格基本属性
const tableProp = {
  index: false,
  isZh: true
}
const initTable = () => {
  tableColumns.value = [...TABLE_COLUMNS]
  tableColumns.value.push({
    label: '操作',
    property: 'action',
    width: '100px',
    component: {
      render(h: any, row: OrderResponse) {
        return (
          <div>
            <el-button
              type="primary"
              size="small"
              text
              vOnClick={() => {
                openDetail()
              }}
            >
              查看详情
            </el-button>
          </div>
        )
      }
    }
  })
}
const tableOptions = ref({
  height: 'auto'
})

const page_info = ref({
  page: 1,
  limit: 10,
  total: 0,
  page_sizes: [3, 5, 10, 20]
})
const pageFilterRef = ref()
const getParams = () => {
  const conditions = pageFilterRef.value.getConditions()
  return {
    ...conditions,
    page: page_info.value.page,
    limit: page_info.value.limit
  }
}
// 合并地址
const mergeAddress = (row: OrderResponse) => {
  return `${row.recipient_province || ''}${row.recipient_city || ''}${row.recipient_county || ''}${
    row.recipient_address || ''
  }`
}
// 获取列表
const getList = async () => {
  try {
    const params = getParams()
    const res = await getOrderList(params)
    const { data } = res
    tableList.value = data.list.map((item: OrderResponse) => ({
      ...item,
      full_address: mergeAddress(item)
    }))
    page_info.value.page = data.page
    page_info.value.total = data.total
    page_info.value.limit = data.page_size
  } catch (error) {
    console.log(error)
  }
}

function openDetail() {
  console.log('查看详情')
}

onBeforeMount(() => {
  initFilter()
  initTable()
})

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  margin: 10px !important;
  width: calc(100% - 20px);
  .goods-info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 280px;
    .goods-img {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
    }
    .goods-name {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        line-height: 16px;
      }
      .spec {
        color: #999;
      }
    }
    .goods-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
}
</style>
