const express = require("express")
const databaseObj = require("../tools/database")
const { jwtVerify } = require("../tools/jwt")
const { generateAddressId } = require("../tools/uuid")

// 创建地址路由
const router = express.Router()

// 添加地址接口
async function addAddress(req, res) {
  const data = req.body
  const id = generateAddressId()
  data.id = id
  try { 
    await databaseObj.addAddress(data)
    res.send({ code: 1000, data: { message: "新地址添加成功" } })
  } catch (error) {
    console.log("添加地址接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/addAddress", jwtVerify, addAddress)

// 删除地址接口
async function deleteAddress(req, res) {
  const { id } = req.body
  try {
    const result = await databaseObj.deleteAddress(id)

    if (result.affectedRows === 0) {
      res.send({ code: 1001, data: { message: "地址不存在" } });
    } else {
      res.send({ code: 1000, data: { message: "删除成功" } });
    }
  } catch (error) {
    console.log("删除地址接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/deleteAddress", jwtVerify, deleteAddress)

// 查询用户地址
async function findAddress(req, res) {
  const uid = req.uid
  try {
    const result = await databaseObj.findAddresses(uid)
    res.send({ code: 1000, data: { message: "查询成功", addresses: result } })
  } catch (error) {
    console.log("查询用户地址接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/findAddress", jwtVerify, findAddress)

// 修改地址
async function modifyAddress(req, res) {
  const data = req.body
  try {
    await databaseObj.modifyAddress(data)
    res.send({ code: 1000, data: { message: "修改成功" } })
  } catch (error) {
    console.log("查询用户地址接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/modifyAddress", jwtVerify, modifyAddress)

// 导出地址路由
module.exports = router