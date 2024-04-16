import { defineStore } from "pinia";
import { ref, reactive } from 'vue';
import { setStore, getStore } from '@/utils/storage';
import { userLoginApi, getUserMessageApi } from '@/api/user'

export const useUserStore = defineStore("useStore", () => {
  const token = ref(getStore("token") || "")
  const userinfo = reactive({})
  
  // 用户登录
  const login = (data) => {
    return new Promise((resolve, reject) => {
      userLoginApi(data).then(res => {
        if (res.code === 1000) {
          token.value = res.data.token
          setStore("token", token.value)
          resolve(res)
        } else {
          resolve(res)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  // 获取用户信息
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      getUserMessageApi().then(res => {
        Object.assign(userinfo, {})
        Object.assign(userinfo, res.data.userinfo)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  // 重置身份信息
  const resetToken = () => {
    return new Promise(resolve => {
      token.value = ""
      Object.assign(userinfo, {})
      setStore("token", "")
      resolve()
    })
  }


  return {
    token,
    userinfo,
    login,
    getUserInfo,
    resetToken
  }
})