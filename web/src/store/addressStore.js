import { defineStore } from "pinia";
import { ref } from 'vue';
import { addAddressApi, deleteAddressApi, findAddressApi, modifyAddressApi } from '@/api/address.js'
import { ElMessage } from "element-plus";

export const useAddressStore = defineStore("addressStore", () => {
  const addresses = ref("")
  

  // 添加一个地址
  function addAddress(data) {
    addAddressApi(data).then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: "添加成功"
        })
        findAddress()
      }
    }).catch(err => {
      ElMessage.err(err || "添加失败")
    })
  }

  // 删除某一个地址 
  function deleteAddress(id) {
    deleteAddressApi(id).then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: res.data.message
        })
        findAddress()
      } else {
        ElMessage.error("删除失败")
      }
    }).catch(() => {
      ElMessage.error("删除失败")
    })
  }

  // 查询某个用户下的所有地址
  function findAddress() {
    findAddressApi().then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: res.data.message
        })
        addresses.value = res.data.addresses
      } else {
        ElMessage.error("查询失败")
      }
    }).catch(() => {
      ElMessage.error("查询失败")
    })
  }

  // 修改某个地址
  function modifyAddress(data) {
    modifyAddressApi(data).then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: res.data.message
        })
        findAddress()
      } else {
        ElMessage.error("修改失败")
      }
    }).catch(() => {
      ElMessage.error("修改失败")
    })
  }

  return {
    addresses,
    addAddress,
    deleteAddress,
    findAddress,
    modifyAddress
  }
})