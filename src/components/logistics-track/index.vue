<template>
  <div class="logistics-track">
    <!-- 快递单号 -->
    <div class="logistics-header">
      <span class="courier">{{ courierName }}</span>
      <span class="number">{{ trackingNumber }}</span>
    </div>
    <!-- 加载效果 -->
    <div v-if="loading" class="loader-box">
      <div class="loader"></div>
    </div>
    <!-- 物流轨迹 -->
    <template v-else>
      <el-timeline class="logistics-track-list">
        <el-timeline-item
          v-for="(item, index) in trackList"
          :key="index"
          :timestamp="item.op_time"
          placement="top"
        >
          <div class="track-title">{{ item.op_type }}</div>
          <div class="track-content">{{ item.content }}</div>
        </el-timeline-item>
      </el-timeline>
      <div v-show="trackList.length === 0" class="no-data">暂无物流信息</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

defineOptions({ name: 'LogisticsTrack' })

interface Props {
  courierName?: string
  trackingNumber?: string
  trackList?: ICheckpoint[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  courierName: '',
  trackingNumber: '',
  trackList: () => [],
  loading: true
})

const { courierName, trackingNumber, loading, trackList } = toRefs(props)
</script>

<style lang="scss" scoped>
.logistics-track {
  min-height: 300px;
  display: flex;
  flex-direction: column;

  .logistics-header {
    margin-left: 10px;
    margin-bottom: 12px;

    .courier {
      font-size: 16px;
      font-weight: bold;
      margin-right: 4px;
      color: var(--el-text-color-primary);
    }

    .number {
      font-size: 16px;
      color: var(--el-text-color-primary);
    }
  }

  ::v-deep .el-timeline {
    padding-left: 10px;
    max-height: 300px;
    padding-right: 10px;
    overflow-y: auto;
    font-size: 13px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }

    .el-timeline-item {
      padding-bottom: 20px;

      .el-timeline-item__timestamp {
        color: var(--el-text-color-secondary);
        font-size: 13px;
        margin-bottom: 8px;
        margin-left: 156px;
        &.is-top {
          padding-top: 5px;
        }
      }
      .el-timeline-item__node--normal {
        width: 8px;
        height: 8px;
        left: 1px;
        top: 3px;
      }
      .el-timeline-item__tail {
        top: 3px;
      }
      .el-timeline-item__wrapper {
        top: -5px;
      }

      .track-content {
        font-size: 13px;
        color: var(--el-text-color-regular);
        line-height: 1.5;
      }
      .track-title {
        position: absolute;
        left: 27px;
        top: 2px;
        font-size: 14px;
        color: var(--el-text-color-primary);
        font-weight: 500;
      }
      &:last-child {
        padding-bottom: 0;
      }
    }
  }
}
.loader-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  .loader {
    border: 3px solid var(--el-border-color-light);
    border-top-color: var(--el-color-primary);
    border-left-color: var(--el-color-primary);
    border-right-color: var(--el-color-primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto; /* 居中 */
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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
