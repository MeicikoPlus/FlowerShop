import { defineStore } from "pinia";
import { ref, reactive } from 'vue';
import { deleteCartByIdApi, getUserCartsApi, updateCartItemApi } from '@/api/cart.js';
import { ElMessage } from "element-plus";
import { addCartApi } from "@/api/cart.js"

export const useCartStore = defineStore("cartStore", () => {
  const carts = ref("")

  // 获取购物车信息
  const getUserCarts = () => {
    return new Promise((resolve, reject) => {
      getUserCartsApi().then(res => {
        if (res.code === 1000) {
          carts.value = res.data.carts
          resolve()
        } else {
          reject()
        }
      }).catch(err => {
        ElMessage.error("购物车信息获取失败")
        reject()
      })
    })
  }

  // 更新购物车
  const updateCartItem = (id, quantity) => {
    const obj = {
      id, quantity
    }
    updateCartItemApi(obj).then(res => {
      if (res.code === 1000) {
        getUserCarts()
      } else {
        ElMessage.error("购物车信息更新失败")
      }
    }).catch(err => {
      ElMessage.error("购物车信息更新失败")
    })
  }

  // 删除购物车
  const deleteCartById = (ids) => {
    deleteCartByIdApi(ids).then(res => {
      if (res.code === 1000) {
        getUserCarts()
      } else {
        ElMessage.error("删除失败")
      }
    }).catch(err => {
      ElMessage.error("删除失败")
    })
  }

  // 添加购物车
  const addCart = (data) => {
    addCartApi(data).then(res => {
      if (res.code === 1000) {
        getUserCarts()
        ElMessage({
          type: "success",
          message: res.data.message
        })
      }
    }).catch(err => {
      ElMessage.error("添加失败")
    })
  }

  return {
    carts,
    getUserCarts,
    updateCartItem,
    deleteCartById,
    addCart
  }
})