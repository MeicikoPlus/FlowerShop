import request from "@/utils/request";

// 添加一个新的地址
export function addAddressApi(data) {
  return request({
    url: "/address/addAddress",
    method: "POST",
    data
  })
}

// 删除某一个地址
export function deleteAddressApi(id) {
  return request({
    url: "/address/deleteAddress",
    method: 'POST',
    data: {
      id
    }
  })
}

// 查询用户的所有地址
export function findAddressApi() {
  return request({
    url: "/address/findAddress",
    method: "GET"
  })
}

// 修改某个地址
export function modifyAddressApi(data) {
  return request({
    url: "/address/modifyAddress",
    method: "POST",
    data
  })
}