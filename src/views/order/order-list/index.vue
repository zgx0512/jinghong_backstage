<template>
  <div>
    <page-filter
      ref="pageFilterRef"
      :filterConfigs="filterConfigs"
      :useFont12="true"
      @change="changeFilter"
    />
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
import { FILTER_CONFIGS, ORDER_STATUS_MAP, AFTER_SALE_STATUS_MAP } from './const'
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
  tableColumns.value = [
    {
      label: '订单号',
      property: 'order_id',
      width: '180px',
      component: {
        render(h: any, row: OrderResponse) {
          return <div>{row.order_id || '--'}</div>
        }
      }
    },
    {
      label: '商品',
      property: 'goods_name',
      width: '380px',
      fit: true,
      align: 'left',
      component: {
        render(h: any, row: OrderResponse) {
          return (
            <div class="goods-info">
              {row.goods_image && (
                <el-image
                  class="goods-img"
                  src={row.goods_image}
                  preview-src-list={[row.goods_image]}
                  preview-teleported
                />
              )}
              <el-tooltip
                placement="top"
                effect="light"
                v-slots={{
                  content: () => (
                    <div>
                      <div>商品名称: {row.goods_name || '--'}</div>
                      <div>商品ID: {row.goods_id || '--'}</div>
                    </div>
                  )
                }}
              >
                <div class="goods-name">
                  <span>{row.goods_name || '--'}</span>
                  <span>{row.goods_id || '--'}</span>
                  <span class="spec">{row.spec || '--'}</span>
                </div>
              </el-tooltip>

              <div class="goods-price">
                <span>￥{row.goods_price || '--'}</span>
                <span>x{row.goods_num || '--'}</span>
              </div>
            </div>
          )
        }
      }
    },
    {
      label: '订单状态',
      property: 'order_status',
      width: '100px',
      component: {
        render(h: any, row: OrderResponse) {
          return <div>{ORDER_STATUS_MAP[row.order_status] || '--'}</div>
        }
      }
    },
    {
      label: '售后状态',
      property: 'after_sale_status',
      width: '100px',
      component: {
        render(h: any, row: OrderResponse) {
          return <div>{AFTER_SALE_STATUS_MAP[row.after_sale_status] || '--'}</div>
        }
      }
    },
    {
      label: '实收金额(元)',
      property: 'pay_amount',
      width: '100px',
      component: {
        render(h: any, row: OrderResponse) {
          return <div>{row.min_group_price || '--'}</div>
        }
      }
    },
    {
      label: '收件人',
      property: 'recipient-info',
      width: '240px',
      component: {
        render(h: any, row: OrderResponse) {
          const { recipient_name, recipient_phone, full_address, hide } = row
          return (
            <div>
              <div class="recipient-info">
                <div class="recipient-name">
                  {(recipient_name && hide ? hideNickName(recipient_name) : recipient_name) || '--'}
                </div>
                <div class="recipient-phone">
                  {(recipient_phone && hide ? hidePhone(recipient_phone) : recipient_phone) || '--'}
                </div>
                <mo-icon
                  iconName={hide ? 'tabler:eye-closed' : 'tabler:eye'}
                  style="cursor: pointer;"
                  onClick={() => {
                    row.hide = !hide
                  }}
                />
              </div>
              <el-tooltip
                placement="top"
                effect="light"
                disabled={hide || !full_address}
                v-slots={{
                  content: () => <div>{full_address}</div>
                }}
              >
                <div class="recipient-address">
                  {(full_address && hide ? hideAddress(full_address) : full_address) || '--'}
                </div>
              </el-tooltip>
            </div>
          )
        }
      }
    },
    {
      label: '下单时间',
      property: 'create_time',
      width: '160px',
      component: {
        render(h: any, row: OrderResponse) {
          return <div>{row.create_time || '--'}</div>
        }
      }
    },
    {
      label: '支付时间',
      property: 'pay_time',
      width: '160px',
      component: {
        render(h: any, row: OrderResponse) {
          return <div>{row.pay_time || '--'}</div>
        }
      }
    },
    {
      label: '操作',
      property: 'action',
      width: '100px',
      fixed: 'right',
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
    }
  ]
}
const tableOptions = ref({
  height: 'auto',
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
  if (Object.prototype.hasOwnProperty.call(conditions, 'create_time')) {
    conditions.create_time = conditions.create_time ? conditions.create_time.join(',') : ''
  }
  if (Object.prototype.hasOwnProperty.call(conditions, 'pay_time')) {
    conditions.pay_time = conditions.pay_time ? conditions.pay_time.join(',') : ''
  }
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
      full_address: mergeAddress(item),
      hide: true
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

// 隐藏昵称
const hideNickName = (nickName: string) => {
  if (!nickName || nickName.length === 0) return nickName
  if (nickName.length === 1) return nickName

  const firstChar = nickName.charAt(0)
  const stars = '*'.repeat(nickName.length - 1)
  return firstChar + stars
}

// 隐藏手机号
const hidePhone = (phone: string) => {
  if (!phone) return phone
  const s = String(phone)

  // 手机号：显示前3位和后4位，中间用*
  if (/^\d{11}$/.test(s)) {
    return s.slice(0, 3) + '*'.repeat(11 - 3 - 4) + s.slice(-4)
  }

  // 座机号：保留'-'，显示前4位数字，其余数字用*
  let result = ''
  let digitCount = 0
  for (const ch of s) {
    if (/\d/.test(ch)) {
      if (digitCount < 4) {
        result += ch
      } else {
        result += '*'
      }
      digitCount++
    } else if (ch === '-') {
      result += '-'
    } else {
      // 其他字符原样保留（如空格、括号等）
      result += ch
    }
  }
  return result
}

// 隐藏地址
const hideAddress = (address: string) => {
  if (!address) return address
  return '*'.repeat(20)
}

// 重置数据
const retGetList = (page = 1) => {
  page_info.value.page = page
  getList()
}

const changeFilter = () => {
  retGetList()
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
:deep(.jh-table) {
  width: calc(100%);
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
  .recipient-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .recipient-address {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
