// 共有的ts类型
interface responseType {
  code: number
  message: string
  ok?: boolean
}
// 每个菜单的ts类型
export interface permissionResponseType {
  id?: number | string
  createTime?: string
  updateTime?: string
  parentId?: string | number
  name?: string
  path?: string | null
  toCode?: string | null
  type?: string
  status?: string | null
  level?: number
  children?: permissionResponseType[]
  select?: boolean
  icon?: string
  acl?: string
  menuId?: string | number
}
// 获取菜单数据的接口的返回值的ts类型
export interface permissionInfoResponseType extends responseType {
  data: permissionResponseType[]
}
// 删除菜单接口返回值的ts类型
export interface removeResponseType extends responseType {
  data: null | string
}
