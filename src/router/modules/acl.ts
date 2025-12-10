/* 
   权限管理
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '~/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/acl',
    name: 'acl',
    component: Layout,
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      icon: 'ep-lock',
      order: 2
    },
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'ep-user'
        },
        component: () => import('~/views/acl/user.vue')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          title: '角色管理',
          icon: 'ep-avatar'
        },
        component: () => import('~/views/acl/role.vue')
      },
      {
        path: 'permission',
        name: 'menu',
        meta: {
          title: '菜单管理',
          icon: 'ep-menu'
        },
        component: () => import('~/views/acl/permission.vue')
      }
    ]
  }
]
export default routes
