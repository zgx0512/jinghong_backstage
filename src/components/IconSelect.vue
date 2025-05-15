<template>
  <div>
    <el-popover
      placement="bottom"
      :hide-after="0"
      :width="700"
      trigger="click"
      popper-class="icon-popover"
    >
      <template #reference>
        <el-input v-model="selectedIcon" :placeholder="placeholder" readonly @click="loadIcons">
        </el-input>
      </template>

      <div class="icon-container">
        <div class="icon-search">
          <el-input v-model="searchText" placeholder="搜索图标" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="icon-list">
          <div
            v-for="icon in customIcons"
            :key="icon.icon"
            class="icon-item"
            @click="selectIcon(icon.text)"
          >
            <el-icon>
              <component :is="icon.icon" />
            </el-icon>
            <span class="icon-name">{{ icon.text }}</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '点击选择图标'
  }
})

const emit = defineEmits(['update:modelValue'])

const icons = ref<string[]>([])
const searchText = ref('')
const selectedIcon = ref(props.modelValue)

// 加载图标
const loadIcons = () => {
  if (icons.value.length === 0) {
    icons.value = Object.keys(ElementPlusIconsVue)
  }
}

// 加上自定义图标文本
const customIcons = computed(() => {
  return icons.value
    .map((icon) => {
      const text = icon.replace(/([A-Z])/g, '-$1').toLowerCase()
      return {
        icon,
        text: `ep${text}`
      }
    })
    .filter((icon) => {
      return icon.text.includes(searchText.value)
    })
})

// 选择图标
const selectIcon = (icon: string) => {
  selectedIcon.value = icon
  // 清空搜索框
  searchText.value = ''
  // 触发外部值变化
  emit('update:modelValue', icon)
  // 关闭弹窗
  document.body.click()
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    selectedIcon.value = newVal
  }
)
</script>

<style scoped lang="scss">
.icon-container {
  max-height: 280px;
  overflow-y: hidden;
  .icon-search {
    padding: 10px;
  }

  .icon-list {
    height: 300px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 10px;
    padding-bottom: 50px;
    /* 隐藏滚动条但保持可滚动功能 */
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    /* Firefox */
    scrollbar-width: none;
    /* IE 和 Edge */
    -ms-overflow-style: none;
  }
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  height: 74px;

  &:hover {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  .el-icon {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .icon-name {
    font-size: 12px;
    text-align: center;
    word-break: break-all;
  }
}
</style>
