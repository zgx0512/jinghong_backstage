// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok?: boolean
}

// 每个用户的ts类型
export interface userResponseType {
  userId: number | string
  createTime?: string
  updateTime?: string
  username: string
  password?: string
  name?: string
  phone?: string | null
  role?: string[],
  email?: string | null
}
// 获取用户数据接口返回值的ts类型
export interface userInfoResponseType extends responseType {
  data: {
    records: userResponseType[]
    total: number
    size?: number
    orders?: []
    optimizeCountSql?: boolean
    hitCount?: boolean
    countId?: string | null
    maxLimit?: string | null
    searchCount?: boolean
    pages: number
  }
}
// 添加|修改用户接口返回值的ts类型
export interface addOrUpdateUserResponseType extends responseType {
  data: null
}
// 每个角色的ts类型
export interface roleResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null | string
}

// 根据用户请求角色数据的接口的返回值的ts类型
export interface roleInfoResponseType extends responseType {
  data: {
    assignRoles: roleResponseType[]
    allRolesList: roleResponseType[]
  }
}

// 分配角色的参数的ts类型
export interface roleVoResponseType {
  roleIdList: (number | string)[]
  userId: number | string
}
