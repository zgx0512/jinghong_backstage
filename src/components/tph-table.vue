<template>
  <el-table
    :data="props.tableData"
    border
    style="margin: 10px 0"
    max-height="280"
    class="jh-table"
    tooltip-effect="light"
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
      :min-width="item.width"
      :align="item.align || 'center'"
      :fit="item.fit || true"
      show-overflow-tooltip
      :fixed="item.label === '操作' ? 'right' : false"
    >
      <template #default="{ row }">
        <!-- 如果有自定义渲染函数 -->
        <component
          v-if="item.component && item.component.render"
          :is="() => item.component!.render!(h, row)"
        />
        <!-- 插槽 -->
        <slot v-else-if="item.label === '操作' || item.label === '默认图片'" :row="row"></slot>
        <!-- 默认显示 -->
        <span v-else>{{ row[item.property] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, defineEmits, h } from 'vue'
const props = withDefaults(
  defineProps<{
    tableHeadList: {
      label: string
      property?: string
      width?: string
      fit?: boolean
      align?: string
      component?: {
        render?: Function
      }
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

<style lang="scss" scoped>
.jh-table {
  font-size: 13px;
}
</style>
