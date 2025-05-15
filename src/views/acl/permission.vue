<template>
  <div class="container">
    <el-card>
      <el-button type="primary" icon="Plus" class="add_btn" @click="openDialog({}, 'add')"
        >添加菜单</el-button
      >
      <el-button type="primary" icon="Plus" class="add_btn" @click="openBtnDialog({}, 'add')"
        >添加权限按钮</el-button
      >
      <el-table
        :data="permissionTableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="loading"
      >
        <el-table-column prop="name" label="名称" min-width="110px" />
        <el-table-column prop="path" label="路径" min-width="110px" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column prop="acl" label="权限值"></el-table-column>
        <el-table-column prop="type" label="类别">
          <template #default="{ row }">
            <span>{{ row.type === 'menu'? '菜单' : '按钮' }}</span>
          </template>  
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="110px" align="center" />
        <el-table-column prop="updateTime" label="更新时间" min-width="110px" align="center" />
        <el-table-column label="操作" align="center" min-width="150px">
          <template #default="{ row }">
            <el-button type="primary" icon="Edit" size="small" @click="handleOpenDialog(row, 'update')"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`确定删除${row.name}${row.type === 'menu' ? '菜单' : '按钮'}?`"
              @confirm="removePermission(row)"
              width="180"
            >
              <template #reference>
                <el-button type="danger" icon="Delete" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加|修改菜单对话框 -->
    <el-dialog v-model="dialogVisible" :title="title" width="50%" :close-on-click-modal="false">
      <el-form label-width="80" :rules="rules" :model="permissionForm" ref="permissionFormRef">
        <el-form-item label="菜单名称" prop="name">
          <el-input placeholder="请输入菜单名称" v-model="permissionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input placeholder="请输入菜单路径" v-model="permissionForm.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <IconSelect style="width: 100%" v-model="permissionForm.icon" />
        </el-form-item>
        <el-form-item label="权限值" prop="acl">
          <el-input placeholder="请输入权限值" v-model="permissionForm.acl"></el-input>
        </el-form-item>
        <el-form-item label="菜单等级" prop="level">
          <el-select
            v-model="permissionForm.level"
            placeholder="请选择菜单等级"
            @change="handelChangeLevel"
          >
            <el-option
              v-for="item in menuLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="permissionForm.level !== 1"
          label="归属菜单"
          prop="parentId"
          :rules="[{ required: true, message: '请选择归属菜单！', trigger: 'change' }]"
        >
          <el-select
            v-model="permissionForm.parentId"
            placeholder="请选择归属菜单"
            @visible-change="getMenuListByLevel"
          >
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="`${item.menuName}(${item.menuPath})`"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit" :loading="submitLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加|修改按钮对话框 -->
    <addOrUpdateBtn ref="addOrUpdateBtnRef" @refresh="refresh"></addOrUpdateBtn>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'
import IconSelect from '~/components/IconSelect.vue'
import addOrUpdateBtn from './components/addOrUpdateBtn.vue'
// 引入接口函数
import {
  reqPermissionInfo,
  reqRemovePermission,
  reqAddOrUpdatePermission,
  reqMenuByLevel
} from '~/api/acl/permission'
import { removeBtn } from '~/api/acl/btn'
// 引入ts类型
import type { permissionResponseType } from '~/api/acl/permission/type'
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
  path: '',
  level: 1,
  parentId: '',
  icon: '',
  acl: ''
})
// 表单校验规则
// 添加|修改菜单表单校验规则
const rules = ref({
  name: { required: true, message: '菜单名称不能为空！', trigger: 'blur' },
  acl: { required: true, message: '权限值不能为空！', trigger: 'blur' },
  icon: { required: true, message: '菜单图标不能为空！', trigger: 'blur' },
  path: { required: true, message: '菜单路径不能为空！', trigger: 'blur' },
  level: { required: true, message: '菜单等级不能为空！', trigger: 'blur' }
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
const removePermission = async (row: permissionResponseType) => {
  let api = reqRemovePermission
  let id = row.id!
  if (row.type === 'btn') {
    api = removeBtn
    id = row.btnId!
  }
  // 调用接口
  const result = await api(id)
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
const handleOpenDialog = (row: permissionResponseType, str: string) => {
  if (row.type === 'menu') {
    openDialog(row, str);
  } else if (row.type === 'btn') {
    openBtnDialog(row, str);
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
    path: '',
    level: 1,
    parentId: '',
    icon: '',
    acl: ''
  }
  // 清空校验信息
  nextTick(() => {
    permissionFormRef.value.clearValidate()
  })
  if (str === 'add') {
    // 添加操作，level值是当前值 - 1
    // permissionForm.value.level = row.level + 1
    // 添加父级id
    permissionForm.value.parentId = Number(row.id)
    title.value = '添加菜单'
  } else {
    permissionForm.value = JSON.parse(JSON.stringify(row))
    title.value = '修改菜单'
    if (permissionForm.value.level !== 1) {
      // 不是一级菜单，获取父级菜单列表
      getMenuListByLevel(true)
    }
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
        const res: any = await reqAddOrUpdatePermission(permissionForm.value)
        if (res.code === 200) {
          // 成功提示信息
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
          // 重新获取菜单数据
          getPermissionInfo()
          // 关闭对话框
          dialogVisible.value = false
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      } catch (error) {
        // 失败提示信息
        ElMessage({
          type: 'error',
          message: '保存失败'
        })
      } finally {
        // 关闭加载效果
        submitLoading.value = false
      }
    } else {
      console.log('error submit!')
    }
  })
}
// 菜单等级列表
const menuLevelList = [
  {
    label: '一级菜单',
    value: 1
  },
  {
    label: '二级菜单',
    value: 2
  },
  {
    label: '三级菜单',
    value: 3
  }
]
const handelChangeLevel = () => {
  // 菜单等级发生变化，清空父级菜单列表
  parentMenuList.value = []
  // 清空父级菜单id
  permissionForm.value.parentId = ''
}
// 归属菜单列表
const parentMenuList = ref<any[]>([])
// 根据菜单等级获取菜单列表
const getMenuListByLevel = async (visible: boolean) => {
  if (!visible) return
  try {
    const result = await reqMenuByLevel(permissionForm.value.level as number)
    if (result.code === 200) {
      parentMenuList.value = result.data
    } else {
      ElMessage({
        type: 'error',
        message: result.message
      })
    }
  } catch (error) {
    console.log(error)
  }
}
const addOrUpdateBtnRef = ref()
const openBtnDialog = (row: permissionResponseType, str: string) => {
  if (!addOrUpdateBtnRef.value) return;
  addOrUpdateBtnRef.value.open(row, str)
}
const refresh = () => {
  getPermissionInfo()
}
</script>

<style lang="scss" scoped>
.add_btn {
  margin-bottom: 10px;
  :deep(span) {
    margin-top: 1px;
  }
}
// .el-table {
//   :deep(.el-table__header) {
//     .el-table-fixed-column--right {
//       border-bottom: 1px solid #dcdfe6;
//     }
//   }
// }
</style>
