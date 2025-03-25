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
        icon="Plus"
        type="primary"
        @click="openDialog({ id: '', roleName: '' }, '添加角色')"
        >添加角色</el-button
      >
      <el-button icon="Delete" type="danger" :disabled="idList.length === 0" @click="batchRemove"
        >批量删除</el-button
      >
      <!-- 自定义封装表格 -->
      <tph-table
        :tableData="tableData"
        :tableHeadList="tableHeadList"
        :tableProp="tableProp"
        v-loading="loading"
        @selectionChange="selectionChange"
      >
        <template #default="{ row }">
          <el-button type="warning" icon="User" size="small" @click="openDrawer(row.id)"
            >分配权限</el-button
          >
          <el-button type="primary" icon="Edit" size="small" @click="openDialog(row, '编辑角色')"
            >编辑</el-button
          >
          <el-popconfirm :title="`确定删除${row.roleName}?`" width="180" @confirm="remove(row.id)">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
    <el-drawer v-model="disAclDrawer" title="分配菜单与按钮的权限">
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

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  reqRoleInfo,
  reqBatchRemoveRole,
  reqRemoveRole,
  reqPermissionInfo,
  reqAssignAcl
} from '~/api/acl/role'
import addOrUpdateRole from './components/addOrUpdateRole.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { roleResponseType } from '~/api/acl/role/type'
import type { permissionResponseType } from '~/api/acl/permission/type'
import dayjs from 'dayjs'
// 表格的基础属性
const tableProp = {
  isSelect: true,
  index: true
}
// 角色表格的表头
const tableHeadList = [
  {
    label: 'ID',
    property: 'id',
    width: '80'
  },
  {
    label: '角色名称',
    property: 'roleName',
    width: '100'
  },
  {
    label: '创建时间',
    property: 'createTime',
    width: '180'
  },
  {
    label: '更新时间',
    property: 'updateTime',
    width: '180'
  },
  {
    label: '操作',
    width: '300'
  }
]
const roleName = ref<string>('') // 搜索文本框绑定的属性
// 当前页
const page = ref<number>(1)
// 每页大小
const limit = ref<number>(5)
// 总数
const total = ref<number>(0)
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
  getRoleInfo()
})
// 获取角色列表数据的函数
const getRoleInfo = async () => {
  loading.value = true
  const result = await reqRoleInfo(page.value, limit.value, roleName.value)
  if (result.code === 200) {
    tableData.value = result.data.rolesList.map((role: roleResponseType) => {
      return {
        ...role,
        createTime: dayjs(role.createTime).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs(role.createTime).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }
    })
    total.value = result.data.total
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
          page.value = 1
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
    if (tableData.value.length <= 1 && page.value > 1) {
      // 前往上一页
      page.value = page.value - 1
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
    page.value = 1
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
const openDrawer = async (id: number) => {
  // 存储roleId
  roleId.value = id
  // 每次打开抽屉，都先清空上一个角色的数据
  checkedIds.value = []
  permissionData.value = []
  // 打开抽屉
  disAclDrawer.value = true
  treeLoading.value = true
  // 发送请求，获取菜单数据
  const result = await reqPermissionInfo(id)
  if (result.code === 200) {
    permissionData.value = result.data
    // 遍历permissionData，找出选中的节点
    getLeafNode(permissionData.value)
    console.log(checkedIds.value)
    treeLoading.value = false
  }
}
// 递归函数，找出叶子节点
const getLeafNode = (node: permissionResponseType[]) => {
  node.forEach((item) => {
    if (item.children && item.children?.length > 0) {
      // 不是叶子节点，接着递归
      getLeafNode(item.children)
    } else {
      // 是叶子节点，判断其是否选中
      if (item.select) {
        checkedIds.value.push(item.id as number)
      }
    }
  })
}
// 抽屉确认按钮的回调
const submit = async () => {
  // 整合参数，包括叶子节点跟半选中的父节点
  const permissionIdList = [
    ...permissionTreeRef.value.getCheckedKeys(),
    ...permissionTreeRef.value.getHalfCheckedKeys()
  ]
  // 发送请求，分配权限
  try {
    await reqAssignAcl({ permissionIdList, roleId: roleId.value as number })
    // 成功提示信息
    ElMessage({
      type: 'success',
      message: '保存成功'
    })
    // 关闭抽屉
    disAclDrawer.value = false
  } catch (error) {
    // 失败提示信息
    ElMessage({
      type: 'error',
      message: '保存失败'
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
