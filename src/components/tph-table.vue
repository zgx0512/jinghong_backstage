<template>
  <el-table
    :data="props.tableData"
    border
    style="margin: 10px 0"
    max-height="280"
    @selection-change="selectionChange"
  >
    <el-table-column type="selection" width="55" v-if="props.tableProp.isSelect" align="center" />
    <el-table-column
      type="index"
      :label="props.tableProp.isZh ? '序号' : '#'"
      :width="props.tableProp.isZh ? '80' : '55'"
      align="center"
      v-if="props.tableProp.index"
    ></el-table-column>
    <el-table-column
      v-for="(item, index) in props.tableHeadList"
      :key="index"
      :label="item.label"
      :property="item.property"
      :min-width="item.width"
      align="center"
      show-overflow-tooltip
      :fixed="item.label === '操作' ? 'right' : false"
    >
      <template #default="{ row }">
        <slot v-if="item.label === '操作' || item.label === '默认图片'" :row="row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, defineEmits } from 'vue'
const props = withDefaults(
  defineProps<{
    tableHeadList: {
      label: string
      property?: string
      width?: string
    }[]
    tableData: never[]
    tableProp: {
      isSelect?: boolean
      index?: boolean
      isZh?: boolean
    }
  }>(),
  {
    tableProp: () => ({
      isSelect: false,
      index: false,
      isZh: false
    })
  }
)
const emits = defineEmits(['selectionChange'])
// 复选框发生改变时的回调
const selectionChange = (selection: any) => {
  // map数组，将id筛选出来
  const idList = selection.map((item: any) => item.id)
  emits('selectionChange', idList)
}
</script>

<style lang="" scoped></style>
