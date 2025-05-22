<!-- 
    分类选择器组件
 -->
<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryIds.category1Id"
          @change="category1IdChange"
          :disabled="props.disabled"
        >
          <el-option
            v-for="category1 in category1List"
            :key="category1.id"
            :label="category1.name"
            :value="category1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryIds.category2Id"
          @change="category2IdChange"
          :disabled="props.disabled"
        >
          <el-option
            v-for="category2 in category2List"
            :key="category2.id"
            :label="category2.name"
            :value="category2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryIds.category3Id"
          :disabled="props.disabled"
        >
          <el-option
            v-for="category3 in category3List"
            :key="category3.id"
            :label="category3.name"
            :value="category3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, watch, defineProps, withDefaults } from 'vue'
import { reqCategory1Info, reqCategory2Info, reqCategory3Info } from '~/api/commodity/category'
const emits = defineEmits(['initCategory'])
const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)
// 选出来的分类id
const categoryIds = ref({
  category1Id: '',
  category2Id: '',
  category3Id: ''
})
// 一级分类列表
const category1List = ref<categoryResponseType[]>([])
// 二级分类列表
const category2List = ref<categoryResponseType[]>([])
// 三级分类列表
const category3List = ref<categoryResponseType[]>([])
// 获取一级分类数据的函数
const getCategory1Info = async () => {
  // 调用接口
  const result = await reqCategory1Info()
  if (result.code === 200) {
    category1List.value = result.data
  }
}
// 页面挂载王碧
onMounted(() => {
  getCategory1Info()
})
// 一级分类发生变化时的回调
const category1IdChange = async () => {
  // 清空二级跟三级分类的id
  categoryIds.value.category2Id = ''
  categoryIds.value.category3Id = ''
  // 发起获取二级分类数据的请求
  const result = await reqCategory2Info(categoryIds.value.category1Id)
  if (result.code === 200) {
    category2List.value = result.data
  }
}
// 二级分类发生变化时的回调
const category2IdChange = async () => {
  // 清空三级分类id
  categoryIds.value.category3Id = ''
  // 发起获取三级分类数据的请求
  const result = await reqCategory3Info(categoryIds.value.category2Id)
  if (result.code === 200) {
    category3List.value = result.data
  }
}
// 监听三级分类的变化
watch(
  () => categoryIds.value.category3Id,
  () => {
    // 调用父组件方法，把三个分类id传给父组件
    emits('initCategory', categoryIds.value)
  }
)
</script>

<style lang="scss" scoped>
:deep(.is-hidden) {
  position: static !important;
}
</style>
