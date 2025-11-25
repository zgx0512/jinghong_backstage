<template>
  <div class="order-detail" v-loading="loading">
    <div class="order-detail-header">
      <span>订单明细 / </span>
      <h4>订单详情</h4>
    </div>
    <el-card class="order-info-crad">
      <header class="order-info-crad-header">
        <h4>订单信息</h4>
        <div class="order-id">
          <span>订单号: {{ orderInfo?.order_id || '--' }}</span>
          <el-button link size="small" type="primary">复制</el-button>
        </div>
        <div class="wx-pay-id">
          <span>微信支付订单号: {{ orderInfo?.transaction_id || '--' }}</span>
          <el-button link size="small" type="primary">复制</el-button>
        </div>
      </header>
      <el-timeline class="order-status-log">
        <el-timeline-item
          v-for="(order_status, index) in orderInfo?.order_status_log"
          :key="order_status.id"
          type="primary"
          hollow
        >
          <template #default>
            <div class="order-status-log-item">
              <div class="timeline-item-content">
                <div class="reason">{{ order_status.reason }}</div>
                <div
                  v-show="index < orderInfo!.order_status_log!.length - 1"
                  class="timeline-line"
                ></div>
              </div>
              <div class="time">{{ order_status.create_time }}</div>
            </div>
          </template>
        </el-timeline-item>
      </el-timeline>
      <jh-table
        :tableColumns="tableColumns"
        :tableOptions="tableOptions"
        :data="tableList"
        :tableProp="tableProp"
        :showPagination="false"
      ></jh-table>
    </el-card>
    <el-card class="express-info-crad">
      <h4>物流信息</h4>
      <div class="express-info">
        <div class="express-info-left">
          <div class="express-info-left-item">
            <h5>收货信息</h5>
            <div class="express-info-left-item-content">
              <div class="content-item">
                <div class="label">收货人：</div>
                <div class="value">
                  {{
                    orderInfo?.recipient_name
                      ? hide
                        ? hideNickName(orderInfo?.recipient_name)
                        : orderInfo?.recipient_name
                      : '--'
                  }}
                </div>
                <mo-icon
                  :iconName="hide ? 'tabler:eye-closed' : 'tabler:eye'"
                  style="cursor: pointer; margin-left: 20px; margin-top: 2px;"
                  @click="changeShow"
                />
              </div>
              <div class="content-item">
                <div class="label">手机号：</div>
                <div class="value">
                  {{
                    orderInfo?.recipient_phone
                      ? hide
                        ? hidePhone(orderInfo?.recipient_phone)
                        : orderInfo?.recipient_phone
                      : '--'
                  }}
                </div>
              </div>
              <div class="content-item">
                <div class="label">收货地址：</div>
                <div class="value">
                  {{
                    orderInfo?.full_address
                      ? hide
                        ? hideAddress(orderInfo?.full_address)
                        : orderInfo?.full_address
                      : '--'
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="express-info-left-item">
            <h5>包裹信息</h5>
            <div class="express-info-left-item-content">
              <div class="content-item">
                <div class="label">物流公司：</div>
                <div class="value">{{ logisticsCompanyName }}</div>
              </div>
              <div class="content-item">
                <div class="label">物流单号：</div>
                <div class="value">{{ orderInfo?.express_sn || '--' }}</div>
              </div>
              <div class="content-item">
                <div class="label">快递电话：</div>
                <div class="value">{{ logisticsPhone }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="express-info-right">
          <h5>物流轨迹</h5>
          <timeline :records="expressInfo" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, computed } from 'vue'
import { LOGISTICS_COMPANY } from '../order-list/const'
import { reqOrderDetail, reqExpressDetail } from '~/api/order/order-list'
import timeline from '~/components/timeline/index.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const orderInfo = ref<OrderResponse>()

const tableColumns = ref<any[]>([])
const tableOptions = ref({
  height: 'auto',
  'max-height': '107px'
})
interface Goods {
  goods_id: number
  goods_name: string
  goods_image: string
  spec: string
  min_group_price: number
  goods_num: number
  goods_price: number
}
const tableList = ref<Goods[]>([])
const tableProp = {
  index: false,
  isZh: true
}
const initTable = () => {
  tableColumns.value = [
    {
      label: '商品',
      property: 'goods_name',
      width: '380px',
      fit: true,
      align: 'left',
      component: {
        render(h: any, row: Goods) {
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
            </div>
          )
        }
      }
    },
    {
      label: '单价',
      property: 'goods_price',
      width: '100px',
      align: 'center',
      component: {
        render(h: any, row: Goods) {
          return <div>￥{row.goods_price ? row.goods_price.toFixed(2) : '--'}</div>
        }
      }
    },
    {
      label: '件数',
      property: 'goods_num',
      width: '100px',
      align: 'center',
      component: {
        render(h: any, row: Goods) {
          return <div>{row.goods_num || '--'}</div>
        }
      }
    },
    {
      label: '实收金额',
      property: 'min_group_price',
      width: '100px',
      align: 'center',
      component: {
        render(h: any, row: Goods) {
          return (
            <div class="min-group-price">
              ￥{row.min_group_price ? row.min_group_price.toFixed(2) : '--'}
            </div>
          )
        }
      }
    }
  ]
}
// 合并地址
const mergeAddress = (row: OrderResponse) => {
  return `${row.recipient_province || ''}${row.recipient_city || ''}${row.recipient_county || ''}${
    row.recipient_address || ''
  }`
}
const loading = ref(false)
const getOrderDetail = async () => {
  try {
    loading.value = true
    const { order_id } = route.query
    const res = await reqOrderDetail({ order_id: order_id as string })

    if (res.code === 200) {
      orderInfo.value = res.data
      orderInfo.value!.full_address = mergeAddress(orderInfo.value!)
      tableList.value = [orderInfo.value].map((item) => ({
        goods_id: item!.goods_id,
        goods_name: item!.goods_name,
        goods_image: item!.goods_image,
        spec: item!.spec,
        min_group_price: item!.min_group_price,
        goods_num: item!.goods_num,
        goods_price: item!.goods_price
      }))
      // 获取物流信息
      await getExpressInfo()
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const expressInfo = ref<ICheckpoint[]>([])
const getExpressInfo = async () => {
  try {
    const data = {
      express_sn: 'SF3279318013134',
      express_code: 'shunfeng'
    }
    const res = await reqExpressDetail(data)
    if (res.code === 200) {
      expressInfo.value = res.data || []
    }
  } catch (error) {
    console.log(error)
  }
}
const logisticsCompany = ref([...LOGISTICS_COMPANY])
// 物流公司名称
const logisticsCompanyName = computed(() => {
  return (
    logisticsCompany.value.find((item) => item.value === orderInfo.value?.express_code)?.label ||
    '--'
  )
})
// 快递电话
const logisticsPhone = computed(() => {
  return (
    logisticsCompany.value.find((item) => item.value === orderInfo.value?.express_code)?.phone ||
    '--'
  )
})
const hide = ref(true)
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
const changeShow = () => {
  hide.value = !hide.value
}

onMounted(() => {
  initTable()
  getOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail {
  &-header {
    display: flex;
    align-items: center;
    color: var(--el-text-color-secondary);
    margin: 10px 0;
    margin-left: 10px;
    h4 {
      margin-left: 4px;
      color: var(--el-text-color-primary);
      font-weight: 700;
      font-size: 16px;
    }
  }
  .order-info-crad {
    margin: 0 10px;
    &-header {
      display: flex;
      align-items: center;
      color: var(--el-text-color-regular);
      h4 {
        margin-right: 10px;
        color: var(--el-text-color-primary);
        font-weight: 700;
        font-size: 16px;
      }
      .order-id {
        margin-top: 1px;
        margin-right: 100px;
        display: flex;
        align-items: center;
        span {
          margin-right: 8px;
        }
      }
      .wx-pay-id {
        margin-top: 1px;
        display: flex;
        align-items: center;
        span {
          margin-right: 8px;
        }
      }
    }
    .order-status-log {
      display: flex;
      padding-top: 20px;
      .el-timeline-item {
        :deep(.el-timeline-item__tail) {
          top: 4px;
          left: auto;
          border-left: none;
        }
        .order-status-log-item {
          .timeline-item-content {
            transform: translateX(-8px);
            display: flex;
            gap: 4px;
            align-items: center;
            margin-right: 4px;
          }
          .time {
            transform: translateX(-28px);
            color: var(--el-text-color-secondary);
          }
          .timeline-line {
            min-width: 150px;
            height: 2px;
            background-color: var(--el-border-color);
          }
        }
      }
    }
  }
  .express-info-crad {
    margin: 15px 10px 0 10px;
    h4 {
      color: var(--el-text-color-primary);
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .express-info {
      display: flex;
      font-size: 13px;
      &-left {
        display: flex;
        flex-direction: column;
        gap: 40px;
        border-right: 1px solid var(--el-border-color);
        padding-right: 50px;
        min-width: 500px;
        &-item {
          h5 {
            font-weight: 700;
            margin-bottom: 15px;
          }
          &-content {
            .content-item {
              display: flex;
              .label {
                font-weight: 700;
              }
            }
          }
        }
      }
      &-right {
        margin-left: 50px;
        flex: 1;
        max-height: 400px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        scrollbar-width: none;
        -ms-overflow-style: none;
        h5 {
          font-weight: 700;
          margin-bottom: 15px;
        }
      }
    }
  }
}
:deep(.jh-table-container) {
  margin: 0;
}
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
        color: var(--el-text-color-secondary);
      }
    }
  }
  .min-group-price {
    color: red;
  }
}
</style>
