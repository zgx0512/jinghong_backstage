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
export const reqUserInfo = () => {
  return request.get<any, any>(API.USERINFO_URL)
}

// 退出登录接口
export const reqLogout = () => {
  return request.post<any, any>(API.LOGOUT_URL)
}
