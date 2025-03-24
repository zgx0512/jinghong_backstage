import request from '~/utils/http/axios'
// 引入ts类型
import type {
  userInfoResponseType,
  userResponseType,
  addOrUpdateUserResponseType,
  roleInfoResponseType,
  roleVoResponseType
} from './type'

enum API {
  USERINFO_URL = '/getUserList',
  BATCHREMOVEUSER_URL = '/batchDeleteUser',
  REMOVEUSER_URL = '/deleteUser',
  ADDUSER_URL = '/addUser',
  UPDATEUSER_URL = '/updateUser',
  GETROLEINFO_URL = '/admin/acl/user/toAssign/',
  ASSIGNROLE_URL = '/admin/acl/user/doAssignRole'
}

// 获取用户数据的接口
export const reqUserInfo = (page: number, limit: number, username: string) => {
  return request.get<userInfoResponseType, any>(
    `${API.USERINFO_URL}?page=${page}&pageSize=${limit}&username=${username}`
  )
}

// 批量删除用户的接口
export const reqBatchRemoveUser = (idList: number[]) => {
  return request({
    url: API.BATCHREMOVEUSER_URL,
    method: 'delete',
    data: idList
  })
}

// 根据id删除单个用户的接口
export const reqRemoveUser = (id: number) => {
  return request.delete<any, any>(API.REMOVEUSER_URL + '/' + id)
}

// 添加|编辑用户的接口
export const reqAddOrUpdateUser = (user: userResponseType) => {
  if (user.userId) {
    // 是编辑
    return request.put<addOrUpdateUserResponseType, any>(API.UPDATEUSER_URL, user)
  } else {
    // 是添加
    return request.post<addOrUpdateUserResponseType, any>(API.ADDUSER_URL, user)
  }
}

// 根据用户得到角色数据
export const reqRoleInfo = (adminId: number | string) => {
  return request.get<roleInfoResponseType, any>(API.GETROLEINFO_URL + adminId)
}

// 分配角色的接口
export const reqAssignRole = (data: roleVoResponseType) => {
    return request.post(API.ASSIGNROLE_URL, data)
}
