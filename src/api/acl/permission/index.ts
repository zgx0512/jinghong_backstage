import request from '~/utils/http/axios'
// 接口ts类型文件
import type { permissionResponseType, permissionInfoResponseType, removeResponseType } from './type'
enum API {
  MENULIST_URL = '/getMenuList',
  REMOVE_URL = '/admin/acl/permission/remove/',
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  UPDATEPERMISSION_URL = '/admin/acl/permission/update'
}

// 获取菜单数据的接口
export const reqPermissionInfo = () => {
  return request.get<permissionInfoResponseType, any>(API.MENULIST_URL)
}

// 递归删除菜单的接口
export const reqRemovePermission = (id: number | string) => {
  return request.delete<removeResponseType, any>(API.REMOVE_URL + id)
}

// 新增|修改菜单的接口
export const reqAddOrUpdatePermission = (permission: permissionResponseType) => {
  if (permission.id) {
    // 存在，是修改
    return request.put(API.UPDATEPERMISSION_URL, permission)
  } else {
    // 不存在，是新增
    return request.post(API.ADDPERMISSION_URL, permission)
  }
}
