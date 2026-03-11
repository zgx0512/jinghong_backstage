<template>
  <div class="container">
    <el-card style="margin-bottom: 10px; height: 74px">
      <el-form :inline="true" class="searchForm">
        <el-form-item label="角色名:">
          <el-input
            placeholder="请输入角色名"
            v-model="roleName"
            @keyup.enter="getRoleInfo()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getRoleInfo()">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button
        v-btnPermiss="'Add-Role'"
        icon="Plus"
        type="primary"
        @click="openDialog({ id: '', roleName: '' }, '添加角色')"
        >添加角色</el-button
      >
      <el-button
        v-btnPermiss="'Batch-Delete-Role'"
        icon="Delete"
        type="danger"
        :disabled="idList.length === 0"
        @click="batchRemove"
        >批量删除</el-button
      >
      <!-- 自定义封装表格 -->
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
    <!-- 添加|修改角色对话框 -->
    <addOrUpdateRole
      ref="addOrUpdateRoleRef"
      :dialogVisible="dialogVisible"
      @cancelAddOrUpdate="dialogVisible = false"
      @submitAddOrUpdate="dialogVisible = false"
      @getRoleInfo="reloadRoleInfo"
    ></addOrUpdateRole>
    <!-- 分配权限抽屉 -->
    <el-drawer v-model="disAclDrawer" title="分配权限">
      <el-tree
        ref="permissionTreeRef"
        :data="permissionData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="checkedIds"
        v-loading="treeLoading"
      />
      <template #footer>
        <div style="flex: auto">
          <el-button @click="disAclDrawer = false">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="tsx" setup>
