import request from '~/utils/http/axios'

/**
 * 获取订单列表
 * @param params - 请求参数，包含查询条件
 * @returns 返回订单列表数据的Promise对象
 */
export const getOrderList = (params: any) => {
  return request.get<OrderListResponse, any>('/order-list', { params })
}
/**
 * 发送快递请求
 * @param data - 包含快递信息的数据对象
 * @param data.express_sn - 快递单号
 * @param data.order_id - 订单ID
 * @param data.express_code - 快递公司编码
 * @returns 返回请求结果
 */
export const reqSendExpress = (data: {
  express_sn: string
  order_id: string
  express_code: string
}) => {
  return request.post<nullResponseType, any>('/sendExpress', data)
}

/**
 * 获取快递详情信息
 * @param params - 查询参数对象
 * @param params.express_sn - 快递单号
 * @param params.express_code - 快递公司编码
 * @returns 返回快递详情信息的Promise对象
 */
export const reqExpressDetail = (params: {
  express_sn: string
  express_code: string
}) => {
  return request.get<ExpressInfoResponse, any>('/getExpressDetail', { params })
}
