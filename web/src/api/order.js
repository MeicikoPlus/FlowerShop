import request from "@/utils/request";

// 生产订单
export function addOrderApi(data) {
  return request({
    url: "/order/addOrder",
    method: "POST",
    data
  })
}

// 获取用户的所有订单
export function getOrdersByUidApi() {
  return request({
    url: "/order/getOrdersByUid",
    method: "GET"
  })
}

// 查看某个订单的详情（id）
export function getOrderByIdApi(id) {
  return request({
    url: "/order/getOrderById",
    method: "POST",
    data: {
      id
    }
  })
}

// 删除订单接口
export function deleteOrderApi(id) {
  return request({
    url: "/order/deleteOrder",
    method: "POST",
    data: {
      id
    }
  })
}

// 更改订单状态接口
export function updateOrderStateApi(id, state) {
  return request({
    url: "/order/updateOrderState",
    method: "POST",
    data: {
      id,
      state
    }
  })
}

// 获取所有订单
export function getAllOrderApi() {
  return request({
    url: '/order/getAllOrder',
    method: "GET"
  })
}