<template>
  <div
    class="page-filter"
    :style="{
      fontSize: useFont12 ? '12px' : '14px',
      '--el-font-size-base': useFont12 ? '12px' : '14px'
    }"
  >
    <el-row :gutter="16" class="page-filter-container">
      <el-col
        :span="colspan"
        v-for="(config, index) in props.filterConfigs"
        v-show="index < maxCount"
        :key="config.value"
      >
        <template v-if="config.isSlot">
          <slot :name="config.slotName"></slot>
        </template>
        <!-- 输入框 -->
        <template v-else-if="config.type === 'input'">
          <section class="filter-section">
            <!-- 左侧标题 -->
            <div class="filter-section__label">{{ config.label }}</div>
            <el-input
              v-model="conditions[config.value]"
              :placeholder="config.placeholder || ''"
              :clearable="config.clearable || true"
              v-bind="config.other_config || {}"
              class="filter-section__common"
              @keyup.enter="search"
            >
              <template #append>
                <el-icon @click="search">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </section>
        </template>
        <!-- 下拉框 -->
        <template v-else-if="config.type === 'select'">
          <section class="filter-section">
            <!-- 左侧标题 -->
            <div class="filter-section__label">{{ config.label }}</div>
            <el-select
              v-model="conditions[config.value]"
              :placeholder="config.placeholder || '请选择'"
              :clearable="config.clearable || true"
              :disabled="config.disabled || false"
              :multiple="config.multiple"
              v-bind="config.other_config || {}"
              class="filter-section__common"
              @change="search"
            >
              <el-option
                v-for="item in config.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </section>
        </template>
        <!-- 级联选择器 -->
        <template v-else-if="config.type === 'cascader'">
          <section class="filter-section">
            <!-- 左侧标题 -->
            <div class="filter-section__label">{{ config.label }}</div>
            <el-cascader
              v-model="conditions[config.value]"
              :options="config.options"
              :placeholder="config.placeholder || '请选择'"
              :disabled="config.disabled || false"
              :clearable="config.clearable || true"
              :props="config.props || {}"
              :filterable="config.filterable || false"
              :collapse-tags="true"
              v-bind="config.other_config || {}"
              class="filter-section__common"
              @change="search"
            />
          </section>
        </template>
        <!-- 日期选择器 -->
        <template v-else-if="config.type === 'date'">
          <section class="filter-section">
            <!-- 左侧标题 -->
            <div class="filter-section__label">{{ config.label }}</div>
            <el-date-picker
              v-model="conditions[config.value]"
              type="date"
              :placeholder="config.placeholder || '请选择'"
              :clearable="config.clearable || true"
              :disabled-date="disabledDate"
              :shortcuts="dateShortcuts"
              value-format="YYYY-MM-DD"
              v-bind="config.other_config || {}"
              class="filter-section__common"
              @change="search"
            />
          </section>
        </template>
        <!-- 日期选择器（选择一段时间） -->
        <template v-else-if="config.type === 'daterange'">
          <section class="filter-section">
            <!-- 左侧标题 -->
            <div class="filter-section__label">{{ config.label }}</div>
            <el-date-picker
              v-model="conditions[config.value]"
              type="daterange"
              :placeholder="config.placeholder || '请选择'"
              :clearable="config.clearable || true"
              :disabled-date="disabledDate"
              :shortcuts="daterangeShortcuts"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              value-format="YYYY-MM-DD"
              v-bind="config.other_config || {}"
              class="filter-section__common"
              @change="search"
            />
          </section>
        </template>
        <!-- 复合选择器 -->
        <template v-else-if="config.type === 'compound'">
          <section class="filter-section">
            <!-- 左侧标题 -->
            <div class="filter-section__label">
              <el-select
                v-model="config.compound_key"
                class="header-select"
                @change="handleChangeCompound"
              >
                <el-option
                  v-for="item in config.children"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <template v-for="child in config.children" :key="child.value">
              <template v-if="config.compound_key === child.value">
                <template v-if="child.type === 'input'">
                  <el-input
                    v-model="conditions[config.compound_key]"
                    :placeholder="child.placeholder || ''"
                    :clearable="child.clearable || true"
                    v-bind="child.other_config || {}"
                    class="filter-section__common"
                    @keyup.enter="search"
                  >
                    <template #append>
                      <el-icon @click="search">
                        <Search />
                      </el-icon>
                    </template>
                  </el-input>
                </template>
                <template v-else-if="child.type === 'select'">
                  <el-select
                    v-model="conditions[config.compound_key]"
                    :placeholder="child.placeholder || '请选择'"
                    :clearable="child.clearable || true"
                    :disabled="child.disabled || false"
                    :multiple="child.multiple"
                    v-bind="child.other_config || {}"
                    class="filter-section__common"
                    @change="search"
                  >
                    <el-option
                      v-for="item in child.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <template v-else-if="child.type === 'cascader'">
                  <el-cascader
                    v-model="conditions[config.compound_key]"
                    :options="child.options"
                    :placeholder="child.placeholder || '请选择'"
                    :disabled="child.disabled || false"
                    :clearable="child.clearable || true"
                    :props="child.props || {}"
                    :filterable="child.filterable || false"
                    :collapse-tags="true"
                    v-bind="child.other_config || {}"
                    class="filter-section__common"
                    @change="search"
                  />
                </template>
                <template v-else-if="child.type === 'date'">
                  <el-date-picker
                    v-model="conditions[config.compound_key]"
                    type="date"
                    :placeholder="child.placeholder || '请选择'"
                    :clearable="child.clearable || true"
                    :disabled-date="disabledDate"
                    :shortcuts="dateShortcuts"
                    value-format="YYYY-MM-DD"
                    v-bind="child.other_config || {}"
                    class="filter-section__common"
                    @change="search"
                  />
                </template>
                <template v-else-if="child.type === 'daterange'">
                  <el-date-picker
                    v-model="conditions[config.compound_key]"
                    type="daterange"
                    :placeholder="child.placeholder || '请选择'"
                    :clearable="child.clearable || true"
                    :disabled-date="disabledDate"
                    :shortcuts="daterangeShortcuts"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    value-format="YYYY-MM-DD"
                    v-bind="child.other_config || {}"
                    class="filter-section__common"
                    @change="search"
                  />
                </template>
              </template>
            </template>
          </section>
        </template>
      </el-col>
    </el-row>
    <el-row class="page-filter-operation">
      <el-button type="primary" text size="small" @click="toggle">{{
        isShowAll ? '隐藏条件 «' : '更多条件 »'
      }}</el-button>
      <el-button type="primary" text size="small" @click="clear">清空</el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useDate } from './composables/useDate'

