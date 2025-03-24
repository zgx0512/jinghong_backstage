/* 
自定义校验规则文件
 */
// 引入接口函数
import { reqTmList } from '~/api/product/trademark'
// 引入ts类型
import { tmResponseType } from '~/api/product/trademark/type'
import { ref } from 'vue'

// 邮箱校验规则
export const emailValidatePass = (rule: any, value: string, callback: any) => {
  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}

// 角色名称校验规则
export const roleNameValidatePass = (rule: any, value: any, callback: any) => {
  const reg = /^(?!\d+$)[\u4e00-\u9fa5\w]+$/
  if (reg.test(value)) {
    // 放行
    callback()
  } else {
    // 不符合，提示信息
    callback(new Error('用户名不能全为数字'))
  }
}

// 添加用户密码文本框校验规则
export const passwordValidatePass = (rule: any, value: any, callback: any) => {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  if (reg.test(value)) {
    // 放行
    callback()
  } else {
    // 不符合，提示信息
    callback(new Error('密码长度至少6位，且至少包含1个字母跟1个数字'))
  }
}

// 所有品牌列表
const tmList = ref<string[]>([])
// 获取所有品牌数据的函数
const getTmList = async () => {
  // 调用接口
  const result = await reqTmList()
  if (result.code === 200) {
    tmList.value = result.data.map((item: tmResponseType) => item.tmName)
  }
}
// 添加品牌文本框自定义校验规则
export const tmNameValidatePass = async (rule: any, value: any, callback: any, tmName: any) => {
  if (value.length < 2) {
    callback(new Error('品牌名称长度不能小于2位'))
    return
  }
  try {
    // 调用函数
    await getTmList()
    // 如果是修改，则要去除掉正在修改的品牌
    tmList.value = tmList.value.filter((item) => item !== tmName.tmName)
    // 判断品牌数组中是否已经存在该品牌
    const res = tmList.value.includes(value)
    if (res) {
      callback(new Error('品牌名称已经存在'))
      return
    }
  } catch (error) {}
  callback()
}

// 品牌logo的自定义校验规则
export const tmLogoValidatePass = (rule: any, value: any, callback: any, imageUrl: string) => {
  if (imageUrl) {
    // 放行
    callback()
  } else {
    // 提示用户
    callback(new Error('品牌LOGO不能为空'))
  }
}

// 照片墙自定义校验规则
export const imageListValidatePass = (rule: any, value: any, callback: any, len: number) => {
  if (len > 0) {
    // 放行
    callback()
  } else {
    // 提示用户
    callback(new Error('SPU图片不能为空'))
  }
}
