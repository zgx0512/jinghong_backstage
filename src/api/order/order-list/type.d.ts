interface responseType {
  code: number
  message: string
  ok: boolean
}

// 订单流转状态ts类型
interface IOrderStatusLog {
  order_status: number;
  id: number;
  reason: string;
  order_id: string;
  c_user_id: number;
  create_time: string;
}

// 每笔订单的ts类型
interface OrderResponse {
  c_user_id: number
  order_id: string
  order_status: number
  after_sale_status: number
  goods_id: number
  goods_name: string
  goods_price: number
  goods_num: number
  goods_image: string
  spec: string
  min_group_price: number
  express_sn?: string
  express_code?: string
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
  order_status_log?: IOrderStatusLog[]
  transaction_id?: string
}

// 获取订单列表的ts类型
interface OrderListResponse extends responseType {
  data: {
    list: OrderResponse[]
    total: number
    page: number
    page_size: number
  }
}

interface ICheckpoint {
  content: string // 轨迹内容
  express_name?: string
  is_received: number
  op_time: string
  op_type: string
}

interface ExpressInfoResponse extends responseType {
  data: ICheckpoint[]
}
