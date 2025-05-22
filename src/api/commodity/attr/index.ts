import request from '~/utils/http/axios'
// 引入ts类型
import type { attrInfoResponse, attrReponseType } from './type'
enum API {
  ATTRINFO_URL = '/admin/product/attrInfoList/',
  SAVEATTRINFO_URL = '/admin/product/saveAttrInfo',
  REMOVEATTR_URL = '/admin/product/deleteAttr/'
}

// 获取商品基础属性的接口
export const reqAttrInfo = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string
) => {
  return request.get<attrInfoResponse, any>(
    `${API.ATTRINFO_URL}${category1Id}/${category2Id}/${category3Id}`
  )
}

// 添加|修改属性的接口
export const reqSaveAttrInfo = (data: attrReponseType) => {
  return request.post(API.SAVEATTRINFO_URL, data)
}

// 删除属性的接口
export const reqRemoveAttr = (id: number | string) => {
  return request.delete(API.REMOVEATTR_URL + id)
}
