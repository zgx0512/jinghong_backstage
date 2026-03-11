/* 
  权限管理
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '~/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Layout,
    redirect: '/dashboard/workbench',
    meta: {
      title: '仪表盘',
      icon: 'ep-sunrise',
      order: 1
    },

    children: [
      {
        path: 'workbench',
        name: 'workbench',
        meta: {
          title: '工作台',
          icon: 'ep-data-analysis'
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '~/views/dashboard/Workbench.vue')
      },
      {
        path: 'analysis',
        name: 'analysis',
        meta: {
          title: '分析',
          icon: 'ep-histogram'
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '~/views/dashboard/Analysis.vue')
      }
      // {
      //   path: 'today-dashboard',
      //   name: 'today-dashboard',
      //   meta: {
      //     title: '今日数据',
      //     icon: 'ep-data-analysis'
      //   },
      //   component: () => import(/* webpackChunkName: "dashboard" */ '~/views/dashboard/TodayDashboard.vue')
      // }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    hidden: true,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/screen',
    name: 'screen',
    meta: {
      title: '数据大屏',
      order: 2,
      icon: 'ep-monitor'
    },
    component: () => import(/* webpackChunkName: "screen" */ '~/views/screen/index.vue')
  }
]
export default routes