const { disabledDate, dateShortcuts, daterangeShortcuts } = useDate()
const props = withDefaults(
  defineProps<{
    filterConfigs: filterConfigType[] // 筛选条件
    column?: number // 列数
    limit?: number // 最少显示的条件数
    useFont12?: boolean // 是否使用12号字体
  }>(),
  {
    filterConfigs: () => [],
    column: 4,
    limit: 2,
    useFont12: false
  }
)

const emits = defineEmits(['change'])

const colspan = ref(Math.floor(24 / props.column))
// 根据页面的宽度，计算每列占据的格子数
const setColSpans = () => {
  const width = window.innerWidth
  let cols = props.column ?? 4
  if (width >= 1600) {
    cols = 4
  } else if (width >= 1280) {
    cols = 3
  } else if (width >= 768) {
    cols = 2
  } else {
    cols = 1
  }
  colspan.value = Math.floor(24 / cols)
}

type ConditionValue = string | number | any[] | Record<string, any>
// 筛选条件
const conditions = ref<Record<string, ConditionValue>>({})

// 根据筛选条件，设置默认值
const setConditions = (configs = props.filterConfigs) => {
  const newConditions: Record<string, ConditionValue> = {}
  configs.forEach((config) => {
    if (config.type === 'compound') {
      const default_compound = config.children!.find((item) => item.value === config.compound_key)
      if (default_compound?.multiple) {
        newConditions[config.value] = default_compound?.default_value || []
      } else {
        newConditions[config.value] = default_compound?.default_value || ''
      }
    } else {
      if (config.multiple) {
        newConditions[config.value] = config.default_value || []
      } else {
        newConditions[config.value] = config.default_value || ''
      }
    }
  })
  conditions.value = newConditions
}

// 获取筛选条件
const getConditions = () => {
  return { ...conditions.value }
}

