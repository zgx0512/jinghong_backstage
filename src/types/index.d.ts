export interface SelectOptionItem {
  value: string
  label: string
}

export interface UserInfo {
  email: string
  username?: string
  password?: string
  role?: string
  permiss?: []
  routes?: []
}
