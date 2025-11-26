<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="按钮名称" prop="name">
        <el-input placeholder="请你输入按钮名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="按钮图标" prop="icon">
        <IconSelect style="width: 100%" v-model="form.icon" />
      </el-form-item>
      <el-form-item label="权限值" prop="acl">
        <el-input placeholder="请你输入按钮权限值" v-model="form.acl"></el-input>
      </el-form-item>
      <el-form-item label="归属菜单" prop="menuId">
        <el-cascader
          v-model="form.menuId"
          :options="menuList"
          :props="menuProps"
          @visible-change="handelChangeMenu"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reqPermissionInfo } from '~/api/acl/permission'
import type { btnOperateResponseType } from '~/api/acl/btn/type'
import { addBtn, updateBtn } from '~/api/acl/btn'
import { ElMessage } from 'element-plus'
import IconSelect from '~/components/IconSelect.vue'
// 引入ts类型
import type { permissionResponseType } from '~/api/acl/permission/type'
const emit = defineEmits(['refresh'])
const dialogVisible = ref(false)
const title = ref('添加按钮')
const form = ref<permissionResponseType>({
  id: '',
  name: '',
  acl: '',
  menuId: '',
  icon: ''
})
const rules = {
  name: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
  acl: [{ required: true, message: '请输入按钮权限', trigger: 'blur' }],
  icon: { required: true, message: '请选择按钮图标', trigger: 'blur' },
  menuId: [{ required: true, message: '请选择菜单', trigger: 'blur' }]
}
const loading = ref(false)
// 打开对话框
const open = (row: permissionResponseType, str: string) => {
  dialogVisible.value = true
  // 移除掉formRef的验证
  if (formRef.value) {
    formRef.value.resetFields()
  }
  
  // 表单赋值
  if (str === 'update') {
    title.value = '编辑按钮'
    form.value = {
      id: row.btnId,
      name: row.name,
      acl: row.acl,
      menuId: row.parentId,
      icon: row.icon
    }
    // 获取菜单列表
    handelChangeMenu(true)
  } else {
    title.value = '添加按钮'
    form.value = {
      id: '',
      name: '',
      acl: '',
      menuId: '',
      icon: ''
    }
  }
}
// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}
// 请求菜单列表
interface IMenu {
  id: number
  name: string
  level: number
}
const menuList = ref<IMenu[]>([])
const menuProps = {
  label: 'name',
  value: 'id',
  emitPath: false
}
const handelChangeMenu = async (bool: boolean) => {
  if (!bool) return
  try {
    const params = {
      type: 1
    }
    const res = await reqPermissionInfo(params)
    if (res.code === 200) {
      menuList.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}
// 表单ref
const formRef = ref()
// 提交表单
const submit = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      let api = addBtn
      if (form.value.id) {
        api = updateBtn
      }
      // 表单校验成功
      const res: btnOperateResponseType = await api(form.value)
      if (res.code === 200) {
        ElMessage.success(res.message)
        dialogVisible.value = false
        // 通知父组件, 重新获取数据
        emit('refresh')
      } else {
        ElMessage.error(res.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  })
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
