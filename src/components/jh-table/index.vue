<template>
  <div class="jh-table-container">
    <el-table
      :data="props.data"
      border
      class="jh-table"
      tooltip-effect="light"
      v-bind="props.tableOptions"
      @selection-change="handleSelectiChange"
      @sort-change="handleSortChange"
      @header-dragend="handleHeaderDragEnd"
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
        v-for="(item, index) in props.tableColumns"
        :key="index"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
        :fit="item.fit || true"
        :fixed="item.fixed || false"
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
    <!-- 分页器 -->
    <el-pagination
      v-if="showPagination"
      v-model:current-page="page_info.page"
      v-model:page-size="page_info.limit"
      :page-sizes="page_info.page_sizes"
      size="small"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="page_info.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'JhTable'
})
import { defineProps, withDefaults, defineEmits, h } from 'vue'
const props = withDefaults(
  defineProps<{
    tableColumns: JHTableColumnType[]
    tableOptions: JHTableOptionsType
    data: any[]
    tableProp: JHTablePropType
    page_info: JHTablePageInfoType
    showPagination?: boolean
    selectProps?: JHTableSelctPropsType
  }>(),
  {
    tableProp: () => ({
      isSelect: false,
      index: false,
      isZh: false
    }),
    showPagination: true,
    page_info: () => ({
      page: 1,
      limit: 10,
      total: 0,
      page_sizes: [3, 5, 10, 20]
    })
  }
)
const emits = defineEmits([
  'selection-change',
  'size-change',
  'current-change',
  'sort-change',
  'header-dragend'
])
// 复选框发生改变时的回调
const handleSelectiChange = (selection: any) => {
  // map数组，将id筛选出来
  const idList = selection.map((item: any) => item.id)
  emits('selection-change', idList)
}

// 改变分页大小
const handleSizeChange = (val: number) => {
  emits('size-change', val)
}

// 改变当前页
const handleCurrentChange = (val: number) => {
  emits('current-change', val)
}

// 排序
const handleSortChange = (val: any) => {
  emits('sort-change', val)
}

// 改变列宽度
const handleHeaderDragEnd = (newWidth: number, oldWidth: number, column: any) => {
  emits('header-dragend', { newWidth, oldWidth, column })
}
</script>

<style lang="scss" scoped>
.jh-table-container {
  // margin: 0 10px 10px 10px;
}
.jh-table {
  margin: 10px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--el-table-border-color);
  :deep(.el-table__body-wrapper) {
    .el-scrollbar {
      min-height: 350px;
    }
  }
}
</style>
