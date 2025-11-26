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
    label: '已取消',
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
    label: "订单状态",
    value: 'order_status',
    type: 'select',
    options: [...ORDER_STATUS_LIST]
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
        default_value: [], // Array.from({ length: 2 }, () => dayjs().format('YYYY-MM-DD'))
        options: []
      },
      {
        label: '支付时间',
        value: 'pay_time',
        type: 'daterange',
        default_value: [], // Array.from({ length: 2 }, () => dayjs().format('YYYY-MM-DD'))
        options: []
      }
    ]
  }
]

// 目前支持的快递公司
export const LOGISTICS_COMPANY = [
  { label: "顺丰速运", value: "shunfeng", phone: "95338" },
  { label: "申通快递", value: "shentong", phone: "95543" },
  { label: "圆通快递", value: "yuantong", phone: "95554" },
  { label: "中通快递", value: "zhongtong", phone: "95311" },
  { label: "韵达快递", value: "yunda", phone: "95546" },
  { label: "EMS", value: "ems", phone: "11183" },
  { label: "京东物流", value: "jd", phone: "950616" },
  { label: "极兔速递", value: "jtexpress", phone: "400-820-8383" },
];

