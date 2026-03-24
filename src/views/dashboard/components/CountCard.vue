<template>
  <div
    class="relative flex px-4 py-6 transition-all rounded-lg shadow hover:scale-105 hover:shadow-xl count-card"
  >
    <div
      class="inline-flex items-center justify-center w-12 h-12 mr-2 rounded-full shadow"
      :class="bgcolors[color as keyof typeof bgcolors]"
    >
      <MoIcon :icon-name="icon" class="text-xl text-white"></MoIcon>
    </div>
    <div>
      <GsapNumber
        v-if="title !== '退款率'"
        class="text-2xl"
        :to="count as number"
        :from="0"
        :duration="1"
        :isFloat="isFloat"
      />
      <div v-else class="text-2xl">{{ count }}</div>
      <div class="text-sm text-gray-500">{{ title }}</div>
    </div>
    <div class="absolute right-2 top-2">
      <el-tooltip :content="desc" effect="light">
        <el-icon class="text-gray-300 dark:text-gray-700"><i-ep-question-filled /></el-icon>
      </el-tooltip>
    </div>
    <div
      class="absolute text-sm right-2 bottom-2"
      :class="textColors[trend as keyof typeof textColors]"
    >
      {{ rate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GsapNumber from '~/components/gsap/GsapNumber.vue'

const props = withDefaults(
  defineProps<{
    title: string
    count: number | string
    rate: string
    desc?: string
    icon: string
    color: string
    trend: number
  }>(),
  { title: '', count: 0, rate: '', desc: '', icon: '', color: '', trend: 1 }
)

const isFloat = computed(() => {
  return !['订单数', '退款订单数', '成交订单数'].includes(props.title)
})

const icon1 = 'IceCream'

// tailwind 不支持动态拼接class，
// 需要预定义再使用
const bgcolors = {
  orange: 'bg-orange-400',
  blue: 'bg-blue-400',
  pink: 'bg-pink-400',
  purple: 'bg-purple-400',
  indigo: 'bg-indigo-400'
}
const textColors = {
  1: 'text-green-400',
  2: 'text-red-400'
}
</script>

<style lang="scss" scoped>
.count-card {
  background-color: var(--el-bg-color-overlay);
}
</style>
