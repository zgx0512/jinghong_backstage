<template>
  <div class="container">
    <div class="flex items-center justify-between px-6 pt-4 mb-8">
      <div class="flex items-center">
        <el-avatar size="large" class="mr-4" :src="avatar" />
        <div>
          <p class="mb-2" style="font-size: 24px">
            {{ getTime() }}, {{ getTime() === '午夜时间，请注意休息哦！' ? '' : name }}
          </p>
          <p class="text-gray-400"></p>
        </div>
      </div>
    </div>
    <div class="flex box">
      <el-row>
        <el-col :span="12" class="nav">
          <el-card style="height: 100%">
            <template #header>
              <div class="card-header">
                <span>快捷方式</span>
              </div>
            </template>
            <el-row>
              <el-col
                :span="12"
                v-for="(nav, index) in navList"
                :key="nav.name"
                class="item"
                @click="go(nav.url)"
              >
                <div :style="{ 'margin-bottom': index < navList.length - 2 ? '20px' : '0' }">
                  <svg-icon :name="nav.icon"></svg-icon>
                  {{ nav.name }}
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12" class="nav">
          <el-card class="pic">
            <template #header>
              <div class="card-header">
                <span>技术栈</span>
              </div>
            </template>
            <PieChart />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="Workbench">
import { ref } from 'vue'
import PieChart from './components/PieChart.vue'
import { useUserStore } from '~/store/user'
import { useRouter } from 'vue-router'
// 获取时间
import { getTime } from '~/utils/getTime'
// 创建路由对象
const router = useRouter()

const userStore = useUserStore()
// 用户名
const name = userStore.userInfo.username
// 头像
const avatar = userStore.userInfo.avatar
// 快捷导航列表
const navList = ref([
  {
    name: '用户管理',
    url: '/acl/user',
    icon: 'user'
  },
  {
    name: '角色管理',
    url: '/acl/role',
    icon: 'role'
  },
  {
    name: '菜单管理',
    url: '/acl/permission',
    icon: 'permission'
  },
  {
    name: '商品列表',
    url: '/commodity/commodity-list',
    icon: 'spu'
  },
  {
    name: 'SKU管理',
    url: '/commodity/sku',
    icon: 'sku'
  },
  {
    name: '品牌管理',
    url: '/commodity/trademark',
    icon: 'trademark'
  },
  {
    name: '属性管理',
    url: '/commodity/attr',
    icon: 'attr'
  }
])
const go = (url: string) => {
  router.push(url)
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
.nav {
  height: 350px;
}
.nav .item {
  cursor: pointer;
  text-align: center;
}
.box {
  height: 350px;
  padding: 0 30px;
}
.box .pic {
  width: 450px;
  margin-left: 20px;
  height: 100%;
}
</style>
