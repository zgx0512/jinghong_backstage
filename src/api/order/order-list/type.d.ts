interface responseType {
  code: number
  message: string
  ok: boolean
}

// 每笔订单的ts类型
interface OrderResponse {
  c_user_id: number
  order_id: number
  order_status: number
  after_sale_status: number
  goods_id: number
  goods_name: string
  goods_price: number
  goods_num: number
  goods_image: string
  spec: string
  min_group_price: number
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  recipient_county: string
  recipient_city: string
  recipient_province: string
  recipient_postal_code: string
  create_time: string
  pay_time: string
  full_address?: string
  hide?: boolean
}

// 获取订单列表的ts类型
interface OrderListResponse extends responseType {
  data: OrderResponse[]
  total: number
  page: number
  page_size: number
}
