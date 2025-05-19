<template>
  <div class="login-wrap">
    <div class="login-left"></div>
    <div class="flex flex-col login-main">
      <div class="p-12 py-20 transition-all rounded hover:shadow-lg hover:bg-indigo-50">
        <h1 class="text-2xl">Welcome back</h1>
        <p class="text-sm text-gray-400">Enter the infomation you entered while registing</p>
        <el-form
          class="mt-8"
          :model="param"
          :rules="rules"
          ref="login"
          label-position="top"
          size="large"
        >
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="param.email" placeholder="请输入邮箱"> </el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
            >
            </el-input>
          </el-form-item>
          <div>
            <el-button class="w-full" type="primary" @click="submitForm(login)" :loading="loading"
              >登录</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useTagsStore } from '../../store/tags'
import { useUserStore } from '~/store/user'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UserInfo } from '~/types/index'
import { emailValidatePass } from '~/utils/validate'

const router = useRouter()
const param: UserInfo = reactive({
  email: '2324461523@qq.com',
  password: 'A123456'
})
// 登录按钮加载效果
const loading = ref<boolean>(false)
const rules: FormRules = {
  email: [
    {
      required: true,
      validator: emailValidatePass,
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const userStore = useUserStore()
const login = ref<FormInstance>()
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true
        const result = await userStore.userLogin(param)
        if (result.bool) {
          ElMessage({
            type: 'success',
            message: '登录成功'
          })
          router.push('/')
          // userStore.getUserInfo()
        } else {
          ElMessage({
            type: 'error',
            message: result.message || '登录失败'
          })
        }
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false
      }
    }
  })
}

const tags = useTagsStore()
tags.clearTags()
</script>

<style scoped lang="scss">
.login-wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.login-left {
  position: absolute;
  width: 50%;
  height: 100vh;
  background-image: url(~/assets/images/login-vector.png);
  background-size: contain;
  background-position: 80% center;
  background-repeat: no-repeat;
}
.login-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: calc(50% + 100px);
  width: 460px;

  height: 100%;
}
</style>
