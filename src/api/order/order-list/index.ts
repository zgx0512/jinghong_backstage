import request from '~/utils/http/axios'

export const getOrderList = (params: any) => {
  return request.get('/order-list', { params })
}
