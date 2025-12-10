/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2024-01-14 18:27:44
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-14 18:32:51
 * @FilePath: \taopinhui_vue3\src\utils\permissionBtn.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 引入user仓库
import { useUserStore } from '~/store/user'
import pinia from '~/store'
// 创建user仓库对象
const user = useUserStore(pinia)
// 解构出按钮权限数组
const { buttons } = user

export const permissionBtn = (btnCode: string) => {
    return buttons.some(item => item === btnCode)
}