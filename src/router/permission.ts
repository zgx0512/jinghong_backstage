import router from '~/router'
import { useUserStore } from '~/store/user'
import pinia from '~/store'
import { clearToken } from '~/utils/token'
import { RouteRecordRaw } from 'vue-router'

// 实例化路由对象
const userStore = useUserStore(pinia)
// 解构出user仓库中函数跟对象
const { userInfo, getUserInfo } = userStore

router.beforeEach(async (to, from, next) => {
  if (userStore.token) {
    // 有token，已登录状态
    if (to.path === '/login') {
      next(userStore.defaultRoute)
    } else {
      if (userInfo.avatar === '' && userInfo.username === '') {
        // 头像跟名称为空，重新发送获取用户信息的请求
        try {
          await getUserInfo()
          next({ ...to, replace: true })
        } catch (error) {
          clearToken()
          userStore.token = ''
          userInfo.avatar = ''
          userInfo.username = ''
          next('/login')
        }
      } else {
        const getDefaultRoute = (routes: RouteRecordRaw[]): RouteRecordRaw | undefined => {
          for (const route of routes) {
            // 先判断自己
            if ((route.name as string).toLowerCase() === (to.name as string)!.toLowerCase()) {
              return route
            }
            // 再递归子路由
            if (route.children && route.children.length > 0) {
              const found = getDefaultRoute(route.children)
              if (found) {
                return found
              }
            }
          }

          return undefined
        }
        const hasRouter = getDefaultRoute(router.options.routes as RouteRecordRaw[])
        if (to.path === '/') {
          next(userStore.defaultRoute)
        } else if (!hasRouter) {
          next('/403')
        } else {
          next()
        }
      }
    }
  } else {
    // 未登录状态
    if (to.path !== '/login') {
      // 不是去往登录页，直接跳转到登录页
      next('/login')
    } else {
      // 放行
      next()
    }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | 鲸鸿后台管理系统`
})
