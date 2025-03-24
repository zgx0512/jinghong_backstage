// 引入axios
import axios from 'axios'
// 使用element-plus中的Message做消息提醒
import { ElMessage } from 'element-plus'
// 引入token操作文件
import { getToken } from '../token'
// 引入进度条插件
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 关闭右侧圆圈效果
nprogress.configure({ showSpinner: false })
// 创建axios的示例
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_BASE_URL,
  // 超时时间
  timeout: 5000
})
// 请求拦截器
request.interceptors.request.use((config) => {
  nprogress.start()
  config.headers = config.headers || {}
  if (getToken()) {
    // config.headers.token = getToken() as string
    config.headers.Authorization = `Bearer ${getToken()}` as string
  }
  return config
})
// 响应拦截器
request.interceptors.response.use(
  (res) => {
    nprogress.done()
    return res.data
  },
  (error) => {
    nprogress.done()
    // 处理网络错误
    let msg = ''
    let status = 0
    if (error.response) {
      status = error.resopnse.status
    }
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      case 0: 
        msg = '没有数据'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      message: msg,
      type: 'error'
    })
    return Promise.reject(error)
  }
)
export default request
