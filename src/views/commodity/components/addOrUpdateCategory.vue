<template>
  <el-dialog v-model="dialogVisible" :title="title" width="50%" :close-on-click-modal="false">
    <el-form label-width="80" :rules="rules" :model="categoryForm" ref="formRef">
      <el-form-item label="类别名称" prop="name">
        <el-input placeholder="请输入类别名称" v-model="categoryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="类别等级" prop="level">
        <el-select
          v-model="categoryForm.level"
          placeholder="请选择类别等级"
          @change="handelChangeLevel"
        >
          <el-option
            v-for="item in categoryLevelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="categoryForm.level !== 1"
        label="归属类别"
        prop="parentId"
        :rules="[{ required: true, message: '请选择归属类别！', trigger: 'change' }]"
      >
        <el-select
          v-model="categoryForm.parentId"
          placeholder="请选择归属类别"
          @visible-change="getCategoryListByLevel"
        >
          <el-option
            v-for="item in parentCategoryList"
            :key="item.id"
            :label="`${item.name}`"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  reqClassifyByLevel,
  reqAddCategory,
  reqUpdateCategory,
  reqEditClassifyByLevel
} from '~/api/commodity/category'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refresh'])
// 对话框状态
const dialogVisible = ref(false)
// 对话框标题
const title = ref('新增分类')
// 表单数据
const categoryForm = ref<categoryResponseType>({})
// 表单规则
const rules = ref({
  name: [
    { required: true, message: '请输入类别名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  level: [{ required: true, message: '请选择类别等级', trigger: 'change' }]
})
// 类别等级
const categoryLevelList = ref([
  { value: 1, label: '一级分类' },
  { value: 2, label: '二级分类' },
  { value: 3, label: '三级分类' }
])
const handelChangeLevel = () => {
  if (categoryForm.value.level === 1) {
    categoryForm.value.parentId = null
    return
  }
  getCategoryListByLevel()
}
const parentCategoryList = ref<categoryResponseType[]>([])
const getCategoryListByLevel = async () => {
  try {
    let res;
    if (categoryForm.value.id) {
      const parmas = {
        level: categoryForm.value.level! - 1,
        id: categoryForm.value.id
      }
      res = await reqEditClassifyByLevel(parmas)
    } else {
      const level = categoryForm.value.level! - 1
      res = await reqClassifyByLevel(level as number)
    }
    parentCategoryList.value = res.data
  } catch (error) {
    console.log(error)
  }
}
const formRef = ref()
const submitLoading = ref(false)
const submit = () => {
  // 表单校验
  if (!formRef.value) return
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const api = categoryForm.value.id ? reqUpdateCategory : reqAddCategory
      const res = await api(categoryForm.value)
      if (res.code === 200) ElMessage.success(categoryForm.value.id ? '修改成功' : '新增成功')
      else ElMessage.error(res.message)
      // 成功，关闭对话框，通知父组件重新获取列表数据
      dialogVisible.value = false
      emit('refresh')
    } catch (error) {
      console.log(error)
    } finally {
      submitLoading.value = false
    }
  })
}

const open = (row: categoryResponseType = {}) => {
  if (row.id) {
    // 编辑
    title.value = '编辑分类'
    categoryForm.value = JSON.parse(JSON.stringify(row))
    getCategoryListByLevel();
  } else {
    // 新增
    title.value = '新增分类'
    categoryForm.value = {
      id: '',
      name: '',
      level: 1,
      parentId: ''
    }
  }
  dialogVisible.value = true
}

defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
