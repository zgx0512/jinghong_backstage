import router from '~/router'
import { useUserStore } from '~/store/user'
import pinia from '~/store'
import { clearToken } from '~/utils/token'

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
        const hasRouter = (() => {
          if (typeof to.name === 'string' && router.hasRoute(to.name)) {
            return true
          }
          return router.getRoutes().some((route) => route.path === to.path)
        })()

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
