// 共有的ts类型
interface responseType {
    code: number
    message: string
    ok: boolean
}

// 每个角色的ts类型
export interface roleResponseType {
    id?: number | string
    createTime?: string
    updateTime?: string
    roleName: string
    remark?: string | null
}

// 获取角色列表数据的接口返回值的ts类型
export interface roleInfoResponseType extends responseType {
  data: {
    records: roleResponseType[]
    total: number
    size: number
    current: number
    orders?: []
    optimizeCountSql?: boolean
    hitCount?: boolean
    countId?: string | null
    maxLimit?: string | null
    searchCount?: boolean
    pages: number
  }
}

// 分配权限参数的ts类型
export interface permissionVoReponseType {
  permissionIdList: number[]
  roleId: number
}