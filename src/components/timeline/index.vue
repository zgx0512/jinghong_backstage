<template>
  <el-timeline class="timeline">
    <el-timeline-item
      v-for="(record, index) in displayData"
      :key="index"
      :type="index === displayData.length - 1 && records.length <= 3 ? 'info' : 'primary'"
      :hollow="index > 0"
      :timestamp="record.op_time"
      hide-timestamp
    >
      <template #default>
        <p>{{ record.content }}</p>
        <p class="time">{{ record.op_time }}</p>
      </template>
    </el-timeline-item>
    <el-timeline-item
      v-show="records.length > 3"
      type="info"
      hollow
      hide-timestamp
      class="expand-btn"
    >
      <template #default>
        <div class="btn" @click="isExpand = !isExpand">
          {{ isExpand ? '折叠' : '展开全部' }}
        </div>
      </template>
    </el-timeline-item>
  </el-timeline>
  <div v-show="records.length === 0" class="no-data">暂无物流信息</div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from 'vue'

interface TimelineRecord {
  op_type?: string
  is_received?: number
  op_time?: string
  content: string
  express_name?: string
}

interface Props {
  records?: TimelineRecord[]
}

const props = withDefaults(defineProps<Props>(), {
  records: () => [] as TimelineRecord[]
})

const { records } = toRefs(props)

const isExpand = ref(false)
const displayData = computed(() => {
  return isExpand.value ? records.value : records.value.slice(0, 3)
})
</script>

<style lang="scss" scoped>
.timeline {
  .time {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
    margin-top: 8px;
  }
  :deep(.expand-btn) {
    .el-timeline-item__wrapper {
      .btn {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
  }
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
