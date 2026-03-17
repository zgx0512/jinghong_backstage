<template>
  <div>
    {{ isFloat ? tweened.number.toFixed(2) : tweened.number.toFixed(0) }}
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import gsap from 'gsap'

const props = withDefaults(
  defineProps<{
    from: number
    to: number
    duration?: number
    isFloat: boolean
  }>(),
  {
    from: 0,
    to: 0,
    duration: 1,
    isFloat: false
  }
)

let tweened = reactive({
  number: props.from
})
watch(
  () => props.to,
  () => {
    gsap.to(tweened, {
      duration: props.duration,
      ease: 'power1.out',
      number: props.isFloat ? props.to.toFixed(2) : props.to.toFixed(0)
    })
  }
)

gsap.to(tweened, {
  duration: props.duration,
  ease: 'power1.out',
  number: props.isFloat ? props.to.toFixed(2) : props.to.toFixed(0)
})
</script>
