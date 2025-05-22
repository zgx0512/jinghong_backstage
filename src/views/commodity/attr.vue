<template>
  <div class="container">
    <!-- 分类选择器卡片 -->
    <el-card style="margin-bottom: 10px; height: 74px">
      <Category @initCategory="initCategory" :disabled="!showData"></Category>
    </el-card>
    <!-- 数据展示卡片 -->
    <el-card v-if="showData">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="!category3Id"
        style="margin-bottom: 10px"
        @click="addOrUpdateAttr"
        >添加属性</el-button
      >
      <el-table :data="attrInfo" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="attrName" label="属性名称" width="180" align="center" />
        <el-table-column label="属性值名称" align="center">
          <template #default="{ row }">
            <el-tag
              v-for="(attr, index) in row.attrValueList"
              :class="{ tag_box: index < row.attrValueList.length - 1 }"
              :type="tagType[index % 4]"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click="addOrUpdateAttr(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.attrName}?`"
              @confirm="removeAttr(row.id)"
              width="180"
            >
              <template #reference>
                <el-button type="danger" icon="Delete" size="small"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加|修改属性卡片 -->
    <AddOrupdateAttr
      v-else
      @cancel="cancel"
      @submit="submit"
      ref="addOrUpdateAttrRef"
    ></AddOrupdateAttr>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
// 引入分类选择器组件
import Category from '~/components/category.vue'
// 引入接口函数
import { reqAttrInfo, reqRemoveAttr } from '~/api/commodity/attr'
// 引入ts类型
import type { attrReponseType } from '~/api/commodity/attr/type'
// 引入子组件
import AddOrupdateAttr from './components/addOrupdateAttr.vue'
import { ElMessage } from 'element-plus'
// 一级分类id
const category1Id = ref<string>('')
// 二级分类id
const category2Id = ref<string>('')
// 三级分类id
const category3Id = ref<string>('')
// 商品基础属性列表
const attrInfo = ref<attrReponseType[]>([])
// 表格加载小姑
const loading = ref<boolean>(false)
// tag标签的类型
const tagType = ['primary', 'warning', 'danger', 'success']
// 控制显示的是数据卡片还是添加卡片的属性
const showData = ref<boolean>(true)
// 添加|修改属性的ref对象
const addOrUpdateAttrRef = ref()
// 获取商品基础属性列表的函数
const getAttrInfo = async () => {
  // 开启加载效果
  loading.value = true
  try {
    const result = await reqAttrInfo(category1Id.value, category2Id.value, category3Id.value)
    if (result.code === 200) {
      attrInfo.value = result.data
    }
    // 关闭加载效果
    loading.value = false
  } catch (error) {
    // 关闭加载效果
    loading.value = false
  }
}
// 接收子组件传递过来的分类id
const initCategory = (ids: any) => {
  category1Id.value = ids.category1Id
  category2Id.value = ids.category2Id
  category3Id.value = ids.category3Id
  if (category3Id.value) {
    // 三级分类id存在，可以调用接口，获取数据
    getAttrInfo()
  } else {
    // 三级分类id为空，清空属性列表
    attrInfo.value = []
  }
}
const cancel = () => {
  // 切换卡片
  showData.value = true
}
const submit = () => {
  // 切换卡片
  showData.value = true
  // 重新获取属性列表数据
  getAttrInfo()
}
// 添加属性按钮的回调
const addOrUpdateAttr = (row: attrReponseType) => {
  // 切换卡片
  showData.value = false
  nextTick(() => {
    // 将三级分类id传过去
    addOrUpdateAttrRef.value.open(row, category3Id.value)
  })
}
// 删除按钮的回调
const removeAttr = async (id: number | string) => {
  try {
    await reqRemoveAttr(id)
    // 成功提示信息
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 重新获取表格数据
    getAttrInfo()
  } catch (error) {
    // 失败提示信息
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<style lang="scss" scoped>
.tag_box {
  margin-right: 5px;
}
</style>
