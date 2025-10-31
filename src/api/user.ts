import type { AxiosRequestConfig } from 'axios'
import request from '~/utils/http/axios'

enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/getUserInfo',
  LOGOUT_URL = '/logout'
}

// 登录接口
export function login(data: {}) {
  return request({
    url: API.LOGIN_URL,
    method: 'post',
    data
  })
}

// 获取用户信息接口
export const reqUserInfo = (config?: AxiosRequestConfig) => {
  return request.get<any, any>(API.USERINFO_URL, config)
}

// 退出登录接口
export const reqLogout = (config?: AxiosRequestConfig) => {
  return request.post<any, any>(API.LOGOUT_URL, undefined, config)
}
