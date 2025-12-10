<template>
  <div class="shadow mo-tags backdrop-blur-sm bg-white/75 dark:bg-black/75" v-if="tags.show">
    <el-scrollbar>
      <ul v-click-outside="onClickOutside">
        <li
          v-for="(item, index) in tags.list"
          :key="item.path"
          :class="isActive(item.path) ? 'active' : ''"
        >
          <span
            class="cursor-pointer"
            @click="changeTab(item.path)"
            @contextmenu.prevent="openContext($event, index)"
            >{{ $t(`route.${item.title}`) }}</span
          >
          <i-ep-close @click="removeTag(item.path)"></i-ep-close>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { useTagsStore } from '~/store/tags'
import { useSidebarStore } from '~/store/sidebar'
import { useUserStore } from '~/store/user'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tags = useTagsStore()
const userStore = useUserStore()
const siderbarStore = useSidebarStore()

const { defaultRoute } = userStore
const isActive = (path: string) => {
  return path === route.fullPath
}

function changeTab(e: string) {
  router.push(e)
}

let contextmenuShow = ref(false)
let contextmenuPositon = ref({ top: 0, left: 0 })
let currentIndex = ref(0)

function openContext(e: Event, index: number) {
  contextmenuShow.value = true
  currentIndex.value = index
  const { top, left } = getParentOffset(e.target)

  contextmenuPositon.value = {
    top: top - 38,
    left: left + (e.target as HTMLElement).clientWidth - (siderbarStore.collapse ? 64 : 200) - 84
  }
}

// 获取父元素的相对位移
function getParentOffset(el: any) {
  let offset = { top: 0, left: 0 }
  offset.top = el.offsetTop
  offset.left = el.offsetLeft

  if (el.offsetParent != null) {
    let offsetParent = getParentOffset(el.offsetParent)
    offset.top += offsetParent.top
    offset.left += offsetParent.left
  }
  return offset
}

const onClickOutside = () => {
  contextmenuShow.value = false
}

function removeTag(e: string) {
  const index = tags.list.findIndex((cur) => cur.path === e)

  tags.delTagsItem(index)
  const item = tags.list[index] ? tags.list[index] : tags.list[index - 1]
  if (item) {
    router.push(item.path)
  } else {
    const getDefaultRoute = (routes: RouteRecordRaw[]): RouteRecordRaw | undefined => {
      for (const route of routes) {
        // 先判断自己
        if (route.path === defaultRoute) {
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

    const default_route = getDefaultRoute(router.options.routes as RouteRecordRaw[])
    console.log('default_route', default_route)
    tags.setTagsItem({ name: 'workbench', path: '/dashboard/workbench', title: '工作台' })
    router.push('/')
  }
}

// 设置标签
const setTags = (route: any) => {
  const isExist = tags.list.some((item) => {
    return item.path === route.fullPath
  })

  if (!isExist) {
    tags.setTagsItem({
      name: route.name,
      title: route.meta.title,
      path: route.fullPath
    })
  }
}
setTags(route)

watch(route, (newVal) => {
  setTags(route)
})
</script>

<style lang="scss">
.mo-tags {
  position: fixed;
  top: 60px;
  z-index: 1001;
  left: 220px;
  right: 0;
  height: 30px;
  transition: left 0.3s ease-in-out, width 0.3s ease-in-out;

  &.tag-collapse {
    left: 64px;
  }

  ul {
    display: flex;

    li {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      padding-right: 4px;
      height: 24px;
      margin-top: 3px;
      font-size: 12px;

      margin-right: 2px;
      border: 1px solid var(--el-border-color);
      background: var(--el-fill-color-blank);
      border-radius: 2px;

      > span {
        padding: 0 4px 0 8px;
      }

      &.active {
        color: var(--el-color-primary);
      }

      &:hover {
        background-color: var(--el-bg-color-page);
      }
    }
  }
}
</style>
