import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/userStore'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  // 成功
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  // 失败
  error => {
    console.log("request debug:", error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  // 成功
  response => {
    const res = response.data
    if (response.status === 401 || res.code === 1002 ) {
      ElMessageBox.confirm(response.status === 401 ? '请登录' : '身份验证失败', "警告", {
        confirmButtonText: "确认",
        type: "warning"
      }).then(() => {
        const userStore = useUserStore()
        userStore.resetToken().then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(res.data) || "token验证失败")
    } else {
      return res
    }
  },
  // 失败
  error => {
    ElMessage.error({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default request