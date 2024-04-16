import request from "@/utils/request";

// 根据id来查询商品信息
export function findProductByIdApi(id) {
  return request({
    url: "/product/findProductById",
    method: "GET",
    params: {
      id
    }
  })
}

// 随机查询指定条商品的数据
export function findRandomProductsApi(num) {
  return request({
    url: "/product/findRandomProducts",
    method: "GET",
    params: {
      num
    }
  })
}

// 根据分类来查询某个分类下的所有商品
export function findProductsByCategoryApi(category) {
  return request({
    url: "/product/findProductsByCategory",
    method: "GET",
    params: {
      category
    }
  })
}

// 根据关键词来查询商品
export function findProductsByKeywordApi(keyword) {
  return request({
    url: "/product/findProductsByKeyword",
    method: "GET",
    params: {
      keyword
    }
  })
}

// 查询商品的所有分类
export function findProductCategoryApi() {
  return request({
    url: "/product/findProductCategory",
    method: "GET"
  })
}

// 添加某个商品的存货(id, quantity)
export function increaseProductInventoryApi(data) {
  return request({
    url: "/product/increaseProductInventory",
    method: "POST",
    data
  })
}

// 减少某个商品的存货
export function decreaseProductInventoryApi(data) {
  return request({
    url: "/product/decreaseProductInventory",
    method: "POST",
    data
  })
}

// 分页查询商品
export function paginateAllProductsApi(page, pageSize) {
  return request({
    url: "/product/paginateAllProducts",
    method: "POST",
    data: {
      page,
      pageSize
    }
  })
}

// 删除某个商品
export function deleteProductApi(id) {
  return request({
    url: "/product/deleteProduct",
    method: "POST",
    data: {
      id
    }
  })
}

// 添加商品
export function addProductApi(data) {
  return request({
    url: "/product/addProduct",
    method: "POST",
    data
  })
}

// 获取商品总数
export function getProductCountApi() {
  return request({
    url: "/product/getProductCount",
    method: "GET"
  })
}