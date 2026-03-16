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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <shipmentDialog ref="shipmentDialogRef" @refresh="retGetList(page_info.page)" />
  </div>
</template>

<script setup lang="tsx">
defineOptions({
  name: 'OrderList'
})
import { ref, onMounted, onBeforeMount } from 'vue'
import { FILTER_CONFIGS, ORDER_STATUS_MAP, AFTER_SALE_STATUS_MAP, LOGISTICS_COMPANY } from './const'
import { getOrderList, reqExpressDetail } from '~/api/order/order-list'
import shipmentDialog from './components/shipment-dialog.vue'
import LogisticsTrack from '~/components/logistics-track/index.vue'
import { useRouter } from 'vue-router'
import { permissionBtn } from '~/utils/permissionBtn'

const router = useRouter()

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
          const courierName =
            LOGISTICS_COMPANY.find((item) => item.value === row.express_code)?.label || ''
          if ([3, 4, 5].includes(row.order_status)) {
            // 待收货，待评价，已完成需可以展示出来物流信息
            return (
              <el-popover
                trigger="click"
                placement="left"
                width="360"
                v-slots={{
                  reference: () => {
                    return (
                      <div
                        class="order-status"
                        onClick={() => {
                          getExpressDetail(row)
                        }}
                      >{`${ORDER_STATUS_MAP[row.order_status]} >`}</div>
                    )
                  },
                  default: () => {
                    return (
                      <LogisticsTrack
                        courierName={courierName}
                        trackingNumber={row.express_sn}
                        trackList={expressInfo.value}
                        loading={expressLoading.value}
                      />
                    )
                  }
                }}
                onHide={() => {
                  expressInfo.value = []
                  expressLoading.value = false
                }}
              ></el-popover>
            )
          }
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
          const currentHide = recipientHideStates.value.get(row.order_id)
          const { recipient_name, recipient_phone, full_address } = row
          return (
            <div>
              <div class="recipient-info">
                <div class="recipient-name">
                  {(recipient_name && currentHide ? hideNickName(recipient_name) : recipient_name) || '--'}
                </div>
                <div class="recipient-phone">
                  {(recipient_phone && currentHide ? hidePhone(recipient_phone) : recipient_phone) || '--'}
                </div>
                <mo-icon
                  iconName={currentHide ? 'tabler:eye-closed' : 'tabler:eye'}
                  style="cursor: pointer;"
                  onClick={() => {
                    recipientHideStates.value.set(row.order_id, !currentHide)
                  }}
                />
              </div>
              <el-tooltip
                placement="top"
                effect="light"
                disabled={currentHide || !full_address}
                v-slots={{
                  content: () => <div>{full_address}</div>
                }}
              >
                <div class="recipient-address">
                  {(full_address && currentHide ? hideAddress(full_address) : full_address) || '--'}
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
      width: '142px',
      fixed: 'right',
      component: {
        render(h: any, row: OrderResponse) {
          const viewOrder = permissionBtn('Open-Order')
          const Shipment = permissionBtn('Shipment-Order')
          if (!viewOrder && !Shipment) {
            return <div>--</div>
          }
          return (
            <div class="action-btns">
              {viewOrder && (
                <el-button
                  type="primary"
                  size="small"
                  text
                  onClick={() => {
                    viewOrderDetail(row)
                  }}
                >
                  查看详情
                </el-button>
              )}
              {/* 待发货出现发货按钮 */}
              {Shipment && Number(row.order_status) === 2 && (
                <el-button
                  type="primary"
                  size="small"
                  text
                  onClick={() => {
                    openShipmentDialog(row)
                  }}
                >
                  发货
                </el-button>
              )}
            </div>
          )
        }
      }
    }
  ]
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

const recipientHideStates = ref<Map<string, boolean>>(new Map())
// 获取列表
const getList = async () => {
  try {
    const params = getParams()
    const res: OrderListResponse = await getOrderList(params)
    const { data } = res
    tableList.value = data.list.map((item: OrderResponse) => {
      const orderItem = {
        ...item,
        full_address: mergeAddress(item)
      }
      if (!recipientHideStates.value.has(item.order_id)) {
        recipientHideStates.value.set(item.order_id, true)
      }
      return orderItem
    })

    page_info.value.page = data.page
    page_info.value.total = data.total
    page_info.value.limit = data.page_size
  } catch (error) {
    console.log(error)
  }
}

function viewOrderDetail(row: OrderResponse) {
  // 跳转到订单详情页面
  router.push({
    path: '/order/order-detail',
    query: {
      order_id: row.order_id
    }
  })
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
  return '*'.repeat(40)
}

// 重置数据
const retGetList = (page = 1) => {
  page_info.value.page = page
  getList()
}

const changeFilter = () => {
  retGetList()
}

const shipmentDialogRef = ref()
const openShipmentDialog = (row: OrderResponse) => {
  shipmentDialogRef.value.open(row)
}

const expressInfo = ref<ICheckpoint[]>([])
const expressLoading = ref(false)
// 获取物流信息
const getExpressDetail = async (row: OrderResponse) => {
  try {
    expressLoading.value = true
    const params = {
      express_sn: row.express_sn as string,
      express_code: row.express_code as string
    }
    const res = await reqExpressDetail(params)
    if (res.code === 200) {
      const { data } = res
      expressInfo.value = data
    }
  } catch (error) {
    console.log(error)
  } finally {
    expressLoading.value = false
  }
}

const handleSizeChange = (page_size: number) => {
  page_info.value.limit = page_size
  getList()
}

const handleCurrentChange = (page: number = 1) => {
  page_info.value.page = page
  getList()
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
  width: calc(100% - 20px);
  margin: 10px;
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
        color: var(--el-text-color-secondary);
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
  .action-btns {
    .el-button {
      margin-left: 0px;
    }
  }
  .order-status {
    color: var(--el-color-warning);
    cursor: pointer;
  }
}
</style>
