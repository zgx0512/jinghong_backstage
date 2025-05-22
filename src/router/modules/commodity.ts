/* 
   商品管理
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '~/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/commodity',
    name: 'commodity',
    component: Layout,
    redirect: '/commodity/commodity_list',
    meta: {
      title: '商品管理',
      icon: 'ep-goods',
      order: 3
    },
    children: [
      {
        path: 'commodity_list',
        name: 'commodity_list',
        component: () => import('~/views/commodity/commodity_list.vue'),
        meta: {
          title: '商品列表',
          icon: 'ep-film'
        }
      },
      {
        path: 'sku',
        name: 'sku',
        component: () => import('~/views/product/sku.vue'),
        meta: {
          title: 'SKU管理',
          icon: 'ep-collection'
        }
      },
      {
        path: 'trademark',
        name: 'trademark',
        component: () => import('~/views/product/trademark.vue'),
        meta: {
          title: '品牌管理',
          icon: 'ep-suitcase'
        }
      },
      {
        path: 'attr',
        name: 'attr',
        component: () => import('~/views/product/attr.vue'),
        meta: {
          title: '属性管理',
          icon: 'ep-document'
        }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('~/views/product/category.vue'),
        meta: {
          title: '分类管理',
          icon: 'ep-wallet'
        }
      }
    ]
  }
]
export default routes
