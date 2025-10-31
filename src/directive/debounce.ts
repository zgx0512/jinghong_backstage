import { DirectiveBinding } from 'vue'

// 使用 WeakMap 存放每个元素的定时器与事件处理器，避免给 HTMLElement 挂自定义属性
const debounceTimers = new WeakMap<HTMLElement, number>()
const handlerMap = new WeakMap<HTMLElement, EventListener>()

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const time: number = binding.value?.time ?? 1000
    const func: (() => void) | null = binding.value?.func ?? null

    const onClick: EventListener = () => {
      const prev = debounceTimers.get(el)
      if (prev !== undefined) {
        clearTimeout(prev)
      }
      const timer = window.setTimeout(() => {
        func && func()
      }, time)
      debounceTimers.set(el, timer)
    }

    handlerMap.set(el, onClick)
    el.addEventListener('click', onClick)
  },
  unmounted(el: HTMLElement) {
    const prev = debounceTimers.get(el)
    if (prev !== undefined) {
      clearTimeout(prev)
      debounceTimers.delete(el)
    }
    const handler = handlerMap.get(el)
    if (handler) {
      el.removeEventListener('click', handler)
      handlerMap.delete(el)
    }
  }
}
