import request from '~/utils/http/axios'

import type { btnOperateResponseType } from './type'

export const addBtn = (data: any) => {
  return request.post<btnOperateResponseType>('/acl/addBtn', data)
}