import { ref, onMounted } from 'vue'
import { reqRoleInfo, reqBatchRemoveRole, reqRemoveRole, reqAssignAcl } from '~/api/acl/role'
import { reqPermissionInfo } from '~/api/acl/permission'
import addOrUpdateRole from './components/addOrUpdateRole.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { roleResponseType } from '~/api/acl/role/type'
import type { permissionResponseType } from '~/api/acl/permission/type'
// 引入按钮权限函数
import { permissionBtn } from '~/utils/permissionBtn'
import dayjs from 'dayjs'
// 表格的基础属性
const tableProp: JHTablePropType = {
  isSelect: true,
  index: true
}
const tableColumns = ref<JHTableColumnType[]>([])
const tableOptions = ref<JHTableOptionsType>({
  height: 'auto'
})
const page_info = ref<JHTablePageInfoType>({
  page: 1,
  limit: 10,
  total: 0,
  page_sizes: [3, 5, 10, 20]
})
const initTable = () => {
  tableColumns.value = [
    {
      label: 'ID',
      property: 'id',
      width: '80px',
      fit: true,
      align: 'center'
    },
    {
      label: '角色名称',
      property: 'roleName',
      width: '100px',
      fit: true,
      align: 'center'
    },
    {
      label: '创建时间',
      property: 'createTime',
      width: '140px',
      fit: true,
      align: 'center'
    },
    {
      label: '更新时间',
      property: 'updateTime',
      width: '140px',
      fit: true,
      align: 'center'
    },
    {
      label: '操作',
      property: 'operation',
      width: '200px',
      fit: true,
      align: 'center',
      component: {
        render(h: any, row: roleResponseType) {
          const assignAuth = permissionBtn('Assign-Auth-Role')
          const editAuth = permissionBtn('Edit-Auth-Role')
          const deleteAuth = permissionBtn('Delete-Auth-Role')
          if (!assignAuth && !editAuth && !deleteAuth) {
            return <div>--</div>
          }
          return (
            <div>
              {assignAuth && (
                <el-button
                  type="warning"
                  icon="User"
                  size="small"
                  onClick={() => {
                    openDrawer(row)
                  }}
                >
                  分配权限
                </el-button>
              )}
              {editAuth && (
                <el-button
                  type="primary"
                  icon="Edit"
                  size="small"
                  onClick={() => {
                    openDialog(row, '编辑角色')
                  }}
                >
                  编辑
                </el-button>
              )}
              {deleteAuth && (
                <el-popconfirm
                  title={`确定删除${row.roleName}?`}
                  width="180"
                  onConfirm={() => remove(row.id as number)}
                  v-slots={{
                    reference: () => (
                      <el-button type="danger" icon="Delete" size="small">
                        删除
                      </el-button>
                    )
                  }}
                ></el-popconfirm>
              )}
            </div>
          )
        }
      }
    }
  ]
}
const roleName = ref<string>('') // 搜索文本框绑定的属性
// 用户角色数据列表
const tableData = ref([])
// 表格加载效果
const loading = ref<boolean>(false)
// 复选框选出来的id列表
const idList = ref<(number | string)[]>([])
// 控制添加|修改角色对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 对话框的ref对象
const addOrUpdateRoleRef = ref()
// 控制分配权限抽屉的显示与隐藏
const disAclDrawer = ref<boolean>(false)
// 存储菜单数据的属性
const permissionData = ref<permissionResponseType[]>([])
// 树形组件展示的数据
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 页面挂载完毕时的回调
onMounted(() => {
  initTable()
  getRoleInfo()
})
// 获取角色列表数据的函数
const getRoleInfo = async () => {
  loading.value = true
  const { page, limit } = page_info.value
  const result = await reqRoleInfo(page, limit, roleName.value)
  if (result.code === 200) {
    tableData.value = result.data.rolesList
    page_info.value.total = result.data.total
    loading.value = false
  } else {
    loading.value = false
  }
}
// 重置按钮的回调
const reset = () => {
  // 清空搜索文本框的内容
  roleName.value = ''
  // 重新获取角色数据
  getRoleInfo()
}
// 当前页大小发生改变时的回调
const handleSizeChange = () => {
  // 重新调用获取列表数据的函数
  getRoleInfo()
}
// 当前页发生改变时的回调
const handleCurrentChange = () => {
  // 重新调用获取列表数据的函数
  getRoleInfo()
}
// 复选框发生改变时的回调
const selectionChange = (ids: number[]) => {
  idList.value = ids
}
// 批量删除按钮的回调
const batchRemove = () => {
  ElMessageBox.confirm('确定要删除这些角色吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // 发送批量删除角色的请求
        const res: any = await reqBatchRemoveRole(idList.value)
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '批量删除成功'
          })
          // 回到第一页
          page_info.value.page = 1
          // 重新获取角色列表
          getRoleInfo()
        } else {
          ElMessage({
            type: 'error',
            message: res.message || '批量删除失败'
          })
        }
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
// 删除角色按钮的回调
const remove = async (id: number) => {
  try {
    // 调用删除角色的接口
    const res: any = await reqRemoveRole(id)
    if (res.code !== 200) {
      // 失败的提示信息
      ElMessage({
        type: 'error',
        message: res.message || '删除失败'
      })
      return
    }
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
    getRoleInfo()
  } catch (error) {
    // 失败的提示信息
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
// 添加|编辑角色按钮的回调
const openDialog = (row: roleResponseType, title: string) => {
  dialogVisible.value = true
  // 清空校验信息跟文本框
  addOrUpdateRoleRef.value.clear()
  addOrUpdateRoleRef.value.open(JSON.parse(JSON.stringify(row)), title)
}
// 重新获取用户列表数据
const reloadRoleInfo = (id: number | string) => {
  if (!id) {
    // 是新增，回到第一页
    page_info.value.page = 1
  }
  // 调用函数
  getRoleInfo()
}
// 菜单树的对象
const permissionTreeRef = ref()
// 选中的叶子节点
const checkedIds = ref<number[]>([])
// 树形组件的加载效果
const treeLoading = ref<boolean>(false)
const roleId = ref<number>()

// 分配权限按钮的回调
const openDrawer = async (row: roleResponseType) => {
  const { id, role_ids } = row
  // 存储roleId
  roleId.value = id as number
  // 每次打开抽屉，都先清空上一个角色的数据
  checkedIds.value = [...role_ids!]
  permissionData.value = []
  // 打开抽屉
  disAclDrawer.value = true
  treeLoading.value = true
  // 发送请求，获取菜单数据
  const result = await reqPermissionInfo()
  if (result.code === 200) {
    permissionData.value = result.data
    treeLoading.value = false
  }
}
// 抽屉确认按钮的回调
const submit = async () => {
  // 整合参数，包括叶子节点跟半选中的父节点
  const permissions = [...permissionTreeRef.value.getCheckedKeys()]
  const halfPermissions = [...permissionTreeRef.value.getHalfCheckedKeys()]
  // 发送请求，分配权限
  try {
    const data = {
      permissions,
      roleId: roleId.value as number,
      halfPermissions: halfPermissions as number[]
    }
    await reqAssignAcl(data)

    // 成功提示信息
    ElMessage({
      type: 'success',
      message: '权限分配成功'
    })
    // 重新获取一遍数据
    getRoleInfo()
    // 关闭抽屉
    disAclDrawer.value = false
  } catch (error) {
    // 失败提示信息
    ElMessage({
      type: 'error',
      message: '权限分配失败'
    })
  }
}
</script>

<style lang="scss" scoped>
.searchForm {
  display: flex;
  justify-content: space-between;
}
</style>
