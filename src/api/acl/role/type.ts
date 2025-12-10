// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok?: boolean
}

// 每个角色的ts类型
export interface roleResponseType {
  id: number | string;
  roleName: string;
  permissions?: number[];
  role_ids?: number[];
  createTime?: Date;
  updateTime?: Date;
}

// 获取角色列表数据的接口返回值的ts类型
export interface roleInfoResponseType extends responseType {
  data: {
    roleList: roleResponseType[]
    total: number
    page: number
    pageSize: number
  }
}

// 分配权限参数的ts类型
export interface permissionVoReponseType {
  permissions: number[]
  roleId: number
  halfPermissions: number[]
}
