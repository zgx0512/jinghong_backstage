import request from '~/utils/http/axios'
import type { roleInfoResponseType, roleResponseType, permissionVoReponseType } from './type'
import type { permissionInfoResponseType } from '../permission/type'
enum API {
  ROLEINFO_URL = '/getRoleList',
  BATCHREMOVEROLE_URL = '/batchDeleteRole',
  REMOVE_URL = '/deleteRole/',
  ADDROLE_URL = '/addRole',
  UPDATEROLE_URL = '/updateRole',
  ASSIGNACL_URL = '/assignPermissions'
}

// 获取角色列表的接口
export const reqRoleInfo = (page: number, limit: number, roleName: string) => {
  return request.get<roleInfoResponseType, any>(
    `${API.ROLEINFO_URL}?page=${page}&limit=${limit}&roleName=${roleName}`
  )
}

// 批量删除角色列表的接口
export const reqBatchRemoveRole = (idList: (number | string)[]) => {
  return request({
    method: 'delete',
    url: API.BATCHREMOVEROLE_URL,
    data: idList
  })
}
// 删除单个角色的接口
export const reqRemoveRole = (id: number) => {
  return request.delete<any, any>(API.REMOVE_URL + id)
}

// 添加|修改角色的接口
export const reqAddOrUpdateRole = (data: roleResponseType) => {
  if (data.id) {
    // 有id，是修改角色
    return request({
      method: 'put',
      url: API.UPDATEROLE_URL,
      data
    })
  } else {
    // 没id，是添加角色
    return request({
      method: 'post',
      url: API.ADDROLE_URL,
      data
    })
  }
}

// 给角色分配权限的接口
export const reqAssignAcl = (data: permissionVoReponseType) => {
  return request({
    url: API.ASSIGNACL_URL,
    method: 'post',
    data
  })
}
