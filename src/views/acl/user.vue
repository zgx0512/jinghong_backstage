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
      <el-button v-btnPermiss="'Add-User'" type="primary" icon="Plus" @click="openAddOrUpdateDrawer"
        >添加用户</el-button
      >
      <el-button
        v-btnPermiss="'Batch-delete-User'"
        type="danger"
        icon="Delete"
        :disabled="idList.length === 0"
        @click="batchRemove"
        >批量删除</el-button
      >
      <jh-table
        :data="tableData"
        :tableColumns="tableColumns"
        :tableOptions="tableOptions"
        :tableProp="tableProp"
        :page_info="page_info"
        v-loading="loading"
        @selection-change="selectionChange"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </jh-table>
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
          <div style="display: block; width: 100%">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
          </div>
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

<script lang="tsx" setup>
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
// 表格加载效果
const loading = ref<boolean>(false)
const tableOptions = ref({
  height: 'auto'
})
const page_info = ref({
  page: 1,
  limit: 10,
  total: 0,
  page_sizes: [3, 5, 10, 20]
})
const tableProp = {
  index: false,
  isZh: true,
  isSelect: true
}
const tableColumns = ref<any[]>([])
const initTable = () => {
  tableColumns.value = [
    {
      property: 'userId',
      label: '用户ID',
      width: '80px'
    },
    {
      property: 'username',
      label: '用户名',
      width: '120px'
    },
    {
      property: 'email',
      label: '邮箱',
      width: '160px'
    },
    {
      property: 'roleNames',
      label: '角色',
      width: '200px',
      component: {
        render(h: any, row: userResponseType) {
          if (!row.roleNames) {
            return <div>--</div>
          }
          return (
            <el-tooltip
              placement="top"
              effect="light"
              v-slots={{
                content: () => <div>{row.roleNames}</div>
              }}
            >
              <div class="text-ellipsis-common">
                <span>{row.roleNames}</span>
              </div>
            </el-tooltip>
          )
        }
      }
    },
    {
      label: '创建时间',
      property: 'createTime',
      width: '180px'
    },
    {
      label: '更新时间',
      property: 'updateTime',
      width: '180px'
    },
    {
      label: '操作',
      property: 'operation',
      width: '280px',
      fixed: 'right',
      component: {
        render(h: any, row: any) {
          const assignAuth = permissionBtn('Assign-Role-User')
          const editAuth = permissionBtn('Edit-User')
          const deleteAuth = permissionBtn('Delete-User')
          if (!assignAuth && !editAuth && !deleteAuth) {
            return <div>--</div>
          }
          return (
            <div class="action-btns">
              {assignAuth && (
                <el-button
                  type="warning"
                  icon="User"
                  size="small"
                  onClick={() => {
                    openAssignDrawer(row)
                  }}
                >
                  分配角色
                </el-button>
              )}

              {editAuth && (
                <el-button
                  type="primary"
                  icon="Edit"
                  size="small"
                  onClick={() => {
                    openAddOrUpdateDrawer(row)
                  }}
                >
                  编辑
                </el-button>
              )}

              {deleteAuth && (
                <el-popconfirm
                  title={`确定删除${row.username}?`}
                  width="200"
                  onConfirm={() => {
                    removeUser(row.userId)
                  }}
                  v-slots={{
                    reference: () => (
                      <el-button type="danger" icon="Delete" size="small">
                        删除
                      </el-button>
                    )
                  }}
                />
              )}
            </div>
          )
        }
      }
    }
  ]
}
// 选出来的用户id列表
const idList = ref<number[]>([])
// 获取用户数据的函数
const getUserInfo = async () => {
  loading.value = true
  const { page, limit } = page_info.value
  // 发送请求
  const result = await reqUserInfo(page, limit, username.value)
  if (result.code === 200) {
    loading.value = false
    // 赋值
    page_info.value.total = result.data.total
    tableData.value = result.data.usersList.map((item: userResponseType) => {
      return {
        ...item,
        id: item.userId,
        roleName: item.roleNames,
        createTime: dayjs(item.createTime).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs(item.updateTime).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }
}
onMounted(() => {
  initTable()
  // 页面挂载完毕，获取数据
  getUserInfo()
})
// 重置按钮的回调
const reset = () => {
  // 清空文本框
  username.value = ''
  // 回到第一页
  page_info.value.page = 1
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
        page_info.value.page = 1
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
      if (tableData.value.length <= 1 && page_info.value.page > 1) {
        // 前往上一页
        page_info.value.page = page_info.value.page - 1
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
    page_info.value.page = 1
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
    allRoles.value = result.data.allRoles
    checkedRoles.value = result.data.checkedRoles.map((item: roleResponseType) => item.id)
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
  const data = {
    role_ids: checkedRoles.value.join(','),
    userId: userId.value
  }
  // 发送请求
  try {
    assignLoading.value = true
    await reqAssignRole(data)
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
const handleSizeChange = (page_size: number) => {
  page_info.value.limit = page_size
  getUserInfo()
}

const handleCurrentChange = (page: number = 1) => {
  page_info.value.page = page
  getUserInfo()
}
</script>

<style lang="scss" scoped>
.searchForm {
  display: flex;
  justify-content: space-between;
}
</style>
