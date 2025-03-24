<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2024-01-05 16:33:16
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-06 22:16:54
 * @FilePath: \taopinhui_vue3\src\views\acl\components\addOrUpdateRole.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    :model-value="props.dialogVisible"
    :title="title"
    width="50%"
    @close="emits('cancelAddOrUpdate')"
  >
    <el-form :model="roleForm" :rules="rules" ref="roleFormRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请你输入角色名称" v-model="roleForm.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, ref, nextTick } from 'vue'
import type { roleResponseType } from '~/api/acl/role/type'
import { roleNameValidatePass } from '~/utils/validate'
import { reqAddOrUpdateRole } from '~/api/acl/role'
import { ElMessage } from 'element-plus'
const props = withDefaults(
  defineProps<{
    dialogVisible: boolean
  }>(),
  {
    dialogVisible: false
  }
)
const emits = defineEmits(['cancelAddOrUpdate', 'submitAddOrUpdate', 'getRoleInfo'])
const roleFormRef = ref()
// 表单绑定对象
const roleForm = ref<roleResponseType>({
  id: '',
  roleName: ''
})
const title = ref<string>('添加角色')
// 表单校验规则
const rules = ref({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { validator: roleNameValidatePass, trigger: 'blur' }
  ]
})
// 取消按钮的回调
const cancel = () => {
  emits('cancelAddOrUpdate')
}
// 确认按钮加载效果
const loading = ref<boolean>(false)
// 确认按钮的回调
const submit = () => {
  if (!roleFormRef.value) return
  roleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // 发送请求，添加|修改角色
        const res: any = await reqAddOrUpdateRole(roleForm.value)
        if (res.code === 200) {
          // 成功，提示用户
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
          // 关闭对话框
          emits('submitAddOrUpdate')
          // 关闭加载效果
          loading.value = false
          // 重新获取用户列表数据
          emits('getRoleInfo', roleForm.value.id)
        } else {
          ElMessage({
            type: 'error',
            message: res.message || '保存失败'
          })
        }
      } catch (error) {
        // 失败的提示信息
        ElMessage({
          type: 'error',
          message: '保存失败'
        })
      } finally {
        // 关闭加载效果
        loading.value = false
      }
    } else {
      console.log('error submit!')
    }
  })
}
// 打开对话框，赋值
const open = (row: roleResponseType, titleName: string) => {
  roleForm.value = row
  title.value = titleName
}
// 清空文本框跟校验规则的函数
const clear = () => {
  roleForm.value.roleName = ''
  nextTick(() => {
    roleFormRef.value.clearValidate()
  })
}
// 将表单对象暴露出去
defineExpose({
  clear,
  open
})
</script>

<style lang="" scoped></style>
