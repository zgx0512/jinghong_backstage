// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok: boolean
}
// 每个属性值的ts类型
export interface attrValueResponseType {
  id?: number | string
  createTime?: string | null
  updateTime?: string | null
  valueName?: string
  attrId?: number | string 
  isEdit?: boolean
}
// 每个属性的ts类型
export interface attrReponseType {
  id?: number | string
  createTime?: string | null
  updateTime?: string | null
  attrName?: string
  categoryId?: number | string
  categoryLevel?: number
  attrValueList: attrValueResponseType[]
}

// 获取商品基础属性接口返回值的ts类型
export interface attrInfoResponse extends responseType {
  data: attrReponseType[]
}
