import type { DirectiveBinding, ObjectDirective } from 'vue'
import { useUserStore } from '~/store/user'

const btnPermiss: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const needValue = binding.value
    const userStore = useUserStore()
    const buttons = (userStore as any).buttons || []

    let hasPermission = true

    if (typeof needValue === 'string') {
      hasPermission = buttons.includes(needValue)
    } else if (Array.isArray(needValue)) {
      hasPermission = needValue.some((code) => buttons.includes(code))
    } else {
      hasPermission = false
    }

    if (!hasPermission) {
      el.parentElement?.removeChild(el)
    }
  }
}

export default btnPermiss
