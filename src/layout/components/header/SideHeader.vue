<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-07-16 05:52:36
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-13 18:22:42
 * @FilePath: \taopinhui_vue3\src\layout\components\header\SideHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    class="flex flex-col items-center justify-between header backdrop-blur-sm bg-white/75 dark:bg-black/75"
  >
    <div class="text-lg text-center vertical">鲸鸿后台管理系统</div>

    <div class="flex flex-col items-center justify-center">
      <!-- 用户名下拉菜单 -->
      <el-dropdown
        class="mx-2"
        trigger="click"
        @command="handleCommand"
        style="margin-bottom: 10px"
      >
        <span class="flex items-center cursor-pointer">
          {{ username }}
          <el-icon class="el-icon--right">
            <MoIcon icon-name="ep-arrow-down" />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <a href="#" target="_blank">
              <el-dropdown-item>项目仓库</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 用户头像 -->
      <el-avatar class="mb-8" :size="42" :src="avatar" />
      <SiteSearch class="mb-8" />
      <el-switch
        v-model="darkMode"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        class="mb-8"
        @change="toggleDark()"
        style="--el-switch-on-color: #0960bd; --el-switch-off-color: #ff6600"
      />

      <Language class="mb-8" />
      <ThemeSetting class="mb-8" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useSidebarStore } from '~/store/sidebar'
import { useRouter } from 'vue-router'
import { SelectOptionItem } from '~/types/index'
import { useDark, useToggle } from '@vueuse/core'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useUserStore } from '~/store/user'
import SiteSearch from '../SiteSearch.vue'
import Language from '../Language.vue'
import ThemeSetting from '../ThemeSetting.vue'

const isDark = useDark()
let darkMode = ref(false)
darkMode.value = isDark.value

const toggleDark = useToggle(isDark)

const userStore = useUserStore()

const username: string | null = userStore.userInfo.username
const avatar: string | null = userStore.userInfo.avatar

const sidebar = useSidebarStore()
// 侧边栏折叠
const collapseChage = () => {
  sidebar.handleCollapse()
}

onMounted(() => {
  if (document.body.clientWidth < 1200) {
    collapseChage()
  }
})

// 用户名下拉菜单选择事件
const router = useRouter()
const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await userStore.userLogout()
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  } else if (command === 'user') {
    router.push('/system/profile')
  }
}
</script>
<style scoped>
.vertical {
  padding-top: 10px;
  writing-mode: vertical-rl; /* 从右到左 */
  text-orientation: upright; /* 保持正常显示 */
  letter-spacing: 4px;   /* 控制文字间的间距 */
}
</style>
