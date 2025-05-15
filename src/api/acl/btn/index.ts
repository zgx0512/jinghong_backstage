import request from '~/utils/http/axios'

import type { btnOperateResponseType } from './type'

// 新增权限按钮
export const addBtn = (data: any) => {
  return request.post<btnOperateResponseType, any>('/acl/addBtn', data)
}

// 更新权限按钮
export const updateBtn = (data: any) => {
  return request.put<btnOperateResponseType, any>('/acl/updateBtn', data)
}

// 删除权限按钮
export const removeBtn = (id: number | string) => {
  return request.delete<btnOperateResponseType, any>('/acl/removeBtn/' + id)
}