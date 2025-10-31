/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-07-16 05:52:36
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-14 20:18:20
 * @FilePath: \taopinhui_vue3\src\store\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'
import { login, reqUserInfo, reqLogout } from '~/api/user'
import { UserInfo } from '~/types/index'
import { setToken, clearToken, getToken } from '~/utils/token'
import { constantRoutes, routeModuleList, lastRoutes } from '~/router'
import { RouteRecordRaw } from 'vue-router'
import router from '~/router'
export const useUserStore = defineStore('userStore', () => {
  let permiss = ref(['btn_more', 'btn-edit', 'btn-delelte'])
  // 用户信息
  const userInfo = ref({
    avatar: '',
    username: '',
    buttons: []
  })
  // token
  const token = ref<string>(getToken() as string)
  let asyncRoutes: RouteRecordRaw[] = []

  // 用户登录
  async function userLogin(param: UserInfo) {
    const res: any = await login({
      email: param.email,
      password: param.password
    })
    if (res.code === 200) {
      // 请求成功
      // 将token存储起来
      token.value = res.data
      setToken(res.data)
      return {
        bool: true,
        message: '登录成功'
      }
    }
    return {
      bool: false,
      message: res.message
    }
  }
  // 递归函数 --- 获取用户所拥有的菜单权限
  const getAsyncRoutes = (routesList: RouteRecordRaw[], routes: string[]) => {
    return routesList.filter((item) => {
      const res = routes.some(
        (item1: string) => item1.toLowerCase() === (item.name as string).toLowerCase()
      )
      if (res) {
        // 有权限，在判断子路由是否有权限
        if (item.children && item.children.length > 0) {
          item.children = getAsyncRoutes(item.children, routes)
        }
        return true
      } else {
        return false
      }
    })
  }
  // 获取用户信息
  const getUserInfo = async () => {
    const source = axios.CancelToken.source()
    const timeoutId = window.setTimeout(() => {
      source.cancel('getUserInfo timeout')
    }, 800)

    const config: AxiosRequestConfig = {
      cancelToken: source.token,
      timeout: 1000
    }

    let result
    try {
      result = await reqUserInfo(config)
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        throw new Error('fetch user info timeout')
      }
      throw error
    } finally {
      window.clearTimeout(timeoutId)
    }

    if (result.code === 200) {
      // 请求成功
      userInfo.value.avatar = result.data.avatar
      userInfo.value.username = result.data.username
      userInfo.value.buttons = result.data.buttons
      // 每次进来，都将routes复原回只有同步路由跟404路由
      // router.options.routes = [...constantRoutes, ...lastRoutes]
      // asyncRoutes = getAsyncRoutes(routeModuleList, result.data.routes)
      // asyncRoutes.forEach((routes) => {
      //   router.addRoute(routes)
      //   if (!router.options.routes.some((item) => item.name === routes.name)) {
      //     router.options.routes = router.options.routes.concat(routes)
      //   }
      // })
      return 'ok'
    }
    return Promise.reject(new Error(''))
  }

  // 退出登录
  async function userLogout() {
    try {
      await reqLogout()
    } catch (error) {
      // ignore logout failure, proceed with local cleanup
    }
    userInfo.value.avatar = ''
    userInfo.value.username = ''
    permiss.value = []
    clearToken()
    token.value = ''
    location.reload()
    return 'ok'
  }
  return {
    permiss,
    userInfo,
    token,
    asyncRoutes,
    userLogin,
    userLogout,
    getUserInfo
  }
})
