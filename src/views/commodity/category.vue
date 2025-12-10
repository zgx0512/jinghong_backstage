<template>
  <div class="container">
    <el-card>
      <el-button
        v-btnPermiss="'Add-Category'"
        type="primary"
        icon="Plus"
        class="add_btn"
        @click="openDialog"
        >添加分类</el-button
      >
      <el-table
        :data="classifyTableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="loading"
      >
        <el-table-column prop="name" label="名称" min-width="110px" />
        <el-table-column prop="createTime" label="创建时间" min-width="110px" align="center" />
        <el-table-column prop="updateTime" label="更新时间" min-width="110px" align="center" />
        <el-table-column label="操作" align="center" min-width="150px">
          <template #default="{ row }">
            <el-button v-btnPermiss="'Edit-Category'" type="primary" icon="Edit" size="small" @click="openDialog(row)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`确定删除${row.name}分类?`"
              @confirm="removeCategory(row)"
              width="180"
            >
              <template #reference>
                <el-button v-btnPermiss="'Delete-Category'" type="danger" icon="Delete" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加/编辑分类弹窗 -->
    <add-or-update-category ref="addOrUpdateCategoryRef" @refresh="refresh" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import addOrUpdateCategory from './components/addOrUpdateCategory.vue'
import { reqAllCategoryList, reqDeleteCategory } from '~/api/commodity/category'
import { ElMessage } from 'element-plus'
// 菜单表格数组对象
const classifyTableData = ref<categoryResponseType[]>([])
// 菜单数据加载效果
const loading = ref<boolean>(false)
// 获取分类列表
const getAllCategoryList = async () => {
  try {
    loading.value = true
    const result = await reqAllCategoryList()
    if (result.code === 200) {
      classifyTableData.value = result.data
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const addOrUpdateCategoryRef = ref<InstanceType<typeof addOrUpdateCategory>>()
const openDialog = (row: categoryResponseType = {}) => {
  addOrUpdateCategoryRef.value?.open(row)
}
const refresh = () => {
  getAllCategoryList()
}
const removeCategory = async (row: categoryResponseType) => {
  try {
    const res = await reqDeleteCategory(row.id as number)
    if (res.code === 200) {
      ElMessage.success(res.message)
      refresh()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getAllCategoryList()
})
</script>

<style lang="scss" scoped>
.add_btn {
  margin-bottom: 10px;
  :deep(span) {
    margin-top: 1px;
  }
}
</style>
