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
  const buttons = ref([])
  const defaultRoute = ref<string>('')
  const defaultMenuName = ref<string>('')
  // 用户信息
  const userInfo = ref({
    avatar: '',
    username: ''
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
  // 递归函数 --- 根据后端树形菜单顺序，生成用户所拥有的路由
  const getAsyncRoutes = (routesList: RouteRecordRaw[], menuTree: any[]): RouteRecordRaw[] => {
    const result: RouteRecordRaw[] = []

    const travel = (nodes: any[], availableRoutes: RouteRecordRaw[]) => {
      nodes.forEach((node: any) => {
        const acl = (node.acl || node.name || '').toLowerCase()
        if (!acl) return

        const matched = availableRoutes.find((route) => {
          const routeName = (route.name as string | undefined) || ''
          return routeName.toLowerCase() === acl
        })

        if (!matched) return

        const routeCopy: RouteRecordRaw = { ...matched }

        if (
          node.children &&
          node.children.length > 0 &&
          matched.children &&
          matched.children.length > 0
        ) {
          routeCopy.children = getAsyncRoutes(matched.children, node.children)
        } else {
          routeCopy.children = []
        }

        result.push(routeCopy)
      })
    }

    travel(menuTree, routesList)

    return result
  }
  // 获取用户信息
  const getUserInfo = async () => {
    const source = axios.CancelToken.source()
    const timeoutId = window.setTimeout(() => {
      source.cancel('getUserInfo timeout')
    }, 5000)

    const config: AxiosRequestConfig = {
      cancelToken: source.token,
      timeout: 5000
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
      buttons.value = result.data.btnAclList
      defaultRoute.value = result.data.defaultRoute
      defaultMenuName.value = result.data.defaultMenuName
      // 每次进来，都将routes复原回只有同步路由跟404路由
      router.options.routes = [...constantRoutes, ...lastRoutes]
      asyncRoutes = getAsyncRoutes(routeModuleList, result.data.menuList)

      // 优化路由添加逻辑，批量处理
      const existingRouteNames = new Set(router.options.routes.map((r) => r.name))
      const newRoutes: RouteRecordRaw[] = []

      asyncRoutes.forEach((routes) => {
        router.addRoute(routes)
        if (!existingRouteNames.has(routes.name)) {
          newRoutes.push(routes)
        }
      })

      if (newRoutes.length > 0) {
        router.options.routes = [...router.options.routes, ...newRoutes]
      }
      if (defaultRoute.value) {
        router.push({ path: defaultRoute.value })
      } else {
        router.push({ path: '/403' })
      }
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
    buttons.value = []
    clearToken()
    token.value = ''
    location.reload()
    return 'ok'
  }
  return {
    buttons,
    userInfo,
    token,
    asyncRoutes,
    userLogin,
    userLogout,
    getUserInfo,
    defaultRoute,
    defaultMenuName
  }
})
