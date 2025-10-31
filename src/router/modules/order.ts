/* 
   订单管理
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '~/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/order',
    name: 'order',
    component: Layout,
    redirect: '/order/order-list',
    meta: {
      title: '订单管理',
      icon: 'ep-goods',
      order: 4
    },
    children: [
      {
        path: 'order-list',
        name: 'order-list',
        component: () => import('~/views/order/order-list/index.vue'),
        meta: {
          title: '订单列表',
          icon: 'ep-film'
        }
      }
    ]
  }
]
export default routes