// 复合选择器发生改变的回调
const handleChangeCompound = () => {
  setConditions()
  search()
}

// 清空
const clear = () => {
  const newConditions: Record<string, ConditionValue> = {}
  props.filterConfigs.forEach((config) => {
    if (config.type === 'compound') {
      newConditions[config.compound_key!] = ''
    } else if (config.type === 'date' || config.type === 'daterange') {
      newConditions[config.value] = config.default_value!
    } else {
      newConditions[config.value] = ''
    }
  })
  conditions.value = newConditions
  search()
}

// 是否显示全部
const isShowAll = ref(true)

// 计算展示的数量
const maxCount = computed(() => {
  return isShowAll.value ? props.filterConfigs.length : props.limit
})

const toggle = () => {
  isShowAll.value = !isShowAll.value
}

// 清空对应的筛选条件选中值
const clearCondition = (key: string) => {
  // 找出对应的筛选条件
  const config = props.filterConfigs.find((item) => item.value === key)
  if (!config) {
    // 找不到对应的筛选条件
    // 判断compound_key是否存在
    const compoundConfig = props.filterConfigs.find((item) => item.compound_key === key)
    if (!compoundConfig) {
      return
    }
    // 找出compound_key对应的筛选条件
    const child = compoundConfig.children!.find((item) => item.value === key)
    if (!child) {
      return
    }
    // 多选，则变为数组，单选变为字符串
    if (child.multiple) {
      conditions.value[key] = []
    } else {
      conditions.value[key] = ''
    }
    search()
    return
  }
  // 多选，则变为数组，单选变为字符串
  if (config.multiple) {
    conditions.value[key] = []
  } else {
    conditions.value[key] = ''
  }
  search()
}

// 发起请求
const search = () => {
  emits('change')
}

let timer: number | null = null
const onResize = () => {
  if (timer) return
  timer = window.setTimeout(() => {
    timer = null
    setColSpans()
  }, 150)
}

onMounted(() => {
  setColSpans()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  window.removeEventListener('resize', onResize)
})

watch(
  () => props.filterConfigs,
  (val) => {
    setConditions(val)
  },
  {
    immediate: true
  }
)

defineExpose({
  getConditions,
  clearCondition
})
</script>

<style lang="scss" scoped>
.page-filter {
  padding: 16px;
  margin: 10px;
  box-sizing: border-box;
  width: calc(100% - 20px);
  min-width: 500px;
  display: flex;
  background-color: var(--el-bg-color);
  font-size: 14px;

  &-container {
    flex: 1;

    .filter-section {
      display: flex;
      align-items: center;
      margin-top: 8px;
      margin-bottom: 8px;

      &__label {
        flex-basis: 33%;
        min-width: 100px;
        max-width: 100px;
        line-height: 30px;
        font-size: inherit !important;
        text-align: center;
        color: var(--el-text-color-regular);
        border: 1px solid var(--el-border-color);
        border-right: 0;

        :deep(.header-select) {
          font-size: inherit !important;

          .el-select__wrapper {
            font-size: inherit !important;
            box-shadow: none;
            min-height: 28px;
            padding: 3px 9px;
          }
        }
      }

      &__common {
        flex: 1;

        :deep(.el-input__wrapper),
        :deep(.el-select__wrapper) {
          border-radius: 0 !important;
        }

        :deep(.el-input-group__append) {
          background-color: transparent !important;
          border-radius: 0 !important;
          cursor: pointer;
          width: 40px;
          padding: 0 !important;

          .el-icon {
            width: 100%;
            height: 100%;
            color: var(--el-text-color-regular);
          }
        }
      }

      :deep(.el-cascader.filter-section__common),
      :deep(.el-date-editor.filter-section__common) {
        flex: 1;
        border-radius: 0 !important;

        .el-input__wrapper {
          border-radius: 0 !important;
        }
      }
    }
  }

  &-operation {
    margin-left: 10px;
    display: flex;
    align-items: center;

    .el-button {
      padding: 10px 0 !important;
    }

    .el-button.is-text:not(.is-disabled):hover {
      background-color: transparent !important;
      color: var(--el-color-primary) !important;
    }

    .el-button:focus {
      outline: none !important;
    }
  }
}
</style>
