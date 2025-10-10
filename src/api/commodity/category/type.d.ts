// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok: boolean
}

// 每个分类的ts类型
interface categoryResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  name?: string
  level?: number
  parentId?: number | string | null
  children?: categoryResponseType[]
}

// 获取商品分类接口返回值的ts类型
interface categoryInfoResponseType extends responseType {
  data: categoryResponseType[]
}

interface categoryAddParamsType extends responseType {
  data: null
}
