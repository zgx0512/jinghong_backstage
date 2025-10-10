<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`${spuName}的SKU列表`"
    width="50%"
    :before-close="beforClose"
  >
    <tph-table :tableData="skuList" :tableHeadList="tableHeadList" v-loading="loading">
      <template #default="{ row }">
        <img style="width: 50px; display: inline-block" :src="row.skuDefaultImg" alt="" />
      </template>
    </tph-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// 引入接口函数
import { reqSkuListBySpuId } from '~/api/commodity/commodity-list'
// 引入ts类型
import { skuListResponseType, skuResponseType, spuResponseType } from '~/api/commodity/commodity-list/type'
const dialogVisible = ref<boolean>(false)
// 标题
const spuName = ref<string>('')
// sku列表
const skuList = ref<skuResponseType[]>([])
// sku列表表格的表头
const tableHeadList = ref([
  {
    label: '名称',
    property: 'skuName'
  },
  {
    label: '价格',
    property: 'price'
  },
  {
    label: '重量',
    property: 'weight'
  },
  {
    label: '默认图片'
  }
])
// 表格加载效果
const loading = ref<boolean>(false)
// 打开对话框的回调
const open = (row: spuResponseType) => {
  // 开启加载效果
  loading.value = true
  // 调用函数，获取数据
  getSkuList(row.id as number)
  // 标题
  spuName.value = row.spuName
  // 打开对话框
  dialogVisible.value = true
}
// 获取sku列表的函数
const getSkuList = async (id: number | string) => {
  const result: skuListResponseType = await reqSkuListBySpuId(id)
  if (result.code === 200) {
    skuList.value = result.data
    // 关闭加载效果
    loading.value = false
  }
}
// 对话框关闭前的回调
const beforClose = (done: () => void) => {
  // 清空表格数据
  skuList.value = []
  done()
}
defineExpose({
  open
})
</script>

<style lang="" scoped></style>
