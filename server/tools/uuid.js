const uuid = require('uuid') // 导入uuid模块

/**
 * 生成用户uid的函数
 * @returns 
 */
const generateUid = () => {
  return uuid.v4()
}

/**
 * 生成订单号的函数
 * @returns 
 */
const generateOrderNumber = () => {
  return uuid.v1()
}

/**
 * 生成地址id的函数
 */
const generateAddressId = () => {
  return uuid.v4()
}

module.exports = {
  generateUid,
  generateOrderNumber,
  generateAddressId
}