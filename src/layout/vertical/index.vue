<template>
  <v-header class="v" :class="{ 'header-collapse': sidebar.collapse }" />
  <v-sidebar class="siderbar" />
  <div class="main-content" :class="{ 'content-collapse': sidebar.collapse }">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '~/store/sidebar'
import { useTagsStore } from '~/store/tags'
import vHeader from '../components/header/SideHeader.vue'
import vSidebar from '../components/sidebar/index.vue'

const sidebar = useSidebarStore()
const tags = useTagsStore()
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  z-index: 10;
  width: 80px;
  height: 100vh;
  border-right: 1px solid var(--el-border-color);

  .logo {
    color: var(--el-color-primary);
  }
}

.el-aside {
  position: fixed;
  left: 80px;
  top: 0;
  bottom: 0;
  height: 100vh;

  > :deep(.el-menu) {
    width: 200px;
    border-right: 0 none;
    height: 100vh;
    overflow-y: auto;
    border-right: 1px solid var(--el-border-color);
  }
  > .el-menu--collapse {
    width: 64px;
  }
}

.main-content {
  position: relative;
  margin-left: 280px;

  -webkit-transition: left 0.3s ease-in-out;
  transition: margin-left 0.3s ease-in-out;

  // 优化：使用渐进式背景加载，避免阻塞首屏渲染
  background-color: #f5f7fa;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(~/assets/images/bg.avif) no-repeat top center;
    background-size: cover;
    opacity: 0;
    animation: fadeInBg 0.5s ease-in 0.3s forwards;
    z-index: -1;
  }

  &.content-collapse {
    margin-left: 144px;
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
  margin: 10px;
}
</style>
