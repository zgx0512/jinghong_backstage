import request from '~/utils/http/axios'
// 引入ts类型
import type {
  tmInforResponseType,
  tmResponseType,
  tmListResponseType,
  removeTmResponseType
} from './type'

// 获取品牌数据的接口
export const reqTrademarkInfo = (page: number, limit: number) => {
  return request.get<tmInforResponseType, any>(`/getTrademarkList?page=${page}&limit=${limit}`)
}

// 新增|修改品牌的接口
export const reqAddorUpdateTM = (data: tmResponseType) => {
  if (data.id) {
    // 是修改
    return request.put('/updateTrademark', data)
  } else {
    return request.post('/addTrademark', data)
  }
}

// 获取全部品牌数据的接口
export const reqTmList = () => {
    return request.get<tmListResponseType, any>('/getAllTrademarkList')
}

// 删除品牌的接口
export const reqRemoveTm = (id: number | string) => {
    return request.delete<removeTmResponseType, any>('/deleteTrademark/' + id)
}