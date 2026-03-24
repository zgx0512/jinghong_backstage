<template>
  <div class="header-filter">
    <el-radio-group v-model="time_type" fill="#409eff" @change="timeTypeChange">
      <el-radio-button label="今天" :value="1" />
      <el-radio-button label="近7天" :value="2" />
      <el-radio-button label="近30天" :value="3" />
    </el-radio-group>
    <div>
      <el-date-picker
        v-model="conditions.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-value="defaultValue"
        value-format="YYYY-MM-DD"
        :clearable="false"
        :disabled-date="disabledDate"
        @change="changeFilter"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

const emits = defineEmits(['changeFilter'])

const conditions = ref({
  date: [
    dayjs().format('YYYY-MM-DD'), // 当天开始时间
    dayjs().format('YYYY-MM-DD') // 当天结束时间
  ]
})

const defaultValue = computed(() => {
  return [
    dayjs().format('YYYY-MM-DD'), // 当天开始时间
    dayjs().format('YYYY-MM-DD') // 当天结束时间
  ]
})
const time_type = ref(1)
const timeTypeChange = () => {
  // 近7天
  const time7 = [dayjs().subtract(6, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  // 近30天
  const time30 = [dayjs().subtract(29, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  conditions.value.date =
    time_type.value === 1 ? defaultValue.value : time_type.value === 2 ? time7 : time30
  changeFilter()
}
const getConditions = () => {
  return conditions.value
}
const changeFilter = () => {
  // 定义预设时间范围检查函数
  const isPresetRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const now = dayjs()
    const today = now.endOf('day')
    const ranges = [
      { start: now.startOf('day'), end: today },
      { start: now.subtract(6, 'day').startOf('day'), end: today },
      { start: now.subtract(29, 'day').startOf('day'), end: today }
    ]
    return ranges.some(
      ({ start: presetStart, end: presetEnd }) =>
        start.isSame(presetStart, 'day') && end.isSame(presetEnd, 'day')
    )
  }
  const [startDate, endDate] = conditions.value.date.map((date) => dayjs(date))
  // 不是预设范围则清空 time_type
  if (!isPresetRange(startDate, endDate)) {
    time_type.value = 0
  }
  emits('changeFilter')
}
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
defineExpose({
  getConditions
})
</script>
<style lang="scss" scoped>
.header-filter {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
