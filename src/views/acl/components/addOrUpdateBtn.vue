<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="按钮名称" prop="btnName">
        <el-input placeholder="请你输入按钮名称" v-model="form.btnName"></el-input>
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
const dialogVisible = ref(false)
const title = ref('添加按钮')
const formRef = ref(null)
const form = ref({
  btnName: '',
  acl: '',
  menuId: ''
})
const rules = {
  btnName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
  acl: [{ required: true, message: '请输入按钮权限', trigger: 'blur' }],
  menuId: [{ required: true, message: '请选择菜单', trigger: 'blur' }]
}
const loading = ref(false)
// 打开对话框
const open = (row: any) => {
  dialogVisible.value = true
  if (row) {
    title.value = '编辑按钮'
    form.value = row
  } else {
    title.value = '添加按钮'
    form.value = {
      btnName: '',
      acl: '',
      menuId: ''
    }
  }
}
// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}
interface IMenu {
  id: number
  menuName: string
}
const menuList = ref<IMenu[]>([])
const menuProps = {
  label: 'menuName',
  value: 'id'
}
const handelChangeMenu = async (bool: boolean) => {
  if (!bool) return
  try {
    const res = await reqPermissionInfo()
    if (res.code === 200) {
      menuList.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}
const submit = () => {}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
