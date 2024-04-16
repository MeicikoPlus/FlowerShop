import request from "@/utils/request";

// 用户注册
export function userRegisterApi(data) {
  return request({
    url: "/user/register",
    method: "POST",
    data
  })
}

// 获取所有用户信息
export function getAllUserApi() {
  return request({
    url: "/user/getAllUser",
    method: "GET"
  })
}

// 根据用户名来搜索
export function getUserMessageByUsernameApi(username) {
  return request({
    url: "/user/getUserMessageByUsername",
    method: "GET",
    params: {
      username
    }
  })
}

// 用户登录
export function userLoginApi(data) {
  return request({
    url: "/user/login",
    method: "POST",
    data
  })
}

// 用户信息查询
export function getUserMessageApi() {
  return request({
    url: "/user/getUserMessage",
    method: "GET"
  })
}

// 用户注销
export function deleteUserApi(uid) {
  return request({
    url: "/user/deleteUser",
    method: "GET",
    params: {
      uid
    }
  })
}

// 用户修改密码
export function modifyUserPasswordApi(data) {
  return request({
    url: "/user/modifyPassword",
    method: "POST",
    data
  })
}

// 用户修改信息接口
export function modifyUserMessageApi(formData) {
  return request({
    url: "/user/modifyUserMessage",
    method: "POST",
    data: formData
  })
}