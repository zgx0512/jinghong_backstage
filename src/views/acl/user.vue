<template>
  <div class="container">
    <!-- 搜索卡片 -->
    <el-card style="margin-bottom: 10px; height: 74px">
      <el-form :inline="true" class="searchForm">
        <el-form-item label="用户名:">
          <el-input
            placeholder="请输入用户名"
            v-model="username"
            @keyup.enter="getUserInfo()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getUserInfo()">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 展示用户数据卡片 -->
    <el-card>
      <!--  v-if="permissionBtn('btn.User.add')" -->
      <el-button type="primary" icon="Plus" @click="openAddOrUpdateDrawer">添加用户</el-button>
      <el-button type="danger" icon="Delete" :disabled="idList.length === 0" @click="batchRemove"
        >批量删除</el-button
      >
      <tph-table
        :tableData="tableData"
        :tableHeadList="tableHeadList"
        :tableProp="tableProp"
        v-loading="loading"
        @selectionChange="selectionChange"
      >
        <template #default="{ row }">
          <el-button type="warning" icon="User" size="small" @click="openAssignDrawer(row)"
            >分配角色</el-button
          >
          <el-button type="primary" icon="Edit" size="small" @click="openAddOrUpdateDrawer(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`确定删除${row.username}?`"
            width="200"
            @confirm="removeUser(row.userId)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </tph-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 10, 20]"
        size="small"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="getUserInfo()"
        @current-change="getUserInfo()"
      />
    </el-card>
    <!-- 添加|编辑用户抽屉 -->
    <addOrUpdateUser ref="addOrUpdateUserRef" @submit="submit"></addOrUpdateUser>
    <!-- 分配角色抽屉 -->
    <el-drawer v-model="assignRoleDrawer" title="分配角色">
      <el-form>
        <el-form-item label="用户名字">
          <el-input disabled v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
            <el-checkbox v-for="item in allRoles" :key="item.id" :label="item.id">{{
              item.roleName
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="assignRoleDrawer = false">取消</el-button>
          <el-button type="primary" @click="assignRole" :loading="assignLoading">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import {
  reqUserInfo,
  reqBatchRemoveUser,
  reqRemoveUser,
  reqRoleInfo,
  reqAssignRole
} from '~/api/acl/user'
import { ElMessageBox } from 'element-plus'
// 引入子组件
import addOrUpdateUser from './components/addOrUpdateUser.vue'
import dayjs from 'dayjs'
// 引入ts类型
import { userResponseType, roleResponseType } from '~/api/acl/user/type'
// 引入按钮权限函数
import { permissionBtn } from '~/utils/permissionBtn'
const username = ref<string>('')
const tableData = ref<userResponseType[]>([])
// 表头
const tableHeadList = [
  {
    label: 'ID',
    property: 'userId',
    width: '80'
  },
  {
    label: '用户名称',
    property: 'username',
    width: '200'
  },
  {
    label: '邮箱',
    property: 'email',
    width: '200'
  },
  {
    label: '用户角色',
    property: 'roleName',
    width: '120'
  },
  {
    label: '创建时间',
    property: 'createTime',
    width: '200'
  },
  {
    label: '更新时间',
    property: 'updateTime',
    width: '200'
  },
  {
    label: '操作',
    width: '300'
  }
]
// 表格基本布局
const tableProp = {
  isSelect: true,
  index: true
}
// 表格加载效果
const loading = ref<boolean>(false)
// 当前页
const page = ref<number>(1)
// 每页大小
const limit = ref<number>(5)
// 总数
const total = ref<number>(0)
// 选出来的用户id列表
const idList = ref<number[]>([])
// 获取用户数据的函数
const getUserInfo = async () => {
  loading.value = true
  // 发送请求
  const result = await reqUserInfo(page.value, limit.value, username.value)
  if (result.code === 200) {
    loading.value = false
    // 赋值
    total.value = result.data.total
    tableData.value = result.data.usersList.map((item: userResponseType) => {
      return {
        ...item,
        id: item.userId,
        roleName: item.role!.join(','),
        createTime: dayjs(item.createTime).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs(item.updateTime).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }
}
onMounted(() => {
  // 页面挂载完毕，获取数据
  getUserInfo()
})
// 重置按钮的回调
const reset = () => {
  // 清空文本框
  username.value = ''
  // 回到第一页
  page.value = 1
  // 重新获取用户数据
  getUserInfo()
}

// 复选框发生改变时的回调
const selectionChange = (ids: number[]) => {
  // 获取最新的id列表
  idList.value = ids
}
// 批量删除按钮的回调
const batchRemove = async () => {
  ElMessageBox.confirm('确定要删除这些角色吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // 发送批量删除角色的请求
        const res = await reqBatchRemoveUser(idList.value)
        ElMessage({
          type: 'success',
          message: '批量删除成功'
        })
        // 回到第一页
        page.value = 1
        // 重新获取角色列表
        getUserInfo()
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '批量删除失败'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
// 删除按钮的回调
const removeUser = async (id: number) => {
  try {
    // 调用删除角色的接口
    const res = await reqRemoveUser(id)
    if (res.code === 200) {
      // 成功，提示用户
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      // 判断删除的角色是否是当前页的最后一个
      if (tableData.value.length <= 1 && page.value > 1) {
        // 前往上一页
        page.value = page.value - 1
      }
      // 重新获取角色列表数据
      getUserInfo()
    } else {
      // 失败，提示用户
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  } catch (error) {
    // 失败的提示信息
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
// 添加|编辑用户抽屉ref对象
const addOrUpdateUserRef = ref()
// 添加用户按钮的回调
const openAddOrUpdateDrawer = (row: userResponseType) => {
  addOrUpdateUserRef.value?.open(row)
}
const submit = (id: number | string) => {
  if (!id) {
    // 是添加，要重新回到首页
    page.value = 1
  }
  // 重新获取用户数据
  getUserInfo()
}
// 分配角色抽屉的显示与隐藏
const assignRoleDrawer = ref<boolean>(false)
// 全选按钮
const checkAll = ref(false)
const isIndeterminate = ref(true)
// 已经选中的角色的数组
const checkedRoles = ref<(number | string)[]>([])
// 所有角色的数组
const allRoles = ref<roleResponseType[]>([])
// 用户名
const name = ref<string>('')
// 用户id
const userId = ref<string | number>('')
// 分配角色抽屉确认按钮的加载效果
const assignLoading = ref<boolean>(false)
// 分配角色按钮的回调
const openAssignDrawer = async (row: userResponseType) => {
  // 打开抽屉
  assignRoleDrawer.value = true
  // 赋值
  name.value = row.username
  userId.value = row.userId
  // 发送请求
  const result = await reqRoleInfo(row.userId)
  if (result.code === 200) {
    allRoles.value = result.data.allRolesList
    checkedRoles.value = result.data.assignRoles.map((item: roleResponseType) => item.id)
  }
  // 全选按钮的状态
  checkAll.value = allRoles.value.length === checkedRoles.value.length
  // 半选中状态的值
  isIndeterminate.value = allRoles.value.length !== checkedRoles.value.length
}
// 点击全选复选框的回调
const handleCheckAllChange = (val: boolean) => {
  checkedRoles.value = val
    ? (allRoles.value.map((item: roleResponseType) => item.id) as number[])
    : []
  isIndeterminate.value = false
}
// 点击复选框的回调
const handleCheckedRolesChange = (value: number[]) => {
  checkedRoles.value = value
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRoles.value.length
}
// 分配角色对话框确认按钮的回调
const assignRole = async () => {
  // 整合参数
  const roleVo = {
    roleIdList: checkedRoles.value,
    userId: userId.value
  }
  // 发送请求
  try {
    assignLoading.value = true
    await reqAssignRole(roleVo)
    // 成功提示信息
    ElMessage({
      type: 'success',
      message: '保存成功'
    })
    assignLoading.value = false
    // 关闭抽屉
    assignRoleDrawer.value = false
    // 重新获取表格数据
    getUserInfo()
  } catch (error) {
    // 失败提示信息
    ElMessage({
      type: 'error',
      message: '保存失败'
    })
    assignLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.searchForm {
  display: flex;
  justify-content: space-between;
}
</style>
