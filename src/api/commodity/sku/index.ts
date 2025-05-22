import request from '~/utils/http/axios'
// 引入ts类型
import { skuListResponseType, nullResponseType, skuInfoResponseType } from './type'
enum API {
  GETSKULIST_URL = '/admin/product/list/',
  ONSALESKU_URL = '/admin/product/onSale/',
  CANCELSALESKU_URL = '/admin/product/cancelSale/',
  GETSKUINFO_URL = '/admin/product/getSkuInfo/',
  REMOVESKU_URL = '/admin/product/deleteSku/'
}

// 获取sku列表的函数
export const reqSkuList = (page: number, limit: number) => {
  return request.get<skuListResponseType, any>(`${API.GETSKULIST_URL}${page}/${limit}`)
}

// 上架sku的接口
export const reqOnSaleSku = (id: number | string) => {
  return request.get<nullResponseType, any>(API.ONSALESKU_URL + id)
}

// 下架sku的接口
export const reqCancelSaleSku = (id: number | string) => {
  return request.get<nullResponseType, any>(API.CANCELSALESKU_URL + id)
}

// 获取sku详情的接口
export const reqSkuInfo = (id: number | string) => {
  return request.get<skuInfoResponseType, any>(API.GETSKUINFO_URL + id)
}

// 删除sku的接口
export const reqRemoveSku = (id: number | string) => {
    return request.delete<nullResponseType, any>(API.REMOVESKU_URL + id)
}