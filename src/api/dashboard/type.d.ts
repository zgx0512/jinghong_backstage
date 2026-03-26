interface responseType {
  code: number
  message: string
  ok?: boolean
}

interface OverviewData {
  avg_order_price: number
  avg_order_price_growth_rate: number
  order_amount: number
  order_amount_growth_rate: number
  order_cnt: number
  order_cnt_growth_rate: number
  refund_amount: number
  refund_amount_growth_rate: number
  refund_order_cnt: number
  refund_order_cnt_growth_rate: number
  refund_rate: number
  refund_rate_growth_rate: number
  success_amount: number
  success_amount_growth_rate: number
  success_order_cnt: number
  success_order_cnt_growth_rate: number
  [property: string]: any
}

interface OverviewDataResponseType extends responseType {
  data: OverviewData
}

// 数据概览项的类型定义
interface OverviewItem {
  title: string
  prop: string
  count: number | string
  desc: string
  rate: string
  icon: string
  color: string
  trend?: number
}

interface TrendAnalysisData {
  avg_order_price: number
  order_amount: number
  order_cnt: number
  refund_amount: number
  refund_order_cnt: number
  refund_rate: number
  success_amount: number
  success_order_cnt: number
  [property: string]: any
}

interface TrendAnalysisResponseType extends responseType {
  data: {
    [key: string]: TrendAnalysisData
  }
}

interface CategorySales {
  category: number
  category_name: string
  order_cnt: number
  [property: string]: any
}

interface CategorySalesResponseType extends responseType {
  data: CategorySales[]
}

interface RealTimeData {
  avg_order_price_ratio: number
  order_amount_ratio: number
  order_ratio: number
  orderProductData: OrderProductDatum[]
  refund_amount_ratio: number
  refund_order_ratio: number
  refund_rate_ratio: number
  today_avg_order_price: number
  today_order_amount: number
  today_order_cnt: number
  today_refund_amount: number
  today_refund_order_cnt: number
  today_refund_rate: number
  [property: string]: any
}

interface OrderProductDatum {
  goods_id: number
  goods_name: string
  goods_num: number
  sales_growth_rate: number
  yesterday_goods_num: number
  [property: string]: any
}

interface RealTimeDataResponseType extends responseType {
  data: RealTimeData
}
