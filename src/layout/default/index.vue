<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-07-16 05:52:36
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-07 15:12:10
 * @FilePath: \taopinhui_vue3\src\layout\default\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <v-header :class="{ 'header-collapse': sidebar.collapse }" />
  <v-tags :class="{ 'tag-collapse': sidebar.collapse }"></v-tags>
  <v-sidebar class="siderbar" />
  <div class="main-content" :class="{ 'content-collapse': sidebar.collapse }">
    <router-view v-slot="{ Component }">
      <transition name="move" mode="out-in">
        <keep-alive :include="tags.nameList">
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '~/store/sidebar'
import { useTagsStore } from '~/store/tags'
import vHeader from '../components/header/index.vue'
import vSidebar from '../components/sidebar/index.vue'
import vTags from '../components/tags/index.vue'

const sidebar = useSidebarStore()
const tags = useTagsStore()
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--el-border-color);

  .logo {
    color: var(--el-color-primary);
  }
}

.el-aside {
  > :deep(.el-menu) {
    position: fixed;
    margin-top: 60px;
    width: 220px;
    border-right: 0 none;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
  > :deep(.el-menu--collapse) {
    width: 64px;
  }
}

.main-content {
  position: relative;
  margin-left: 220px;
  padding-top: 90px;
  height: 100vh;

  -webkit-transition: left 0.3s ease-in-out;
  transition: margin-left 0.3s ease-in-out;

  // 优化：使用渐进式背景加载，避免阻塞首屏渲染
  background-color: var(--el-bg-color-page);

  // &::before {
  //   content: '';
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   bottom: 0;
  //   right: 0;
  //   width: 100%;
  //   height: 100%;
  //   background: url(~/assets/images/bg.avif) no-repeat top center;
  //   background-size: cover;
  //   opacity: 0;
  //   animation: fadeInBg 0.5s ease-in 0.3s forwards;
  //   z-index: -1;
  // }

  &.content-collapse {
    margin-left: 64px;
  }
}

@keyframes fadeInBg {
  to {
    opacity: 1;
  }
}

.content {
  width: auto;
  overflow-y: auto;

  &.content-collapse {
    left: 64px;
  }
}

.container {
  padding: 10px;
  height: 100%;
}
</style>
