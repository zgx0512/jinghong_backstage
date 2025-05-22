// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok: boolean
}

// 每个品牌的ts类型
export interface tmResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  tmName?: string
  logoUrl?: string
}

// 获取品牌数据接口返回值的ts类型
export interface tmInforResponseType extends responseType {
  data: {
    records: tmResponseType[]
    total: number
    size: number
    current: number
    orders?: []
    optimizeCountSql?: boolean
    hitCount?: boolean
    countId?: string | null
    maxLimit?: string | null
    searchCount?: boolean
    pages: number
  }
}

// 获取全部品牌数据接口返回值的ts类型
export interface tmListResponseType extends responseType {
  data: tmResponseType[]
}

// 删除品牌接口返回值的回调
export interface removeTmResponseType extends responseType {
    data: string | null
}