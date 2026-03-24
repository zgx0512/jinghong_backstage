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
