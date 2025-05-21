<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%">
    <el-form :label-width="100" ref="tmFormRef" :rules="rules" :model="tmInfo">
      <el-form-item label="品牌名称" prop="tmName">
        <el-input placeholder="请输入品牌名称" v-model="tmInfo.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          :headers="uploadHeaders"
          :action="`${env.VITE_BASE_URL}/upload`"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, defineEmits } from 'vue'
// 引入接口函数
import { reqAddorUpdateTM } from '~/api/product/trademark'
// 引入ts类型
import type { tmResponseType } from '~/api/product/trademark/type'
// 引入自定义校验规则
import { tmNameValidatePass, tmLogoValidatePass } from '~/utils/validate'
import { getToken } from '~/utils/token'
// 引入环境变量
const env = import.meta.env
const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`
}
// 接收父组件传递过来的函数
const emits = defineEmits(['submit'])
// 控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
const tmInfo = ref<tmResponseType>({
  id: '',
  tmName: '', // 品牌名称
  logoUrl: ''
})
// 存储修改前的品牌名称
const trademarkName = ref<string>('')
// 标题
const title = ref<string>('添加品牌')
// 图片
const imageUrl = ref<string>('')
// 表单的ref对象
const tmFormRef = ref()
// 表单校验规则
const rules = ref({
  tmName: [
    { required: true, message: '品牌名称不能为空', trigger: 'blur' },
    { validator: tmNameValidatePass, trigger: 'blur', tmName: trademarkName.value }
  ],
  logoUrl: {
    required: true,
    validator: (e1: any, e2: any, e3: any) => tmLogoValidatePass(e1, e2, e3, imageUrl.value)
  }
})
// 提交按钮加载效果
const loading = ref<boolean>(false)
// 打开对话框的回调
const open = (row: tmResponseType) => {
  if (row.id) {
    // 是修改
    title.value = '编辑品牌'
    tmInfo.value = JSON.parse(JSON.stringify(row))
    imageUrl.value = tmInfo.value.logoUrl as string
    trademarkName.value = tmInfo.value.tmName as string
  } else {
    // 是新增
    title.value = '添加品牌'
    tmInfo.value.tmName = ''
    imageUrl.value = ''
    tmInfo.value.id = ''
  }
  dialogVisible.value = true
}
// 图片上传成功后的回调
const handleAvatarSuccess = (res: any) => {
  if (res.code === 200) {
    imageUrl.value = res.data.url
  }
}
// 图片上传之前的回调
const beforeAvatarUpload = (file: any) => {
  if (
    file.type.indexOf('jpeg') === -1 &&
    file.type.indexOf('jpg') === -1 &&
    file.type.indexOf('png') === -1 &&
    file.type.indexOf('gif') === -1
  ) {
    // 图片不符合，提示用户
    ElMessage({
      type: 'error',
      message: '图片只能是jpg、png、jpeg、gif格式'
    })
    return false
  }
  if (file.size / 1024 / 1024 > 3) {
    // 图片大小不符合
    ElMessage({
      type: 'error',
      message: '图片大小不能超过3M'
    })
    return false
  }
  return true
}
// 确认按钮的回调
const submit = () => {
  // 表单校验
  if (!tmFormRef.value) return
  tmFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 开启加载效果
      loading.value = true
      // 通过, 整合参数
      tmInfo.value.logoUrl = imageUrl.value
      try {
        // 发送请求
        await reqAddorUpdateTM(tmInfo.value)
        // 成功提示信息
        ElMessage({
          type: 'success',
          message: '保存成功'
        })
        // 关闭加载效果
        loading.value = false
        // 关闭对话框
        dialogVisible.value = false
        // 告诉父组件，重新获取数据
        emits('submit', tmInfo.value.id)
      } catch (error) {
        // 失败提示信息
        ElMessage({
          type: 'error',
          message: '保存失败'
        })
        // 关闭加载效果
        loading.value = false
      }
    } else {
      console.log('error submit!')
    }
  })
}
defineExpose({
  open
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
