/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2024-01-08 16:42:47
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-11 12:17:40
 * @FilePath: \taopinhui_vue3\src\api\product\spu\type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok: boolean
}

// 基础销售属性值的ts类型
export interface saleAttrValueResponseType {
  baseSaleAttrId?: number | string
  creatTime?: string
  id?: string | number
  isChecked?: string
  saleAttrName?: string
  saleAttrValueName?: string
  spuId?: number | string
  updateTime?: string
}

// 基础销售属性的ts类型
export interface saleAttrResponseType {
  baseSaleAttrId?: number | string
  creatTime?: string
  id?: string | number
  saleAttrName?: string
  spuId?: number | string
  spuSaleAttrValueList?: saleAttrValueResponseType[]
  updateTime?: string
  inputVisible?: boolean
  inputValue?: string
}

// 图片的ts类型
export interface imageResponseType {
    id?: number | string
    createTime?: string
    imgName?: string
    imgUrl?: string
    spuId?: number | string
    upadteTime?: string
    default?: boolean
}

// 每个spu的ts类型
export interface spuResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  spuName: string
  description?: string
  category3Id?: string | number
  tmId?: number | string
  spuSaleAttrList?: saleAttrResponseType[] | null
  spuImageList?: imageResponseType[] | null
  spuPosterList?: imageResponseType[] | null
}

// 获取spu数据接口返回值的ts类型
export interface spuInfoResponseType extends responseType {
  data: {
    records?: spuResponseType[]
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
// 基础销售属性的ts类型
export interface saleAttrResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  name?: string
}

// 获取基础销售属性接口返回值的ts类型
export interface saleAttrInfoResponseType extends responseType {
  data: saleAttrResponseType[]
}

// 新增|修改|删除SPU的接口返回值的ts类型
export interface nullResponseType extends responseType {
    data: null
}

// 获取spu图片接口返回值的ts类型
export interface spuImageListResponseType extends responseType {
  data: imageResponseType[]
}
// sku商品属性的ts类型
export interface skuAttrResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  attrId?: number | string
  valueId?: number | string
  skuId?: number | string
  attrName?: string
  valueName?: string
}
// sku基础属性的ts类型
export interface skuSaleAttrResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  skuId?: number | string
  spuId?: number | string
  saleAttrValueId?: number | string
  saleAttrId?: number | string
  saleAttrName?: string
  saleAttrValueName?: string
}
// 每个sku的ts类型
export interface skuResponseType {
  id?: number | string
  creatTime?: string
  updateTime?: string
  spuId: number | string
  price?: number | string
  skuName: string
  skuDesc?: string
  weight?: string
  tmId?: number | string
  category3Id?: number | string
  skuDefaultImg?: string
  isSale?: number
  skuImageList?: imageResponseType[] | null
  skuAttrValueList?: skuAttrResponseType[] | null
  skuSaleAttrValueList?: skuSaleAttrResponseType[] | null
}

// 根据spuId获取sku列表接口返回值的ts类型
export interface skuListResponseType extends responseType {
  data: skuResponseType[]
}