<template>
  <div class="container">
    <el-table
      :data="permissionTableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-loading="loading"
    >
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="menuPath" label="菜单路径" />
      <el-table-column prop="menuIcon" label="菜单图标" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="updateTime" label="更新时间" align="center" />
      <el-table-column label="操作" align="center" minWidth="150px">
        <template #default="{ row }">
          <el-button
            type="warning"
            icon="Plus"
            size="small"
            :disabled="row.level === 4"
            @click="openDialog(row, 'add')"
            >{{ row.level === 3 ? '添加功能' : '添加菜单' }}</el-button
          >
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            :disabled="row.level === 1"
            @click="openDialog(row, 'update')"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`确定删除${row.name}?`"
            @confirm="removePermission(row.id)"
            width="180"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" size="small" :disabled="row.level === 1"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加|修改菜单对话框 -->
    <el-dialog v-model="dialogVisible" :title="title" width="50%">
      <el-form label-width="80" :rules="rules" :model="permissionForm" ref="permissionFormRef">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入菜单名称" v-model="permissionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值" prop="code">
          <el-input placeholder="请输入权限值" v-model="permissionForm.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit" :loadind="submitLoading"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'
// 引入接口函数
import {
  reqPermissionInfo,
  reqRemovePermission,
  reqAddOrUpdatePermission
} from '~/api/acl/permission'
// 引入ts类型
import { permissionResponseType } from '~/api/acl/permission/type'
// 菜单表格数组对象
const permissionTableData = ref([])
// 菜单数据加载效果
const loading = ref<boolean>(false)
// 控制添加|修改菜单显示与隐藏
const dialogVisible = ref<boolean>(false)
// 对话框标题
const title = ref<string>('添加菜单')
// 添加|修改菜单的ref对象
const permissionFormRef = ref()
// 添加|修改菜单表单对象
const permissionForm = ref<permissionResponseType>({
  id: '',
  name: '',
  code: '',
  level: 0,
  pid: ''
})
// 添加|修改菜单表单校验规则
const rules = ref({
  name: { required: true, message: '菜单名称不能为空！', trigger: 'blur' },
  code: { required: true, message: '权限值不能为空！', trigger: 'blur' }
})
// 获取菜单数据的函数
const getPermissionInfo = async () => {
  loading.value = true
  const result = await reqPermissionInfo()
  if (result.code === 200) {
    permissionTableData.value = result.data
    loading.value = false
  }
}
onMounted(() => {
  getPermissionInfo()
})
// 删除按钮的回调
const removePermission = async (id: string | number) => {
  // 调用接口
  const result = await reqRemovePermission(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 重新获取菜单数据
    getPermissionInfo()
  } else {
    // 失败，提示用户
    ElMessage({
      type: 'error',
      message: result.data
    })
  }
}
// 添加|修改菜单按钮的回调
const openDialog = (row: permissionResponseType, str: string) => {
  // 打开对话框
  dialogVisible.value = true
  // 清空上一次的数据
  permissionForm.value = {
    id: '',
    name: '',
    code: '',
    level: 0,
    pid: ''
  }
  // 清空校验信息
  nextTick(() => {
    permissionFormRef.value.clearValidate()
  })
  if (str === 'add') {
    // 添加操作，level值是当前值 - 1
    permissionForm.value.level = row.level + 1
    // 添加父级id
    permissionForm.value.pid = row.id
    title.value = row.level === 3 ? '添加功能' : '添加菜单'
  } else {
    permissionForm.value = JSON.parse(JSON.stringify(row))
    title.value = row.level === 3 ? '修改功能' : '修改菜单'
  }
}
// 确认按钮的加载效果
const submitLoading = ref<boolean>(false)
// 确认按钮的回调
const submit = () => {
  if (!permissionFormRef.value) return
  permissionFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 开启加载效果
      submitLoading.value = true
      // 校验通过
      submitLoading.value = true
      try {
        // 调用接口
        await reqAddOrUpdatePermission(permissionForm.value)
        // 成功提示信息
        ElMessage({
          type: 'success',
          message: '保存成功'
        })
        // 关闭加载效果
        submitLoading.value = false
        // 重新获取菜单数据
        getPermissionInfo()
        // 关闭对话框
        dialogVisible.value = false
      } catch (error) {
        // 关闭加载效果
        submitLoading.value = false
        // 失败提示信息
        ElMessage({
          type: 'error',
          message: '保存失败'
        })
      }
    } else {
      console.log('error submit!')
    }
  })
}
</script>

<style lang="" scoped></style>
