import request from "@/utils/request";

// 添加购物车
export function addCartApi(data) {
  return request({
    url: '/cart/addCart',
    method: "POST",
    data
  })
}

// 根据id来删除购物车
export function deleteCartByIdApi(ids) {
  return request({
    url: '/cart/deleteCartById',
    method: "POST",
    data: {
      ids
    }
  })
}

// 查询用户的购物车
export function getUserCartsApi() {
  return request({
    url: '/cart/getUserCarts',
    method: "GET"
  })
}

// 更新购物车种某个商品的数量( id, quantity )
export function updateCartItemApi(data) {
  return request({
    url: "/cart/updateCartItem",
    method: "POST",
    data
  })
}