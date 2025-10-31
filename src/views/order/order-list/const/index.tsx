import dayjs from 'dayjs'
import { ElImage, ElTooltip } from 'element-plus'

// 售后状态列表
export const AFTER_SALE_STATUS_LIST = [
  {
    label: '无售后',
    value: 1
  },
  {
    label: '售后中',
    value: 2
  },
  {
    label: '售后完成',
    value: 3
  },
  {
    label: '售后关闭',
    value: 4
  }
]
// 根据售后状态列表生成对应的MAP对象
export const AFTER_SALE_STATUS_MAP = AFTER_SALE_STATUS_LIST.reduce(
  (acc: { [key: number]: string }, cur) => {
    acc[cur.value] = cur.label
    return acc
  },
  {}
)

// 订单状态列表
export const ORDER_STATUS_LIST = [
  {
    label: '待付款',
    value: 1
  },
  {
    label: '待发货',
    value: 2
  },
  {
    label: '待收货',
    value: 3
  },
  {
    label: '待评价',
    value: 4
  },
  {
    label: '已完成',
    value: 5
  },
  {
    label: '售后中',
    value: 6
  }
]

// 根据订单状态列表生成对应的MAP对象
export const ORDER_STATUS_MAP = ORDER_STATUS_LIST.reduce((acc: { [key: number]: string }, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})

export const FILTER_CONFIGS: filterConfigType[] = [
  {
    label: '订单号',
    value: 'order_id',
    type: 'input',
    placeholder: '请输入订单号'
  },
  {
    label: '售后状态',
    value: 'after_sale_status',
    type: 'select',
    options: [...AFTER_SALE_STATUS_LIST]
  },
  {
    type: 'compound',
    value: 'goods',
    compound_key: 'goods',
    children: [
      {
        label: '商品',
        value: 'goods',
        type: 'input',
        placeholder: '请输入商品ID或名称'
      },
      {
        label: '商品规格',
        value: 'spec',
        type: 'input',
        placeholder: '请输入商品规格'
      }
    ]
  },
  {
    type: 'compound',
    value: 'receiver_name',
    compound_key: 'receiver_name',
    children: [
      {
        label: '收件人名称',
        value: 'receiver_name',
        type: 'input',
        placeholder: '请输入收件人名称'
      },
      {
        label: '收件人电话',
        value: 'receiver_phone',
        type: 'input',
        placeholder: '请输入收件人电话'
      }
    ]
  },
  {
    type: 'input',
    label: '快递单号',
    value: 'express_no',
    placeholder: '请输入快递单号'
  },
  {
    type: 'compound',
    value: 'create_time',
    compound_key: 'create_time',
    children: [
      {
        label: '下单时间',
        value: 'create_time',
        type: 'daterange',
        default_value: Array.from({ length: 2 }, () => dayjs().format('YYYY-MM-DD')),
        options: []
      },
      {
        label: '支付时间',
        value: 'pay_time',
        type: 'daterange',
        default_value: Array.from({ length: 2 }, () => dayjs().format('YYYY-MM-DD')),
        options: []
      }
    ]
  }
]

export const TABLE_COLUMNS = [
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
              <ElImage
                class="goods-img"
                src={row.goods_image}
                preview-src-list={[row.goods_image]}
                preview-teleported
              />
            )}
            <ElTooltip
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
            </ElTooltip>

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
    width: '340px',
    component: {
      render(h: any, row: OrderResponse) {
        const { recipient_name, recipient_phone, full_address } = row
        return (
          <div class="recipient-info">
            <div>
              <div class="recipient-name">{recipient_name || '--'}</div>
              <div class="recipient-phone">{recipient_phone || '--'}</div>
            </div>
            <div class="recipient-address">{full_address || '--'}</div>
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
  }
]
