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
  GETROLEINFO_URL = '/getRoleInfo',
  ASSIGNROLE_URL = '/assignRoles'
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
/**
 * 获取用户角色信息
 * @param userId 用户ID，可以是数字或字符串类型
 * @returns 返回一个Promise，解析为角色信息响应数据
 */
export const reqRoleInfo = (userId: number | string) => { // 定义获取角色信息的请求函数
  return request.get<roleInfoResponseType, any>(`${API.GETROLEINFO_URL}?userId=${userId}`)
}

// 分配角色的接口
export const reqAssignRole = (data: roleVoResponseType) => {
  return request.post<addOrUpdateUserResponseType, any>(API.ASSIGNROLE_URL, data)
}
