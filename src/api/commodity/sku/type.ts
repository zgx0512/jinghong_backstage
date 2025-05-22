// 引入sku的ts类型
import { skuResponseType } from '../commodity_list/type'
interface responseType {
  code: number
  message: string
  ok: boolean
}

// 获取sku列表接口返回值的ts类型
export interface skuListResponseType extends responseType {
  data: {
    records: skuResponseType[]
    total: number
    size: number
    current: number
    orders?: []
    optimizeCountSql?: boolean
    hitCount?: boolean
    countId?: string | null
    maxLimit?: null
    searchCount?: boolean
    pages: number
  }
}
// 返回空的接口的ts类型
export interface nullResponseType extends responseType {
    data: null
}

// 获取sku详情接口返回值的ts类型
export interface skuInfoResponseType extends responseType {
  data: skuResponseType
}
