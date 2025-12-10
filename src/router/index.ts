/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-07-16 05:52:36
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-14 22:58:16
 * @FilePath: \taopinhui_vue3\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('./modules/**/*.ts', { eager: true })

let routeModuleList: RouteRecordRaw[] = []

// 获取模块路由
Object.values(modules).forEach((key: any) => {
  const mod = key.default || []
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/login/login.vue')
  },
  {
    path: '/403',
    name: '403',
    hidden: true,
    meta: {
      title: '没有权限'
    },
    component: () => import(/* webpackChunkName: "400" */ '../views/403.vue')
  },
]
const lastRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    hidden: true,
    meta: {
      title: '404'
    },
    component: () => import(/* webpackChunkName: "400" */ '../views/404.vue')
  }
]

let routes = constantRoutes

// 前端固定路由模式
if (import.meta.env.VITE_PERMISSION_MODE === 'CONSTANT') {
  routes = [...constantRoutes, ...lastRoutes, ...routeModuleList]
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
export { constantRoutes, routeModuleList, lastRoutes }
