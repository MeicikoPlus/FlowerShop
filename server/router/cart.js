const express = require("express")
const databaseObj = require("../tools/database")
const { jwtVerify } = require("../tools/jwt")
const { generateAddressId } = require("../tools/uuid")

// 创建购物车路由
const router = express.Router()

// 添加购物车接口
async function addCart(req, res) {
  const data = req.body
  try {
    await databaseObj.addCart(data)
    res.send({ code: 1000, data: { message: "添加成功" } })
  } catch (error) {
    console.log("添加购物车接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/addCart", jwtVerify, addCart)

// 根据id来删除购物车
async function deleteCartById(req, res) {
  const { ids } = req.body
  try {
    await databaseObj.deleteCartById(ids)
    res.send({ code: 1000, data: { message: "删除成功" } })
  } catch (error) {
    console.log("删除购物车接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/deleteCartById", jwtVerify, deleteCartById)

// 查询用户购物车接口
async function getUserCarts(req, res) {
  const uid = req.uid; // 使用jwtVerify中间件解析的用户信息获取uid
  try {
    const result = await databaseObj.findCartsByUid(uid);
    res.send({ code: 1000, data: { carts: result } });
  } catch (error) {
    console.log("查询用户购物车接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}

router.get("/getUserCarts", jwtVerify, getUserCarts);

// 更新购物车商品数量接口
async function updateCartItem(req, res) {
  const { id, quantity } = req.body;
  try {
    const result = await databaseObj.updateCart({ id, quantity });
    res.send({ code: 1000, data: { message: "更新成功" } });
  } catch (error) {
    console.log("更新购物车商品数量接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}

router.post("/updateCartItem", jwtVerify, updateCartItem);



module.exports = router