interface responseType {
  code: number
  message: string
  ok?: boolean
}
// 每个按钮的ts类型
export interface btnResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  menuId?: number | string
  btnName?: string
  acl: string
}
// 获取菜单数据的接口的返回值的ts类型
export interface btnInfoResponseType extends responseType {
  data: btnResponseType[]
}

// 新增|修改|删除的接口的返回值的ts类型
export interface btnOperateResponseType extends responseType {
  data: null
}