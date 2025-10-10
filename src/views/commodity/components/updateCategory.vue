<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改分类"
    width="450px"
    align-center
    class="category-dialog"
    @close="close"
  >
    <el-cascader
      v-model="categoryId"
      :options="categoryList"
      :show-all-levels="false"
      :props="cascaderProps"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
// 引入接口函数
import { reqAllCategoryList } from '~/api/commodity/category'
import { reqUpdateGoodsCategory } from '~/api/commodity/commodity-list'
import { ElMessage } from 'element-plus'
const emits = defineEmits(['refresh'])
const dialogVisible = ref<boolean>(false)
const categoryList = ref<categoryResponseType[]>([])
const cascaderProps = ref({
  value: 'id',
  label: 'name',
  children: 'children',
  emitPath: false
})
const goods_id = ref<number | string>()
const categoryId = ref<number | string>()
// 打开对话框的回调
const open = (row: GoodsResponseType) => {
  goods_id.value = row.goods_id
  categoryId.value = row.category_id
  // 打开对话框
  dialogVisible.value = true
  getCategoryList()
}

// 获取所有分类列表
const getCategoryList = async () => {
  try {
    const res = await reqAllCategoryList()
    categoryList.value = res.data
  } catch (error) {
    console.log(error)
  }
}

// 对话框关闭前的回调
const close = () => {
  // 关闭对话框
  dialogVisible.value = false
}

const btnLoading = ref<boolean>(false)
const confirm = async () => {
  try {
    btnLoading.value = true
    const data = {
      goods_id: goods_id.value,
      category_id: categoryId.value
    }
    await reqUpdateGoodsCategory(data)
    ElMessage.success('修改归属分类成功')
    // 通知父组件，刷新列表
    emits('refresh')
  } catch (error) {
    console.log(error)
  } finally {
    btnLoading.value = false
    close()
  }
}

defineExpose({
  open
})
</script>

<style lang="scss">
.category-dialog {
  .el-cascader {
    display: block;
  }
}
</style>
