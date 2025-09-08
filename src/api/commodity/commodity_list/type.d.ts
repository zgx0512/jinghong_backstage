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
interface saleAttrValueResponseType {
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
interface saleAttrResponseType {
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
interface imageResponseType {
  id?: number | string
  createTime?: string
  imgName?: string
  imgUrl?: string
  spuId?: number | string
  upadteTime?: string
  default?: boolean
}

interface ISku {
  sku_id?: number
  min_group_price: number | string // 最低价
  min_normal_price: number | string // 划线价
  is_default: number // 是否默认规格
  spec: {
    spec_id?: number | string
    spec_name: string
    spec_value: string
  }[]
}

// 每个商品的ts类型
interface GoodsResponseType {
  goods_id: number | string
  tm_id: string | string // 品牌ID
  goods_name: string
  min_normal_price?: number | string // 划线价
  min_group_price?: number | string // 最低价
  note?: string // 备注
  category_id?: number | string
  is_onsale: number // 上架状态
  is_delete?: number // 删除状态
  sales_num: number | string // 销量
  goods_thumbnail_url?: string // 商品主图
  image_list: string[]
  sku_list: ISku[]
  service_labels: string | number[]
  goods_labels: string | number[]
  delivery_promise_type: number
  create_time?: Date
  update_time?: Date
}

// 获取spu数据接口返回值的ts类型
interface GoodsInfoResponseType extends responseType {
  data: {
    goods_list?: GoodsResponseType[]
    total: number
    page: number
    page_size: number
  }
}
// 基础销售属性的ts类型
interface saleAttrResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  name?: string
}

// 获取基础销售属性接口返回值的ts类型
interface saleAttrInfoResponseType extends responseType {
  data: saleAttrResponseType[]
}

// 新增|修改|删除SPU的接口返回值的ts类型
interface nullResponseType extends responseType {
  data: null
}

// 获取spu图片接口返回值的ts类型
interface spuImageListResponseType extends responseType {
  data: imageResponseType[]
}
// sku商品属性的ts类型
interface skuAttrResponseType {
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
interface skuSaleAttrResponseType {
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
interface skuResponseType {
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
interface skuListResponseType extends responseType {
  data: skuResponseType[]
}

// 规格组的ts类型
interface skuGroupResponseType {
  uid?: number | string
  spec_id?: number | string | null
  spec_name?: string
  useSpecThumb: boolean
  customVisible: boolean
  list: {
    uid?: number | string
    spec_id?: number | string | null
    spec_value: string
    sku_thumb_url?: string
  }[]
}

// sku表格组的ts类型
interface skuTableResponseType {
  uid: number | string
  spec_name1: string
  spec_name2: string
  min_group_price: number | string
  min_normal_price: number | string
  out_sku_sn: string
  is_default: number
}

interface skuTableGroupResponseType {
  spec_id?: number | string
  id?: number | string
  spec_name: string
  spec_value: string
}

// 规格类型的ts类型
interface specResponseType {
  spec_id: number
  spec_name: string
  create_time: string
}

// 规格类型列表的ts类型
interface specListResponseType extends responseType {
  data: specResponseType[]
}
