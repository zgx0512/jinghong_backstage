/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2024-01-08 16:42:44
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-11 19:04:39
 * @FilePath: \taopinhui_vue3\src\api\product\spu\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '~/utils/http/axios'

enum API {
  SPUIMAGELIST_URL = '/admin/product/spuImageList/',
  SPUSALEATTRLIST_URL = '/admin/product/spuSaleAttrList/',
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  FINDBYSPUID_URL = '/admin/product/findBySpuId/',
  UPDATESKU_URL = '/admin/product/updateSkuInfo'
}

// 获取商品列表数据的接口
export const reqCommodityList = (page: number, limit: number, category3Id: number | string) => {
  return request.get<GoodsInfoResponseType, any>(
    `/getGoodsList?page=${page}&limit=${limit}&category_id=${category3Id}`
  )
}

// 新增|编辑商品的接口
export const reqAddOrUpdateGoods = (data: GoodsResponseType) => {
  if (data.goods_id) {
    // 存在，是修改
    return request.post<nullResponseType, any>("/updateGoods", data)
  } else {
    return request.post<nullResponseType, any>("/createGoods", data)
  }
}

// 获取spu图片的接口
export const reqSpuImageList = (id: number | string) => {
  return request.get<spuImageListResponseType, any>(API.SPUIMAGELIST_URL + id)
}

// 获取spu已有销售属性的接口
export const reqSpuSaleAttrList = (id: number | string) => {
  return request.get<saleAttrInfoResponseType, any>(API.SPUSALEATTRLIST_URL + id)
}

// 新增|修改sku的接口
export const reqAddSkuInfo = (data: any) => {
  if (data.id) {
    // 有id，是修改
    return request.post<nullResponseType, any>(API.UPDATESKU_URL, data)
  } else {
    return request.post<nullResponseType, any>(API.ADDSKU_URL, data)
  }
}

// 根据GoodsId查找对应的sku列表
export const reqSkuListByGoodsId = (id: number | string) => {
  return request.get<skuListResponseType, any>(`/getGoodsSkuList?goods_id=${id}`)
}

// 删除spu的接口
export const reqRemoveCommodity = (id: number | string) => {
  return request.delete<nullResponseType, any>(`/deleteGoods/${id}`)
}

// 获取规格类型列表的接口
export const reqSpecList = () => {
  return request.get<specListResponseType, any>('/getSpecList')
}

// 新增规格类型的接口
export const reqAddSpec = (data: any) => {
  return request.post<nullResponseType, any>('/addSpec', data)
}

// 获取商品详情
export const reqGoodsDetail = (goods_id: number | string) => {
  return request.get<GoodsResponseType, any>(`/getGoodsDetail?goods_id=${goods_id}`)
}
